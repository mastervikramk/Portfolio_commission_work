import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export default function WhatsAppButton({ customMessage = "Hi Vinita, I saw your artwork on Arthur Visions website and would like to inquire about a custom portrait commission." }) {
  const whatsappUrl = SITE_CONFIG.getWhatsAppUrl(customMessage);

  return (
    <aside aria-label="Quick contact" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:bg-[#20ba59] hover:scale-105 transition-all duration-300 font-medium text-sm group"
        title="Chat on WhatsApp with Artist"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline font-sans">Chat on WhatsApp</span>
        <span className="sm:hidden font-sans">WhatsApp</span>
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
      </a>
    </aside>
  );
}

