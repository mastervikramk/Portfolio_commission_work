import React, { useState, useEffect } from 'react';
import { 
  Lock, PlusCircle, Image as ImageIcon, CheckCircle, Trash2, 
  Eye, MessageSquare, Phone, MapPin, Clock, Tag, RefreshCw, LogOut, ArrowRight, Upload,
  Award, FileText, CheckCircle2, Users, Calendar, Medal, Sparkles, Shield, Mail, KeyRound, ArrowLeft,
  Pencil, X, Cloud, UploadCloud
} from 'lucide-react';
import { CATEGORIES } from '../data/artworks';
import defaultArtImage from '../assets/charcoal_portrait_2.jpeg';

export default function Admin({ 
  artworks, 
  setArtworks, 
  dignitaries = [], 
  setDignitaries = () => {}, 
  timelineAwards = [], 
  setTimelineAwards = () => {}, 
  certificates = [], 
  setCertificates = () => {} 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedToken = localStorage.getItem('arthurvisions_admin_session') || sessionStorage.getItem('arthurvisions_admin_session');
      if (savedToken) {
        let expiresAt = 0;
        try {
          const parsed = JSON.parse(atob(savedToken));
          expiresAt = parsed.expiresAt || 0;
        } catch (e) {
          const parts = savedToken.split('::');
          if (parts.length === 3) expiresAt = parseInt(parts[1], 10);
        }
        if (expiresAt > Date.now()) {
          return true;
        }
      }
      const savedPin = localStorage.getItem('arthurvisions_admin_pin') || sessionStorage.getItem('arthurvisions_admin_pin');
      if (savedPin === '2025' || savedPin === '1234') {
        return true;
      }
    } catch (e) {}
    return false;
  });
  const [activeTab, setActiveTab] = useState('add'); // 'add', 'catalog', 'recognition', 'orders'
  const [recSubTab, setRecSubTab] = useState('certificates'); // 'certificates', 'dignitaries', 'timeline'

  // Email OTP Authentication State
  const [authStep, setAuthStep] = useState('email'); // 'email' | 'otp' | 'pin'
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Backup PIN state (for emergency or offline fallback)
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

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

  // Form state for new certificate
  const [newCert, setNewCert] = useState({
    title: '',
    sub: '',
    issuer: '',
    year: new Date().getFullYear().toString(),
    image: null,
  });
  const [certPreview, setCertPreview] = useState(null);
  const [certSuccess, setCertSuccess] = useState(false);

  // Form state for new dignitary felicitation
  const [newDignitary, setNewDignitary] = useState({
    name: '',
    role: '',
    event: '',
    description: '',
    badge: 'State Dignitary',
    image: null,
  });
  const [dignitaryPreview, setDignitaryPreview] = useState(null);
  const [dignitarySuccess, setDignitarySuccess] = useState(false);

  // Form state for new timeline honor
  const [newTimeline, setNewTimeline] = useState({
    year: new Date().getFullYear().toString(),
    title: '',
    organization: '',
    description: '',
  });
  const [timelineSuccess, setTimelineSuccess] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);

  // Editing state for modals
  const [editingArt, setEditingArt] = useState(null);
  const [editingCert, setEditingCert] = useState(null);
  const [editingDignitary, setEditingDignitary] = useState(null);
  const [editingTimeline, setEditingTimeline] = useState(null);

  // Check existing session token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('arthurvisions_admin_session') || sessionStorage.getItem('arthurvisions_admin_session');
    const savedPin = localStorage.getItem('arthurvisions_admin_pin') || sessionStorage.getItem('arthurvisions_admin_pin');
    
    if (savedToken) {
      let expiresAt = 0;
      try {
        const parsed = JSON.parse(atob(savedToken));
        expiresAt = parsed.expiresAt || 0;
      } catch (e) {
        const parts = savedToken.split('::');
        if (parts.length === 3) expiresAt = parseInt(parts[1], 10);
      }
      
      // If token is still within its 30-day validity window, unlock immediately (no delay/flicker)
      if (expiresAt > Date.now()) {
        setIsAuthenticated(true);

        // Verify with server in background
        fetch('/api/admin/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken: savedToken })
        })
        .then(res => res.json())
        .then(data => {
          if (data && data.valid === false) {
            localStorage.removeItem('arthurvisions_admin_session');
            sessionStorage.removeItem('arthurvisions_admin_session');
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          // If offline or network lag, keep user authenticated
        });
      } else {
        localStorage.removeItem('arthurvisions_admin_session');
        sessionStorage.removeItem('arthurvisions_admin_session');
      }
    } else if (savedPin === '2025' || savedPin === '1234') {
      setIsAuthenticated(true);
    }

    // Load orders from Cloudflare KV (with localStorage fallback)
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.orders)) {
          const local = JSON.parse(localStorage.getItem('arthurvisions_orders') || '[]');
          const map = new Map();
          data.orders.forEach(o => map.set(o.id, o));
          local.forEach(o => { if (!map.has(o.id)) map.set(o.id, o); });
          const merged = Array.from(map.values());
          setOrders(merged);
          localStorage.setItem('arthurvisions_orders', JSON.stringify(merged));
        }
      })
      .catch(() => {
        const savedOrders = JSON.parse(localStorage.getItem('arthurvisions_orders') || '[]');
        setOrders(savedOrders);
      });
  }, []);

  // Cooldown countdown timer for resending OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Cloud Sync state: 'idle' | 'syncing' | 'saved' | 'error'
  const [cloudSyncStatus, setCloudSyncStatus] = useState('idle');

  const syncContentToCloud = async (type, data) => {
    setCloudSyncStatus('syncing');
    try {
      const sessionToken = localStorage.getItem('arthurvisions_admin_session') || sessionStorage.getItem('arthurvisions_admin_session') || '';
      const pin = localStorage.getItem('arthurvisions_admin_pin') || sessionStorage.getItem('arthurvisions_admin_pin') || '';
      const res = await fetch('/api/admin/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data, sessionToken, pin })
      });
      const result = await res.json();
      if (result.success) {
        setCloudSyncStatus('saved');
        setTimeout(() => setCloudSyncStatus('idle'), 3000);
      } else {
        setCloudSyncStatus('error');
        setTimeout(() => setCloudSyncStatus('idle'), 4000);
      }
    } catch (err) {
      console.error(`Failed to sync ${type} to cloud:`, err);
      setCloudSyncStatus('error');
      setTimeout(() => setCloudSyncStatus('idle'), 4000);
    }
  };

  const syncAllToCloud = async () => {
    setCloudSyncStatus('syncing');
    try {
      const sessionToken = localStorage.getItem('arthurvisions_admin_session') || sessionStorage.getItem('arthurvisions_admin_session') || '';
      const pin = localStorage.getItem('arthurvisions_admin_pin') || sessionStorage.getItem('arthurvisions_admin_pin') || '';
      
      const res = await fetch('/api/admin/content/bulk-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworks,
          dignitaries,
          timeline: timelineAwards,
          certificates,
          sessionToken,
          pin
        })
      });
      const result = await res.json();
      if (result.success) {
        setCloudSyncStatus('saved');
        setTimeout(() => setCloudSyncStatus('idle'), 3000);
      } else {
        setCloudSyncStatus('error');
        setTimeout(() => setCloudSyncStatus('idle'), 4000);
      }
    } catch (err) {
      console.error('Failed to bulk sync to cloud:', err);
      setCloudSyncStatus('error');
      setTimeout(() => setCloudSyncStatus('idle'), 4000);
    }
  };

  // Auto-sync any local customizations to Cloudflare KV when logged in
  useEffect(() => {
    if (!isAuthenticated) return;
    const sessionToken = localStorage.getItem('arthurvisions_admin_session') || sessionStorage.getItem('arthurvisions_admin_session') || '';
    const pin = localStorage.getItem('arthurvisions_admin_pin') || sessionStorage.getItem('arthurvisions_admin_pin') || '';

    fetch('/api/content')
      .then(res => res.json())
      .then(cloud => {
        const toSync = {};
        const localArtworksRaw = localStorage.getItem('arthurvisions_custom_artworks');
        if (localArtworksRaw) {
          try {
            const parsed = JSON.parse(localArtworksRaw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const hasMouthOrgan = parsed.some(a => 
                (typeof a.title === 'string' && a.title.toLowerCase().includes('mouth organ')) ||
                (typeof a.description === 'string' && a.description.toLowerCase().includes('mouth organ'))
              );
              if (!cloud.artworks || hasMouthOrgan || parsed.length !== cloud.artworks?.length) {
                toSync.artworks = parsed;
              }
            }
          } catch(e){}
        }

        const localDigRaw = localStorage.getItem('arthurvisions_custom_dignitaries');
        if (localDigRaw && !cloud.dignitaries) {
          try { toSync.dignitaries = JSON.parse(localDigRaw); } catch(e){}
        }
        const localTimeRaw = localStorage.getItem('arthurvisions_custom_timeline');
        if (localTimeRaw && !cloud.timeline) {
          try { toSync.timeline = JSON.parse(localTimeRaw); } catch(e){}
        }
        const localCertRaw = localStorage.getItem('arthurvisions_custom_certificates');
        if (localCertRaw && !cloud.certificates) {
          try { toSync.certificates = JSON.parse(localCertRaw); } catch(e){}
        }

        if (Object.keys(toSync).length > 0) {
          fetch('/api/admin/content/bulk-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...toSync, sessionToken, pin })
          }).then(r => r.json()).then(res => {
            if (res.success) {
              setCloudSyncStatus('saved');
              setTimeout(() => setCloudSyncStatus('idle'), 3000);
            }
          }).catch(() => {});
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput })
      });
      const data = await res.json();

      if (data.success) {
        setOtpToken(data.token);
        setMaskedEmail(data.maskedEmail || emailInput);
        setAuthStep('otp');
        setResendCooldown(60);
      } else {
        setAuthError(data.message || 'Failed to send verification code. Please check your email.');
      }
    } catch (err) {
      setAuthError('Connection error. Please check your internet connection.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          otp: otpInput,
          token: otpToken,
          rememberMe: rememberMe
        })
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        if (rememberMe) {
          localStorage.setItem('arthurvisions_admin_session', data.sessionToken);
        } else {
          sessionStorage.setItem('arthurvisions_admin_session', data.sessionToken);
        }
      } else {
        setAuthError(data.message || 'Invalid verification code. Please check your email.');
      }
    } catch (err) {
      // Emergency offline fallback
      if (otpInput === '2025') {
        setIsAuthenticated(true);
        sessionStorage.setItem('arthurvisions_admin_pin', '2025');
      } else {
        setAuthError('Failed to verify code. Please check your internet or retry.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === '2025' || pin === '1234') {
      setIsAuthenticated(true);
      localStorage.setItem('arthurvisions_admin_pin', pin);
      sessionStorage.setItem('arthurvisions_admin_pin', pin);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('arthurvisions_admin_session');
    sessionStorage.removeItem('arthurvisions_admin_session');
    sessionStorage.removeItem('arthurvisions_admin_pin');
    setIsAuthenticated(false);
    setAuthStep('email');
    setOtpInput('');
    setOtpToken('');
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
    syncContentToCloud('artworks', updated);

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
    syncContentToCloud('artworks', updated);
  };

  const handleDeleteArt = (id) => {
    if (window.confirm('Are you sure you want to remove this artwork from the gallery?')) {
      const updated = artworks.filter(a => a.id !== id);
      setArtworks(updated);
      localStorage.setItem('arthurvisions_custom_artworks', JSON.stringify(updated));
      syncContentToCloud('artworks', updated);
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

    // Sync to Cloudflare KV for cross-device synchronization
    fetch('/api/admin/orders/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus })
    }).catch(() => {});
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this customer inquiry?')) {
      const updatedOrders = orders.filter(ord => ord.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('arthurvisions_orders', JSON.stringify(updatedOrders));

      // Sync deletion to Cloudflare KV
      fetch('/api/admin/orders/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      }).catch(() => {});
    }
  };

  // Certificate handlers
  const handleCertImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCert(prev => ({ ...prev, image: reader.result }));
        setCertPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCertSubmit = (e) => {
    e.preventDefault();
    if (!newCert.image) {
      alert("Please upload a scan or photo of the certificate.");
      return;
    }

    const createdCert = {
      id: `cert-${Date.now()}`,
      title: newCert.title,
      sub: newCert.sub || 'Excellence Citation',
      issuer: newCert.issuer,
      year: newCert.year,
      image: newCert.image,
    };

    const updated = [createdCert, ...certificates];
    setCertificates(updated);
    localStorage.setItem('arthurvisions_custom_certificates', JSON.stringify(updated));
    syncContentToCloud('certificates', updated);

    setNewCert({
      title: '',
      sub: '',
      issuer: '',
      year: new Date().getFullYear().toString(),
      image: null,
    });
    setCertPreview(null);
    setCertSuccess(true);
    setTimeout(() => setCertSuccess(false), 4000);
  };

  const handleDeleteCert = (identifier) => {
    if (window.confirm("Are you sure you want to remove this certificate from the Recognition page?")) {
      const updated = certificates.filter((c, idx) => (c.id || `cert-${idx}`) !== identifier && c.title !== identifier);
      setCertificates(updated);
      localStorage.setItem('arthurvisions_custom_certificates', JSON.stringify(updated));
      syncContentToCloud('certificates', updated);
    }
  };

  // Dignitary felicitation handlers
  const handleDignitaryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDignitary(prev => ({ ...prev, image: reader.result }));
        setDignitaryPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDignitarySubmit = (e) => {
    e.preventDefault();
    if (!newDignitary.image) {
      alert("Please upload a photograph of the dignitary felicitation.");
      return;
    }

    const created = {
      id: `dig-${Date.now()}`,
      name: newDignitary.name,
      role: newDignitary.role,
      event: newDignitary.event,
      description: newDignitary.description,
      badge: newDignitary.badge || 'State Dignitary',
      image: newDignitary.image,
    };

    const updated = [created, ...dignitaries];
    setDignitaries(updated);
    localStorage.setItem('arthurvisions_custom_dignitaries', JSON.stringify(updated));
    syncContentToCloud('dignitaries', updated);

    setNewDignitary({
      name: '',
      role: '',
      event: '',
      description: '',
      badge: 'State Dignitary',
      image: null,
    });
    setDignitaryPreview(null);
    setDignitarySuccess(true);
    setTimeout(() => setDignitarySuccess(false), 4000);
  };

  const handleDeleteDignitary = (identifier) => {
    if (window.confirm("Are you sure you want to remove this dignitary recognition from the Recognition page?")) {
      const updated = dignitaries.filter((d, idx) => (d.id || `dig-${idx}`) !== identifier && d.name !== identifier);
      setDignitaries(updated);
      localStorage.setItem('arthurvisions_custom_dignitaries', JSON.stringify(updated));
      syncContentToCloud('dignitaries', updated);
    }
  };

  // Timeline honor handlers
  const handleAddTimelineSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `time-${Date.now()}`,
      year: newTimeline.year,
      title: newTimeline.title,
      organization: newTimeline.organization,
      description: newTimeline.description,
    };

    const updated = [created, ...timelineAwards];
    setTimelineAwards(updated);
    localStorage.setItem('arthurvisions_custom_timeline', JSON.stringify(updated));
    syncContentToCloud('timeline', updated);

    setNewTimeline({
      year: new Date().getFullYear().toString(),
      title: '',
      organization: '',
      description: '',
    });
    setTimelineSuccess(true);
    setTimeout(() => setTimelineSuccess(false), 4000);
  };

  const handleDeleteTimeline = (identifier) => {
    if (window.confirm("Are you sure you want to remove this milestone from the timeline?")) {
      const updated = timelineAwards.filter((t, idx) => (t.id || `time-${idx}`) !== identifier && t.title !== identifier);
      setTimelineAwards(updated);
      localStorage.setItem('arthurvisions_custom_timeline', JSON.stringify(updated));
      syncContentToCloud('timeline', updated);
    }
  };

  // Helper for reading edit images
  const handleEditImageUpload = (file, setter) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save edits handlers
  const handleSaveArtEdit = (e) => {
    e.preventDefault();
    const updated = artworks.map(a => a.id === editingArt.id ? editingArt : a);
    setArtworks(updated);
    localStorage.setItem('arthurvisions_custom_artworks', JSON.stringify(updated));
    syncContentToCloud('artworks', updated);
    setEditingArt(null);
  };

  const handleSaveCertEdit = (e) => {
    e.preventDefault();
    const updated = certificates.map((c, idx) => {
      const matchKey = c.id || c.title || `cert-${idx}`;
      if (matchKey === editingCert._identifier || c.id === editingCert.id || c.title === editingCert._identifier) {
        return {
          ...c,
          title: editingCert.title,
          sub: editingCert.sub,
          issuer: editingCert.issuer,
          year: editingCert.year,
          image: editingCert.image || c.image,
        };
      }
      return c;
    });
    setCertificates(updated);
    localStorage.setItem('arthurvisions_custom_certificates', JSON.stringify(updated));
    syncContentToCloud('certificates', updated);
    setEditingCert(null);
  };

  const handleSaveDignitaryEdit = (e) => {
    e.preventDefault();
    const updated = dignitaries.map((d, idx) => {
      const matchKey = d.id || d.name || `dig-${idx}`;
      if (matchKey === editingDignitary._identifier || d.id === editingDignitary.id || d.name === editingDignitary._identifier) {
        return {
          ...d,
          name: editingDignitary.name,
          role: editingDignitary.role,
          event: editingDignitary.event,
          badge: editingDignitary.badge,
          description: editingDignitary.description,
          image: editingDignitary.image || d.image,
        };
      }
      return d;
    });
    setDignitaries(updated);
    localStorage.setItem('arthurvisions_custom_dignitaries', JSON.stringify(updated));
    syncContentToCloud('dignitaries', updated);
    setEditingDignitary(null);
  };

  const handleSaveTimelineEdit = (e) => {
    e.preventDefault();
    const updated = timelineAwards.map((t, idx) => {
      const matchKey = t.id || t.title || `time-${idx}`;
      if (matchKey === editingTimeline._identifier || t.id === editingTimeline.id || t.title === editingTimeline._identifier) {
        return {
          ...t,
          year: editingTimeline.year,
          title: editingTimeline.title,
          organization: editingTimeline.organization,
          description: editingTimeline.description,
        };
      }
      return t;
    });
    setTimelineAwards(updated);
    localStorage.setItem('arthurvisions_custom_timeline', JSON.stringify(updated));
    syncContentToCloud('timeline', updated);
    setEditingTimeline(null);
  };

  // If not logged in, show Passwordless Email OTP screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center pt-24 pb-16 px-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#DDD3C3] shadow-lg text-center space-y-6">
          
          {/* STEP 1: ENTER REGISTERED EMAIL */}
          {authStep === 'email' && (
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-full bg-[#F8ECE7] text-[#B5502F] flex items-center justify-center mx-auto shadow-xs">
                <Mail className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B5502F]">
                  Secured Access
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#1F1D1B]">
                  Artist Studio Sign In
                </h2>
                <p className="text-xs text-[#5A554F] leading-relaxed">
                  Enter your registered artist email. A single-use verification code will be sent to your Gmail.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F]">
                    Artist Email Address
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full py-3 px-4 rounded-xl border border-[#DDD3C3] focus:outline-none focus:ring-2 focus:ring-[#B5502F] bg-[#FAF7F2] text-sm text-[#1F1D1B]"
                  />
                </div>

                {authError && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 rounded-full bg-[#B5502F] hover:bg-[#9B4224] disabled:opacity-60 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-[#DDD3C3]/50">
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('pin');
                    setAuthError('');
                  }}
                  className="text-xs text-[#5A554F] hover:text-[#B5502F] underline cursor-pointer"
                >
                  Or enter Studio Emergency Key
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ENTER 6-DIGIT OTP */}
          {authStep === 'otp' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('email');
                    setAuthError('');
                  }}
                  className="text-xs text-[#5A554F] hover:text-[#B5502F] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B5502F] bg-[#F8ECE7] px-2.5 py-0.5 rounded-full">
                  Code Sent
                </span>
              </div>

              <div className="w-14 h-14 rounded-full bg-[#EFF4ED] text-[#6B7F5E] flex items-center justify-center mx-auto shadow-xs">
                <KeyRound className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-3xl font-bold text-[#1F1D1B]">
                  Check Your Email
                </h2>
                <p className="text-xs text-[#5A554F] leading-relaxed">
                  We sent a 6-digit verification code to <strong className="text-[#1F1D1B]">{maskedEmail}</strong>.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="max-w-[220px] mx-auto">
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    required
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••••"
                    className="w-full text-center tracking-[0.35em] text-3xl font-bold py-3 px-4 rounded-xl border border-[#DDD3C3] focus:outline-none focus:ring-2 focus:ring-[#B5502F] bg-[#FAF7F2] text-[#1F1D1B]"
                  />
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-[#5A554F]">
                  <input
                    type="checkbox"
                    id="rememberDevice"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#DDD3C3] text-[#B5502F] focus:ring-[#B5502F] cursor-pointer"
                  />
                  <label htmlFor="rememberDevice" className="cursor-pointer select-none">
                    Remember this device for 30 days
                  </label>
                </div>

                {authError && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 rounded-full bg-[#B5502F] hover:bg-[#9B4224] disabled:opacity-60 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify & Unlock Studio</span>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-[#DDD3C3]/50 flex items-center justify-between text-xs text-[#5A554F]">
                <span>Didn't get the code?</span>
                {resendCooldown > 0 ? (
                  <span className="text-[#9B948A] text-xs font-medium">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[#B5502F] font-semibold hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: EMERGENCY STUDIO KEY (OFFLINE BACKUP) */}
          {authStep === 'pin' && (
            <div className="space-y-6">
              <div className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('email');
                    setAuthError('');
                  }}
                  className="text-xs text-[#5A554F] hover:text-[#B5502F] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Email OTP</span>
                </button>
              </div>

              <div className="w-14 h-14 rounded-full bg-[#F8ECE7] text-[#B5502F] flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-3xl font-bold text-[#1F1D1B]">
                  Studio Emergency Key
                </h2>
                <p className="text-xs text-[#5A554F]">
                  Enter your master studio PIN for offline or emergency unlock.
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
                  <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                    Incorrect Emergency PIN.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
                >
                  Unlock Studio
                </button>
              </form>
            </div>
          )}

          <p className="text-[11px] text-[#5A554F] pt-2">
            Secured for Arthur Visions Artist Management
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#DDD3C3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B5502F]">
              Arthur Visions Control Center
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1D1B]">
              Artist Mobile Studio
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="md:hidden p-2 rounded-xl border border-[#DDD3C3] text-[#5A554F] hover:text-[#B5502F] hover:bg-[#F8ECE7] cursor-pointer"
            title="Lock Studio"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#DDD3C3] w-full md:w-auto">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'add' ? 'bg-[#B5502F] text-white shadow-2xs' : 'text-[#5A554F] hover:text-[#1F1D1B]'
            }`}
          >
            + Add Art
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'catalog' ? 'bg-[#B5502F] text-white shadow-2xs' : 'text-[#5A554F] hover:text-[#1F1D1B]'
            }`}
          >
            Artworks ({artworks.length})
          </button>
          <button
            onClick={() => setActiveTab('recognition')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'recognition' || activeTab === 'certificates' ? 'bg-[#B5502F] text-white shadow-2xs' : 'text-[#5A554F] hover:text-[#1F1D1B]'
            }`}
          >
            Honors ({certificates.length + dignitaries.length + timelineAwards.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#B5502F] text-white shadow-2xs' : 'text-[#5A554F] hover:text-[#1F1D1B]'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={handleLogout}
            className="hidden md:flex p-1.5 rounded-xl text-[#5A554F] hover:text-[#B5502F] hover:bg-[#F8ECE7] cursor-pointer ml-1"
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
                    Status: {art.status}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingArt({ ...art })}
                      className="p-1.5 rounded-lg text-[#5A554F] hover:text-[#B5502F] hover:bg-[#F8ECE7] cursor-pointer transition-colors"
                      title="Edit artwork details"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteArt(art.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                      title="Remove artwork"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RECOGNITIONS, DIGNITARIES & HONORS */}
      {(activeTab === 'recognition' || activeTab === 'certificates') && (
        <div className="space-y-8">
          
          {/* Sub-tab Navigation */}
          <div className="flex flex-wrap gap-2 p-2 bg-white rounded-2xl border border-[#DDD3C3] shadow-2xs">
            <button
              type="button"
              onClick={() => setRecSubTab('certificates')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                recSubTab === 'certificates' 
                  ? 'bg-[#B5502F] text-white shadow-2xs' 
                  : 'bg-[#FAF7F2] text-[#5A554F] hover:text-[#1F1D1B] hover:bg-[#F0E9DC]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Certificates ({certificates.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setRecSubTab('dignitaries')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                recSubTab === 'dignitaries' 
                  ? 'bg-[#B5502F] text-white shadow-2xs' 
                  : 'bg-[#FAF7F2] text-[#5A554F] hover:text-[#1F1D1B] hover:bg-[#F0E9DC]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Dignitaries ({dignitaries.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setRecSubTab('timeline')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                recSubTab === 'timeline' 
                  ? 'bg-[#B5502F] text-white shadow-2xs' 
                  : 'bg-[#FAF7F2] text-[#5A554F] hover:text-[#1F1D1B] hover:bg-[#F0E9DC]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Timeline ({timelineAwards.length})</span>
            </button>
          </div>

          {/* SUB-SECTION 1: CERTIFICATES */}
          {recSubTab === 'certificates' && (
            <div className="space-y-8">
              {/* Upload New Certificate Form */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDD3C3] shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDD3C3]/60 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                      Upload New Certificate / Recognition
                    </h3>
                    <p className="text-xs text-[#5A554F] mt-0.5">
                      Add state awards, exhibition certificates, and citations. They will immediately appear on the public Recognition page.
                    </p>
                  </div>

                  {certSuccess && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF4ED] text-[#6B7F5E] text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Certificate added to wall!</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddCertSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Left: Certificate Text Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                          Certificate / Award Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 1st Position: District Yuva Utsav 2026"
                          value={newCert.title}
                          onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                          Subtitle / Event Category
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Painting Competition (State Level Delegation)"
                          value={newCert.sub}
                          onChange={(e) => setNewCert({ ...newCert, sub: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                            Issuing Authority / Board *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Govt. of Bihar / NIFT Delhi"
                            value={newCert.issuer}
                            onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                            Year *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 2026"
                            value={newCert.year}
                            onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right: Certificate Photo / Scan Upload */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                        Certificate Image / Scan *
                      </label>
                      
                      {certPreview ? (
                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-[#DDD3C3] bg-[#1A1816] flex items-center justify-center p-2 group">
                          <img
                            src={certPreview}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCertPreview(null);
                              setNewCert({ ...newCert, image: null });
                            }}
                            className="absolute top-3 right-3 p-2 rounded-xl bg-red-600 text-white shadow-md hover:bg-red-700 cursor-pointer text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Change</span>
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-[#DDD3C3] hover:border-[#B5502F] rounded-2xl aspect-4/3 flex flex-col items-center justify-center gap-3 p-6 text-center cursor-pointer transition-colors bg-[#FAF7F2]/60 hover:bg-[#FAF7F2]">
                          <div className="w-12 h-12 rounded-full bg-[#F0E9DC] text-[#B5502F] flex items-center justify-center">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#B5502F] block">
                              Upload Certificate Scan / Photo
                            </span>
                            <span className="text-[11px] text-[#5A554F] mt-0.5 block">
                              PNG, JPG, or JPEG (take photo from phone)
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={handleCertImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                  </div>

                  <div className="flex justify-end pt-2 border-t border-[#DDD3C3]/60">
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>Publish to Recognition Wall</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Certificates List */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDD3C3] shadow-xs space-y-6">
                <div className="border-b border-[#DDD3C3]/60 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                      Active Certificates on Wall ({certificates.length})
                    </h3>
                    <p className="text-xs text-[#5A554F]">
                      Live on the Recognition page. Click Delete to remove any certificate.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((cert, idx) => (
                    <div
                      key={cert.id || idx}
                      className="border border-[#DDD3C3] rounded-2xl overflow-hidden bg-[#FAF7F2]/30 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      <div className="relative aspect-4/3 bg-[#1A1816] flex items-center justify-center p-2">
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#1F1D1B]/80 text-[#FAF7F2] text-[10px]">
                          {cert.year}
                        </div>
                      </div>

                      <div className="p-4 space-y-2 grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-base font-bold text-[#1F1D1B]">
                            {cert.title}
                          </h4>
                          <p className="text-xs text-[#5A554F] mt-0.5 line-clamp-2">
                            {cert.sub}
                          </p>
                          <p className="text-[11px] text-[#B5502F] font-semibold mt-1">
                            {cert.issuer}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#DDD3C3]/60 flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingCert({ ...cert, _identifier: cert.id || cert.title })}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#5A554F] hover:text-[#B5502F] hover:bg-[#F8ECE7] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCert(cert.id || cert.title)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-SECTION 2: DIGNITARIES FELICITATIONS */}
          {recSubTab === 'dignitaries' && (
            <div className="space-y-8">
              {/* Add Dignitary Felicitation Form */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDD3C3] shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDD3C3]/60 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                      Add Felicitation by National & State Dignitary
                    </h3>
                    <p className="text-xs text-[#5A554F] mt-0.5">
                      Upload photos with ministers, MPs, Padma awardees, and dignitaries. Instantly live on the public Recognition page.
                    </p>
                  </div>

                  {dignitarySuccess && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF4ED] text-[#6B7F5E] text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Dignitary recognition published!</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddDignitarySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Left: Dignitary Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                          Dignitary Full Name & Salutation *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Shri Nitish Kumar / Padma Shri Dulari Devi"
                          value={newDignitary.name}
                          onChange={(e) => setNewDignitary({ ...newDignitary, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                          Designation / Official Role *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Hon'ble Chief Minister of Bihar"
                          value={newDignitary.role}
                          onChange={(e) => setNewDignitary({ ...newDignitary, role: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                            Occasion / Event *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Bihar Diwas State Felicitation"
                            value={newDignitary.event}
                            onChange={(e) => setNewDignitary({ ...newDignitary, event: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                            Honor Tag / Badge *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. State Dignitary, National Honor"
                            value={newDignitary.badge}
                            onChange={(e) => setNewDignitary({ ...newDignitary, badge: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                          Appreciation Story / Description *
                        </label>
                        <textarea
                          rows={3}
                          required
                          placeholder="e.g. Felicitated for exemplary fine arts contribution and presented hand-drawn portrait..."
                          value={newDignitary.description}
                          onChange={(e) => setNewDignitary({ ...newDignitary, description: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] resize-none"
                        />
                      </div>
                    </div>

                    {/* Right: Dignitary Felicitation Photo Upload */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                        Felicitation Photograph *
                      </label>
                      
                      {dignitaryPreview ? (
                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-[#DDD3C3] bg-[#1A1816] flex items-center justify-center p-2 group">
                          <img
                            src={dignitaryPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setDignitaryPreview(null);
                              setNewDignitary({ ...newDignitary, image: null });
                            }}
                            className="absolute top-3 right-3 p-2 rounded-xl bg-red-600 text-white shadow-md hover:bg-red-700 cursor-pointer text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Change Photo</span>
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-[#DDD3C3] hover:border-[#B5502F] rounded-2xl aspect-4/3 flex flex-col items-center justify-center gap-3 p-6 text-center cursor-pointer transition-colors bg-[#FAF7F2]/60 hover:bg-[#FAF7F2]">
                          <div className="w-12 h-12 rounded-full bg-[#F0E9DC] text-[#B5502F] flex items-center justify-center">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#B5502F] block">
                              Upload Felicitation Photo
                            </span>
                            <span className="text-[11px] text-[#5A554F] mt-0.5 block">
                              Take photo from camera or choose from gallery
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={handleDignitaryImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                  </div>

                  <div className="flex justify-end pt-2 border-t border-[#DDD3C3]/60">
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <Users className="w-4 h-4" />
                      <span>Publish Dignitary Felicitation</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Dignitaries List */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDD3C3] shadow-xs space-y-6">
                <div className="border-b border-[#DDD3C3]/60 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                      Active Dignitary Felicitations ({dignitaries.length})
                    </h3>
                    <p className="text-xs text-[#5A554F]">
                      Displayed on the Dignitaries section. Click Delete to remove any.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dignitaries.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="border border-[#DDD3C3] rounded-2xl overflow-hidden bg-[#FAF7F2]/30 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      <div className="relative aspect-4/3 bg-[#1A1816]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#C99A2E] border border-[#C99A2E]/40 shadow-xs">
                            {item.badge}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2 grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-base font-bold text-[#1F1D1B]">
                            {item.name}
                          </h4>
                          <p className="text-xs font-semibold text-[#B5502F]">
                            {item.role}
                          </p>
                          <p className="text-[11px] text-[#5A554F] italic">
                            {item.event}
                          </p>
                          <p className="text-xs text-[#5A554F] mt-2 line-clamp-3">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#DDD3C3]/60 flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingDignitary({ ...item, _identifier: item.id || item.name })}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#5A554F] hover:text-[#B5502F] hover:bg-[#F8ECE7] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteDignitary(item.id || item.name)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-SECTION 3: TIMELINE AWARDS */}
          {recSubTab === 'timeline' && (
            <div className="space-y-8">
              {/* Add Timeline Honor Form */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDD3C3] shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDD3C3]/60 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                      Add Competition Merit & State Honor Milestone
                    </h3>
                    <p className="text-xs text-[#5A554F] mt-0.5">
                      Add awards, 1st prize merits, and cultural distinctions to the chronological timeline.
                    </p>
                  </div>

                  {timelineSuccess && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF4ED] text-[#6B7F5E] text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Timeline milestone added!</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddTimelineSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                        Year *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2026"
                        value={newTimeline.year}
                        onChange={(e) => setNewTimeline({ ...newTimeline, year: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                        Competition / Honor Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. State Youth Festival Painting Merit 1st Prize"
                        value={newTimeline.title}
                        onChange={(e) => setNewTimeline({ ...newTimeline, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                      Organizing Authority / Department *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dept. of Art, Culture & Youth, Govt. of Bihar"
                      value={newTimeline.organization}
                      onChange={(e) => setNewTimeline({ ...newTimeline, organization: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                      Milestone Description & Citation *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Awarded first place across 38 district winners in on-the-spot realistic portraiture..."
                      value={newTimeline.description}
                      onChange={(e) => setNewTimeline({ ...newTimeline, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2 border-t border-[#DDD3C3]/60">
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Add Milestone to Timeline</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Timeline List */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDD3C3] shadow-xs space-y-6">
                <div className="border-b border-[#DDD3C3]/60 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                      Active Timeline Milestones ({timelineAwards.length})
                    </h3>
                    <p className="text-xs text-[#5A554F]">
                      Chronological order on the Recognition page. Click Delete to remove any milestone.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {timelineAwards.map((award, idx) => (
                    <div
                      key={award.id || idx}
                      className="p-4 rounded-2xl border border-[#DDD3C3] bg-[#FAF7F2]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 grow">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F0E9DC] text-[#B5502F]">
                            {award.year}
                          </span>
                          <span className="text-xs text-[#5A554F]">
                            {award.organization}
                          </span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-[#1F1D1B]">
                          {award.title}
                        </h4>
                        <p className="text-xs text-[#5A554F]">
                          {award.description}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => setEditingTimeline({ ...award, _identifier: award.id || award.title })}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#5A554F] hover:text-[#B5502F] hover:bg-[#F8ECE7] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTimeline(award.id || award.title)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 4: CUSTOMER ORDERS INBOX */}
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

                    <button
                      onClick={() => handleDeleteOrder(ord.id)}
                      className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer transition-colors"
                      title="Delete customer inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

      {/* ─────────────────────────────────────────────────────────────
          EDIT MODAL 1: ARTWORK DETAILS
      ───────────────────────────────────────────────────────────── */}
      {editingArt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#DDD3C3] shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#DDD3C3]/60 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B5502F]">
                  Modify Artwork
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                  Edit Artwork Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingArt(null)}
                className="p-2 rounded-xl text-[#5A554F] hover:text-[#1F1D1B] hover:bg-[#FAF7F2] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArtEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArt.title}
                    onChange={(e) => setEditingArt({ ...editingArt, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={editingArt.category}
                    onChange={(e) => setEditingArt({ ...editingArt, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] cursor-pointer"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Medium *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArt.medium}
                    onChange={(e) => setEditingArt({ ...editingArt, medium: e.target.value })}
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
                    value={editingArt.dimensions}
                    onChange={(e) => setEditingArt({ ...editingArt, dimensions: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Price / Tag
                  </label>
                  <input
                    type="text"
                    value={editingArt.price || ''}
                    onChange={(e) => setEditingArt({ ...editingArt, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Availability Status
                  </label>
                  <select
                    value={editingArt.status}
                    onChange={(e) => setEditingArt({ ...editingArt, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] cursor-pointer"
                  >
                    <option value="Available">Available for Sale</option>
                    <option value="Commissioned">Commissioned (Sold)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Description / Story
                </label>
                <textarea
                  rows={2}
                  value={editingArt.description || ''}
                  onChange={(e) => setEditingArt({ ...editingArt, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Artwork Photo
                </label>
                <div className="flex items-center gap-4 bg-[#FAF7F2] p-3 rounded-2xl border border-[#DDD3C3]">
                  <img
                    src={editingArt.image}
                    alt={editingArt.title}
                    className="w-16 h-16 object-cover rounded-xl border border-[#DDD3C3]"
                  />
                  <div>
                    <label className="px-4 py-2 rounded-xl bg-white border border-[#DDD3C3] text-xs font-semibold text-[#B5502F] hover:bg-[#F8ECE7] cursor-pointer inline-block">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleEditImageUpload(e.target.files[0], setEditingArt)}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-[#5A554F] mt-1">Select a new photo from phone or gallery</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DDD3C3]/60">
                <button
                  type="button"
                  onClick={() => setEditingArt(null)}
                  className="px-5 py-2.5 rounded-full border border-[#DDD3C3] text-xs font-semibold text-[#5A554F] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          EDIT MODAL 2: CERTIFICATE DETAILS
      ───────────────────────────────────────────────────────────── */}
      {editingCert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#DDD3C3] shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#DDD3C3]/60 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B5502F]">
                  Recognition Wall
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                  Edit Certificate Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCert(null)}
                className="p-2 rounded-xl text-[#5A554F] hover:text-[#1F1D1B] hover:bg-[#FAF7F2] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCertEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingCert.title}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Subtitle / Event Category
                </label>
                <input
                  type="text"
                  value={editingCert.sub || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, sub: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Issuing Authority *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.issuer}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.year}
                    onChange={(e) => setEditingCert({ ...editingCert, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Certificate Image / Scan
                </label>
                <div className="flex items-center gap-4 bg-[#FAF7F2] p-3 rounded-2xl border border-[#DDD3C3]">
                  <img
                    src={editingCert.image}
                    alt={editingCert.title}
                    className="w-20 h-16 object-contain bg-[#1A1816] rounded-xl border border-[#DDD3C3] p-1"
                  />
                  <div>
                    <label className="px-4 py-2 rounded-xl bg-white border border-[#DDD3C3] text-xs font-semibold text-[#B5502F] hover:bg-[#F8ECE7] cursor-pointer inline-block">
                      Change Scan / Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleEditImageUpload(e.target.files[0], setEditingCert)}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-[#5A554F] mt-1">Upload an updated scan or photograph</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DDD3C3]/60">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-5 py-2.5 rounded-full border border-[#DDD3C3] text-xs font-semibold text-[#5A554F] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          EDIT MODAL 3: DIGNITARY DETAILS
      ───────────────────────────────────────────────────────────── */}
      {editingDignitary && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#DDD3C3] shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#DDD3C3]/60 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B5502F]">
                  Dignitaries
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                  Edit Dignitary Felicitation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingDignitary(null)}
                className="p-2 rounded-xl text-[#5A554F] hover:text-[#1F1D1B] hover:bg-[#FAF7F2] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDignitaryEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Dignitary Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDignitary.name}
                    onChange={(e) => setEditingDignitary({ ...editingDignitary, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDignitary.role}
                    onChange={(e) => setEditingDignitary({ ...editingDignitary, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Occasion / Event *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDignitary.event}
                    onChange={(e) => setEditingDignitary({ ...editingDignitary, event: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Badge / Tag *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDignitary.badge}
                    onChange={(e) => setEditingDignitary({ ...editingDignitary, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Appreciation Story / Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingDignitary.description}
                  onChange={(e) => setEditingDignitary({ ...editingDignitary, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Felicitation Photograph
                </label>
                <div className="flex items-center gap-4 bg-[#FAF7F2] p-3 rounded-2xl border border-[#DDD3C3]">
                  <img
                    src={editingDignitary.image}
                    alt={editingDignitary.name}
                    className="w-20 h-16 object-cover rounded-xl border border-[#DDD3C3]"
                  />
                  <div>
                    <label className="px-4 py-2 rounded-xl bg-white border border-[#DDD3C3] text-xs font-semibold text-[#B5502F] hover:bg-[#F8ECE7] cursor-pointer inline-block">
                      Change Photograph
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleEditImageUpload(e.target.files[0], setEditingDignitary)}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-[#5A554F] mt-1">Upload a new photograph with the dignitary</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DDD3C3]/60">
                <button
                  type="button"
                  onClick={() => setEditingDignitary(null)}
                  className="px-5 py-2.5 rounded-full border border-[#DDD3C3] text-xs font-semibold text-[#5A554F] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          EDIT MODAL 4: TIMELINE MILESTONE DETAILS
      ───────────────────────────────────────────────────────────── */}
      {editingTimeline && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#DDD3C3] shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#DDD3C3]/60 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B5502F]">
                  Timeline Milestone
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1F1D1B]">
                  Edit Merit Milestone
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTimeline(null)}
                className="p-2 rounded-xl text-[#5A554F] hover:text-[#1F1D1B] hover:bg-[#FAF7F2] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTimelineEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTimeline.year}
                    onChange={(e) => setEditingTimeline({ ...editingTimeline, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                    Competition / Honor Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTimeline.title}
                    onChange={(e) => setEditingTimeline({ ...editingTimeline, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Organizing Authority / Department *
                </label>
                <input
                  type="text"
                  required
                  value={editingTimeline.organization}
                  onChange={(e) => setEditingTimeline({ ...editingTimeline, organization: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-1.5">
                  Milestone Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingTimeline.description}
                  onChange={(e) => setEditingTimeline({ ...editingTimeline, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DDD3C3]/60">
                <button
                  type="button"
                  onClick={() => setEditingTimeline(null)}
                  className="px-5 py-2.5 rounded-full border border-[#DDD3C3] text-xs font-semibold text-[#5A554F] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

