import React, { useEffect } from 'react';
import { X, ZoomIn, MessageSquare, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export default function LightboxModal({ item, onClose, onOrderSimilar }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const isCertificate = !!item.issuer;

  return (
    <div className="fixed inset-0 z-50 bg-[#1F1D1B]/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all cursor-pointer z-50"
        aria-label="Close modal"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative max-w-5xl w-full max-h-[90vh] bg-[#FAF7F2] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-[#DDD3C3]">
        
        {/* Image Frame */}
        <div className="md:w-3/5 bg-[#1F1D1B] flex items-center justify-center relative p-4 overflow-hidden group">
          <img
            src={item.image}
            alt={item.title}
            className="max-h-[60vh] md:max-h-[80vh] w-auto object-contain rounded shadow-lg transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-3 left-3 bg-[#1F1D1B]/80 text-[#FAF7F2] text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>High-Resolution Preview</span>
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-[#FAF7F2]">
          <div className="space-y-4">
            
            {/* Badges */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F0E9DC] text-[#B5502F] border border-[#DDD3C3]">
                {item.category || item.issuer || "Fine Art"}
              </span>
              {item.status && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'Available'
                      ? 'bg-[#EFF4ED] text-[#6B7F5E] border border-[#6B7F5E]/30'
                      : 'bg-[#F0E9DC] text-[#5A554F]'
                  }`}
                >
                  {item.status}
                </span>
              )}
            </div>

            {/* Title & Metadata */}
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1F1D1B] leading-tight">
              {item.title}
            </h3>

            {item.medium && (
              <div className="border-y border-[#DDD3C3]/60 py-3 space-y-1.5 text-xs text-[#5A554F]">
                <div className="flex justify-between">
                  <span className="font-medium">Medium:</span>
                  <span className="text-[#1F1D1B] font-semibold">{item.medium}</span>
                </div>
                {item.dimensions && (
                  <div className="flex justify-between">
                    <span className="font-medium">Dimensions:</span>
                    <span className="text-[#1F1D1B] font-semibold">{item.dimensions}</span>
                  </div>
                )}
                {item.year && (
                  <div className="flex justify-between">
                    <span className="font-medium">Year:</span>
                    <span className="text-[#1F1D1B] font-semibold">{item.year}</span>
                  </div>
                )}
                {item.price && (
                  <div className="flex justify-between text-sm pt-1 text-[#B5502F]">
                    <span className="font-bold">Original Price:</span>
                    <span className="font-bold text-base">{item.price}</span>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-[#5A554F] leading-relaxed">
              {item.description || item.sub || "Handcrafted with pure archival materials and authentic artistic technique."}
            </p>

            {isCertificate && item.issuer && (
              <div className="bg-[#F0E9DC] p-3 rounded-lg border border-[#DDD3C3] text-xs text-[#5A554F]">
                <p className="font-semibold text-[#1F1D1B]">Issued By:</p>
                <p>{item.issuer}</p>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-[#DDD3C3]/60 space-y-2.5">
            {!isCertificate && (
              <button
                onClick={() => {
                  onClose();
                  if (onOrderSimilar) onOrderSimilar(item);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#B5502F] hover:bg-[#9B4224] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Commission Similar Artwork</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                `Hi Vinita, I am interested in your artwork: "${item.title}" (${item.medium || item.category || 'Portfolio piece'}). Can you share more details?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

