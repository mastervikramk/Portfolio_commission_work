import React, { useState } from 'react';
import { QrCode, MessageCircle, Mail, ExternalLink, Smartphone } from 'lucide-react';
import { YoutubeIcon, InstagramIcon } from './SocialIcons';
import { SITE_CONFIG } from '../config/site';

export default function QuickConnectQR() {
  const [activeTab, setActiveTab] = useState('whatsapp');

  const qrChannels = {
    whatsapp: {
      title: "Chat on WhatsApp",
      handle: "Arthur Visions Studio Chat",
      url: `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent("Hi Vinita, I am visiting Arthur Visions website and would like to discuss an artwork.")}`,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=Hi Vinita, I am visiting Arthur Visions`)}`,
      color: "#25D366",
      actionText: "Scan to open WhatsApp chat directly on your phone",
      badge: "Fastest Response"
    },
    instagram: {
      title: "Follow on Instagram",
      handle: SITE_CONFIG.instagramHandle,
      url: SITE_CONFIG.instagramUrl,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(SITE_CONFIG.instagramUrl)}`,
      color: "#E1306C",
      actionText: "Scan to view recent stories & artwork reels",
      badge: "Art Feed"
    },
    youtube: {
      title: "Subscribe on YouTube",
      handle: SITE_CONFIG.youtubeHandle,
      url: SITE_CONFIG.youtubeUrl,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(SITE_CONFIG.youtubeUrl)}`,
      color: "#FF0000",
      actionText: "Scan to watch time-lapse videos & live sketches",
      badge: "Videos & Reels"
    },
    email: {
      title: "Official Studio Email",
      handle: SITE_CONFIG.publicEmail,
      url: `mailto:${SITE_CONFIG.publicEmail}`,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(`mailto:${SITE_CONFIG.publicEmail}`)}`,
      color: "#B5502F",
      actionText: "Scan to compose a direct email inquiry",
      badge: "Official Inquiries"
    }
  };

  const current = qrChannels[activeTab];

  return (
    <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#DDD3C3] shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#DDD3C3]">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#F0E9DC] text-[#B5502F]">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1D1B]">
              Scan to Connect
            </h3>
            <p className="text-xs text-[#5A554F]">
              Point your camera to chat on WhatsApp, follow on Instagram, or subscribe.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F8ECE7] text-[#B5502F] border border-[#B5502F]/30">
          Studio QR
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
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>WhatsApp QR</span>
        </button>

        <button
          onClick={() => setActiveTab('instagram')}
          className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'instagram'
              ? 'bg-[#E1306C] text-white shadow-sm'
              : 'bg-white text-[#5A554F] border border-[#DDD3C3] hover:bg-[#F0E9DC]'
          }`}
        >
          <InstagramIcon className="w-4 h-4" />
          <span>Instagram QR</span>
        </button>

        <button
          onClick={() => setActiveTab('youtube')}
          className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'youtube'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white text-[#5A554F] border border-[#DDD3C3] hover:bg-[#F0E9DC]'
          }`}
        >
          <YoutubeIcon className="w-4 h-4" />
          <span>YouTube QR</span>
        </button>

        <button
          onClick={() => setActiveTab('email')}
          className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'email'
              ? 'bg-[#B5502F] text-white shadow-sm'
              : 'bg-white text-[#5A554F] border border-[#DDD3C3] hover:bg-[#F0E9DC]'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email QR</span>
        </button>
      </div>

      {/* QR Display Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDD3C3] flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* QR Code Graphic Frame */}
        <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#DDD3C3] shadow-inner shrink-0">
          <img
            src={current.qrUrl}
            alt={`${current.title} QR Code`}
            className="w-44 h-44 object-contain rounded-xl"
            loading="lazy"
          />
        </div>

        {/* QR Details */}
        <div className="space-y-3 text-center sm:text-left grow">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h4 className="font-serif text-2xl font-bold text-[#1F1D1B]">
              {current.title}
            </h4>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0E9DC] text-[#5A554F]">
              {current.badge}
            </span>
          </div>

          <p className="text-sm font-semibold text-[#B5502F]">
            {current.handle}
          </p>

          <p className="text-xs text-[#5A554F] leading-relaxed max-w-sm">
            {current.actionText}
          </p>

          <div className="pt-2">
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F1D1B] hover:text-[#B5502F] underline"
            >
              <span>Or click here to open directly</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
