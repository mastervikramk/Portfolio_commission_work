import React, { useState, useEffect } from 'react';
import { 
  Lock, PlusCircle, Image as ImageIcon, CheckCircle, Trash2, 
  Eye, MessageSquare, Phone, MapPin, Clock, Tag, RefreshCw, LogOut, ArrowRight, Upload
} from 'lucide-react';
import { CATEGORIES } from '../data/artworks';
import defaultArtImage from '../assets/charcoal_portrait_2.jpeg';

export default function Admin({ artworks, setArtworks }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState('add'); // 'add', 'catalog', 'orders'

  // Form state for new artwork
  const [newArt, setNewArt] = useState({
    title: '',
    medium: 'Charcoal on Archival Paper',
    category: 'Charcoal',
    dimensions: '12 × 16 in (A3)',
    year: new Date().getFullYear().toString(),
    status: 'Available',
    price: '₹3,500',
    description: '',
    image: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Check if session PIN already verified
    const savedPin = sessionStorage.getItem('arthurvisions_admin_pin');
    if (savedPin === '2025' || savedPin === '1234') {
      setIsAuthenticated(true);
    }

    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('arthurvisions_orders') || '[]');
    setOrders(savedOrders);
  }, []);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    // Default PIN: 2025 (or 1234)
    if (pin === '2025' || pin === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('arthurvisions_admin_pin', pin);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('arthurvisions_admin_pin');
    setIsAuthenticated(false);
    setPin('');
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setNewArt({ ...newArt, image: url });
    }
  };

  const handlePublishArtwork = (e) => {
    e.preventDefault();

    const createdPiece = {
      id: `art-${Date.now()}`,
      title: newArt.title,
      medium: newArt.medium,
      category: newArt.category,
      dimensions: newArt.dimensions,
      year: newArt.year,
      status: newArt.status,
      price: newArt.price,
      description: newArt.description,
      image: previewImage || defaultArtImage,
      featured: false,
    };

    const updated = [createdPiece, ...artworks];
    setArtworks(updated);
    localStorage.setItem('arthurvisions_custom_artworks', JSON.stringify(updated));

    setPublishedSuccess(true);
    setNewArt({
      title: '',
      medium: 'Charcoal on Archival Paper',
      category: 'Charcoal',
      dimensions: '12 × 16 in (A3)',
      year: new Date().getFullYear().toString(),
      status: 'Available',
      price: '₹3,500',
      description: '',
      image: '',
    });
    setPreviewImage(null);

    setTimeout(() => {
      setPublishedSuccess(false);
      setActiveTab('catalog');
    }, 1500);
  };

  const handleToggleStatus = (id) => {
    const updated = artworks.map(art => {
      if (art.id === id) {
        return {
          ...art,
          status: art.status === 'Available' ? 'Commissioned' : 'Available',
        };
      }
      return art;
    });
    setArtworks(updated);
    localStorage.setItem('arthurvisions_custom_artworks', JSON.stringify(updated));
  };

  const handleDeleteArt = (id) => {
    if (window.confirm('Are you sure you want to remove this artwork from the gallery?')) {
      const updated = artworks.filter(a => a.id !== id);
      setArtworks(updated);
      localStorage.setItem('arthurvisions_custom_artworks', JSON.stringify(updated));
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    });
    setOrders(updatedOrders);
    localStorage.setItem('arthurvisions_orders', JSON.stringify(updatedOrders));
  };

  // If not logged in, show mobile-friendly PIN keypad screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#DDD3C3] shadow-lg text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#F8ECE7] text-[#B5502F] flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-bold text-[#1F1D1B]">
              Studio Artist Portal
            </h2>
            <p className="text-xs text-[#5A554F]">
              Enter your 4-digit PIN to upload new artworks and manage customer orders.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="max-w-[200px] mx-auto">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN (e.g. 2025)"
                className="w-full text-center tracking-widest text-2xl font-bold py-3 px-4 rounded-xl border border-[#DDD3C3] focus:outline-none focus:ring-2 focus:ring-[#B5502F] bg-[#FAF7F2]"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs font-semibold text-red-600 animate-shake">
                Incorrect PIN. (Default demo PIN is 2025 or 1234)
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
            >
              Unlock Studio
            </button>
          </form>

          <p className="text-[11px] text-[#5A554F]">
            Secured for Arthur Visions Artist Management
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#DDD3C3] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B5502F]">
            Arthur Visions Control Center
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1F1D1B]">
            Artist Mobile Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#DDD3C3]">
            <button
              onClick={() => setActiveTab('add')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'add' ? 'bg-[#B5502F] text-white shadow-2xs' : 'text-[#5A554F]'
              }`}
            >
              + Add Artwork
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'catalog' ? 'bg-[#B5502F] text-white shadow-2xs' : 'text-[#5A554F]'
              }`}
            >
              Catalog ({artworks.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'orders' ? 'bg-[#B5502F] text-white shadow-2xs' : 'text-[#5A554F]'
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl border border-[#DDD3C3] text-[#5A554F] hover:text-[#B5502F] hover:bg-[#F8ECE7] cursor-pointer"
            title="Lock Studio"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TAB 1: ADD NEW ARTWORK FORM */}
      {activeTab === 'add' && (
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-[#DDD3C3] shadow-sm space-y-6">
          <div className="border-b border-[#DDD3C3]/60 pb-3">
            <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
              Publish New Artwork to Gallery
            </h3>
            <p className="text-xs text-[#5A554F]">
              Take a photo on your phone or choose an image file to publish instantly.
            </p>
          </div>

          {publishedSuccess && (
            <div className="p-4 rounded-xl bg-[#EFF4ED] text-[#6B7F5E] text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>Artwork published to gallery successfully! Switching to catalog...</span>
            </div>
          )}

          <form onSubmit={handlePublishArtwork} className="space-y-6">
            
            {/* Image Upload Box */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                Artwork Photograph *
              </label>
              <div className="border-2 border-dashed border-[#DDD3C3] rounded-2xl p-6 text-center hover:border-[#B5502F] bg-[#FAF7F2]">
                {previewImage ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-60 rounded-xl shadow border border-[#DDD3C3]"
                    />
                    <label className="text-xs text-[#B5502F] font-semibold underline cursor-pointer">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-[#F0E9DC] text-[#B5502F] flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-[#1F1D1B]">
                      Take Photo or Browse Image
                    </span>
                    <span className="text-xs text-[#5A554F]">
                      Upload straight from your phone camera or gallery
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Title & Medium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Artwork Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Village Maiden - Vajjika Series"
                  value={newArt.title}
                  onChange={(e) => setNewArt({ ...newArt, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Category *
                </label>
                <select
                  value={newArt.category}
                  onChange={(e) => setNewArt({ ...newArt, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] cursor-pointer"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Medium Specification & Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Medium & Technique *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vine Charcoal on 300 GSM Archival Cotton Paper"
                  value={newArt.medium}
                  onChange={(e) => setNewArt({ ...newArt, medium: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Dimensions *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12 × 16 in (A3)"
                  value={newArt.dimensions}
                  onChange={(e) => setNewArt({ ...newArt, dimensions: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>
            </div>

            {/* Status & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Status
                </label>
                <select
                  value={newArt.status}
                  onChange={(e) => setNewArt({ ...newArt, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] cursor-pointer"
                >
                  <option value="Available">Available for Sale</option>
                  <option value="Commissioned">Commissioned (Sold)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Price (if Available)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹5,500"
                  value={newArt.price}
                  onChange={(e) => setNewArt({ ...newArt, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Year
                </label>
                <input
                  type="text"
                  value={newArt.year}
                  onChange={(e) => setNewArt({ ...newArt, year: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                Artwork Description / Concept
              </label>
              <textarea
                rows="2"
                placeholder="Brief inspiration, mood or technique notes..."
                value={newArt.description}
                onChange={(e) => setNewArt({ ...newArt, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Publish Artwork to Gallery Now</span>
            </button>

          </form>
        </div>
      )}

      {/* TAB 2: MANAGE CATALOG */}
      {activeTab === 'catalog' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDD3C3] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#DDD3C3]/60 pb-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                Active Gallery Pieces ({artworks.length})
              </h3>
              <p className="text-xs text-[#5A554F]">
                Toggle between Available and Sold with one click.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('add')}
              className="px-4 py-2 rounded-full bg-[#B5502F] text-white text-xs font-semibold cursor-pointer"
            >
              + Add Another Piece
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <div
                key={art.id}
                className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#DDD3C3] p-4 flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-4">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-20 h-20 object-cover rounded-xl border border-[#DDD3C3] shrink-0"
                  />
                  <div className="space-y-1 grow min-w-0">
                    <h4 className="font-serif font-bold text-base text-[#1F1D1B] truncate">
                      {art.title}
                    </h4>
                    <p className="text-xs text-[#5A554F] truncate">{art.medium}</p>
                    <p className="text-[11px] text-[#B5502F] font-semibold">{art.price || art.dimensions}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#DDD3C3]/60 text-xs">
                  <button
                    onClick={() => handleToggleStatus(art.id)}
                    className={`px-3 py-1 rounded-full font-semibold cursor-pointer transition-colors ${
                      art.status === 'Available'
                        ? 'bg-[#EFF4ED] text-[#6B7F5E] hover:bg-[#e2edd0]'
                        : 'bg-[#F0E9DC] text-[#5A554F] hover:bg-[#e6dcce]'
                    }`}
                  >
                    Status: {art.status} (Click to toggle)
                  </button>

                  <button
                    onClick={() => handleDeleteArt(art.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Remove artwork"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER ORDERS INBOX */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDD3C3] shadow-xs space-y-6">
          <div className="border-b border-[#DDD3C3]/60 pb-4">
            <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
              Customer Commission Enquiries ({orders.length})
            </h3>
            <p className="text-xs text-[#5A554F]">
              Direct inquiries from visitors. Click the WhatsApp button to reply instantly.
            </p>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#DDD3C3] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 grow">
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-lg text-[#1F1D1B]">
                        {ord.name}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0E9DC] text-[#5A554F] font-medium">
                        {ord.date}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F8ECE7] text-[#B5502F] font-bold">
                        {ord.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#5A554F]">
                      <strong>Medium:</strong> {ord.medium} • <strong>Size:</strong> {ord.size} ({ord.subjects} subject(s))
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#5A554F] pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#B5502F]" />
                        <span>{ord.city}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#6B7F5E]" />
                        <span>{ord.phone}</span>
                      </span>
                    </div>

                    {ord.notes && (
                      <p className="text-xs text-[#1F1D1B] bg-white p-2 rounded-lg border border-[#DDD3C3] mt-2">
                        <em>Notes:</em> "{ord.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions & WhatsApp Reply */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-[#DDD3C3] text-xs font-semibold text-[#1F1D1B] cursor-pointer"
                    >
                      <option value="NEW">Status: NEW</option>
                      <option value="IN PROGRESS">Status: IN PROGRESS</option>
                      <option value="COMPLETED">Status: COMPLETED</option>
                    </select>

                    <a
                      href={`https://wa.me/91${ord.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hi ${ord.name}, this is Vinita from Arthur Visions. Thank you for your inquiry for a ${ord.medium} (${ord.size}) portrait. Let's discuss your reference photo!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba59] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      <span>Reply on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#5A554F] space-y-2">
              <p className="font-serif text-xl text-[#1F1D1B]">No orders yet</p>
              <p className="text-xs">
                When clients fill the commission form on the website, their details and reference photos will appear here.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

