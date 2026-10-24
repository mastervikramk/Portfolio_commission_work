import React, { useState, useEffect } from 'react';
import { Palette, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

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
    { id: 'order', label: 'Order a Portrait', isCta: true },
    { id: 'recognition', label: 'Recognition' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#DDD3C3] flex items-center justify-center text-[#B5502F] shadow-xs group-hover:border-[#B5502F] transition-colors">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-serif text-2xl font-bold tracking-wide text-[#1F1D1B] group-hover:text-[#B5502F] transition-colors">
                Arthur Visions
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-[#5A554F] font-medium">
                Fine Art & Portraits • India
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              if (item.isCta) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="ml-3 px-5 py-2.5 rounded-full text-sm font-medium bg-[#B5502F] text-white hover:bg-[#9B4224] transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
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
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('order')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#B5502F] text-white shadow-xs cursor-pointer"
            >
              Order Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1F1D1B] hover:bg-[#F0E9DC] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#DDD3C3] px-4 pt-2 pb-6 space-y-1 shadow-lg animate-fadeIn">
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
              <span>Studio Artist Portal (Admin)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

