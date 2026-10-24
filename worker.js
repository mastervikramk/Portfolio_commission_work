export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. WhatsApp Edge Redirect (Anonymizes artist's private phone number)
    if (url.pathname === "/api/whatsapp") {
      const text = url.searchParams.get("text") || "";
      const target = env.WHATSAPP_TARGET || "918603406848";
      const userAgent = request.headers.get("user-agent") || "";
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

      let destination;
      if (target.startsWith("http")) {
        const sep = target.includes("?") ? "&" : "?";
        destination = text ? `${target}${sep}text=${encodeURIComponent(text)}` : target;
      } else if (target.startsWith("message/")) {
        const sep = target.includes("?") ? "&" : "?";
        destination = text ? `https://wa.me/${target}${sep}text=${encodeURIComponent(text)}` : `https://wa.me/${target}`;
      } else {
        const cleaned = target.replace(/[^0-9]/g, "");
        const query = text ? `&text=${encodeURIComponent(text)}` : "";
        if (isMobile) {
          // Mobile device: opens WhatsApp mobile app directly
          destination = `https://api.whatsapp.com/send?phone=${cleaned}${query}`;
        } else {
          // Desktop device: opens WhatsApp Web directly in browser
          destination = `https://web.whatsapp.com/send?phone=${cleaned}${query}`;
        }
      }
      return Response.redirect(destination, 302);
    }

    // 2. Commission Order Endpoint
    if (url.pathname === "/api/order" && request.method === "POST") {
      const orderId = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      try {
        const formData = await request.formData();
        if (env.DB) {
          const name = formData.get("name") || "";
          const phone = formData.get("phone") || "";
          const city = formData.get("city") || "";
          const medium = formData.get("medium") || "";
          const size = formData.get("size") || "";
          const subjects = parseInt(formData.get("subjects") || "1", 10);
          const occasion = formData.get("occasion") || "Gift";
          const deadline = formData.get("deadline") || "";
          const notes = formData.get("notes") || "";

          await env.DB.prepare(
            `INSERT INTO orders (id, name, phone, city, medium, size, subjects, occasion, deadline, notes, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW')`
          ).bind(orderId, name, phone, city, medium, size, subjects, occasion, deadline, notes).run();
        }
      } catch (err) {
        console.error("Order DB insert error:", err);
      }

      return new Response(JSON.stringify({
        success: true,
        order_id: orderId,
        message: "Order received! Vinita will contact you via WhatsApp shortly."
      }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 3. Contact Submission Endpoint
    if (url.pathname === "/api/contact" && request.method === "POST") {
      const contactId = `MSG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      try {
        const formData = await request.formData();
        if (env.DB) {
          const name = formData.get("name") || "";
          const email = formData.get("email") || "";
          const phone = formData.get("phone") || "";
          const subject = formData.get("subject") || "General Inquiry";
          const message = formData.get("message") || "";

          await env.DB.prepare(
            `INSERT INTO contacts (id, name, email, phone, subject, message)
             VALUES (?, ?, ?, ?, ?, ?)`
          ).bind(contactId, name, email, phone, subject, message).run();
        }
      } catch (err) {
        console.error("Contact DB insert error:", err);
      }

      return new Response(JSON.stringify({
        success: true,
        contact_id: contactId,
        message: "Message received! We will get back to you shortly."
      }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 4. Admin Orders Endpoint
    if (url.pathname === "/api/admin/orders" && request.method === "GET") {
      if (env.DB) {
        const { results } = await env.DB.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
        return new Response(JSON.stringify({ orders: results || [] }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
      return new Response(JSON.stringify({ orders: [] }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 5. Fallback to Static Assets (HTML, CSS, JS, images)
    return env.ASSETS.fetch(request);
  }
};

