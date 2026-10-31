import React, { useState } from 'react';
import { QrCode, MessageCircle, Mail, ExternalLink, Smartphone, CheckCircle2 } from 'lucide-react';
import { YoutubeIcon, InstagramIcon } from './SocialIcons';
import { SITE_CONFIG } from '../config/site';

export default function QuickConnectQR({ selectedTopic = "Fine Art & Portrait Inquiries" }) {
  const [activeTab, setActiveTab] = useState('whatsapp');

  const whatsappMessage = selectedTopic && selectedTopic !== "Fine Art & Portrait Inquiries"
    ? `Hi Vinita, I am reaching out regarding ${selectedTopic} via Arthur Visions website.`
    : `Hi Vinita, I am reaching out regarding fine art portraits & inquiries via Arthur Visions website.`;

  const emailSubject = `[Inquiry] ${selectedTopic} - Arthur Visions`;
  const emailBody = `Hi Vinita,\n\nI am contacting you from the Arthur Visions website regarding fine art / portraits.\n\nDetails / Questions:\n\nLooking forward to hearing from you.`;
  const emailUrl = `mailto:${SITE_CONFIG.publicEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const qrChannels = {
    whatsapp: {
      platform: "WhatsApp",
      handleLabel: "Availability",
      handle: "Online • 1–2 hr response",
      ctaLabel: "Chat on WhatsApp",
      url: SITE_CONFIG.getWhatsAppUrl(whatsappMessage),
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&ecc=M&data=${encodeURIComponent(SITE_CONFIG.getAbsoluteWhatsAppUrl(whatsappMessage))}`,
      color: "#25D366",
      buttonClass: "bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md hover:shadow-lg",
      activeTabClass: "bg-[#25D366] text-white shadow-sm font-bold",
      summary: "Direct 1-on-1 consultation with artist Vinita for custom quotes, photo reviews, and order updates.",
      points: [
        "Share your reference photos for immediate feedback & sizing advice",
        "Directly discuss canvas medium, framing choices & delivery schedules"
      ],
      badge: "Instant Chat"
    },
    instagram: {
      platform: "Instagram",
      handleLabel: "Username",
      handle: SITE_CONFIG.instagramHandle,
      ctaLabel: "Open Instagram Profile",
      url: SITE_CONFIG.instagramUrl,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&ecc=M&data=${encodeURIComponent(SITE_CONFIG.instagramUrl)}`,
      color: "#E1306C",
      buttonClass: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white shadow-md hover:shadow-lg",
      activeTabClass: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white shadow-sm font-bold",
      summary: "Follow our daily creative journey, work-in-progress reels, and finished original artworks.",
      points: [
        "Watch studio painting reels, pencil studies, and finished pieces",
        "Direct message (DM) us directly for casual inquiries"
      ],
      badge: "Art Feed"
    },
    youtube: {
      platform: "YouTube",
      handleLabel: "Channel",
      handle: SITE_CONFIG.youtubeHandle,
      ctaLabel: "Watch on YouTube",
      url: SITE_CONFIG.youtubeUrl,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&ecc=M&data=${encodeURIComponent(SITE_CONFIG.youtubeUrl)}`,
      color: "#FF0000",
      buttonClass: "bg-[#FF0000] hover:bg-[#d90000] text-white shadow-md hover:shadow-lg",
      activeTabClass: "bg-[#FF0000] text-white shadow-sm font-bold",
      summary: "Watch full portrait creation time-lapses, acrylic art tutorials, and live event sketching videos.",
      points: [
        "Watch blank canvases transform into lifelike portraits in 4K",
        "Explore creative techniques, palette knife blending & sketching"
      ],
      badge: "Videos & Shorts"
    },
    email: {
      platform: "Email",
      handleLabel: "Official Desk",
      handle: SITE_CONFIG.publicEmail,
      ctaLabel: "Send an Email",
      url: emailUrl,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&ecc=M&data=${encodeURIComponent(emailUrl)}`,
      color: "#EA4335",
      buttonClass: "bg-[#EA4335] hover:bg-[#d3382b] text-white shadow-md hover:shadow-lg",
      activeTabClass: "bg-[#EA4335] text-white shadow-sm font-bold",
      summary: "Formal inquiries for exhibitions, institutional collaborations, and press inquiries.",
      points: [
        "Official proposals for corporate gifting, galleries & bulk orders",
        "High-resolution digital press kit and authenticity verification"
      ],
      badge: "Official Desk"
    }
  };

  const current = qrChannels[activeTab];

  const renderIcon = (channel, className = "w-5 h-5") => {
    switch (channel) {
      case 'whatsapp':
        return <MessageCircle className={`${className} fill-current`} />;
      case 'instagram':
        return <InstagramIcon className={className} />;
      case 'youtube':
        return <YoutubeIcon className={className} />;
      case 'email':
        return <Mail className={className} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#DDD3C3] shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#DDD3C3]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#F0E9DC] text-[#B5502F]">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1D1B]">
              Direct Contact & Socials
            </h3>
            <p className="text-xs sm:text-sm text-[#5A554F]">
              Scan the QR code with your phone camera, or click directly to connect.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F8ECE7] text-[#B5502F] border border-[#B5502F]/30 flex items-center gap-1.5 shrink-0">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Quick Connect</span>
        </span>
      </div>

      {/* Selector Tabs with Authentic Company Colors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'whatsapp'
              ? qrChannels.whatsapp.activeTabClass
              : 'bg-white text-[#1F1D1B] border border-[#DDD3C3] hover:border-[#25D366] hover:bg-[#25D366]/5'
          }`}
        >
          <span className={activeTab === 'whatsapp' ? 'text-white' : 'text-[#25D366]'}>
            {renderIcon('whatsapp', 'w-4 h-4')}
          </span>
          <span>WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('instagram')}
          className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'instagram'
              ? qrChannels.instagram.activeTabClass
              : 'bg-white text-[#1F1D1B] border border-[#DDD3C3] hover:border-[#E1306C] hover:bg-[#E1306C]/5'
          }`}
        >
          <span className={activeTab === 'instagram' ? 'text-white' : 'text-[#E1306C]'}>
            {renderIcon('instagram', 'w-4 h-4')}
          </span>
          <span>Instagram</span>
        </button>

        <button
          onClick={() => setActiveTab('youtube')}
          className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'youtube'
              ? qrChannels.youtube.activeTabClass
              : 'bg-white text-[#1F1D1B] border border-[#DDD3C3] hover:border-[#FF0000] hover:bg-[#FF0000]/5'
          }`}
        >
          <span className={activeTab === 'youtube' ? 'text-white' : 'text-[#FF0000]'}>
            {renderIcon('youtube', 'w-4 h-4')}
          </span>
          <span>YouTube</span>
        </button>

        <button
          onClick={() => setActiveTab('email')}
          className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'email'
              ? qrChannels.email.activeTabClass
              : 'bg-white text-[#1F1D1B] border border-[#DDD3C3] hover:border-[#EA4335] hover:bg-[#EA4335]/5'
          }`}
        >
          <span className={activeTab === 'email' ? 'text-white' : 'text-[#EA4335]'}>
            {renderIcon('email', 'w-4 h-4')}
          </span>
          <span>Email</span>
        </button>
      </div>

      {/* Channel Display Card */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#DDD3C3] flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-xs">
        
        {/* QR Code Frame + Single Direct CTA Button */}
        <div className="shrink-0 flex flex-col items-center w-full sm:w-auto">
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Click to open ${current.platform}`}
            className="block p-3 bg-[#FAF7F2] rounded-2xl border border-[#DDD3C3] shadow-inner hover:border-[#1F1D1B]/40 transition-all cursor-pointer group"
          >
            <img
              src={current.qrUrl}
              alt={`${current.platform} QR Code`}
              className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-xl bg-white p-1 mx-auto"
              loading="eager"
            />
          </a>

          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3 w-full sm:w-48 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-98 ${current.buttonClass}`}
          >
            {renderIcon(activeTab, 'w-4 h-4')}
            <span>{current.ctaLabel}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Channel Details Beside QR Code */}
        <div className="space-y-4 text-center sm:text-left grow w-full">
          
          {/* Header Row: Icon, Platform Name, Handle & Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDD3C3]/60">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `${current.color}15`,
                  borderColor: `${current.color}35`,
                  color: current.color
                }}
              >
                {renderIcon(activeTab, 'w-5 h-5')}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                    {current.platform}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#F0E9DC] text-[#5A554F]">
                    {current.badge}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#5A554F] mt-0.5">
                  <span>{current.handleLabel}:</span>
                  <span className="font-semibold font-mono text-[#1F1D1B]">
                    {current.handle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Purpose Summary */}
          <p className="text-xs sm:text-sm text-[#5A554F] leading-relaxed">
            {current.summary}
          </p>

          {/* Key Bullet Points */}
          <ul className="text-xs text-[#5A554F] space-y-2 pt-1 text-left">
            {current.points.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7F5E] shrink-0 mt-0.5" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>

          {/* Usage Tip */}
          <div className="pt-2 text-[11.5px] text-[#5A554F] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD3C3]/70 text-left">
            💡 <strong>On mobile?</strong> Tap the button below the QR. <strong>On desktop?</strong> Scan the QR code directly with your phone.
          </div>

        </div>

      </div>
    </div>
  );
}
