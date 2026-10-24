import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { YoutubeIcon, InstagramIcon } from '../components/SocialIcons';
import QuickConnectQR from '../components/QuickConnectQR';
import { SITE_CONFIG } from '../config/site';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry / Live Event Booking',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1F1D1B]">
          Contact the Studio
        </h1>
        <p className="text-sm sm:text-base text-[#5A554F]">
          Have questions about a custom portrait, gallery purchases, or booking a live event sketching session? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Direct Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-8 rounded-3xl border border-[#DDD3C3] shadow-xs space-y-6">
            <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
              Studio Information
            </h3>

            <div className="space-y-4 text-sm text-[#5A554F]">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#F8ECE7] text-[#B5502F] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1F1D1B]">Studio Location</h4>
                  <p>Muzaffarpur, Bihar, India (PIN: 842001)</p>
                  <p className="text-xs text-[#6B7F5E] font-medium mt-0.5">
                    Express Insured Delivery Across All Indian States & UTs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#EFF4ED] text-[#6B7F5E] shrink-0 mt-0.5">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1F1D1B]">WhatsApp Studio Support</h4>
                  <p className="text-xs text-[#5A554F]">Instant consultation for reference photos & quotes</p>
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent("Hi Vinita, I have an inquiry regarding your art.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold mt-2 shadow-2xs hover:bg-[#20ba59]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#F0E9DC] text-[#1F1D1B] shrink-0 mt-0.5">
                  <Mail className="w-5 h-5 text-[#B5502F]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1F1D1B]">Official Studio Email</h4>
                  <a href={`mailto:${SITE_CONFIG.publicEmail}`} className="hover:text-[#B5502F] font-semibold text-xs sm:text-sm block">
                    {SITE_CONFIG.publicEmail}
                  </a>
                  <p className="text-[11px] text-[#5A554F] mt-0.5">
                    Forwarded to: {SITE_CONFIG.forwardEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#FBF5E6] text-[#C99A2E] shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1F1D1B]">Studio Hours</h4>
                  <p className="text-xs">Monday – Saturday: 10:00 AM – 7:30 PM IST</p>
                  <p className="text-xs text-[#5A554F]">Online inquiries received 24/7</p>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className="pt-4 border-t border-[#DDD3C3]/60 flex items-center gap-3">
              <a
                href={SITE_CONFIG.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD3C3] text-xs font-semibold text-[#1F1D1B] hover:text-[#B5502F] hover:border-[#B5502F] transition-colors"
              >
                <YoutubeIcon className="w-4 h-4 text-red-600" />
                <span>YouTube</span>
              </a>
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD3C3] text-xs font-semibold text-[#1F1D1B] hover:text-[#B5502F] hover:border-[#B5502F] transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-[#B5502F]" />
                <span>Instagram</span>
              </a>
            </div>

          </div>

        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#DDD3C3] shadow-xs">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EFF4ED] text-[#6B7F5E] flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                Message Sent Successfully!
              </h3>
              <p className="text-sm text-[#5A554F] max-w-sm mx-auto">
                Thank you for reaching out. We will get back to you shortly via email or WhatsApp.
              </p>
              <button
                onClick={() => setSent(false)}
                className="px-6 py-2 rounded-full bg-[#FAF7F2] border border-[#DDD3C3] text-xs font-semibold hover:bg-[#F0E9DC] cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-[#DDD3C3]/60 pb-3">
                <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                  Send a Direct Note
                </h3>
                <p className="text-xs text-[#5A554F]">
                  Fill out the form and we will respond within a few hours.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contact Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] cursor-pointer"
                >
                  <option value="General Inquiry / Live Event Booking">General Inquiry / Live Event Booking</option>
                  <option value="Custom Portrait Commission">Custom Portrait Commission</option>
                  <option value="Purchasing Original Vajjika Folk Art">Purchasing Original Vajjika Folk Art</option>
                  <option value="Exhibition / Media Collaboration">Exhibition / Media Collaboration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe your event or questions here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Instant Mobile QR Scan Section (for Laptop / Desktop users) */}
      <QuickConnectQR />

    </div>
  );
}

