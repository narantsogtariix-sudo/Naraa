'use client';

import { Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b0b0b] border-t border-white/5 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Logo Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <a href="#home" className="flex items-center gap-2 group">
              <span className="font-display text-2xl tracking-wider text-white group-hover:text-amber-400 transition-colors">
                NatsoShop
              </span>
              <span className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded font-mono">
                TOONHUB
              </span>
            </a>
            <p className="text-xs text-white/40 mt-1">
              Хамгийн хямд, чанартай хувцас, гутал ба 3D фигурин цуглуулга
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a href="#home" className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors">Эхлэл</a>
            <a href="#about" className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors">Бидний тухай</a>
            <a href="#products" className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors">Бүтээгдэхүүн</a>
            <a href="#testimonials" className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors">Сэтгэгдэл</a>
            <a href="#contact" className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors">Холбоо барих</a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-xs text-white/40">
              &copy; {currentYear} Нараа Брэнд. Бүх эрх хуулиар хамгаалагдсан.
            </p>
            <p className="text-[10px] text-white/20 mt-1 flex items-center justify-center md:justify-end gap-1 font-mono">
              <span>DESIGNED WITH</span>
              <Sparkles size={10} className="text-amber-400" />
              <span>FOR HIGHEST CONVERSION</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
