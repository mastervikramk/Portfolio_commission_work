import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LightboxModal from './components/LightboxModal';

// Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Order from './pages/Order';
import Recognition from './pages/Recognition';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

import { ARTWORKS_DATA } from './data/artworks';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [artworks, setArtworks] = useState(() => {
    try {
      const saved = localStorage.getItem('arthurvisions_custom_artworks');
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasUnsplash = Array.isArray(parsed) && parsed.some(a => typeof a.image === 'string' && a.image.includes('unsplash.com'));
        const isAcrylicFirst = Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id === 'art-acrylic-1';
        const hasLivePortrait = Array.isArray(parsed) && parsed.some(a => a.id === 'art-live-portrait-1');
        const hasOldSpelling = Array.isArray(parsed) && parsed.some(a => typeof a.title === 'string' && a.title.includes('वैज्जिका'));
        
        if (!hasUnsplash && isAcrylicFirst && hasLivePortrait && !hasOldSpelling) {
          return parsed;
        }
        localStorage.removeItem('arthurvisions_custom_artworks');
      }
    } catch (e) {
      // ignore parsing error
    }
    return ARTWORKS_DATA;
  });
  const [selectedArtConfig, setSelectedArtConfig] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);

  // Handle URL hash changes or routing
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'gallery', 'order', 'recognition', 'about', 'contact', 'admin'].includes(hash)) {
      setActivePage(hash);
    }
  }, []);

  const handlePageChange = (page) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSimilar = (art) => {
    setSelectedArtConfig({
      medium: art.medium || art.category,
      size: art.dimensions?.includes('A3') ? 'A3' : 'A4',
      subjects: 1,
    });
    handlePageChange('order');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1D1B] flex flex-col font-sans selection:bg-[#B5502F]/20 selection:text-[#B5502F]">
      
      {/* Fixed Sticky Header Navigation */}
      <Navbar activePage={activePage} setActivePage={handlePageChange} />

      {/* Main Page Content Body */}
      <main className="grow">
        {activePage === 'home' && (
          <Home
            artworks={artworks}
            setActivePage={handlePageChange}
            onOpenLightbox={(item) => setLightboxItem(item)}
            setSelectedArtConfig={setSelectedArtConfig}
          />
        )}

        {activePage === 'gallery' && (
          <Gallery
            artworks={artworks}
            onOpenLightbox={(item) => setLightboxItem(item)}
            onOrderSimilar={handleOrderSimilar}
          />
        )}

        {activePage === 'order' && (
          <Order
            initialConfig={selectedArtConfig}
            onOrderSuccess={() => {}}
          />
        )}

        {activePage === 'recognition' && (
          <Recognition
            onOpenLightbox={(item) => setLightboxItem(item)}
          />
        )}

        {activePage === 'about' && (
          <About setActivePage={handlePageChange} />
        )}

        {activePage === 'contact' && (
          <Contact />
        )}

        {activePage === 'admin' && (
          <Admin
            artworks={artworks}
            setArtworks={setArtworks}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActivePage={handlePageChange} />

      {/* Lightbox Zoom Modal */}
      <LightboxModal
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
        onOrderSimilar={handleOrderSimilar}
      />

    </div>
  );
}
