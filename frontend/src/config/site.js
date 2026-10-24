// Central Studio Configuration
// Private contact details (artist's personal phone and private Gmail) are kept secure in Cloudflare backend.
// Frontend only surfaces the public studio domain, official studio email, and edge redirect routes.

export const SITE_CONFIG = {
  artistName: "Vinita",
  brandName: "Arthur Visions",
  tagline: "Handcrafted Portraits & Heritage Fine Art",
  domain: "arthurvisions.in",
  
  // Public Studio Email (All visitor messages route via contact@arthurvisions.in; private Gmail is never exposed)
  publicEmail: "contact@arthurvisions.in",
  
  // WhatsApp availability label
  displayPhoneLabel: "WhatsApp Studio Active",

  // Edge-proxied WhatsApp URL so the phone number is NEVER exposed in client JS, HTML, or public git repos
  getWhatsAppUrl(message = "") {
    const encoded = message ? `?text=${encodeURIComponent(message)}` : "";
    return `/api/whatsapp${encoded}`;
  },

  // Generates absolute WhatsApp URL (used for external links and QR code scanning via Cloudflare Edge proxy)
  getAbsoluteWhatsAppUrl(message = "") {
    const base = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
      ? window.location.origin
      : `https://${this.domain}`;
    const encoded = message ? `?text=${encodeURIComponent(message)}` : "";
    return `${base}/api/whatsapp${encoded}`;
  },
  
  // Social Handles
  youtubeUrl: "https://youtube.com/@ArthurVisions-521",
  youtubeHandle: "@ArthurVisions-521",
  youtubeShortsUrl: "https://youtube.com/@ArthurVisions-521/shorts",
  latestShortId: "7sdV7B1k-b8",
  latestShortTitle: "Magic of acrylic",
  instagramUrl: "https://instagram.com/arthur_visions",
  instagramHandle: "@arthur_visions",
  
  // Studio Location
  location: "Muzaffarpur, Bihar, India (PIN: 842001)",
  serviceRadius: "Delivering across all 28 Indian States & 8 UTs",
};
