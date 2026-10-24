import React, { useState } from 'react';
import { QrCode, MessageCircle, Mail, ExternalLink, Smartphone } from 'lucide-react';
import { YoutubeIcon, InstagramIcon } from './SocialIcons';
import { SITE_CONFIG } from '../config/site';

export default function QuickConnectQR() {
  const [activeTab, setActiveTab] = useState('whatsapp');

  const qrChannels = {
    whatsapp: {
      title: "Chat on WhatsApp",
      shortName: "WhatsApp",
      handle: "Arthur Visions Studio Chat",
      url: SITE_CONFIG.getWhatsAppUrl("Hi Vinita, I am visiting Arthur Visions website and would like to discuss an artwork."),
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(SITE_CONFIG.getAbsoluteWhatsAppUrl("Hi Vinita, I am visiting Arthur Visions"))}`,
      color: "#25D366",
      actionText: "Scan to open WhatsApp chat directly on your phone, or click the button to chat now.",
      badge: "Fastest Response"
    },
    instagram: {
      title: "Follow on Instagram",
      shortName: "Instagram",
      handle: SITE_CONFIG.instagramHandle,
      url: SITE_CONFIG.instagramUrl,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(SITE_CONFIG.instagramUrl)}`,
      color: "#E1306C",
      actionText: "Scan to view recent stories & artwork reels, or click to open our profile.",
      badge: "Art Feed"
    },
    youtube: {
      title: "Subscribe on YouTube",
      shortName: "YouTube",
      handle: SITE_CONFIG.youtubeHandle,
      url: SITE_CONFIG.youtubeUrl,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(SITE_CONFIG.youtubeUrl)}`,
      color: "#FF0000",
      actionText: "Scan to watch time-lapse videos & live sketches, or click to visit channel.",
      badge: "Videos & Reels"
    },
    email: {
      title: "Official Studio Email",
      shortName: "Email",
      handle: SITE_CONFIG.publicEmail,
      url: `mailto:${SITE_CONFIG.publicEmail}`,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(`mailto:${SITE_CONFIG.publicEmail}`)}`,
      color: "#B5502F",
      actionText: "Scan to compose a direct email inquiry, or click to launch your email app.",
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

      {/* Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'whatsapp'
              ? 'bg-[#25D366] text-white shadow-sm'
              : 'bg-white text-[#5A554F] border border-[#DDD3C3] hover:bg-[#F0E9DC]'
          }`}
        >
          {renderIcon('whatsapp', 'w-4 h-4')}
          <span>WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('instagram')}
          className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'instagram'
              ? 'bg-[#E1306C] text-white shadow-sm'
              : 'bg-white text-[#5A554F] border border-[#DDD3C3] hover:bg-[#F0E9DC]'
          }`}
        >
          {renderIcon('instagram', 'w-4 h-4')}
          <span>Instagram</span>
        </button>

        <button
          onClick={() => setActiveTab('youtube')}
          className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'youtube'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white text-[#5A554F] border border-[#DDD3C3] hover:bg-[#F0E9DC]'
          }`}
        >
          {renderIcon('youtube', 'w-4 h-4')}
          <span>YouTube</span>
        </button>

        <button
          onClick={() => setActiveTab('email')}
          className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'email'
              ? 'bg-[#B5502F] text-white shadow-sm'
              : 'bg-white text-[#5A554F] border border-[#DDD3C3] hover:bg-[#F0E9DC]'
          }`}
        >
          {renderIcon('email', 'w-4 h-4')}
          <span>Email</span>
        </button>
      </div>

      {/* QR Display Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#DDD3C3] flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* QR Code Graphic Frame with Brand Icon Overlay */}
        <div className="relative group shrink-0">
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Click to open ${current.title}`}
            className="block p-3 bg-[#FAF7F2] rounded-2xl border border-[#DDD3C3] shadow-inner hover:border-[#B5502F] transition-all cursor-pointer relative"
          >
            <img
              src={current.qrUrl}
              alt={`${current.title} QR Code`}
              className="w-44 h-44 object-contain rounded-xl"
              loading="lazy"
            />
            {/* Center icon on QR code */}
            <div
              className="absolute inset-0 m-auto w-10 h-10 rounded-xl bg-white shadow-md border border-[#DDD3C3] flex items-center justify-center transition-transform group-hover:scale-110 pointer-events-none"
              style={{ color: current.color }}
            >
              {renderIcon(activeTab, 'w-5 h-5')}
            </div>
          </a>
        </div>

        {/* QR Details Beside QR Code */}
        <div className="space-y-3.5 text-center sm:text-left grow">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {/* Prominent Icon Beside QR Code */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs border"
              style={{
                backgroundColor: `${current.color}15`,
                borderColor: `${current.color}35`,
                color: current.color
              }}
            >
              {renderIcon(activeTab, 'w-5 h-5')}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                  {current.title}
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0E9DC] text-[#5A554F]">
                  {current.badge}
                </span>
              </div>
              <p className="text-xs font-semibold mt-0.5" style={{ color: current.color }}>
                {current.handle}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#5A554F] leading-relaxed max-w-md">
            {current.actionText}
          </p>

          {/* Action Links */}
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs sm:text-sm font-semibold shadow-xs hover:opacity-95 transition-all cursor-pointer"
              style={{ backgroundColor: current.color }}
            >
              {renderIcon(activeTab, 'w-4 h-4')}
              <span>Click to Connect on {current.shortName}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-xs text-[#5A554F]">
              (or scan QR using your phone camera)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
