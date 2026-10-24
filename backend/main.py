from fastapi import FastAPI, Request, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import urllib.parse
import uuid
import json

app = FastAPI(title="Arthur Visions API", version="1.0.0")

# Enable CORS for Cloudflare Pages frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Arthur Visions API",
        "platform": "Cloudflare Workers Python"
    }

# WhatsApp Edge Redirect (Anonymizes artist's private phone number)
@app.get("/api/whatsapp")
async def whatsapp_redirect(request: Request, text: str = ""):
    env = getattr(request, "scope", {}).get("env")
    target = getattr(env, "WHATSAPP_TARGET", None) if env else None
    if not target:
        target = "918603406848"

    # Support WhatsApp Business Short Links (wa.me/message/XYZ) or full URLs
    target_str = str(target).strip()
    if target_str.startswith("http"):
        sep = "&" if "?" in target_str else "?"
        destination = f"{target_str}{sep}text={urllib.parse.quote(text)}" if text else target_str
        return RedirectResponse(url=destination, status_code=302)
    elif target_str.startswith("message/"):
        sep = "&" if "?" in target_str else "?"
        destination = f"https://wa.me/{target_str}{sep}text={urllib.parse.quote(text)}" if text else f"https://wa.me/{target_str}"
        return RedirectResponse(url=destination, status_code=302)
    else:
        # Default numeric phone number redirect
        digits = "".join(filter(str.isdigit, target_str))
        query = f"?text={urllib.parse.quote(text)}" if text else ""
        return RedirectResponse(url=f"https://wa.me/{digits}{query}", status_code=302)

# 1. Commission Order Endpoint
@app.post("/api/order")
async def create_order(
    request: Request,
    name: str = Form(...),
    phone: str = Form(...),
    city: str = Form(...),
    medium: str = Form(...),
    size: str = Form(...),
    subjects: int = Form(1),
    occasion: str = Form("Gift"),
    deadline: str = Form(""),
    notes: str = Form(""),
    photo: UploadFile = File(None)
):
    env = getattr(request, "scope", {}).get("env")
    order_id = f"ORD-{uuid.uuid4().hex[:6].upper()}"
    photo_key = None

    # Upload reference photo to Cloudflare R2 if attached
    if photo and env and hasattr(env, "ART_BUCKET"):
        photo_key = f"references/{order_id}-{photo.filename}"
        photo_bytes = await photo.read()
        await env.ART_BUCKET.put(photo_key, photo_bytes)

    # Insert into Cloudflare D1 Database if bound
    if env and hasattr(env, "DB"):
        query = """
        INSERT INTO orders (id, name, phone, city, medium, size, subjects, occasion, deadline, notes, photo_key, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        await env.DB.prepare(query).bind(
            order_id, name, phone, city, medium, size, subjects, occasion, deadline, notes, photo_key, "NEW"
        ).run()

    return {
        "success": True,
        "order_id": order_id,
        "message": "Order received! Vinita will contact you via WhatsApp shortly.",
        "phone": phone
    }

# 2. General Contact Note Endpoint
@app.post("/api/contact")
async def send_contact(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    subject: str = Form("General Inquiry"),
    message: str = Form(...)
):
    env = getattr(request, "scope", {}).get("env")
    contact_id = f"MSG-{uuid.uuid4().hex[:6].upper()}"

    if env and hasattr(env, "DB"):
        query = """
        INSERT INTO contacts (id, name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?, ?)
        """
        await env.DB.prepare(query).bind(
            contact_id, name, email, phone, subject, message
        ).run()

    return {
        "success": True,
        "contact_id": contact_id,
        "message": "Message sent! We will get back to you shortly."
    }

# 3. Admin Get Orders
@app.get("/api/admin/orders")
async def get_orders(request: Request):
    env = getattr(request, "scope", {}).get("env")
    if env and hasattr(env, "DB"):
        result = await env.DB.prepare("SELECT * FROM orders ORDER BY created_at DESC").all()
        return {"orders": result.results}
    return {"orders": []}

# Cloudflare Workers entrypoint
try:
    from workers import asgi
    default = asgi.entrypoint(app)
except ImportError:
    # Allows running locally via standard uvicorn main:app
    default = app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

