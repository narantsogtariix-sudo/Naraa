'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const IMAGES = [
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F',
    title: 'ROBO PUPPY',
    desc: 'Тод улбар шар өнгө бүхий 3D робот гөлөгний өвөрмөц дүр.'
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
    title: 'GREEN MECH',
    desc: 'Ногоон байгаль болон ирээдүйн робот технологийн төгс хослол.'
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
    title: 'PINK KAWAI',
    desc: 'Ягаан өнгийн өхөөрдөм 3D тоглоом, таны ширээг чимэх шилдэг сонголт.'
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
    title: 'BLUE SCOUT',
    desc: 'Цэнхэр сансрын скаут, адал явдалд дурлагч бүрийн заавал авах цуглуулга.'
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Preload images on mount
  useEffect(() => {
    IMAGES.forEach((img) => {
      const imageInstance = new Image();
      imageInstance.src = img.src;
    });

    // Handle mobile resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigate = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    if (direction === 'next') {
      setActiveIndex((prev) => (prev + 1) % 4);
    } else {
      setActiveIndex((prev) => (prev + 3) % 4);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  // Derive roles
  const centerIndex = activeIndex;
  const leftIndex = (activeIndex + 3) % 4;
  const rightIndex = (activeIndex + 1) % 4;
  const backIndex = (activeIndex + 2) % 4;

  const getStyleForIndex = (index: number) => {
    const transitionStyle = 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1)';
    
    if (index === centerIndex) {
      return {
        left: '50%',
        height: isMobile ? '60%' : '92%',
        bottom: isMobile ? '22%' : '0',
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        transition: transitionStyle,
        willChange: 'transform, filter, opacity',
      };
    }
    
    if (index === leftIndex) {
      return {
        left: isMobile ? '20%' : '30%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        transition: transitionStyle,
        willChange: 'transform, filter, opacity',
      };
    }

    if (index === rightIndex) {
      return {
        left: isMobile ? '80%' : '70%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        transition: transitionStyle,
        willChange: 'transform, filter, opacity',
      };
    }

    // Back role
    return {
      left: '50%',
      height: isMobile ? '13%' : '22%',
      bottom: isMobile ? '32%' : '12%',
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(4px)',
      opacity: 1,
      zIndex: 5,
      transition: transitionStyle,
      willChange: 'transform, filter, opacity',
    };
  };

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div className="relative w-full h-[100vh] overflow-hidden">
        {/* 1. Grain overlay */}
        <div className="grain" />

        {/* 2. Giant ghost text "3D SHAPE" */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-2"
          style={{
            top: '18%',
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(90px, 28vw, 380px)',
            fontWeight: 900,
            color: 'white',
            opacity: 1,
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          3D SHAPE
        </div>

        {/* 3. Top-left brand label */}
        <div className="absolute top-24 left-4 sm:left-8 z-[60] flex flex-col gap-1 pointer-events-none">
          <span 
            className="text-xs font-semibold uppercase text-white opacity-90"
            style={{ letterSpacing: '0.18em' }}
          >
            TOONHUB • NARAA DESIGN STUDIO
          </span>
          <span className="text-[10px] text-white/60 font-mono tracking-widest">
            ONTSLOX ЦУГЛУУЛГА
          </span>
        </div>

        {/* 4. Carousel */}
        <div className="absolute inset-0 z-3">
          {IMAGES.map((img, idx) => (
            <div
              key={idx}
              className="absolute"
              style={{
                aspectRatio: '0.6 / 1',
                ...getStyleForIndex(idx),
              }}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-contain object-bottom select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* 5. Bottom-left text + nav buttons */}
        <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 z-[60] max-w-[320px]">
          <p 
            className="font-bold uppercase text-white opacity-95 text-base sm:text-[22px] mb-2 sm:mb-3"
            style={{ letterSpacing: '0.02em' }}
          >
            TOONHUB FIGURINES
          </p>
          <p className="hidden sm:block text-xs sm:text-sm text-white opacity-85 leading-relaxed mb-4 sm:mb-5">
            The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.
          </p>
          
          {/* Nav buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('prev')}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent transition-all duration-150 hover:scale-108 hover:bg-white/12 active:scale-95"
              aria-label="Өмнөх"
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              onClick={() => navigate('next')}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent transition-all duration-150 hover:scale-108 hover:bg-white/12 active:scale-95"
              aria-label="Дараах"
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right link */}
        <div className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 z-[60]">
          <a
            href="#products"
            className="inline-flex items-center gap-1.5 sm:gap-3 text-white transition-all duration-200 hover:opacity-100 opacity-95 group"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            DISCOVER IT
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-2">
              <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
