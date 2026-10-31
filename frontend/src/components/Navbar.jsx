import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import logoImage from '../assets/logo.png';

export default function Navbar({ activePage, setActivePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#DDD3C3]'
          : 'bg-[#FAF7F2]/80 backdrop-blur-xs border-b border-[#DDD3C3]/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4rem] sm:min-h-[5rem] py-2 gap-4">
          
          {/* Logo / Brand Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer shrink-0 select-none mr-2 sm:mr-4"
          >
            <img
              src={logoImage}
              alt="Arthur Visions Logo"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border border-[#DDD3C3] shadow-xs group-hover:border-[#B5502F] transition-colors shrink-0"
            />
            <div className="flex flex-col justify-center">
              <span className="block font-serif text-[18px] sm:text-2xl font-bold tracking-wide text-[#1F1D1B] group-hover:text-[#B5502F] transition-colors leading-tight whitespace-nowrap">
                Arthur Visions
              </span>
              <span className="block text-[8.5px] sm:text-[10px] uppercase tracking-wider text-[#5A554F] font-medium leading-tight mt-0.5 whitespace-nowrap">
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
          <div className="flex xl:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => handleNavClick('order')}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#B5502F] text-white shadow-xs cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Order</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-[#1F1D1B] hover:bg-[#F0E9DC] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Visible below xl: 1280px) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FAF7F2] border-b border-[#DDD3C3] px-4 pt-2 pb-6 space-y-1 shadow-lg animate-fadeIn">
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
      )}
    </header>
  );
}

