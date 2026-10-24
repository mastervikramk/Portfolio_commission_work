import React, { useState } from 'react';
import { Calculator, Sparkles, ArrowRight } from 'lucide-react';

export default function CommissionEstimator({ onSelectConfig }) {
  const [medium, setMedium] = useState('charcoal');
  const [size, setSize] = useState('a3');
  const [subjects, setSubjects] = useState(1);

  // Pricing matrix
  const pricingTable = {
    charcoal: { a4: 1999, a3: 2999, a2: 4499, name: "Charcoal & Pencil Sketch" },
    pen: { a4: 2299, a3: 3499, a2: 4999, name: "Pen & Ink Portrait" },
    watercolor: { a4: 2799, a3: 3999, a2: 5999, name: "Watercolor Portrait" },
    pastel: { a4: 2999, a3: 4499, a2: 6499, name: "Soft Pastel Painting" },
    acrylic: { a4: 3499, a3: 5199, a2: 7999, name: "Acrylic on Canvas" },
    oil: { a4: 4999, a3: 7499, a2: 11999, name: "Oil on Linen Canvas" },
    vajjika: { a4: 2499, a3: 4199, a2: 6999, name: "Traditional Vajjika Art" },
  };

  const basePrice = pricingTable[medium][size];
  // Add 40% for each additional subject/face
  const multiplier = 1 + (subjects - 1) * 0.45;
  const estimatedTotal = Math.round(basePrice * multiplier);

  return (
    <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#DDD3C3] shadow-md">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DDD3C3]">
        <div className="p-2.5 rounded-xl bg-[#F8ECE7] text-[#B5502F]">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1D1B]">
            Interactive Portrait Price Estimator
          </h3>
          <p className="text-xs text-[#5A554F]">
            Transparent pricing based on medium, surface size, and number of subjects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        
        {/* Step 1: Medium */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-2">
            1. Select Art Medium
          </label>
          <select
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] transition-all cursor-pointer"
          >
            <option value="charcoal">Charcoal & Pencil Sketch</option>
            <option value="pen">Pen & Ink Portrait</option>
            <option value="watercolor">Watercolor on Cotton Sheet</option>
            <option value="pastel">Soft Pastel Painting</option>
            <option value="acrylic">Acrylic on Wrapped Canvas</option>
            <option value="oil">Oil on Linen Canvas (Masterpiece)</option>
            <option value="vajjika">Traditional Vajjika Folk Art</option>
          </select>
        </div>

        {/* Step 2: Size */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-2">
            2. Choose Dimensions
          </label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] transition-all cursor-pointer"
          >
            <option value="a4">A4 (8.3 × 11.7 in) — Desk / Small</option>
            <option value="a3">A3 (11.7 × 16.5 in) — Most Popular</option>
            <option value="a2">A2 (16.5 × 23.4 in) — Grand Statement</option>
          </select>
        </div>

        {/* Step 3: Subjects */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A554F] mb-2">
            3. Number of Faces / People
          </label>
          <select
            value={subjects}
            onChange={(e) => setSubjects(parseInt(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD3C3] text-sm text-[#1F1D1B] focus:outline-none focus:ring-2 focus:ring-[#B5502F] transition-all cursor-pointer"
          >
            <option value={1}>1 Person / Single Portrait</option>
            <option value={2}>2 Persons (Couple / Siblings)</option>
            <option value={3}>3 Persons (Family Portrait)</option>
            <option value={4}>4+ Persons (Custom Group)</option>
          </select>
        </div>

      </div>

      {/* Estimation Display Banner */}
      <div className="bg-[#F0E9DC] p-4 sm:p-5 rounded-xl border border-[#DDD3C3] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#5A554F] uppercase tracking-wider block font-medium">
            Estimated Commission Range
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#B5502F]">
              ₹{estimatedTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#5A554F]">
              (incl. archival packaging & pan-India courier)
            </span>
          </div>
          <p className="text-xs text-[#5A554F] mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C99A2E]" />
            <span>Includes 100% satisfaction proof preview prior to dispatch.</span>
          </p>
        </div>

        <button
          onClick={() => {
            if (onSelectConfig) {
              onSelectConfig({
                medium: pricingTable[medium].name,
                size: size.toUpperCase(),
                subjects,
                estimatedPrice: `₹${estimatedTotal.toLocaleString('en-IN')}`,
              });
            }
          }}
          className="w-full sm:w-auto px-6 py-3 bg-[#B5502F] hover:bg-[#9B4224] text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Lock In This Configuration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

