import React, { useState } from 'react';
import { CATEGORIES } from '../data/artworks';
import { Eye, ArrowRight, MessageSquare, Search, Filter } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export default function Gallery({ artworks, onOpenLightbox, onOrderSimilar }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArtworks = artworks.filter((art) => {
    const cat = art.category || '';
    let matchesCategory = selectedCategory === "All";

    if (!matchesCategory) {
      if (selectedCategory === "Vajjika Painting") {
        matchesCategory = cat === "Vajjika Painting" || cat.toLowerCase().includes("vajjika");
      } else {
        matchesCategory = cat === selectedCategory;
      }
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (art.title || '').toLowerCase().includes(q) ||
      (art.medium || '').toLowerCase().includes(q) ||
      cat.toLowerCase().includes(q) ||
      (art.description || '').toLowerCase().includes(q) ||
      ((q.includes('saree') || q.includes('sari') || q.includes('bag') || q.includes('clutch') || q.includes('pouch') || q.includes('dupatta')) &&
        (cat.toLowerCase().includes('saree') || cat.toLowerCase().includes('product') || (art.description || '').toLowerCase().includes('saree'))) ||
      (q.includes('vajjika') && cat.toLowerCase().includes('vajjika'));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
          The Complete Portfolio
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1F1D1B]">
          Artworks & Creations
        </h1>
        <p className="text-sm sm:text-base text-[#5A554F] leading-relaxed">
          Explore handmade works spanning charcoal portraits, classical oils, delicate watercolors, and authentic Bihar <strong>Vajjika folk art</strong>. Click any artwork to inspect brushstrokes and details.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        
        {/* Search Input */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-[#5A554F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, medium, or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#B5502F] text-white shadow-xs'
                    : 'bg-white text-[#5A554F] border border-[#DDD3C3] hover:bg-[#F0E9DC] hover:text-[#1F1D1B]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Artwork Grid */}
      {filteredArtworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtworks.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#DDD3C3] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Image Frame */}
              <div
                className="relative aspect-4/5 overflow-hidden bg-[#1F1D1B] cursor-pointer"
                onClick={() => onOpenLightbox(art)}
              >
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2]/90 backdrop-blur-xs text-[#1F1D1B] border border-[#DDD3C3]">
                    {art.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs shadow-2xs ${
                      art.status === 'Available'
                        ? 'bg-[#EFF4ED]/95 text-[#6B7F5E] border border-[#6B7F5E]/40'
                        : 'bg-[#F0E9DC]/95 text-[#5A554F] border border-[#DDD3C3]'
                    }`}
                  >
                    {art.status}
                  </span>
                </div>

                {/* Hover inspect hint */}
                <div className="absolute inset-0 bg-[#1F1D1B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="px-4 py-2 rounded-full bg-[#FAF7F2] text-[#1F1D1B] text-xs font-semibold flex items-center gap-2 shadow-md">
                    <Eye className="w-4 h-4 text-[#B5502F]" />
                    <span>Zoom Artwork</span>
                  </div>
                </div>
              </div>

              {/* Artwork Details & Info */}
              <div className="p-6 flex flex-col justify-between grow space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="font-serif text-xl font-bold text-[#1F1D1B] group-hover:text-[#B5502F] transition-colors cursor-pointer"
                      onClick={() => onOpenLightbox(art)}
                    >
                      {art.title}
                    </h3>
                    {art.price && (
                      <span className="text-sm font-bold text-[#B5502F] shrink-0">
                        {art.price}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5A554F] mt-1">
                    {art.medium}
                  </p>
                  <p className="text-[11px] text-[#5A554F] mt-0.5">
                    Dimensions: {art.dimensions} • Year: {art.year}
                  </p>
                </div>

                <p className="text-xs text-[#5A554F] line-clamp-2 leading-relaxed">
                  {art.description}
                </p>

                {/* Dual Action Buttons */}
                <div className="pt-4 border-t border-[#DDD3C3]/60 grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => onOrderSimilar(art)}
                    className="py-2.5 px-3 rounded-xl bg-[#B5502F] hover:bg-[#9B4224] text-white font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
                  >
                    <span>
                      {(art.title || '').toLowerCase().includes('saree')
                        ? 'Inquire Saree'
                        : (art.category || '').toLowerCase().includes('vajjika')
                        ? 'Inquire Painting'
                        : 'Order Similar'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>

                  <a
                    href={SITE_CONFIG.getWhatsAppUrl(
                      (art.title || '').toLowerCase().includes('saree')
                        ? `Hi Vinita, I saw your "${art.title}" in your gallery. I would like to inquire about ordering this hand-painted Saree.`
                        : (art.category || '').toLowerCase().includes('vajjika')
                        ? `Hi Vinita, I saw your Vajjika painting "${art.title}" in your gallery. I would like to inquire about purchasing / commissioning this piece.`
                        : `Hi Vinita, I saw your artwork "${art.title}" (${art.medium}) on your website. I want to inquire about purchasing or commissioning a similar piece.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                </div>

              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#DDD3C3] space-y-3">
          <p className="font-serif text-2xl text-[#1F1D1B]">No artworks found</p>
          <p className="text-sm text-[#5A554F]">
            Try choosing another category or clearing your search term.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="px-5 py-2 rounded-full bg-[#B5502F] text-white text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}

