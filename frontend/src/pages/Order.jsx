import React, { useState, useEffect } from 'react';
import { PRICING_GUIDE, FAQS } from '../data/faqs';
import { SITE_CONFIG } from '../config/site';
import { 
  Upload, CheckCircle, Clock, Shield, Sparkles, Send, 
  HelpCircle, ChevronDown, ChevronUp, Image as ImageIcon,
  MessageCircle, Package, Truck, AlertCircle
} from 'lucide-react';

export default function Order({ initialConfig, onOrderSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    medium: initialConfig?.medium || 'Charcoal & Pencil Sketch',
    size: initialConfig?.size || 'A3',
    subjects: initialConfig?.subjects || 1,
    occasion: 'Birthday / Anniversary Gift',
    deadline: '',
    notes: '',
    photo: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    if (initialConfig) {
      setFormData(prev => ({
        ...prev,
        medium: initialConfig.medium || prev.medium,
        size: initialConfig.size || prev.size,
        subjects: initialConfig.subjects || prev.subjects,
      }));
    }
  }, [initialConfig]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Prepare payload
    try {
      // 1. Send direct email notification to artist's Gmail via Web3Forms
      try {
        const emailPayload = new FormData();
        emailPayload.append('access_key', '3c1f0fa8-385b-42da-9fb4-cbd1b6e39e17');
        emailPayload.append('subject', `🎨 [New Order Inquiry] ${formData.name} - ${formData.medium} (${formData.size})`);
        emailPayload.append('from_name', 'Arthur Visions Order Studio');
        emailPayload.append('Client Name', formData.name);
        emailPayload.append('WhatsApp Phone', formData.phone);
        if (formData.email) {
          emailPayload.append('Email Address', formData.email);
        }
        emailPayload.append('Delivery City & State', formData.city);
        emailPayload.append('Artwork Medium', formData.medium);
        emailPayload.append('Canvas / Paper Size', formData.size);
        emailPayload.append('Number of Faces / Subjects', formData.subjects.toString());
        emailPayload.append('Occasion', formData.occasion);
        emailPayload.append('Target Date / Deadline', formData.deadline || 'Flexible');
        emailPayload.append('Special Instructions / Notes', formData.notes || 'None');
        if (formData.photo) {
          emailPayload.append('attachment', formData.photo);
        }

        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: emailPayload,
        }).catch((e) => console.error('Web3Forms Order email error:', e));
      } catch (emailErr) {
        console.error('Web3Forms dispatch error:', emailErr);
      }

      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      if (formData.email) {
        data.append('email', formData.email);
      }
      data.append('city', formData.city);
      data.append('medium', formData.medium);
      data.append('size', formData.size);
      data.append('subjects', formData.subjects.toString());
      data.append('occasion', formData.occasion);
      data.append('deadline', formData.deadline);
      data.append('notes', formData.notes);
      if (formData.photo) {
        data.append('photo', formData.photo);
      }

      // Try posting to local/Cloudflare Worker endpoint
      await fetch('/api/order', {
        method: 'POST',
        body: data,
      }).catch(() => null);

      // Save to localStorage for Admin view
      const newOrder = {
        id: `ORD-${Date.now().toString().slice(-5)}`,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        medium: formData.medium,
        size: formData.size,
        subjects: formData.subjects,
        notes: formData.notes,
        deadline: formData.deadline,
        date: new Date().toLocaleDateString('en-IN'),
        status: 'NEW',
        photoName: formData.photo ? formData.photo.name : 'No photo uploaded',
      };

      const existingOrders = JSON.parse(localStorage.getItem('arthurvisions_orders') || '[]');
      localStorage.setItem('arthurvisions_orders', JSON.stringify([newOrder, ...existingOrders]));

      if (onOrderSuccess) onOrderSuccess(newOrder);

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
          Commission Studio
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1F1D1B]">
          Order a Custom Handcrafted Portrait
        </h1>
        <p className="text-sm sm:text-base text-[#5A554F] leading-relaxed">
          Commission a personalized artwork in charcoal, watercolor, oil, or traditional Vajjika style. Hand-drawn by state-recognized artist with 100% satisfaction proof preview.
        </p>
      </div>

      {/* 2. Four-Step Commission Journey */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#DDD3C3] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#F8ECE7] text-[#B5502F] flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1F1D1B]">1. Share Your Photo</h3>
          <p className="text-xs text-[#5A554F] leading-relaxed">
            Fill the form below with your favorite photo, medium, and size preferences.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDD3C3] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#FBF5E6] text-[#C99A2E] flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1F1D1B]">2. Quote & 50% Advance</h3>
          <p className="text-xs text-[#5A554F] leading-relaxed">
            We confirm the reference quality on WhatsApp and secure your slot in the studio schedule.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDD3C3] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#EAEFF7] text-[#2F3E5C] flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1F1D1B]">3. Artwork Made & Proof</h3>
          <p className="text-xs text-[#5A554F] leading-relaxed">
            We share high-resolution photos and video angles of the finished sketch for your review.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDD3C3] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#EFF4ED] text-[#6B7F5E] flex items-center justify-center font-bold text-sm">
            4
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1F1D1B]">4. Insured Delivery</h3>
          <p className="text-xs text-[#5A554F] leading-relaxed">
            Safely packed in rigid PVC cylinders or wooden crates, delivered to your doorstep.
          </p>
        </div>
      </div>

      {/* 3. Main Commission Form & Sticky Price Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-[#DDD3C3] shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#EFF4ED] text-[#6B7F5E] flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-3xl font-bold text-[#1F1D1B]">
                  Inquiry Received Successfully!
                </h3>
                <p className="text-sm text-[#5A554F] max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Vinita will review your photo and contact you on WhatsApp (<strong>{formData.phone}</strong>) within 2 to 3 hours with a personalized quote and timeline.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={SITE_CONFIG.getWhatsAppUrl(
                    `Hi Vinita, I just submitted an order inquiry on your website for a ${formData.medium} (${formData.size}). My name is ${formData.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] font-medium text-sm flex items-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Connect Instantly on WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setPreviewUrl(null);
                  }}
                  className="px-6 py-3 rounded-full bg-[#FAF7F2] border border-[#DDD3C3] text-[#1F1D1B] text-sm font-semibold hover:bg-[#F0E9DC] cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="border-b border-[#DDD3C3]/70 pb-4">
                <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                  Commission Details Form
                </h3>
                <p className="text-xs text-[#5A554F]">
                  All fields help us prepare an accurate timeline and material assessment.
                </p>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Delivery City & State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patna, Bihar"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>
              </div>

              {/* Art Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Medium *
                  </label>
                  <select
                    value={formData.medium}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] cursor-pointer"
                  >
                    <option value="Charcoal & Pencil Sketch">Charcoal & Pencil Sketch</option>
                    <option value="Pen & Ink Portrait">Pen & Ink Portrait</option>
                    <option value="Watercolor Portrait">Watercolor on Cotton Sheet</option>
                    <option value="Soft Pastel Painting">Soft Pastel Painting</option>
                    <option value="Acrylic on Canvas">Acrylic on Wrapped Canvas</option>
                    <option value="Oil on Linen Canvas">Oil on Linen Canvas (Masterpiece)</option>
                    <option value="Traditional Vajjika Art">Traditional Vajjika Art</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Size *
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] cursor-pointer"
                  >
                    <option value="A4">A4 (8.3 × 11.7 in) — Desk Display</option>
                    <option value="A3">A3 (11.7 × 16.5 in) — Most Popular</option>
                    <option value="A2">A2 (16.5 × 23.4 in) — Statement Size</option>
                    <option value="Custom Canvas">Custom Canvas (Mention in notes)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Number of Faces
                  </label>
                  <select
                    value={formData.subjects}
                    onChange={(e) => setFormData({ ...formData, subjects: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] cursor-pointer"
                  >
                    <option value={1}>1 Person</option>
                    <option value={2}>2 Persons (Couple)</option>
                    <option value={3}>3 Persons (Family)</option>
                    <option value={4}>4+ Persons (Custom Group)</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Upload Reference Photo (Optional here or send via WhatsApp later)
                </label>
                <div className="border-2 border-dashed border-[#DDD3C3] rounded-2xl p-6 text-center hover:border-[#B5502F] transition-colors bg-[#FAF7F2]/50">
                  {previewUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl shadow-md border border-[#DDD3C3]"
                      />
                      <p className="text-xs text-[#5A554F]">
                        {formData.photo?.name} (Ready to upload)
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, photo: null });
                          setPreviewUrl(null);
                        }}
                        className="text-xs text-[#B5502F] underline hover:text-[#9B4224] cursor-pointer"
                      >
                        Remove photo
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-[#F0E9DC] text-[#B5502F] flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-semibold text-[#1F1D1B]">
                        Click to select photo or drag and drop
                      </span>
                      <span className="text-xs text-[#5A554F]">
                        PNG, JPG, HEIC up to 25 MB (Clear eyes & natural lighting recommended)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Occasion & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Occasion / Purpose
                  </label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] cursor-pointer"
                  >
                    <option value="Birthday / Anniversary Gift">Birthday / Anniversary Gift</option>
                    <option value="Wedding Gift">Wedding Gift</option>
                    <option value="Memorial / Tribute Portrait">Memorial / Tribute Portrait</option>
                    <option value="Home Decor / Fine Art Collection">Home Decor / Fine Art Collection</option>
                    <option value="Corporate / VIP Token">Corporate / VIP Token</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Target Delivery Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>
              </div>

              {/* Custom Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Special Notes or Custom Requests
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Please combine grandmother with grandchild, remove busy background, prefer warm vintage tones..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white font-semibold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {submitting ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Commission Inquiry (No Advance Now)</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-[#5A554F]">
                🔒 Your reference photos and contact details are kept strictly private and never shared publicly without permission.
              </p>

            </form>
          )}
        </div>

        {/* Right Column: Pricing Transparency & Packaging Guarantee */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Price Card */}
          <div className="bg-[#F0E9DC] p-6 rounded-3xl border border-[#DDD3C3] space-y-4">
            <h4 className="font-serif text-xl font-bold text-[#1F1D1B]">
              Studio Starting Prices
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-[#DDD3C3]">
                <span className="text-[#5A554F]">Charcoal & Pencil Sketch (A4)</span>
                <span className="font-bold text-[#1F1D1B]">From ₹1,999</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#DDD3C3]">
                <span className="text-[#5A554F]">Pen & Ink Portrait (A4)</span>
                <span className="font-bold text-[#1F1D1B]">From ₹2,299</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#DDD3C3]">
                <span className="text-[#5A554F]">Watercolor Portrait (A4)</span>
                <span className="font-bold text-[#1F1D1B]">From ₹2,799</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#DDD3C3]">
                <span className="text-[#5A554F]">Soft Pastel on Sheet (A4)</span>
                <span className="font-bold text-[#1F1D1B]">From ₹2,999</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#DDD3C3]">
                <span className="text-[#5A554F]">Acrylic on Stretched Canvas</span>
                <span className="font-bold text-[#1F1D1B]">From ₹3,499</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#DDD3C3]">
                <span className="text-[#5A554F]">Classical Oil on Canvas</span>
                <span className="font-bold text-[#1F1D1B]">From ₹4,999</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A554F]">Vajjika Folk Art (Vaishali Heritage)</span>
                <span className="font-bold text-[#1F1D1B]">From ₹2,499</span>
              </div>
            </div>
            <p className="text-[11px] text-[#5A554F] italic">
              *Prices include archival packaging and insured courier charges across India.
            </p>
          </div>

          {/* Packaging Guarantee Box */}
          <div className="bg-white p-6 rounded-3xl border border-[#DDD3C3] space-y-4">
            <div className="flex items-center gap-2.5 text-[#B5502F]">
              <Package className="w-5 h-5" />
              <h4 className="font-serif text-lg font-bold text-[#1F1D1B]">
                Damage-Proof Packaging Guarantee
              </h4>
            </div>
            <div className="space-y-3 text-xs text-[#5A554F] leading-relaxed">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#6B7F5E] shrink-0 mt-0.5" />
                <span><strong>Heavy PVC Hard Cylinders:</strong> For charcoal, pastel, and watercolor paper artworks with glassine interleaf.</span>
              </div>
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#6B7F5E] shrink-0 mt-0.5" />
                <span><strong>Reinforced Wood & Bubble Crates:</strong> For framed and stretched canvas paintings.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Complete Pricing Guide Table */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#DDD3C3] space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
            Transparent Rate Card
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1D1B]">
            Standard Size & Medium Pricing Matrix
          </h3>
          <p className="text-xs sm:text-sm text-[#5A554F] mt-1">
            Prices for 1 subject. Additional faces are typically +40% to cover the extra drawing hours.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#DDD3C3] bg-[#FAF7F2] text-[#5A554F]">
                <th className="py-3 px-4 font-semibold">Medium & Style</th>
                <th className="py-3 px-4 font-semibold">A4 (8×12 in)</th>
                <th className="py-3 px-4 font-semibold">A3 (12×16 in)</th>
                <th className="py-3 px-4 font-semibold">A2 (16×24 in)</th>
                <th className="py-3 px-4 font-semibold">Creation Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD3C3]/60">
              {PRICING_GUIDE.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#1F1D1B]">
                    {row.medium}
                    {row.popular && (
                      <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-[#F8ECE7] text-[#B5502F]">
                        Popular
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#5A554F]">{row.a4}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#B5502F]">{row.a3}</td>
                  <td className="py-3.5 px-4 text-[#5A554F]">{row.a2}</td>
                  <td className="py-3.5 px-4 text-[#5A554F] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C99A2E]" />
                    <span>{row.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. FAQs Accordion */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
            Frequently Asked Questions
          </span>
          <h3 className="font-serif text-3xl font-bold text-[#1F1D1B]">
            Everything You Need to Know Before Ordering
          </h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#DDD3C3] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF7F2]/50"
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-[#1F1D1B]">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#B5502F] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#5A554F] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#5A554F] leading-relaxed border-t border-[#DDD3C3]/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

