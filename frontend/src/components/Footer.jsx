import React from 'react';
import { Mail, Phone, MapPin, Heart, ShieldCheck, MessageCircle } from 'lucide-react';
import { YoutubeIcon, InstagramIcon } from './SocialIcons';
import { SITE_CONFIG } from '../config/site';
import logoImage from '../assets/logo.png';

export default function Footer({ setActivePage }) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#F0E9DC] border-t border-[#DDD3C3] text-[#1F1D1B] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Brand & Artist Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src={logoImage}
                alt="Arthur Visions Logo"
                className="w-9 h-9 rounded-full object-cover border border-[#DDD3C3]"
              />
              <span className="font-serif text-2xl font-bold tracking-wide text-[#1F1D1B]">
                Arthur Visions
              </span>
            </div>
            <p className="text-sm text-[#5A554F] leading-relaxed">
              Award-winning fine artist based in Muzaffarpur, Bihar. Felicitated by Padma Shri Dulari Devi & Bihar dignitaries. Specializing in bespoke realistic portraits and authentic regional Vajjika folk art.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#5A554F]">
              <a
                href={SITE_CONFIG.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#DDD3C3] flex items-center justify-center hover:border-[#FF0000] hover:scale-105 transition-all shadow-2xs"
                title={`YouTube: ${SITE_CONFIG.youtubeHandle}`}
              >
                <YoutubeIcon className="w-4 h-4 text-[#FF0000]" />
              </a>
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#DDD3C3] flex items-center justify-center hover:border-[#E1306C] hover:scale-105 transition-all shadow-2xs"
                title={`Instagram: ${SITE_CONFIG.instagramHandle}`}
              >
                <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
              </a>
              <a
                href={`mailto:${SITE_CONFIG.publicEmail}`}
                className="w-9 h-9 rounded-full bg-white border border-[#DDD3C3] flex items-center justify-center hover:border-[#EA4335] hover:scale-105 transition-all shadow-2xs"
                title="Email Studio"
              >
                <Mail className="w-4 h-4 text-[#EA4335]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#1F1D1B] mb-4">
              Explore Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-[#5A554F]">
              <li>
                <button
                  onClick={() => handleLinkClick('gallery')}
                  className="hover:text-[#B5502F] transition-colors cursor-pointer"
                >
                  Charcoal & Graphite Portraits
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('gallery')}
                  className="hover:text-[#B5502F] transition-colors cursor-pointer"
                >
                  Oil & Acrylic on Canvas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('gallery')}
                  className="hover:text-[#B5502F] transition-colors cursor-pointer"
                >
                  Watercolors & Soft Pastels
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('gallery')}
                  className="hover:text-[#B5502F] transition-colors cursor-pointer"
                >
                  Traditional Vajjika Art Series
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('gallery')}
                  className="hover:text-[#B5502F] transition-colors cursor-pointer"
                >
                  Live Wedding & Event Sketching
                </button>
              </li>
            </ul>
          </div>

          {/* Credibility & Recognition */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#1F1D1B] mb-4">
              Honors & Certifications
            </h4>
            <ul className="space-y-2 text-sm text-[#5A554F]">
              <li className="flex items-start gap-2">
                <span className="text-[#C99A2E] font-bold">★</span>
                <span>Padma Shri Dulari Devi Recognition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C99A2E] font-bold">★</span>
                <span>NIFT Delhi (Ministry of Textiles)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C99A2E] font-bold">★</span>
                <span>1st Prize, District Yuva Utsav</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C99A2E] font-bold">★</span>
                <span>Vajjika Vibhuti Samman 2025</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C99A2E] font-bold">★</span>
                <span>Udyog Vibhag Bihar Sarkar</span>
              </li>
            </ul>
          </div>

          {/* Studio Contact */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#1F1D1B] mb-4">
              Studio & Orders
            </h4>
            <div className="space-y-3 text-sm text-[#5A554F]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B5502F] shrink-0 mt-0.5" />
                <span>Muzaffarpur, Bihar, India.<br />Delivering across all Indian states & UTs.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#EA4335] shrink-0" />
                <a href={`mailto:${SITE_CONFIG.publicEmail}`} className="hover:text-[#EA4335] text-xs font-semibold">
                  {SITE_CONFIG.publicEmail}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 fill-current" />
                <a 
                  href={SITE_CONFIG.getWhatsAppUrl("Hi Vinita, I have an inquiry regarding your art.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B5502F] font-semibold text-xs text-[#1F1D1B] flex items-center gap-1"
                >
                  <span>Chat on WhatsApp (Online)</span>
                </a>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => handleLinkClick('order')}
                  className="w-full text-center px-4 py-2.5 bg-[#B5502F] text-white rounded-lg text-xs font-semibold hover:bg-[#9B4224] transition-colors cursor-pointer"
                >
                  Commission a Custom Artwork
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-[#DDD3C3] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5A554F] gap-4">
          <p>© {currentYear} Arthur Visions by Vinita. All handmade artworks & intellectual rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLinkClick('recognition')}
              className="hover:text-[#B5502F] cursor-pointer"
            >
              Verify Credentials
            </button>
            <span>•</span>
            <button
              onClick={() => handleLinkClick('admin')}
              className="hover:text-[#B5502F] flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Artist Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

