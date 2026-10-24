import React from 'react';
import { Palette, Award, BookOpen, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { YoutubeIcon } from '../components/SocialIcons';
import profileImage from '../assets/profile.jpeg';

export default function About({ setActivePage }) {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      
      {/* 1. Artist Bio & Portrait Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Studio Portrait Frame */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="absolute -inset-3 bg-gradient-to-tr from-[#B5502F]/15 via-[#C99A2E]/15 to-transparent rounded-3xl blur-xl" />
            <div className="relative bg-white p-4 rounded-3xl shadow-xl border border-[#DDD3C3]">
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-[#1F1D1B]">
                <img
                  src={profileImage}
                  alt="Vinita - Arthur Visions Fine Artist"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#FAF7F2]/95 backdrop-blur-md rounded-xl border border-[#DDD3C3] shadow-md">
                  <h3 className="font-serif font-bold text-lg text-[#1F1D1B]">Vinita</h3>
                  <p className="text-xs text-[#5A554F]">Founder & Master Artist at Arthur Visions</p>
                  <p className="text-[11px] text-[#B5502F] font-semibold mt-0.5">Muzaffarpur, Bihar, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Artist Story & Narrative */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
            The Artist’s Journey
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1D1B] leading-tight">
            Capturing the Human Soul & Preserving Ancient Regional Lore
          </h1>
          
          <div className="space-y-4 text-sm sm:text-base text-[#5A554F] leading-relaxed">
            <p>
              Growing up in <strong>Muzaffarpur, Bihar</strong>, art was never just a hobby—it was a visceral language of emotion. Starting with graphite sketchbooks, I became fascinated by the subtlety of light on human faces: how a single tonal curve in charcoal can capture a lifetime of laughter, sorrow, or wisdom.
            </p>
            <p>
              Over the years, this obsession with realism evolved across diverse mediums—from classical <strong>oil on linen canvas</strong> and luminous <strong>watercolors</strong> to bold <strong>pen portraits</strong> and <strong>live event sketching</strong>.
            </p>
            <p>
              A pivotal chapter in my artistic education came through intensive guidance under <strong>Dr. Ujjwal Ankur</strong>, Professor in the Leather Department at <strong>NIFT Delhi (Ministry of Textiles)</strong>. This expanded my understanding of surface textures, archival materiality, and structural craft.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#DDD3C3]/60 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B5502F]" />
              <span className="font-medium text-[#1F1D1B]">1st Rank District Yuva Utsav</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B5502F]" />
              <span className="font-medium text-[#1F1D1B]">Vajjika Vibhuti Samman 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B5502F]" />
              <span className="font-medium text-[#1F1D1B]">Padma Shri Dulari Devi Blessings</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B5502F]" />
              <span className="font-medium text-[#1F1D1B]">NIFT Delhi Guided</span>
            </div>
          </div>
        </div>

      </section>

      {/* 2. The Cultural Mission: Reviving Vajjika Folk Art */}
      <section className="bg-white p-8 sm:p-12 rounded-3xl border border-[#DDD3C3] shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FBF5E6] text-[#C99A2E] border border-[#C99A2E]/30">
              Cultural Preservation
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1F1D1B]">
              The Heart of Vajjika Art (वज्जिका कला)
            </h2>
            <p className="text-sm sm:text-base text-[#5A554F] leading-relaxed">
              While Madhubani and Mithila art have gained worldwide renown, the historical <strong>Vajjika art tradition</strong> of the ancient Vaishali republic remains an underrepresented jewel of Bihar. Characterized by earthen natural motifs, sacred geometry, flora, and domestic folk rituals, Vajjika art carries the spiritual pulse of north Bihar.
            </p>
            <p className="text-sm sm:text-base text-[#5A554F] leading-relaxed">
              Being honored with the <strong>Vajjika Vibhuti Samman 2025</strong> and blessed by legendary folk artist <strong>Padma Shri Dulari Devi</strong> has cemented my lifelong commitment to keeping this authentic art form alive on contemporary canvases.
            </p>
          </div>
          <div className="lg:col-span-4 bg-[#F0E9DC] p-6 rounded-2xl border border-[#DDD3C3] text-center space-y-3">
            <Award className="w-10 h-10 text-[#C99A2E] mx-auto" />
            <h4 className="font-serif text-lg font-bold text-[#1F1D1B]">
              Vajjika Vibhuti Samman
            </h4>
            <p className="text-xs text-[#5A554F]">
              Awarded in 2025 for exceptional contribution towards regional folk heritage and cultural revival.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Studio Process & YouTube Presence */}
      <section className="bg-[#F0E9DC] p-8 sm:p-12 rounded-3xl border border-[#DDD3C3] text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B5502F] flex items-center justify-center mx-auto shadow-xs">
          <YoutubeIcon className="w-6 h-6 text-red-600" />
        </div>
        <div className="max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-3xl font-bold text-[#1F1D1B]">
            Follow the Studio on YouTube (@ArthurVisions-521)
          </h2>
          <p className="text-sm text-[#5A554F]">
            From raw preliminary sketches to final varnishing, explore weekly studio vlogs, tutorials, and behind-the-scenes creation videos.
          </p>
        </div>
        <div>
          <a
            href="https://youtube.com/@ArthurVisions-521"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#B5502F] text-white hover:bg-[#9B4224] font-medium text-sm transition-all shadow-sm"
          >
            <span>Visit @ArthurVisions-521 Channel</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
}

