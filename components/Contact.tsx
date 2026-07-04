'use client';

import { useState, FormEvent } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle, Instagram, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    productType: 'shoes',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Нэр болон утасны дугаараа заавал бөглөнө үү.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'contact_requests'), {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        productType: formData.productType,
        message: formData.message,
        status: 'Unread',
        createdAt: serverTimestamp(),
        notes: []
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        productType: 'shoes',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact request:', error);
      alert('Алдаа гарлаа. Дахин оролдоно уу.');
      setIsSubmitting(false);
      handleFirestoreError(error, OperationType.WRITE, 'contact_requests');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-24 bg-[#121212] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1.5 rounded-full inline-block">
                Захиалга өгөх
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-4 mb-6">
                Холбоо Барих
              </h2>
              <p className="text-base sm:text-lg text-white/60 mb-10 leading-relaxed">
                Танд сонирхсон асуулт, захиалах хүсэлт байвал бидэнд үлдээгээрэй. Бид тантай маш хурдан эргэн холбогдож, захиалгыг тань баталгаажуулах болно.
              </p>

              {/* Info Items */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider">Утас</h4>
                    <p className="text-sm sm:text-base font-semibold text-white mt-0.5 hover:text-amber-400 transition-colors">
                      <a href="tel:+97699044798">99044798</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider">Имэйл хаяг</h4>
                    <p className="text-sm sm:text-base font-semibold text-white mt-0.5 hover:text-amber-400 transition-colors">
                      <a href="mailto:narantsogt.ariix@gmail.com">narantsogt.ariix@gmail.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider">Хаяг</h4>
                    <p className="text-sm sm:text-base font-semibold text-white mt-0.5">
                      Улаанбаатар хот, Чингэлтэй дүүрэг, NatsoShop
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social handles */}
            <div className="mt-12 lg:mt-0 pt-8 border-t border-white/5">
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Нийгмийн сүлжээ</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-amber-400 hover:text-black hover:scale-105 active:scale-95 transition-all"
                  aria-label="Facebook"
                >
                  <MessageCircle size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-amber-400 hover:text-black hover:scale-105 active:scale-95 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#1c1c1c] rounded-2xl p-8 border border-white/5 relative">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Асуулт, захиалга үлдээх</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-white/70">Таны нэр <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Жишээ: Ану"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors w-full"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-semibold text-white/70">Утасны дугаар <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="Жишээ: 99119911"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-white/70">Имэйл хаяг</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Жишээ: client@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors w-full"
                  />
                </div>

                {/* Product Select */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="productType" className="text-xs font-semibold text-white/70">Бараа сонирхож буй ангилал</label>
                  <select
                    id="productType"
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors w-full appearance-none cursor-pointer"
                  >
                    <option value="shoes">Тренди Гутал</option>
                    <option value="clothes">Чанартай Өдөр Тутмын Хувцас</option>
                    <option value="toonhub">TOONHUB 3D фигурин</option>
                    <option value="other">Бусад</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-white/70">Нэмэлт мэдээлэл (Загвар, хэмжээ, хаяг г.м)</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Энд хүссэн хэмжээ, өнгө, тоо болон нэмэлт мэдээллээ бичнэ үү..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors w-full resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold py-3.5 px-6 rounded-xl text-sm hover:from-amber-400 hover:to-orange-400 transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Илгээж байна...</span>
                ) : (
                  <>
                    <span>Хүсэлт илгээх</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Success notification */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute inset-0 bg-[#1c1c1c] rounded-2xl flex flex-col items-center justify-center p-8 text-center z-20"
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 size={36} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Амжилттай хүлээн авлаа!</h3>
                  <p className="text-sm text-white/60 max-w-sm mb-6">
                    Таны захиалга / холбоо барих хүсэлтийг хүлээн авлаа. Манай менежер тун удахгүй тантай эргэн холбогдох болно. Баярлалаа!
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-white/10 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Хаах
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
