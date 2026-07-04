'use client';

import { Star, Quote, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

export default function Testimonials() {
  const stats = [
    { value: '15,000+', label: 'Нийт Хэрэглэгчид' },
    { value: '5,000+', label: 'Захиалга Хүргэсэн' },
    { value: '2,500+', label: 'TOONHUB Цуглуулагч' },
    { value: '99.4%', label: 'Сэтгэл Ханамж' },
  ];

  const testimonials = [
    {
      name: 'Б. Тэмүүлэн',
      role: 'Цуглуулагч, Designer',
      text: 'TOONHUB хэсэг үнэхээр солиотой! Зургууд дээрээс хараад л шууд захиалж авсан. Нараа-гийн өгсөн 3D фигурин яг зураг дээрх шигээ чанартай, нямбай хийцтэй байна лээ. Маш их баярлалаа!',
      rating: 5,
      image: 'https://picsum.photos/seed/user_temuulen/150/150',
    },
    {
      name: 'О. Саруул',
      role: 'Оюутан',
      text: 'Маш хямдхан мөртлөө үнэхээр чанартай гутал авлаа! Бүх насныханд зориулсан загвар олон байсан болохоор дүүдээ ч бас авч өгсөн. Хүргэлт нь ч маш шуурхай байлаа.',
      rating: 5,
      image: 'https://picsum.photos/seed/user_saruul/150/150',
    },
    {
      name: 'М. Анужин',
      role: 'Маркетер',
      text: 'Өдөр тутмын хувцаснууд нь маш зөөлөн, биед эвтэйхэн юм байна. Олон угаалтын дараа ч хэлбэр, өнгөө алдахгүй байна. Дараагийн шинэ загварыг тэсэн ядан хүлээж байна.',
      rating: 5,
      image: 'https://picsum.photos/seed/user_anujin/150/150',
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-[#181818] relative overflow-hidden">
      {/* Visual background circles */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#1c1c1c] rounded-2xl p-6 text-center border border-white/5 shadow-xl"
            >
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm text-white/60 font-medium mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Heart size={12} className="fill-amber-400" />
            Хэрэглэгчийн үнэлгээ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-4 mb-6">
            Хэрэглэгчид Бидний Тухай
          </h2>
          <p className="text-base sm:text-lg text-white/60">
            Сэтгэл ханамжтай 15,000+ гаруй үйлчлүүлэгчдийн сэтгэгдлүүдээс бодит түүхийг уншаарай.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-[#1c1c1c] rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300 relative group"
            >
              <Quote className="absolute top-6 right-8 text-white/5 w-12 h-12 pointer-events-none group-hover:text-amber-400/5 transition-colors" />
              
              {/* Rating stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(test.rating)].map((_, sIdx) => (
                  <Star key={sIdx} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-8 italic">
                &ldquo;{test.text}&rdquo;
              </p>

              {/* User Bio */}
              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-amber-400/20">
                  <Image
                    src={test.image}
                    alt={test.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm sm:text-base">{test.name}</h4>
                  <p className="text-xs text-white/50">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
