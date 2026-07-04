'use client';

import Image from 'next/image';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#181818] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[450px] sm:h-[550px] w-full rounded-2xl overflow-hidden group shadow-2xl"
          >
            <Image
              src="https://picsum.photos/seed/nara_fashion/800/1000"
              alt="NatsoShop танилцуулга"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Visual badge */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10">
              <span className="font-display text-lg tracking-wider text-white">
                NATSOSHOP STYLE
              </span>
              <p className="text-xs text-white/70 mt-1">
                Чанартай бөгөөд загварлаг өдөр тутмын сонголт
              </p>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full w-fit mb-6 text-sm text-amber-400">
              <Sparkles size={16} />
              <span>Бидний тухай</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
              Хамгийн хямд, хамгийн чанартайг <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                зөвхөн NatsoShop-оос!
              </span>
            </h2>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-6">
              Манай &quot;NatsoShop&quot; брэнд нь бүх насныханд зориулсан хамгийн сүүлийн үеийн, тренди загвартай өдөр тутмын гутал, хувцаснуудыг Монголынхоо хэрэглэгчдэд хамгийн хямд үнээр, чанарын өндөр түвшинд хүргэдэг.
            </p>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8">
              Үүнээс гадна бид ирээдүйн технологи, урлагийг хослуулсан, хязгаарлагдмал тоотой гарах өвөрмөц 3D TOONHUB фигурин цуглуулгуудыг албан ёсны эрхтэйгээр худалдаалж, таны гэр болон ширээг чимэх шилдэг шийдлүүдийг санал болгож байна.
            </p>

            {/* Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="font-semibold text-white text-sm sm:text-base">Хямд Үнийн Баталгаа</h4>
                  <p className="text-xs sm:text-sm text-white/60">Шууд үйлдвэрээс нь хамгийн хямдаар авчирдаг</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="font-semibold text-white text-sm sm:text-base">Чанартай Материал</h4>
                  <p className="text-xs sm:text-sm text-white/60">Урт удаан эдэлгээ, ая тухтай байдлыг хангах материал</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="font-semibold text-white text-sm sm:text-base">Бүх Насныханд</h4>
                  <p className="text-xs sm:text-sm text-white/60">Хүүхдээс эхлээд ахмадууд хүртэл өмсөх сонголтууд</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="font-semibold text-white text-sm sm:text-base">Түргэн Хүргэлт</h4>
                  <p className="text-xs sm:text-sm text-white/60">Хүссэн газарт тань найдвартай шуурхай хүргэнэ</p>
                </div>
              </div>
            </div>

            {/* CTA in context */}
            <div>
              <a
                href="#products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-950/20"
              >
                Бүтээгдэхүүн үзэх
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
