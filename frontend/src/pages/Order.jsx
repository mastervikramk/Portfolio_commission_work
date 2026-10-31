import React, { useState, useEffect } from 'react';
import { FAQS } from '../data/faqs';
import { SITE_CONFIG } from '../config/site';
import { 
  Upload, CheckCircle, Clock, Shield, Sparkles, Send, 
  HelpCircle, ChevronDown, ChevronUp, Image as ImageIcon,
  MessageCircle, Package, Truck, ArrowRight, Calendar, MapPin, Sparkle
} from 'lucide-react';

export default function Order({ initialConfig, onOrderSuccess }) {
  const [serviceType, setServiceType] = useState(initialConfig?.serviceType || 'portrait');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    medium: initialConfig?.medium || 'Charcoal & Pencil',
    otherMedium: '',
    size: initialConfig?.size || 'A3',
    subjects: initialConfig?.subjects || 1,
    neededByDate: '',
    eventDate: '',
    eventType: 'Wedding / Sangeet / Reception',
    otherEventType: '',
    eventDuration: '2 to 3 Hours (approx 5 to 7 portraits)',
    productType: 'Hand-painted Tussar Silk Saree',
    otherProductType: '',
    notes: '',
    photo: null,
  });

  // Calculate today's date in local time YYYY-MM-DD so past dates cannot be selected
  const todayDateString = (() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })();

  // Instant live portrait price calculator matching studio rates
  const calculatePortraitPrice = () => {
    if (formData.medium === 'Other Medium') return null;

    const priceMatrix = {
      'Charcoal & Pencil': { A4: 1999, A3: 2999, A2: 4499 },
      'Pen & Ink': { A4: 2299, A3: 3499, A2: 4999 },
      'Watercolor': { A4: 2799, A3: 3999, A2: 5999 },
      'Realistic Acrylic': { A4: 3499, A3: 5199, A2: 7999 },
      'Oil on Canvas': { A4: 4999, A3: 7499, A2: 11999 },
    };

    const mediumPrices = priceMatrix[formData.medium] || priceMatrix['Charcoal & Pencil'];
    const base = mediumPrices[formData.size] || 2999;
    const multiplier = 1 + (Number(formData.subjects) - 1) * 0.45;
    return Math.round(base * multiplier);
  };

  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  // Available options for Portrait commissions
  const mediumsList = [
    { id: 'Charcoal & Pencil', label: 'Charcoal & Pencil' },
    { id: 'Realistic Acrylic', label: 'Realistic Acrylic', tag: 'Artist Pick' },
    { id: 'Watercolor', label: 'Watercolor' },
    { id: 'Oil on Canvas', label: 'Oil on Canvas' },
    { id: 'Pen & Ink', label: 'Pen & Ink' },
    { id: 'Other Medium', label: 'Other Medium', tag: 'Custom' },
  ];

  const sizesList = [
    { id: 'A4', label: 'A4', dims: '8×12 in', note: 'Desk' },
    { id: 'A3', label: 'A3', dims: '12×16 in', note: 'Wall', popular: true },
    { id: 'A2', label: 'A2', dims: '16×24 in', note: 'Statement' },
  ];

  const subjectsList = [
    { count: 1, label: '1 Person' },
    { count: 2, label: '2 Persons' },
    { count: 3, label: '3 Persons' },
    { count: 4, label: '4+ Persons' },
  ];

  // Options for Vajjika Sarees & Products
  const vajjikaProductsList = [
    { id: 'Hand-painted Tussar Silk Saree', label: 'Tussar Silk Saree', note: 'Pure Handloom' },
    { id: 'Hand-painted Designer Handbag', label: 'Handbag', note: 'Artisan Crafted' },
    { id: 'Hand-painted Sling Bag', label: 'Sling Bag', note: 'Everyday Chic' },
    { id: 'Hand-painted Clutch', label: 'Party Clutch', note: 'Festive Wear' },
    { id: 'Hand-painted Coin Pouch', label: 'Coin Pouch', note: 'Pocket Accessory' },
    { id: 'Handloom Silk Dupatta / Stole', label: 'Dupatta / Stole', note: 'Hand-painted' },
    { id: 'Traditional Wall Canvas Painting', label: 'Wall Canvas', note: 'Fine Art Canvas (Unframed)' },
    { id: 'Other Handcrafted Item', label: 'Other Product', note: 'Custom Request' },
  ];

  // Options for Live Events
  const eventTypesList = [
    'Wedding / Sangeet / Reception',
    'VIP Corporate Conclave',
    'Anniversary / Birthday Gala',
    'Cultural Art Festival',
    'Other Special Occasion',
  ];

  const eventDurationsList = [
    { id: '1 Hour (approx 1 to 4 portraits)', label: '1 Hour', count: '1 to 4 Portraits', note: 'Intimate / VIP' },
    { id: '2 to 3 Hours (approx 5 to 7 portraits)', label: '2 to 3 Hours', count: '5 to 7 Portraits', note: 'Half-Session', popular: true },
    { id: 'Full Evening (approx 20+ portraits)', label: 'Full Evening', count: '20+ Portraits', note: 'Grand Gala' },
    { id: 'Multi-day Wedding Celebration', label: 'Multi-Day', count: 'Custom Session', note: 'Wedding Extravaganza' },
  ];

  useEffect(() => {
    if (initialConfig) {
      if (initialConfig.serviceType) {
        setServiceType(initialConfig.serviceType);
      }
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

  const getInquiryLabel = () => {
    if (serviceType === 'event') {
      const eventName = formData.eventType === 'Other Special Occasion' && formData.otherEventType
        ? `Other: ${formData.otherEventType}`
        : formData.eventType;
      return `Live Event Sketching (${eventName})`;
    }
    if (serviceType === 'vajjika') {
      const prodName = formData.productType === 'Other Handcrafted Item' && formData.otherProductType
        ? `Other: ${formData.otherProductType}`
        : formData.productType;
      return `Vajjika ${prodName}`;
    }
    const medName = formData.medium === 'Other Medium' && formData.otherMedium
      ? `Other: ${formData.otherMedium}`
      : formData.medium;
    return `Custom Portrait (${medName} - ${formData.size})`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderId = `ORD-${Date.now().toString().slice(-5)}`;
    setSubmittedOrderId(orderId);

    try {
      // 1. Direct email notification via Web3Forms
      try {
        const emailPayload = new FormData();
        emailPayload.append('access_key', '3c1f0fa8-385b-42da-9fb4-cbd1b6e39e17');
        emailPayload.append('subject', `🎨 [${orderId}] New Inquiry: ${formData.name} - ${getInquiryLabel()}`);
        emailPayload.append('from_name', 'Arthur Visions Studio');
        emailPayload.append('Order Reference', orderId);
        emailPayload.append('Service Category', serviceType === 'event' ? 'Live Event Sketching' : serviceType === 'vajjika' ? 'Vajjika Saree / Product' : 'Custom Portrait');
        emailPayload.append('Client Name', formData.name);
        emailPayload.append('WhatsApp Phone', formData.phone);
        if (formData.city) emailPayload.append('City / Location', formData.city);
        
        if (serviceType === 'portrait') {
          const finalMedium = formData.medium === 'Other Medium' && formData.otherMedium
            ? `Other (${formData.otherMedium})`
            : formData.medium;
          emailPayload.append('Medium', finalMedium);
          emailPayload.append('Size', formData.size);
          emailPayload.append('Number of Faces', formData.subjects.toString());
          if (formData.neededByDate) emailPayload.append('Needed By / Target Date', formData.neededByDate);
        } else if (serviceType === 'event') {
          const finalEvent = formData.eventType === 'Other Special Occasion' && formData.otherEventType
            ? `Other (${formData.otherEventType})`
            : formData.eventType;
          emailPayload.append('Event Date', formData.eventDate || 'To be decided');
          emailPayload.append('Event Type', finalEvent);
          emailPayload.append('Duration / Guests', formData.eventDuration);
        } else if (serviceType === 'vajjika') {
          const finalProduct = formData.productType === 'Other Handcrafted Item' && formData.otherProductType
            ? `Other (${formData.otherProductType})`
            : formData.productType;
          emailPayload.append('Product Type', finalProduct);
          if (formData.neededByDate) emailPayload.append('Needed By / Target Date', formData.neededByDate);
        }

        emailPayload.append('Special Notes / Requests', formData.notes || 'None');
        if (formData.photo) {
          emailPayload.append('attachment', formData.photo);
        }

        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: emailPayload,
        }).catch((e) => console.error('Web3Forms dispatch error:', e));
      } catch (emailErr) {
        console.error('Web3Forms error:', emailErr);
      }

      // 2. Save order to localStorage for Admin view
      const resolvedMedium = serviceType === 'portrait'
        ? (formData.medium === 'Other Medium' && formData.otherMedium ? `Other: ${formData.otherMedium}` : formData.medium)
        : serviceType === 'event'
        ? `Live Event (${formData.eventType === 'Other Special Occasion' && formData.otherEventType ? formData.otherEventType : formData.eventType})`
        : `Vajjika (${formData.productType === 'Other Handcrafted Item' && formData.otherProductType ? formData.otherProductType : formData.productType})`;

      const newOrder = {
        id: orderId,
        serviceType,
        name: formData.name,
        phone: formData.phone,
        city: formData.city || 'India',
        medium: resolvedMedium,
        size: serviceType === 'portrait'
          ? (formData.neededByDate ? `${formData.size} (Need by: ${formData.neededByDate})` : formData.size)
          : serviceType === 'event'
          ? (formData.eventDate || 'Custom Date')
          : (formData.neededByDate ? `Need by: ${formData.neededByDate}` : 'Custom Order'),
        subjects: serviceType === 'portrait' ? formData.subjects : 1,
        notes: formData.notes,
        date: new Date().toLocaleDateString('en-IN'),
        status: 'NEW',
        photoName: formData.photo ? formData.photo.name : 'Photo sent on WhatsApp',
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
    <div className="pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* 1. Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
          Studio Bookings & Commissions
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1D1B]">
          Bring Fine Art Into Your Life
        </h1>
        <p className="text-sm sm:text-base text-[#5A554F] leading-relaxed">
          Order a custom photo portrait, book live on-site wedding sketching, or commission authentic hand-painted Vajjika sarees.
        </p>
      </div>

      {/* 2. Service Switcher (3 Tabs - Stacked on Mobile, Row on Desktop to Prevent Overlap) */}
      <div className="bg-[#F0E9DC]/80 p-2 rounded-2xl border border-[#DDD3C3] max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 shadow-2xs">
        <button
          type="button"
          onClick={() => setServiceType('portrait')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            serviceType === 'portrait'
              ? 'bg-[#B5502F] text-white shadow-xs'
              : 'bg-white/60 text-[#5A554F] hover:text-[#1F1D1B] hover:bg-white'
          }`}
        >
          <span className="text-base">🎨</span>
          <span className="whitespace-nowrap">Custom Portrait</span>
        </button>

        <button
          type="button"
          onClick={() => setServiceType('event')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            serviceType === 'event'
              ? 'bg-[#B5502F] text-white shadow-xs'
              : 'bg-white/60 text-[#5A554F] hover:text-[#1F1D1B] hover:bg-white'
          }`}
        >
          <span className="text-base">✍️</span>
          <span className="whitespace-nowrap">Live Event Sketching</span>
        </button>

        <button
          type="button"
          onClick={() => setServiceType('vajjika')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            serviceType === 'vajjika'
              ? 'bg-[#B5502F] text-white shadow-xs'
              : 'bg-white/60 text-[#5A554F] hover:text-[#1F1D1B] hover:bg-white'
          }`}
        >
          <span className="text-base">🥻</span>
          <span className="whitespace-nowrap">Vajjika Art & Products</span>
        </button>
      </div>

      {/* 3. Main Form & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-9 rounded-3xl border border-[#DDD3C3] shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#EFF4ED] text-[#6B7F5E] flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <div className="inline-block bg-[#F8ECE7] border border-[#B5502F]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[#B5502F]">
                  Order Reference: #{submittedOrderId || 'ORD-RECORDED'}
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#1F1D1B]">
                  Inquiry Logged Successfully!
                </h3>
                <p className="text-sm text-[#5A554F] max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Your inquiry has been registered in our studio records. Vinita will message you on WhatsApp (<strong>{formData.phone}</strong>) within 1 to 2 hours.
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={SITE_CONFIG.getWhatsAppUrl(
                    `Hi Vinita, I just submitted inquiry #${submittedOrderId} on your website regarding: ${getInquiryLabel()}. My name is ${formData.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Connect on WhatsApp with #{submittedOrderId}</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setPreviewUrl(null);
                    setFormData(prev => ({
                      ...prev,
                      otherMedium: '',
                      otherEventType: '',
                      otherProductType: '',
                      notes: '',
                      photo: null,
                    }));
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FAF7F2] border border-[#DDD3C3] text-[#1F1D1B] text-xs font-semibold hover:bg-[#F0E9DC] cursor-pointer"
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                  {serviceType === 'portrait' && "Custom Portrait Details"}
                  {serviceType === 'event' && "Live Event Booking Details"}
                  {serviceType === 'vajjika' && "Vajjika Saree & Artwork Details"}
                </h3>
                <p className="text-xs text-[#5A554F] mt-0.5">
                  Takes less than a minute. No advance payment required right now.
                </p>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F] mb-1.5">
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F] mb-1.5">
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
              </div>

              {/* SPECIFIC FIELDS PER SERVICE TYPE */}

              {/* 1. PORTRAIT FIELDS */}
              {serviceType === 'portrait' && (
                <>
                  {/* Medium Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F]">
                      Select Medium *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {mediumsList.map((m) => {
                        const isSelected = formData.medium === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, medium: m.id })}
                            className={`py-2.5 px-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                              isSelected
                                ? 'border-[#B5502F] bg-[#FAF3F0] text-[#B5502F] ring-1 ring-[#B5502F]'
                                : 'border-[#DDD3C3] bg-white text-[#1F1D1B] hover:bg-[#FAF7F2]'
                            }`}
                          >
                            <span>{m.label}</span>
                            {m.tag && (
                              <span className="text-[9px] font-bold text-[#B5502F] bg-white px-1.5 py-0.5 rounded border border-[#B5502F]/30 shrink-0">
                                {m.tag}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {formData.medium === 'Other Medium' && (
                      <div className="pt-1.5 animate-fadeIn">
                        <label className="block text-xs font-semibold text-[#5A554F] mb-1">
                          Specify Your Preferred Medium / Style *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.otherMedium}
                          onChange={(e) => setFormData({ ...formData, otherMedium: e.target.value })}
                          placeholder="e.g. Soft pastel, Colored pencil, Mixed media, Gouache, Coffee art..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#B5502F] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]/30 bg-[#FAF3F0]/40"
                        />
                      </div>
                    )}
                  </div>

                  {/* Size & Number of Faces */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F]">
                        Choose Size *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {sizesList.map((s) => {
                          const isSelected = formData.size === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, size: s.id })}
                              className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#B5502F] bg-[#FAF3F0] text-[#B5502F] ring-1 ring-[#B5502F]'
                                  : 'border-[#DDD3C3] bg-white text-[#1F1D1B] hover:bg-[#FAF7F2]'
                              }`}
                            >
                              <p className="text-xs font-bold">{s.label}</p>
                              <p className="text-[10px] text-[#5A554F]">{s.dims}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F]">
                        Number of Faces
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {subjectsList.map((sub) => {
                          const isSelected = formData.subjects === sub.count;
                          return (
                            <button
                              key={sub.count}
                              type="button"
                              onClick={() => setFormData({ ...formData, subjects: sub.count })}
                              className={`py-2 px-1 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#B5502F] bg-[#FAF3F0] text-[#B5502F] ring-1 ring-[#B5502F]'
                                  : 'border-[#DDD3C3] bg-white text-[#1F1D1B] hover:bg-[#FAF7F2]'
                              }`}
                            >
                              {sub.count}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F]">
                      Reference Photo (Optional here, or send via WhatsApp)
                    </label>
                    <div className="border border-dashed border-[#DDD3C3] rounded-2xl p-4 sm:p-5 text-center bg-[#FAF7F2]/60 hover:border-[#B5502F] transition-colors">
                      {previewUrl ? (
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-14 h-14 object-cover rounded-xl border border-[#DDD3C3]"
                            />
                            <div className="text-left">
                              <p className="text-xs font-bold text-[#1F1D1B] truncate max-w-[200px]">
                                {formData.photo?.name}
                              </p>
                              <p className="text-[11px] text-[#6B7F5E] font-medium">Ready to submit</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, photo: null });
                              setPreviewUrl(null);
                            }}
                            className="text-xs font-semibold text-[#B5502F] hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white text-[#B5502F] flex items-center justify-center border border-[#DDD3C3] shrink-0">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div className="text-center sm:text-left">
                            <span className="text-xs sm:text-sm font-bold text-[#1F1D1B] block">
                              Tap to select photo from device
                            </span>
                            <span className="text-[11px] text-[#5A554F]">
                              Or skip this step and share your photo directly on WhatsApp.
                            </span>
                          </div>
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

                  {/* Target Delivery / Needed By Date */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F]">
                      Target Delivery / Needed By Date (Optional)
                    </label>
                    <input
                      type="date"
                      min={todayDateString}
                      value={formData.neededByDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && val < todayDateString) return;
                        setFormData({ ...formData, neededByDate: val });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                    />
                    <p className="text-[11px] text-[#5A554F]">
                      Let us know if you need this by an upcoming birthday, anniversary, or wedding event. Handcrafted portraits typically take 5–10 days.
                    </p>
                  </div>
                </>
              )}

              {/* 2. LIVE EVENT FIELDS */}
              {serviceType === 'event' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F] mb-1.5">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={todayDateString}
                        value={formData.eventDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && val < todayDateString) return;
                          setFormData({ ...formData, eventDate: val });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F] mb-1.5">
                        Event Location (City & State) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Patna / Muzaffarpur / Delhi NCR"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F] mb-1.5">
                      Event Occasion
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] cursor-pointer"
                    >
                      {eventTypesList.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>

                    {formData.eventType === 'Other Special Occasion' && (
                      <div className="pt-2 animate-fadeIn">
                        <label className="block text-xs font-semibold text-[#5A554F] mb-1">
                          Specify Event Occasion *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.otherEventType}
                          onChange={(e) => setFormData({ ...formData, otherEventType: e.target.value })}
                          placeholder="e.g. Milestone Birthday, Private Gala, Art Exhibition, Product Launch..."
                          className="w-full px-3 py-2 rounded-xl border border-[#B5502F] text-xs text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]/30 bg-[#FAF3F0]/40"
                        />
                      </div>
                    )}
                  </div>

                  {/* Duration Selection as Interactive Buttons */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F]">
                        Select Live Sketching Duration *
                      </label>
                      <span className="text-[11px] font-semibold text-[#B5502F]">
                        ⚡ 15–20 Mins Per Person
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {eventDurationsList.map((d) => {
                        const isSelected = formData.eventDuration === d.id;
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, eventDuration: d.id })}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#B5502F] bg-[#FAF3F0] text-[#B5502F] ring-1 ring-[#B5502F]'
                                : 'border-[#DDD3C3] bg-white text-[#1F1D1B] hover:bg-[#FAF7F2]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold">{d.label}</span>
                              {d.popular && (
                                <span className="text-[9px] font-bold text-[#B5502F] bg-white px-1.5 py-0.5 rounded border border-[#B5502F]/30 shrink-0">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-semibold mt-1 text-[#1F1D1B]">
                              {d.count}
                            </p>
                            <p className="text-[10px] text-[#5A554F] mt-0.5">
                              {d.note}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* 3. VAJJIKA SAREE & PRODUCT FIELDS */}
              {serviceType === 'vajjika' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F]">
                      Choose Handcrafted Vajjika Product *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {vajjikaProductsList.map((prod) => {
                        const isSelected = formData.productType === prod.id;
                        return (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, productType: prod.id })}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#B5502F] bg-[#FAF3F0] text-[#B5502F] ring-1 ring-[#B5502F]'
                                : 'border-[#DDD3C3] bg-white text-[#1F1D1B] hover:bg-[#FAF7F2]'
                            }`}
                          >
                            <p className="text-xs font-bold">{prod.label}</p>
                            <p className="text-[10px] text-[#5A554F] mt-0.5">{prod.note}</p>
                          </button>
                        );
                      })}
                    </div>

                    {formData.productType === 'Other Handcrafted Item' && (
                      <div className="pt-1.5 animate-fadeIn">
                        <label className="block text-xs font-semibold text-[#5A554F] mb-1">
                          Specify Custom Vajjika Product / Fabric *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.otherProductType}
                          onChange={(e) => setFormData({ ...formData, otherProductType: e.target.value })}
                          placeholder="e.g. Silk Kurti, Hand-painted Scarf, Jewelry box, Wooden frame, Table runner..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#B5502F] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]/30 bg-[#FAF3F0]/40"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F] mb-1.5">
                        Delivery City & State *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Patna, Bihar / Mumbai, MH"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F] mb-1.5">
                        Target Delivery / Needed By Date (Optional)
                      </label>
                      <input
                        type="date"
                        min={todayDateString}
                        value={formData.neededByDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && val < todayDateString) return;
                          setFormData({ ...formData, neededByDate: val });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Common Notes field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F]">
                  {serviceType === 'portrait' && "Delivery City & Special Notes (Optional)"}
                  {serviceType === 'event' && "Venue Name & Specific Requests (Optional)"}
                  {serviceType === 'vajjika' && "Color / Fabric Preference & Notes (Optional)"}
                </label>
                <input
                  type="text"
                  placeholder={
                    serviceType === 'portrait'
                      ? "e.g. Patna • Need by 15th for anniversary"
                      : serviceType === 'event'
                      ? "e.g. Hotel Maurya, Patna • Evening 7 PM to 10 PM"
                      : "e.g. Natural Beige Tussar silk with peacock motifs"
                  }
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>

              {/* Live Transparent Price Estimation Badge (for Custom Portrait) */}
              {serviceType === 'portrait' && (
                <div className="p-4 rounded-2xl bg-[#FAF3F0] border border-[#B5502F]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#B5502F] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                      ₹
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#B5502F]">
                        Instant Estimated Investment
                      </p>
                      {formData.medium === 'Other Medium' ? (
                        <p className="font-serif text-base sm:text-lg font-bold text-[#1F1D1B]">
                          Custom Quote on WhatsApp
                        </p>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1D1B]">
                            ₹{calculatePortraitPrice()?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-[#5A554F]">
                            ({formData.medium} • {formData.size} • {formData.subjects} {formData.subjects === 1 ? 'Face' : 'Faces'})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#B5502F]/20 text-[11px] text-[#5A554F] shrink-0">
                    <p className="font-semibold text-[#1F1D1B]">📦 Shipped Unframed (Without Frame)</p>
                    <p className="text-[10px] text-[#5A554F]">Courier charge extra at actuals • Safely rolled in rigid PVC tube</p>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 sm:py-4 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white font-bold text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:scale-98"
              >
                {submitting ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {serviceType === 'portrait' && "Send Portrait Inquiry (Free Quote)"}
                      {serviceType === 'event' && "Check Event Date & Get Live Quote"}
                      {serviceType === 'vajjika' && "Inquire About Saree / Artwork"}
                    </span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-[#5A554F]">
                🔒 Your contact details are kept strictly private and never shared without permission.
              </p>

            </form>
          )}
        </div>

        {/* Right Sidebar: Dynamic Context per Service Type */}
        <div className="lg:col-span-4 space-y-6">
          
          {serviceType === 'portrait' && (
            <>
              <div className="bg-[#FAF7F2] p-5 sm:p-6 rounded-3xl border border-[#DDD3C3] space-y-4 shadow-2xs">
                <h4 className="font-serif text-lg font-bold text-[#1F1D1B]">
                  Studio Quality Assurance
                </h4>
                <div className="space-y-3 text-xs text-[#5A554F]">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#B5502F] font-bold">🎨</span>
                    <span><strong>100% Handcrafted:</strong> Pure fine-art individually drawn & painted by Vinita (zero AI filters or digital printing).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#C99A2E] font-bold">📱</span>
                    <span><strong>WhatsApp Angle Approval:</strong> High-definition photos & video angles sent for your approval before sealing.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#2F6F55] font-bold">📜</span>
                    <span><strong>Museum-Grade Materials:</strong> 300 GSM French Canson papers & gallery double-primed wrapped canvas.</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#DDD3C3] space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-[#2F6F55]">
                  <Shield className="w-4 h-4" />
                  <h5 className="font-serif font-bold text-sm text-[#1F1D1B]">
                    Safe Unframed Delivery & Courier Note
                  </h5>
                </div>
                <p className="text-xs text-[#5A554F] leading-relaxed">
                  All artworks are dispatched <strong>without framing</strong>, safely rolled in heavy-duty rigid PVC mailing pipes to guarantee zero glass or frame damage during transit. <strong>Courier charges are separate at actuals</strong> based on your location. Standard sizes (A4, A3, A2) fit store-bought frames easily locally.
                </p>
              </div>
            </>
          )}

          {serviceType === 'event' && (
            <>
              <div className="bg-[#FAF7F2] p-5 sm:p-6 rounded-3xl border border-[#DDD3C3] space-y-4 shadow-2xs">
                <h4 className="font-serif text-lg font-bold text-[#1F1D1B]">
                  Live Sketching Highlights
                </h4>
                <div className="space-y-3 text-xs text-[#5A554F]">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#B5502F] font-bold">⚡</span>
                    <span><strong>15 to 20 Mins Per Person:</strong> Exquisite hand-drawn guest portraits capturing real personality while your guests relax and enjoy.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#C99A2E] font-bold">🎁</span>
                    <span><strong>Custom Branded Sheets:</strong> Each portrait can carry your wedding initials, family crest, or company logo.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#2F6F55] font-bold">✈️</span>
                    <span><strong>Pan-India Availability:</strong> Artist travels for destination weddings & VIP galas across India.</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#DDD3C3] space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-[#B5502F]">
                  <Clock className="w-4 h-4" />
                  <h5 className="font-serif font-bold text-sm text-[#1F1D1B]">
                    Advance Booking Recommended
                  </h5>
                </div>
                <p className="text-xs text-[#5A554F] leading-relaxed">
                  Peak wedding & festival dates book 4 to 8 weeks in advance. Submit your inquiry early to reserve the date on Vinita’s studio calendar.
                </p>
              </div>
            </>
          )}

          {serviceType === 'vajjika' && (
            <>
              <div className="bg-[#FAF7F2] p-5 sm:p-6 rounded-3xl border border-[#DDD3C3] space-y-4 shadow-2xs">
                <h4 className="font-serif text-lg font-bold text-[#1F1D1B]">
                  Authentic Regional Craft
                </h4>
                <div className="space-y-3 text-xs text-[#5A554F]">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#C99A2E] font-bold">🥻</span>
                    <span><strong>Handloom Sarees & Lifestyle Products:</strong> Hand-painted pure Tussar silk sarees, designer handbags, sling bags, clutches, coin pouches, and dupattas.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#B5502F] font-bold">🏛️</span>
                    <span><strong>NIFT Delhi Heritage:</strong> Under the mentorship of Dr. Ujjwal Ankur, reviving rare Vaishali-Vajjika motifs.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#2F6F55] font-bold">🏅</span>
                    <span><strong>Vajjika Vibhuti Samman:</strong> Honored state recognition for authentic cultural preservation.</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#DDD3C3] space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-[#2F6F55]">
                  <Shield className="w-4 h-4" />
                  <h5 className="font-serif font-bold text-sm text-[#1F1D1B]">
                    Made-to-Order Exclusivity
                  </h5>
                </div>
                <p className="text-xs text-[#5A554F] leading-relaxed">
                  Each piece — whether a pure silk saree, designer handbag, clutch, or wall canvas — is painted individually by hand taking 7 to 15 days of artisan devotion. No two pieces are ever identical.
                </p>
              </div>
            </>
          )}

        </div>

      </div>

      {/* 4. FAQs Accordion */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
            Got Questions?
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1D1B]">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-2.5">
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
                  className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-[#FAF7F2]/50"
                >
                  <span className="font-serif text-sm sm:text-base font-bold text-[#1F1D1B]">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#B5502F] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5A554F] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-[#5A554F] leading-relaxed border-t border-[#DDD3C3]/40 pt-2.5">
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
