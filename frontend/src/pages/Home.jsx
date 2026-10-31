import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, CheckCircle2, Eye, ExternalLink } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export default function Home({ artworks, setActivePage, onOpenLightbox, setSelectedArtConfig }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Hero carousel highlights
  const heroWorks = artworks.filter(a => a.featured).slice(0, 4);

  // Auto-slide every 2 seconds with pause-on-hover
  useEffect(() => {
    if (heroWorks.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroWorks.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [heroWorks.length, isPaused]);

  const handleOrderRedirect = (config) => {
    if (setSelectedArtConfig) {
      setSelectedArtConfig(config);
    }
    setActivePage('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 md:space-y-32">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 sm:pt-28 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Prestige Tag */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#FBF5E6] border border-[#C99A2E]/40 text-[#1F1D1B] text-[11px] sm:text-xs font-medium shadow-xs max-w-full">
                <span className="w-2 h-2 rounded-full bg-[#C99A2E] animate-pulse shrink-0" />
                <span className="font-semibold text-[#B5502F] whitespace-nowrap">Arthur Visions</span>
                <span className="text-[#DDD3C3]">|</span>
                <span className="truncate sm:whitespace-normal">Recognized by Padma Shri Dulari Devi</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F1D1B] leading-[1.15] tracking-tight">
                Handcrafted Portraits & Heritage Fine Art,{' '}
                <span className="italic text-[#B5502F] font-normal">
                  Delivered Across India.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#5A554F] leading-relaxed max-w-2xl font-light">
                Preserving emotion in every stroke. Handcrafting <strong>lifelike custom portraits</strong>, authentic <strong>Vajjika art on sarees & products</strong>, and <strong>live event guest sketching</strong> across India. Mentored under NIFT Delhi faculty & recognized by cultural dignitaries.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => handleOrderRedirect(null)}
                  className="px-8 py-4 rounded-full bg-[#B5502F] text-white hover:bg-[#9B4224] font-medium text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 group cursor-pointer"
                >
                  <span>Start an Order</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setActivePage('gallery');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-7 py-4 rounded-full bg-white border border-[#DDD3C3] text-[#1F1D1B] hover:bg-[#FAF7F2] font-medium text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:border-[#B5502F]/40"
                >
                  <Eye className="w-4 h-4 text-[#5A554F]" />
                  <span>View Gallery</span>
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#DDD3C3]/60 text-xs text-[#5A554F]">
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#1F1D1B]">100%</p>
                  <p>Handmade Fine Art</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#1F1D1B]">Pan-India</p>
                  <p>Insured Express Delivery</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#1F1D1B]">1st Rank</p>
                  <p>District Youth Festival</p>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Art Showcase Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Decorative Frame Glow */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#B5502F]/20 via-[#C99A2E]/20 to-transparent rounded-3xl blur-xl" />
                
                {/* Art Frame Container with Auto-slide & Pause on Hover */}
                <div
                  className="relative bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-[#DDD3C3]"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-[#1F1D1B] group">
                    {heroWorks.map((work, idx) => (
                      <img
                        key={work.id}
                        src={work.image}
                        alt={work.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                          idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                      />
                    ))}

                    {/* Overlay Tag on Art */}
                    <div className="absolute bottom-3 left-3 right-3 p-3 bg-[#FAF7F2]/95 backdrop-blur-md rounded-xl border border-[#DDD3C3] shadow-md flex items-center justify-between">
                      <div>
                        <p className="font-serif font-bold text-[#1F1D1B] text-sm truncate">
                          {heroWorks[activeSlide]?.title}
                        </p>
                        <p className="text-[11px] text-[#5A554F]">
                          {heroWorks[activeSlide]?.medium}
                        </p>
                      </div>
                      <button
                        onClick={() => onOpenLightbox(heroWorks[activeSlide])}
                        className="p-1.5 rounded-lg bg-[#FAF7F2] border border-[#DDD3C3] text-[#B5502F] hover:bg-[#F8ECE7] transition-colors cursor-pointer"
                        title="Enlarge"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Carousel Thumbnails Dots */}
                  <div className="flex items-center justify-center gap-2 pt-3">
                    {heroWorks.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === activeSlide ? 'w-6 bg-[#B5502F]' : 'w-2 bg-[#DDD3C3]'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DIGNITARY TRUST MARQUEE STRIP */}
      <section className="bg-[#F0E9DC] py-8 border-y border-[#DDD3C3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5A554F]">
            Appreciated & Felicitated By Leading Cultural Institutions & Dignitaries
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-[#1F1D1B]">
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#DDD3C3] shadow-2xs">
              <span className="text-[#C99A2E] font-bold">★</span>
              <span>Padma Shri Dulari Devi</span>
            </span>
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#DDD3C3] shadow-2xs">
              <span className="text-[#C99A2E] font-bold">★</span>
              <span>NIFT Delhi (Ministry of Textiles)</span>
            </span>
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#DDD3C3] shadow-2xs">
              <span className="text-[#C99A2E] font-bold">★</span>
              <span>District Level Youth Festival 1st Rank</span>
            </span>
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#DDD3C3] shadow-2xs">
              <span className="text-[#C99A2E] font-bold">★</span>
              <span>Vajjika Vibhuti Samman 2025</span>
            </span>
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#DDD3C3] shadow-2xs">
              <span className="text-[#C99A2E] font-bold">★</span>
              <span>Udyog Vibhag Bihar Sarkar</span>
            </span>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE CREATE FOR YOU (3 CORE WEBSITE OFFERINGS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
            What We Create For You
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1D1B]">
            Three Ways to Experience Arthur Visions
          </h2>
          <p className="text-sm sm:text-base text-[#5A554F]">
            Whether immortalizing a loved one from a photograph, collecting rare regional heritage, or creating live memories at your celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Custom Handmade Portraits */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DDD3C3] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#F8ECE7] text-[#B5502F] flex items-center justify-center font-serif text-2xl font-bold">
                  01
                </div>
                <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-[#F8ECE7] text-[#B5502F]">
                  Photo to Painting
                </span>
              </div>
              
              <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                Custom Handmade Portraits
              </h3>
              
              <p className="text-sm text-[#5A554F] leading-relaxed">
                Lifelike hand-drawn and painted tributes of your loved ones, grandparents, babies, or wedding memories. Handcrafted in realistic acrylic, charcoal, pencil, or classical oil paint.
              </p>
              
              <ul className="text-xs text-[#5A554F] space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7F5E]" />
                  <span>300 GSM Archival French Paper & Linen Canvases</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7F5E]" />
                  <span>Single, couple & combined family portraits</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-6 border-t border-[#DDD3C3]/60 mt-6">
              <button
                onClick={() => handleOrderRedirect({ serviceType: 'portrait', medium: "Charcoal & Pencil" })}
                className="w-full py-3.5 px-4 rounded-xl bg-[#B5502F] hover:bg-[#9B4224] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer group"
              >
                <span>Order a Portrait</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: Traditional Vajjika Art */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DDD3C3] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#FBF5E6] text-[#C99A2E] flex items-center justify-center font-serif text-2xl font-bold">
                  02
                </div>
                <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-[#FBF5E6] text-[#8C6615]">
                  Authentic Heritage Art
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                Vajjika Folk Art
              </h3>
              
              <p className="text-sm text-[#5A554F] leading-relaxed">
                Rare, ancient folk art tradition of Vaishali. Available as hand-painted Tussar silk sarees, designer handbags, sling bags, clutches, coin pouches, and fine art canvases.
              </p>
              
              <ul className="text-xs text-[#5A554F] space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C99A2E]" />
                  <span>Vajjika Vibhuti Samman 2025 Recognized</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C99A2E]" />
                  <span>Originals with Signed Certificate of Authenticity</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-6 border-t border-[#DDD3C3]/60 mt-6">
              <button
                onClick={() => handleOrderRedirect({ serviceType: 'vajjika' })}
                className="w-full py-3.5 px-4 rounded-xl bg-[#B5502F] hover:bg-[#9B4224] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer group"
              >
                <span>Inquire Sarees & Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 3: Live Event Portraits */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DDD3C3] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#EAEFF7] text-[#2F3E5C] flex items-center justify-center font-serif text-2xl font-bold">
                  03
                </div>
                <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-[#EAEFF7] text-[#23314B]">
                  Weddings & VIP Galas
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                Live Guest Event Sketching
              </h3>
              
              <p className="text-sm text-[#5A554F] leading-relaxed">
                Add an unforgettable artistic element to weddings, receptions, and VIP conclaves. Detailed 15–20 minute live portraits for your honored guests as custom keepsakes.
              </p>
              
              <ul className="text-xs text-[#5A554F] space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2F3E5C]" />
                  <span>Custom branded event sheets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2F3E5C]" />
                  <span>Available for booking across India</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-6 border-t border-[#DDD3C3]/60 mt-6">
              <button
                onClick={() => handleOrderRedirect({ serviceType: 'event' })}
                className="w-full py-3.5 px-4 rounded-xl bg-[#B5502F] hover:bg-[#9B4224] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer group"
              >
                <span>Book for Live Events</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURED ARTWORKS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
              Curated Selections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1D1B]">
              Recent Featured Works
            </h2>
          </div>
          <button
            onClick={() => {
              setActivePage('gallery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-sm font-semibold text-[#B5502F] hover:text-[#9B4224] flex items-center gap-1 cursor-pointer"
          >
            <span>View Full 50+ Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.slice(0, 3).map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#DDD3C3] shadow-sm hover:shadow-lg transition-all flex flex-col group cursor-pointer"
              onClick={() => onOpenLightbox(art)}
            >
              <div className="relative aspect-4/5 overflow-hidden bg-[#1F1D1B]">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF7F2]/90 backdrop-blur-xs text-[#1F1D1B] border border-[#DDD3C3]">
                  {art.category}
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between grow space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1F1D1B] group-hover:text-[#B5502F] transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-[#5A554F] mt-1">
                    {art.medium} • {art.dimensions}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#DDD3C3]/60 text-xs">
                  <span className="text-[#B5502F] font-semibold flex items-center gap-1">
                    <span>Inspect Texture</span>
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[#5A554F]">
                    {art.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. STUDIO PROCESS & ARTWORK IN MOTION */}
      <section className="bg-[#FAF7F2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F0E9DC] rounded-3xl p-8 sm:p-12 border border-[#DDD3C3] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-5 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#B5502F] text-xs font-semibold uppercase tracking-wider border border-[#DDD3C3]">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Studio in Motion</span>
            </span>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1D1B]">
              See the Artwork Come to Life
            </h2>
            
            <p className="text-sm sm:text-base text-[#5A554F] leading-relaxed">
              Step inside the studio. Watch raw pencil lines, delicate acrylic layers, and realistic textures come together on canvas right from the artist's easel.
            </p>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DDD3C3] space-y-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B5502F] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B5502F] animate-pulse" />
                Featured Studio Video
              </span>
              <p className="font-serif font-bold text-base text-[#1F1D1B]">
                {SITE_CONFIG.latestShortTitle}
              </p>
              <p className="text-xs text-[#5A554F]">
                Studio Channel: {SITE_CONFIG.youtubeHandle}
              </p>
            </div>

            <div className="pt-2">
              <a
                href={SITE_CONFIG.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B5502F] text-white hover:bg-[#9B4224] text-sm font-semibold transition-all shadow-sm"
              >
                <span>Watch More on YouTube</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Vertical Short Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#1F1D1B] bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${SITE_CONFIG.latestShortId}?rel=0&modestbranding=1&playsinline=1`}
                title="Arthur Visions Latest YouTube Short"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

