import React from 'react';
import { Clock, ShieldCheck, MapPin, Sparkles, Mail, Send } from 'lucide-react';
import QuickConnectQR from '../components/QuickConnectQR';
import { SITE_CONFIG } from '../config/site';

export default function Contact() {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* 1. Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F8ECE7] text-[#B5502F] border border-[#B5502F]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Direct Studio Inquiry</span>
        </span>
        
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1D1B]">
          Connect with Arthur Visions
        </h1>
        
        <p className="text-sm sm:text-base text-[#5A554F] leading-relaxed">
          Reach out directly to award-winning artist Vinita. We welcome custom portrait commissions, original Vajjika folk art inquiries, live event sketching bookings, and collaborations.
        </p>

        {/* Quick Trust Highlights */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#5A554F]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DDD3C3] shadow-2xs font-medium">
            <Clock className="w-3.5 h-3.5 text-[#B5502F]" />
            Replies within 1–2 hours
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DDD3C3] shadow-2xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2F6F55]" />
            Insured Pan-India Delivery
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DDD3C3] shadow-2xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#C99A2E]" />
            Muzaffarpur, Bihar
          </span>
        </div>
      </div>

      {/* 2. Direct Connection Hub (QR for Desktop + Big Highlighted Buttons for Mobile/Laptop) */}
      <QuickConnectQR />

      {/* 3. Studio Details Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#DDD3C3] shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-[#DDD3C3]/60">
          
          <div className="space-y-1.5">
            <h4 className="font-serif text-lg font-bold text-[#1F1D1B] flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-[#B5502F]" />
              Studio Location
            </h4>
            <p className="text-xs sm:text-sm text-[#5A554F]">
              Muzaffarpur, Bihar, India
            </p>
            <p className="text-[11px] text-[#5A554F]/80">
              Safe packaging & delivery to all 28 Indian States & 8 UTs
            </p>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6 space-y-1.5">
            <h4 className="font-serif text-lg font-bold text-[#1F1D1B] flex items-center justify-center md:justify-start gap-2">
              <Clock className="w-4 h-4 text-[#B5502F]" />
              Turnaround Times
            </h4>
            <p className="text-xs sm:text-sm text-[#5A554F]">
              5 to 10 business days
            </p>
            <p className="text-[11px] text-[#5A554F]/80">
              Express priority dispatch available on request
            </p>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6 space-y-1.5">
            <h4 className="font-serif text-lg font-bold text-[#1F1D1B] flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-[#B5502F]" />
              Official Email Desk
            </h4>
            <a 
              href={`mailto:${SITE_CONFIG.publicEmail}`}
              className="text-xs sm:text-sm font-semibold text-[#B5502F] hover:underline block break-all"
            >
              {SITE_CONFIG.publicEmail}
            </a>
            <p className="text-[11px] text-[#5A554F]/80">
              For institutions, exhibitions & bulk orders
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
