import React, { useState } from 'react';
import { DIGNITARIES, TIMELINE_AWARDS, CERTIFICATES } from '../data/awards';
import { Award, ShieldCheck, Calendar, Eye, ZoomIn, CheckCircle2 } from 'lucide-react';

export default function Recognition({ 
  dignitaries = DIGNITARIES, 
  timelineAwards = TIMELINE_AWARDS, 
  certificates = CERTIFICATES, 
  onOpenLightbox 
}) {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      
      {/* 1. Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
          Credentials & Honors
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1F1D1B]">
          Recognitions, Awards & Felicitations
        </h1>
        <p className="text-sm sm:text-base text-[#5A554F] leading-relaxed">
          Acknowledged by national icons, premier academic institutions like <strong>NIFT Delhi</strong>, and state leaders for artistic finesse, 1st prize merits, and revitalizing Bihar’s cultural folk heritage.
        </p>
      </div>

      {/* 2. Felicitations by Dignitaries (The Prestige Photo Wall) */}
      <section className="space-y-8">
        <div className="border-b border-[#DDD3C3] pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B5502F]">
            High-Profile Felicitations
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1F1D1B] mt-1">
            Acknowledged by National & State Dignitaries
          </h2>
          <p className="text-xs text-[#5A554F] mt-1">
            Public citations and personal appreciations received from cultural leaders and elected representatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dignitaries.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => onOpenLightbox({ ...item, title: item.name })}
              className="bg-white rounded-2xl overflow-hidden border border-[#DDD3C3] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Dignitary Felicitation Photograph */}
                <div className="relative aspect-4/3 bg-[#1A1816] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FAF7F2]/95 backdrop-blur-xs text-[#C99A2E] border border-[#C99A2E]/40 shadow-xs">
                      {item.badge}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-[#1F1D1B]/70 text-white backdrop-blur-xs shadow-xs">
                    <Award className="w-4 h-4 text-[#C99A2E]" />
                  </div>
                  <div className="absolute inset-0 bg-[#1F1D1B]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="px-4 py-2 rounded-full bg-[#FAF7F2] text-[#1F1D1B] text-xs font-semibold flex items-center gap-1.5 shadow-md">
                      <ZoomIn className="w-4 h-4 text-[#B5502F]" />
                      <span>View Full Photo</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1F1D1B] group-hover:text-[#B5502F] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#B5502F] mt-0.5">
                      {item.role}
                    </p>
                    <p className="text-[11px] text-[#5A554F] italic mt-0.5">
                      {item.event}
                    </p>
                  </div>

                  <p className="text-xs text-[#5A554F] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF7F2] px-6 py-3 border-t border-[#DDD3C3]/60 text-[11px] text-[#5A554F] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7F5E]" />
                  <span>Verified Public Felicitation</span>
                </div>
                <Eye className="w-3.5 h-3.5 text-[#5A554F] group-hover:text-[#B5502F] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Chronological Awards & Competitions Timeline */}
      <section className="bg-white p-8 sm:p-12 rounded-3xl border border-[#DDD3C3] space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B5502F]">
            Proven Track Record
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1F1D1B] mt-1">
            Competition Merits & State Honors Timeline
          </h2>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#DDD3C3] space-y-10">
          {timelineAwards.map((award, idx) => (
            <div key={award.id || idx} className="relative group">
              {/* Bullet Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#B5502F] border-4 border-white shadow-xs group-hover:scale-125 transition-transform" />

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F0E9DC] text-[#B5502F]">
                    {award.year}
                  </span>
                  <span className="text-xs text-[#5A554F]">
                    {award.organization}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#1F1D1B]">
                  {award.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#5A554F] leading-relaxed">
                  {award.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Clickable Certificates Gallery */}
      <section className="space-y-8">
        <div className="border-b border-[#DDD3C3] pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B5502F]">
            Official Documentation
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1F1D1B] mt-1">
            Certificates of Excellence
          </h2>
          <p className="text-xs text-[#5A554F] mt-1">
            Click on any certificate to view high-resolution scan and verified details.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => onOpenLightbox(cert)}
              className="bg-white rounded-2xl overflow-hidden border border-[#DDD3C3] shadow-2xs hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-4/3 bg-[#1A1816] flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#1F1D1B]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-4 py-2 rounded-full bg-[#FAF7F2] text-[#1F1D1B] text-xs font-semibold flex items-center gap-1.5 shadow-md">
                    <ZoomIn className="w-4 h-4 text-[#B5502F]" />
                    <span>View Full Certificate</span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#1F1D1B]/80 text-[#FAF7F2] text-[10px]">
                  {cert.year}
                </div>
              </div>

              <div className="p-5 grow flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#1F1D1B] group-hover:text-[#B5502F] transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-[#5A554F] mt-1">
                    {cert.sub}
                  </p>
                </div>
                <p className="text-[11px] text-[#B5502F] font-medium pt-2 border-t border-[#DDD3C3]/50">
                  {cert.issuer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

