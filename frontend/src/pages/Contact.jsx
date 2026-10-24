import React, { useState } from 'react';
import { Mail, Send, MessageCircle, CheckCircle } from 'lucide-react';
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
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Save to local storage for Admin dashboard
    const newMsg = {
      id: `MSG-${Date.now().toString().slice(-5)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      date: new Date().toLocaleDateString('en-IN'),
    };
    const savedMsgs = JSON.parse(localStorage.getItem('arthurvisions_contacts') || '[]');
    localStorage.setItem('arthurvisions_contacts', JSON.stringify([newMsg, ...savedMsgs]));

    // Send email notification directly to shinkodha@gmail.com via Web3Forms
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: '3c1f0fa8-385b-42da-9fb4-cbd1b6e39e17',
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'Not provided',
          subject: `[Arthur Visions] ${formData.subject}`,
          message: formData.message,
          from_name: 'Arthur Visions Portfolio',
        }),
      });

      // Send to Edge API
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('subject', formData.subject);
      data.append('message', formData.message);

      await fetch('/api/contact', {
        method: 'POST',
        body: data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
      setSent(true);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1F1D1B]">
          Contact Arthur Visions
        </h1>
        <p className="text-sm sm:text-base text-[#5A554F]">
          Have questions about a custom portrait, gallery purchases, or booking a live event sketching session? Connect directly or send a message below.
        </p>
      </div>

      {/* 1. Quick Connect Channels (WhatsApp, Instagram, YouTube, Email) */}
      <QuickConnectQR />

      {/* 2. Contact Message Form */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#DDD3C3] shadow-xs">
        {sent ? (
          <div className="text-center py-10 space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#EFF4ED] text-[#6B7F5E] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                Message Sent Successfully!
              </h3>
              <p className="text-sm text-[#5A554F] max-w-md mx-auto">
                Thank you, <strong>{formData.name}</strong>. Vinita has received your note and will get back to you shortly via WhatsApp or email.
              </p>
            </div>

            {/* Instant WhatsApp & Email connection buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <a
                href={SITE_CONFIG.getWhatsAppUrl(
                  `Hi Vinita, I just submitted an inquiry on your website.\nName: ${formData.name}\nEmail: ${formData.email}${formData.phone ? `\nPhone: ${formData.phone}` : ''}\nSubject: ${formData.subject}\nMessage: ${formData.message}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] font-medium text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Connect Instantly on WhatsApp</span>
              </a>

              <a
                href={`mailto:${SITE_CONFIG.publicEmail}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
                  `Name: ${formData.name}\nEmail: ${formData.email}\n${formData.phone ? `Phone: ${formData.phone}\n` : ''}\nMessage:\n${formData.message}`
                )}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#EA4335] text-white hover:bg-[#d3382b] font-medium text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Open in Email App</span>
              </a>
            </div>

            <div className="pt-4 border-t border-[#DDD3C3]/60">
              <button
                onClick={() => setSent(false)}
                className="px-6 py-2 rounded-full bg-[#FAF7F2] border border-[#DDD3C3] text-xs font-semibold hover:bg-[#F0E9DC] cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-[#DDD3C3]/60 pb-3">
              <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                Send a Direct Message
              </h3>
              <p className="text-xs text-[#5A554F] mt-0.5">
                Fill out the form below and Vinita will respond directly to your WhatsApp or email.
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
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  WhatsApp / Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210 (Optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Inquiry Topic
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
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                Message *
              </label>
              <textarea
                required
                rows="4"
                placeholder="Describe your event, portrait idea, or questions here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending...' : 'Submit Message'}</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
