import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import logoImage from '../assets/logo.png';

export default function Navbar({ activePage, setActivePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on click/touch outside or Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'recognition', label: 'Recognition' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'order', label: 'Order', isCta: true },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 min-w-[360px] transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#DDD3C3]'
          : 'bg-[#FAF7F2]/80 backdrop-blur-xs border-b border-[#DDD3C3]/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[3.75rem] sm:min-h-[5rem] py-2 gap-2 sm:gap-4">
          
          {/* Logo / Brand Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 group text-left cursor-pointer min-w-0 select-none"
          >
            <img
              src={logoImage}
              alt="Arthur Visions Logo"
              className="w-8 h-8 sm:w-11 sm:h-11 rounded-full object-cover border border-[#DDD3C3] shadow-xs group-hover:border-[#B5502F] transition-colors shrink-0"
            />
            <div className="flex flex-col justify-center min-w-0">
              <span className="block font-serif text-[16px] xs:text-[17px] sm:text-2xl font-bold tracking-wide text-[#1F1D1B] group-hover:text-[#B5502F] transition-colors leading-tight truncate">
                Arthur Visions
              </span>
              <span className="block text-[7.5px] xs:text-[8.5px] sm:text-[10px] uppercase tracking-tight xs:tracking-normal sm:tracking-wider text-[#5A554F] font-medium leading-tight mt-0.5 truncate">
                Portraits • Vajjika Art • Live Sketching
              </span>
            </div>
          </button>

          {/* Desktop Navigation (Visible on xl: 1280px+ to ensure zero overlap when resizing) */}
          <nav className="hidden xl:flex items-center gap-1.5 xl:gap-2 shrink-0">
            {navItems.map((item) => {
              if (item.isCta) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="ml-2 xl:ml-3 px-4 xl:px-5 py-2.5 rounded-full text-sm font-medium bg-[#B5502F] text-white hover:bg-[#9B4224] transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                );
              }

              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 xl:px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? 'text-[#B5502F] bg-[#F0E9DC]/70 font-semibold'
                      : 'text-[#5A554F] hover:text-[#1F1D1B] hover:bg-[#F0E9DC]/40'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile / Tablet Actions (Visible below xl: 1280px to prevent overlap on resized windows) */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => handleNavClick('order')}
              className="px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#B5502F] text-white shadow-xs cursor-pointer whitespace-nowrap"
            >
              Order
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-white border border-[#DDD3C3] text-[#1F1D1B] hover:text-[#B5502F] hover:bg-[#F0E9DC] transition-colors cursor-pointer shadow-2xs flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#B5502F]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown & Backdrop (Visible below xl: 1280px) */}
      {mobileMenuOpen && (
        <>
          {/* Dimmed backdrop to close menu when tapping outside */}
          <div
            className="fixed inset-0 top-[3.75rem] sm:top-[5rem] bg-black/25 backdrop-blur-2xs xl:hidden animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="relative xl:hidden bg-[#FAF7F2] border-b border-[#DDD3C3] px-4 pt-2 pb-6 space-y-1 shadow-xl animate-fadeIn">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center justify-between cursor-pointer ${
                  activePage === item.id
                    ? 'bg-[#F0E9DC] text-[#B5502F] font-semibold'
                    : 'text-[#1F1D1B] hover:bg-[#F0E9DC]/50'
                }`}
              >
                <span>{item.label}</span>
                {item.isCta && <ArrowRight className="w-4 h-4 text-[#B5502F]" />}
              </button>
            ))}
            <div className="pt-2 border-t border-[#DDD3C3]/60 px-4">
              <button
                onClick={() => handleNavClick('admin')}
                className="text-xs text-[#5A554F] hover:text-[#B5502F] flex items-center gap-1.5 py-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Artist Portal</span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

