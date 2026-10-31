import React, { useState } from 'react';
import { Calculator, Sparkles, ArrowRight, Check, ShieldCheck, Heart } from 'lucide-react';

export default function CommissionEstimator({ onSelectConfig }) {
  const [medium, setMedium] = useState('charcoal');
  const [size, setSize] = useState('a3');
  const [subjects, setSubjects] = useState(1);

  // Pricing matrix for custom fine-art portraits
  const mediums = [
    { id: 'charcoal', name: "Charcoal & Pencil", desc: "Soulful depth on archival French paper", base: { a4: 1999, a3: 2999, a2: 4499 } },
    { id: 'pen', name: "Pen & Ink", desc: "Fine precision cross-hatching", base: { a4: 2299, a3: 3499, a2: 4999 } },
    { id: 'watercolor', name: "Watercolor", desc: "Soft luminous washes on cotton sheet", base: { a4: 2799, a3: 3999, a2: 5999 } },
    { id: 'acrylic', name: "Realistic Acrylic", tag: "Artist Pick", desc: "Artist's signature medium on canvas", base: { a4: 3499, a3: 5199, a2: 7999 } },
    { id: 'oil', name: "Oil on Canvas", desc: "Timeless heirloom with rich texture", base: { a4: 4999, a3: 7499, a2: 11999 } },
  ];

  const sizes = [
    { id: 'a4', label: "A4 Size", dims: "8.3 × 11.7 in", note: "Desk or Bedside" },
    { id: 'a3', label: "A3 Size", dims: "11.7 × 16.5 in", note: "Living Wall", popular: true },
    { id: 'a2', label: "A2 Size", dims: "16.5 × 23.4 in", note: "Grand Statement" },
  ];

  const subjectOptions = [
    { count: 1, label: "1 Person", note: "Solo Portrait" },
    { count: 2, label: "2 Persons", note: "Couple / Siblings" },
    { count: 3, label: "3 Persons", note: "Family Portrait" },
    { count: 4, label: "4+ Persons", note: "Custom Group" },
  ];

  const selectedMediumObj = mediums.find(m => m.id === medium) || mediums[0];
  const basePrice = selectedMediumObj.base[size] || 2999;
  
  // +45% for each additional subject
  const multiplier = 1 + (subjects - 1) * 0.45;
  const estimatedTotal = Math.round(basePrice * multiplier);

  return (
    <div className="bg-[#FAF7F2] p-6 sm:p-9 rounded-3xl border border-[#DDD3C3] shadow-md space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#DDD3C3]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#F8ECE7] text-[#B5502F]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1D1B]">
              Portrait Price Estimator
            </h3>
            <p className="text-xs sm:text-sm text-[#5A554F]">
              Transparent instant pricing. Select your preferred options below:
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-[#F0E9DC] text-[#1F1D1B] border border-[#DDD3C3]">
          100% Handcrafted
        </span>
      </div>

      {/* 1. Medium Selector (Visual Pills) */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F]">
          Step 1: Choose Art Medium
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {mediums.map((m) => {
            const isSelected = medium === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMedium(m.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'border-[#B5502F] bg-white ring-2 ring-[#B5502F]/20 shadow-xs'
                    : 'border-[#DDD3C3] bg-white/70 hover:bg-white hover:border-[#1F1D1B]/30'
                }`}
              >
                <div>
                  <p className={`text-xs sm:text-sm font-bold leading-tight ${isSelected ? 'text-[#B5502F]' : 'text-[#1F1D1B]'}`}>
                    {m.name}
                  </p>
                  {m.tag && (
                    <p className="text-[11px] font-semibold text-[#B5502F] mt-0.5 leading-tight">
                      ({m.tag})
                    </p>
                  )}
                  <p className="text-[10px] text-[#5A554F] leading-tight mt-1">
                    {m.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 & 3: Dimensions and Subjects in 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Step 2: Dimensions */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F]">
            Step 2: Choose Dimensions
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {sizes.map((s) => {
              const isSelected = size === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSize(s.id)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#B5502F] bg-white ring-2 ring-[#B5502F]/20 shadow-xs'
                      : 'border-[#DDD3C3] bg-white/70 hover:bg-white hover:border-[#1F1D1B]/30'
                  }`}
                >
                  {s.popular && (
                    <span className="block text-[9px] font-bold text-[#C99A2E] uppercase">
                      ★ Popular
                    </span>
                  )}
                  <p className={`text-sm font-bold mt-0.5 ${isSelected ? 'text-[#B5502F]' : 'text-[#1F1D1B]'}`}>
                    {s.label}
                  </p>
                  <p className="text-[10px] text-[#5A554F] mt-0.5">
                    {s.dims}
                  </p>
                  <p className="text-[9px] text-[#5A554F]/80">
                    {s.note}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Number of People / Faces */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5A554F]">
            Step 3: Number of Faces / People
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {subjectOptions.map((opt) => {
              const isSelected = subjects === opt.count;
              return (
                <button
                  key={opt.count}
                  type="button"
                  onClick={() => setSubjects(opt.count)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#B5502F] bg-white ring-2 ring-[#B5502F]/20 shadow-xs'
                      : 'border-[#DDD3C3] bg-white/70 hover:bg-white hover:border-[#1F1D1B]/30'
                  }`}
                >
                  <p className={`text-sm font-bold ${isSelected ? 'text-[#B5502F]' : 'text-[#1F1D1B]'}`}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-[#5A554F] mt-0.5">
                    {opt.note}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Estimation Display Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#DDD3C3] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <span className="text-[11px] text-[#5A554F] uppercase tracking-wider block font-semibold">
            Estimated Starting Commission
          </span>
          <div className="flex flex-wrap items-baseline justify-center md:justify-start gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#B5502F]">
              ₹{estimatedTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#5A554F]">
              (artwork only • shipped unframed without frame • courier extra at actuals)
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-xs text-[#5A554F]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C99A2E]" />
              WhatsApp preview proof before dispatch
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F6F55]" />
              Safe unframed PVC tube delivery
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onSelectConfig) {
              onSelectConfig({
                medium: selectedMediumObj.name,
                size: size.toUpperCase(),
                subjects,
                estimatedPrice: `₹${estimatedTotal.toLocaleString('en-IN')}`,
              });
            }
          }}
          className="w-full md:w-auto px-7 py-3.5 bg-[#B5502F] hover:bg-[#9B4224] text-white rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <span>Continue to Order at this Estimate</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

