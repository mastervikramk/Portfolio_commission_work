import React, { useState } from 'react';
import { 
  Palette, Sparkles, HeartHandshake, Award, HelpCircle, 
  Check, Smartphone, CheckCircle2
} from 'lucide-react';
import QuickConnectQR from '../components/QuickConnectQR';

export default function Contact() {
  const inquiryTopics = [
    {
      id: 'portrait',
      label: 'Custom Portrait Commission',
      desc: 'Bespoke realistic charcoal, pencil, watercolor, oil & pen portraits handcrafted from your photos.',
      icon: Palette,
      tag: 'Most Popular',
      accentColor: '#B5502F',
      theme: {
        activeCard: 'border-[#B5502F] bg-[#FAF3F0] ring-2 ring-[#B5502F]/30 shadow-md',
        iconBg: 'bg-[#B5502F] text-white',
        badge: 'bg-[#B5502F] text-white',
        block: 'bg-[#F8ECE7] text-[#B5502F] border border-[#B5502F]/30',
        activeBlock: 'bg-[#B5502F] text-white shadow-xs',
        indicator: 'text-[#B5502F]'
      }
    },
    {
      id: 'vajjika',
      label: 'Original Vajjika Folk Art Purchase',
      desc: 'Authentic regional Mithila/Vajjika heritage paintings celebrating ancient Bihar folk traditions.',
      icon: Sparkles,
      tag: 'Heritage Fine Art',
      accentColor: '#C99A2E',
      theme: {
        activeCard: 'border-[#C99A2E] bg-[#FDFBF5] ring-2 ring-[#C99A2E]/30 shadow-md',
        iconBg: 'bg-[#C99A2E] text-white',
        badge: 'bg-[#C99A2E] text-white',
        block: 'bg-[#FBF5E6] text-[#8C6615] border border-[#C99A2E]/40',
        activeBlock: 'bg-[#C99A2E] text-white shadow-xs',
        indicator: 'text-[#8C6615]'
      }
    },
    {
      id: 'live_event',
      label: 'Live Event & Wedding Sketching',
      desc: 'On-site live guest portrait sessions for luxury wedding receptions, galas & private VIP banquets.',
      icon: HeartHandshake,
      tag: 'Live Event Booking',
      accentColor: '#2F6F55',
      theme: {
        activeCard: 'border-[#2F6F55] bg-[#F4F9F6] ring-2 ring-[#2F6F55]/30 shadow-md',
        iconBg: 'bg-[#2F6F55] text-white',
        badge: 'bg-[#2F6F55] text-white',
        block: 'bg-[#EBF5F0] text-[#245943] border border-[#2F6F55]/40',
        activeBlock: 'bg-[#2F6F55] text-white shadow-xs',
        indicator: 'text-[#245943]'
      }
    },
    {
      id: 'exhibition',
      label: 'Exhibitions & Collaborations',
      desc: 'Cultural festivals, media features, national gallery displays & institutional partnerships.',
      icon: Award,
      tag: 'Gallery / Media',
      accentColor: '#2F3E5C',
      theme: {
        activeCard: 'border-[#2F3E5C] bg-[#F2F5FA] ring-2 ring-[#2F3E5C]/30 shadow-md',
        iconBg: 'bg-[#2F3E5C] text-white',
        badge: 'bg-[#2F3E5C] text-white',
        block: 'bg-[#EAEFF7] text-[#23314B] border border-[#2F3E5C]/40',
        activeBlock: 'bg-[#2F3E5C] text-white shadow-xs',
        indicator: 'text-[#23314B]'
      }
    },
    {
      id: 'general',
      label: 'General Studio Question',
      desc: 'Turnaround times, insured pan-India delivery, wooden framing guidance & custom inquiries.',
      icon: HelpCircle,
      tag: 'Studio Advice',
      accentColor: '#4A433D',
      theme: {
        activeCard: 'border-[#4A433D] bg-[#F7F4F0] ring-2 ring-[#4A433D]/30 shadow-md',
        iconBg: 'bg-[#4A433D] text-white',
        badge: 'bg-[#4A433D] text-white',
        block: 'bg-[#EBE5DE] text-[#342E29] border border-[#4A433D]/40',
        activeBlock: 'bg-[#4A433D] text-white shadow-xs',
        indicator: 'text-[#342E29]'
      }
    }
  ];

  const [selectedTopic, setSelectedTopic] = useState(inquiryTopics[0].label);

  const activeTopicObj = inquiryTopics.find(t => t.label === selectedTopic) || inquiryTopics[0];

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* 1. Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B5502F]">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1F1D1B]">
          Connect with Arthur Visions
        </h1>
        <p className="text-sm sm:text-base text-[#5A554F]">
          Choose what you would like to discuss below to start an instant conversation directly on WhatsApp or Email.
        </p>
      </div>

      {/* 2. Interactive Topic Selector with Highlighted Blocks & Editorial Fonts */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDD3C3] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDD3C3]/60 pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1D1B]">
              Step 1: Select Your Topic
            </h2>
            <p className="text-xs sm:text-sm text-[#5A554F] mt-0.5">
              Tap a block below to customize your direct inquiry:
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#5A554F]">Active:</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-2xs ${activeTopicObj.theme.badge}`}>
              {activeTopicObj.tag}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inquiryTopics.map((topic) => {
            const Icon = topic.icon;
            const isSelected = selectedTopic === topic.label;

            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.label)}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4 cursor-pointer relative group ${
                  isSelected
                    ? topic.theme.activeCard
                    : 'border-[#DDD3C3] bg-[#FAF7F2]/40 hover:bg-white hover:border-[#1F1D1B]/40 hover:shadow-xs'
                }`}
              >
                {/* Header Row: Icon & Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${
                    isSelected ? topic.theme.iconBg : 'bg-white text-[#1F1D1B] border border-[#DDD3C3]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-colors ${
                    isSelected ? topic.theme.badge : 'bg-[#DDD3C3]/40 text-[#5A554F]'
                  }`}>
                    {topic.tag}
                  </span>
                </div>

                {/* Highlighted Block with Editorial Cormorant Garamond Serif Font */}
                <div className="space-y-2 grow">
                  <div className="inline-block">
                    <span className={`inline-block px-3 py-1 rounded-lg transition-all font-serif text-[17px] sm:text-[18px] font-bold tracking-wide leading-snug ${
                      isSelected
                        ? topic.theme.activeBlock
                        : topic.theme.block
                    }`}>
                      {topic.label}
                    </span>
                  </div>

                  <p className="text-xs text-[#5A554F] leading-relaxed line-clamp-3">
                    {topic.desc}
                  </p>
                </div>

                {/* Bottom Selection Indicator */}
                <div className={`flex items-center gap-1.5 text-xs font-semibold pt-1 border-t border-[#DDD3C3]/50 ${
                  isSelected ? topic.theme.indicator : 'text-[#5A554F] group-hover:text-[#1F1D1B]'
                }`}>
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 fill-current text-white bg-current rounded-full" />
                      <span>Selected & Active</span>
                    </>
                  ) : (
                    <span>Tap to choose this topic &rarr;</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Step 2: Instant Connection Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1D1B]">
              Step 2: Connect Directly
            </h2>
            <p className="text-xs sm:text-sm text-[#5A554F] mt-0.5">
              Messages and QR codes are now customized for <strong className="text-[#1F1D1B] underline decoration-[#B5502F] underline-offset-2">{selectedTopic}</strong>:
            </p>
          </div>
        </div>

        {/* Dynamic QuickConnect with selected topic */}
        <QuickConnectQR selectedTopic={selectedTopic} />
      </div>

    </div>
  );
}
