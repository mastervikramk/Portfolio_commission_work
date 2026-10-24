import React, { useState } from 'react';
import { QrCode, MessageCircle, Mail, ExternalLink, Smartphone } from 'lucide-react';
import { YoutubeIcon, InstagramIcon } from './SocialIcons';
import { SITE_CONFIG } from '../config/site';

export default function QuickConnectQR({ selectedTopic = "Custom Portrait Commission" }) {
  const [activeTab, setActiveTab] = useState('whatsapp');

  const whatsappMessage = `Hi Vinita, I am reaching out regarding ${selectedTopic} via Arthur Visions website.`;
  const emailSubject = `[Inquiry] ${selectedTopic} - Arthur Visions`;
  const emailBody = `Hi Vinita,\n\nI am contacting you from the Arthur Visions website regarding: ${selectedTopic}.\n\nDetails / Questions:\n\nLooking forward to hearing from you.`;
  const emailUrl = `mailto:${SITE_CONFIG.publicEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const qrChannels = {
    whatsapp: {
      title: "Chat on WhatsApp",
      shortName: "WhatsApp",
      handle: "Arthur Visions Studio (Online)",
      url: SITE_CONFIG.getWhatsAppUrl(whatsappMessage),
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&ecc=M&data=${encodeURIComponent(SITE_CONFIG.getAbsoluteWhatsAppUrl(whatsappMessage))}`,
      color: "#25D366",
      buttonClass: "bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm",
      activeTabClass: "bg-[#25D366] text-white shadow-sm font-bold",
      actionText: `Scan with your phone to start WhatsApp chat about "${selectedTopic}", or click the button below.`,
      badge: "Fastest Response"
    },
    instagram: {
      title: "Follow on Instagram",
      shortName: "Instagram",
      handle: SITE_CONFIG.instagramHandle,
      url: SITE_CONFIG.instagramUrl,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&ecc=M&data=${encodeURIComponent(SITE_CONFIG.instagramUrl)}`,
      color: "#E1306C",
      buttonClass: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white shadow-sm",
      activeTabClass: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white shadow-sm font-bold",
      actionText: "Scan with your phone to view recent artwork reels and DM us on Instagram, or click below.",
      badge: "Art Feed"
    },
    youtube: {
      title: "Subscribe on YouTube",
      shortName: "YouTube",
      handle: SITE_CONFIG.youtubeHandle,
      url: SITE_CONFIG.youtubeUrl,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&ecc=M&data=${encodeURIComponent(SITE_CONFIG.youtubeUrl)}`,
      color: "#FF0000",
      buttonClass: "bg-[#FF0000] hover:bg-[#d90000] text-white shadow-sm",
      activeTabClass: "bg-[#FF0000] text-white shadow-sm font-bold",
      actionText: "Scan with your phone to watch creation time-lapses and tutorials, or click below to visit channel.",
      badge: "Videos & Reels"
    },
    email: {
      title: "Official Studio Email",
      shortName: "Email",
      handle: SITE_CONFIG.publicEmail,
      url: emailUrl,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&ecc=M&data=${encodeURIComponent(emailUrl)}`,
      color: "#EA4335",
      buttonClass: "bg-[#EA4335] hover:bg-[#d3382b] text-white shadow-sm",
      activeTabClass: "bg-[#EA4335] text-white shadow-sm font-bold",
      actionText: `Scan to open your phone's email app pre-filled for "${selectedTopic}", or click below.`,
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
              Scan or Click to Connect
            </h3>
            <p className="text-xs sm:text-sm text-[#5A554F]">
              Point your phone camera to scan, or click directly to connect instantly.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F8ECE7] text-[#B5502F] border border-[#B5502F]/30 flex items-center gap-1.5 shrink-0">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Instant Connect</span>
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

      {/* QR Display Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#DDD3C3] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        
        {/* Clean, 100% Scannable QR Code Frame */}
        <div className="shrink-0">
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Click to open ${current.title}`}
            className="block p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#DDD3C3] shadow-inner hover:border-[#1F1D1B]/40 transition-all cursor-pointer group"
          >
            <img
              src={current.qrUrl}
              alt={`${current.title} QR Code`}
              className="w-48 h-48 object-contain rounded-xl bg-white p-1"
              loading="eager"
            />
            <span className="block text-center text-[10px] text-[#5A554F] group-hover:text-[#1F1D1B] font-medium mt-1.5 transition-colors">
              Click to open directly
            </span>
          </a>
        </div>

        {/* QR Details Beside QR Code */}
        <div className="space-y-4 text-center sm:text-left grow">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {/* Prominent Authentic Brand Icon Beside QR Code */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border"
              style={{
                backgroundColor: `${current.color}15`,
                borderColor: `${current.color}40`,
                color: current.color
              }}
            >
              {renderIcon(activeTab, 'w-6 h-6')}
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h4 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                  {current.title}
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0E9DC] text-[#5A554F]">
                  {current.badge}
                </span>
              </div>
              <p className="text-xs font-bold mt-0.5" style={{ color: current.color }}>
                {current.handle}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#5A554F] leading-relaxed max-w-md mx-auto sm:mx-0">
            {current.actionText}
          </p>

          {/* Action Button Styled with Official Company Colors */}
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${current.buttonClass}`}
            >
              {renderIcon(activeTab, 'w-4 h-4')}
              <span>Click to Open {current.shortName}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-xs text-[#5A554F]">
              (or scan QR code with your phone camera)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
