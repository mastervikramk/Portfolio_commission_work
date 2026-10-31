import React from 'react';
import { Palette, Award, BookOpen, Heart, ArrowRight, CheckCircle2, Sparkles, ExternalLink, Brush, Compass, Layers } from 'lucide-react';
import { YoutubeIcon, InstagramIcon } from '../components/SocialIcons';
import profileImage from '../assets/profile.jpeg';

export default function About({ setActivePage }) {
  const learningJourney = [
    {
      period: "The Foundation (6 Years)",
      mentor: "Anand Kumar",
      institution: "NBI of Fine Art & Craft",
      role: "Classical Fine Art Foundation",
      link: "https://www.instagram.com/",
      description: "Beginning her artistic path in class 7 with the devoted support of her family, Vinita spent 6 transformative years under Anand Kumar mastering the core classical disciplines—pencil sketching, realistic portraiture, vine charcoal, watercolor, oil, and acrylic."
    },
    {
      period: "Delhi Exploration (3 Months)",
      mentor: "Dilip Sharma",
      institution: "Contemporary Studio, Delhi",
      role: "Impressionism & Live Art",
      link: "https://dilipsharma.in/gallery/",
      description: "Traveled to Delhi to broaden her artistic horizons, studying Impressionism, abstract compositions, acrylic sculptures, and fast-paced live sketching from life."
    },
    {
      period: "Folk Heritage & Craft",
      mentor: "Dr. Ujjwal Ankur",
      institution: "NIFT Delhi (Ministry of Textiles)",
      role: "Vajjika Folk Art & Wearable Art",
      link: "https://www.instagram.com/",
      description: "Immersed in indigenous regional heritage, mastering traditional Vajjika art. She brought this rare folk tradition alive on canvas, hand-painted sarees, and artisan lifestyle products, presenting them at public exhibitions and cultural craft stalls."
    },
    {
      period: "Specialized Workshops",
      mentor: "Kuldeep Singh",
      institution: "Realism Workshops",
      role: "Realistic Acrylic Mastery",
      link: "https://youtube.com/@artistkuldeepsingh",
      description: "Dedicated herself to advanced workshops and courses to master the nuances of light, photographic depth, and fine textural blending in realistic acrylic painting."
    },
    {
      period: "Advanced Techniques",
      mentor: "Vijender Sharma",
      institution: "Master Studio, Delhi",
      role: "Mixed Media (Acrylic & Oil)",
      link: "https://www.vijendersharma.com/",
      description: "Refined her versatility under veteran master Vijender Sharma, exploring layered mixed-media harmonies blending rich acrylics with traditional oils."
    }
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      
      {/* 1. Artist Bio & Story Section */}
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
                  <p className="text-xs text-[#5A554F]">Founder & Fine Artist at Arthur Visions</p>
                  <p className="text-[11px] text-[#B5502F] font-semibold mt-0.5">Muzaffarpur, Bihar, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Artist Story & Narrative */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
            The Artist’s Story
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1D1B] leading-tight">
            A Journey of Learning, Teaching, and Sharing Fine Art
          </h1>
          
          <div className="space-y-4 text-sm sm:text-base text-[#5A554F] leading-relaxed">
            <p>
              Vinita’s journey with color and canvas began simply, in the seventh grade. Recognizing her quiet obsession with drawing, her family gave her the greatest gift an aspiring artist could ask for: unshakeable belief. They enrolled her at the <strong>NBI of Fine Art and Craft</strong> coaching center in Muzaffarpur, where she met her mentor, <strong>Anand Kumar</strong>.
            </p>
            <p>
              Under his guidance, what began as a childhood fascination turned into six years of disciplined practice. Day after day, she honed her fundamentals across every classical medium—from pencil sketching and soulful vine charcoal to luminous watercolors, oils, and acrylics.
            </p>
            <p>
              Driven by a hunger to push her boundaries, she traveled to Delhi to learn Impressionism and live sketching from <strong>Dilip Sharma</strong>, dove deep into Bihar’s indigenous <strong>Vajjika folk art</strong> under <strong>Dr. Ujjwal Ankur at NIFT Delhi</strong>, perfected hyper-realistic acrylics with <strong>Kuldeep Singh</strong>, and mastered mixed media with <strong>Vijender Sharma</strong>.
            </p>
            <p>
              Today, Vinita’s artistic journey has come full circle: she continues to study master techniques while teaching students, sharing her creative process on YouTube (<strong>@ArthurVisions-521</strong>), and delivering bespoke portraits and authentic Vajjika artworks to art lovers across India.
            </p>
            <p className="text-[#1F1D1B] font-medium italic pt-1 border-l-2 border-[#B5502F] pl-4">
              "While I paint across charcoal, oils, and watercolors, my heart belongs to <strong className="text-[#B5502F] font-bold not-italic">realistic acrylic painting</strong>. My dream is to create a distinct identity for my work, to preserve our heritage, and to make Bihar and India proud on the global art stage."
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#DDD3C3]/60 text-xs">
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DDD3C3]/70 text-center">
              <span className="block font-bold text-[#1F1D1B] text-sm">6+ Years</span>
              <span className="text-[11px] text-[#5A554F]">Master Training</span>
            </div>
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DDD3C3]/70 text-center">
              <span className="block font-bold text-[#1F1D1B] text-sm">Artist & Mentor</span>
              <span className="text-[11px] text-[#5A554F]">Learning & Teaching</span>
            </div>
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DDD3C3]/70 text-center">
              <span className="block font-bold text-[#1F1D1B] text-sm">Realistic</span>
              <span className="text-[11px] text-[#5A554F]">Acrylic Specialty</span>
            </div>
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DDD3C3]/70 text-center">
              <span className="block font-bold text-[#1F1D1B] text-sm">Pan-India</span>
              <span className="text-[11px] text-[#5A554F]">Art Delivery</span>
            </div>
          </div>
        </div>

      </section>

      {/* 2. Education & Mentorship Timeline */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
            Mentorship & Training
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1D1B]">
            Shaped by Master Artists
          </h2>
          <p className="text-sm text-[#5A554F]">
            Every brushstroke is grounded in years of continuous learning, diverse artistic philosophies, and hands-on master studios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningJourney.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-3xl border border-[#DDD3C3] shadow-xs hover:border-[#B5502F]/60 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B5502F] bg-[#F8ECE7] px-2.5 py-1 rounded-full">
                    {item.period}
                  </span>
                  {item.link && (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#5A554F] hover:text-[#B5502F] transition-colors"
                      title="View artist profile"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1F1D1B]">
                    {item.mentor}
                  </h3>
                  <p className="text-xs font-semibold text-[#8C4024] mt-0.5">
                    {item.institution}
                  </p>
                  <p className="text-[11px] text-[#5A554F] font-medium">
                    {item.role}
                  </p>
                </div>

                <p className="text-xs text-[#5A554F] leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#DDD3C3]/40 flex items-center gap-1.5 text-[11px] text-[#5A554F]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B5502F]" />
                <span>Verified Studio Training</span>
              </div>
            </div>
          ))}

          {/* Vajjika Heritage Card */}
          <div className="bg-gradient-to-br from-[#FBF5E6] to-[#FAF7F2] p-6 rounded-3xl border border-[#C99A2E]/40 shadow-xs flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-1">
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C99A2E] bg-white px-2.5 py-1 rounded-full border border-[#C99A2E]/30">
                Cultural Mission
              </span>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1F1D1B]">
                  Vajjika Art on Canvas & Silk
                </h3>
                <p className="text-xs text-[#5A554F] mt-1 leading-relaxed">
                  Beyond canvases, Vinita paints sacred Vajjika folk motifs directly onto handloom sarees and artisan home décor, keeping stalls at cultural fairs to revive Bihar’s ancient Vaishali folk art tradition.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[#DDD3C3]/40 flex items-center justify-between text-xs font-serif font-bold text-[#1F1D1B]">
              <span>Honored with Vajjika Vibhuti Samman</span>
              <Award className="w-4 h-4 text-[#C99A2E]" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Vision: Bihar to the World */}
      <section className="bg-white p-8 sm:p-12 rounded-3xl border border-[#DDD3C3] shadow-sm text-center max-w-4xl mx-auto space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#F8ECE7] text-[#B5502F] flex items-center justify-center mx-auto shadow-xs">
          <Heart className="w-6 h-6" />
        </div>
        <div className="space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1D1B]">
            Her Vision & Philosophy
          </h2>
          <p className="text-sm sm:text-base text-[#5A554F] leading-relaxed max-w-2xl mx-auto">
            "Art is not just technique; it is devotion. While I create pencil sketches, charcoal portraits, watercolors, and oils, my deepest focus is <strong className="text-[#B5502F] font-bold not-italic">realistic acrylic painting</strong>. I want my artwork to leave a lasting mark—giving Bihar a proud, respected identity in contemporary fine art across India and the world."
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActivePage('gallery')}
            className="px-6 py-3 rounded-full bg-[#B5502F] hover:bg-[#9B4224] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center gap-2"
          >
            <span>Explore Original Artworks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActivePage('order')}
            className="px-6 py-3 rounded-full bg-white hover:bg-[#FAF7F2] text-[#1F1D1B] border border-[#DDD3C3] text-xs font-semibold transition-all shadow-2xs cursor-pointer"
          >
            Commission a Custom Portrait
          </button>
        </div>
      </section>

      {/* 4. Studio Presence & Social Channels */}
      <section className="bg-[#F0E9DC] p-8 sm:p-12 rounded-3xl border border-[#DDD3C3] text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B5502F] flex items-center justify-center mx-auto shadow-xs">
          <YoutubeIcon className="w-6 h-6 text-red-600" />
        </div>
        <div className="max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-3xl font-bold text-[#1F1D1B]">
            Watch Her Creative Process
          </h2>
          <p className="text-sm text-[#5A554F]">
            From raw preliminary sketches to hyper-realistic acrylic layering, watch weekly art reels, shorts, and behind-the-scenes studio sessions.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://youtube.com/@ArthurVisions-521"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B5502F] text-white hover:bg-[#9B4224] font-medium text-xs transition-all shadow-sm"
          >
            <YoutubeIcon className="w-4 h-4 text-white" />
            <span>YouTube (@ArthurVisions-521)</span>
          </a>
          <a
            href="https://instagram.com/arthur_visions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#1F1D1B] border border-[#DDD3C3] hover:border-[#E1306C] font-medium text-xs transition-all shadow-2xs"
          >
            <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
            <span>Instagram (@arthur_visions)</span>
          </a>
        </div>
      </section>

    </div>
  );
}

