'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Shirt, Flame, Box, ArrowUpRight, MessageSquareCode, Smile, Footprints, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jeepTshirt from '@/src/assets/images/jeep_tshirt_1782872715581.jpg';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Products() {
  const products = [
    {
      id: 'p1',
      title: 'Уулын Гутал',
      category: 'Аяллын Гутал',
      brands: ['Jeep®'],
      description: 'Бат бөх, хальтрахгүй тусгай ултай, усны хамгаалалттай уулын гутал. Алхалт болон хүнд хэцүү замын аялалд таны хөлийг дээд зэргээр хамгаална.',
      icon: Footprints,
      iconColor: 'text-amber-500 bg-amber-500/10',
      image: 'https://picsum.photos/seed/mountain_boots/600/450',
      price: '145,000₮ - 195,000₮',
      features: ['Ус, чийг үл нэвтрүүлэх даавуу', 'Хальтрахгүй резинэн улны технологи', 'Шагай дэмжих зөөлөн хамгаалалт']
    },
    {
      id: 'p2',
      title: 'Спорт Гутал, Пүүз',
      category: 'Спортын Цуглуулга',
      brands: ['Nike', 'Li-Ning', 'Jordan', 'Reebok'],
      description: 'Өдөр тутамд өмсөхөд маш хөнгөн, агаар чөлөөтэй нэвтрүүлдэг спорт загварын пүүзнүүд. Гүйлт болон фитнесст төгс тохирно.',
      icon: Flame,
      iconColor: 'text-orange-500 bg-orange-500/10',
      image: 'https://picsum.photos/seed/sport_shoes/600/450',
      price: '85,000₮ - 135,000₮',
      features: ['Хэт хөнгөн уллах технологи', 'Сунамтгай, уян хатан материал', 'Орчин үеийн тренди өнгөний сонголт']
    },
    {
      id: 'p3',
      title: 'Хүүхдийн Гутал, Пүүз',
      category: 'Хүүхдийн Сонголт',
      brands: ['Disney', 'Adidas kids'],
      description: 'Хүүхдийн хөлд эвтэйхэн, зөөлөн, хөнгөн бөгөөд эрүүл ахуйн шаардлага хангасан материалтай. Сургууль, цэцэрлэг болон тоглоомын талбайд өмсөхөд хамгийн тохиромжтой.',
      icon: Smile,
      iconColor: 'text-emerald-500 bg-emerald-500/10',
      image: 'https://picsum.photos/seed/kids_shoes/600/450',
      price: '55,000₮ - 85,000₮',
      features: ['Хөл хэлбэржүүлэх зөөлөн улавч', 'Хялбар өмсөх наалттай загвар', 'Үрэлтэд тэсвэртэй бат бөх материал']
    },
    {
      id: 'p4',
      title: 'Өмд, Цамц',
      category: 'Өдөр Тутмын Хувцас',
      brands: ['Zara', 'Champion'],
      description: 'Биед маш эвтэйхэн, дулаахан өндөр чанартай даавуун материалтай өмд цамцны хослол болон тусдаа загварууд. Тренди загварыг хамгийн хямдаар.',
      icon: Shirt,
      iconColor: 'text-purple-500 bg-purple-500/10',
      image: jeepTshirt,
      price: '45,000₮ - 115,000₮',
      features: ['100% Хөвөн даавуу (cotton)', 'Угаахад бөөгнөрөхгүй, сунахгүй', 'Өнгө алдахгүй, чанарын баталгаа']
    },
    {
      id: 'p5',
      title: 'TOONHUB 3D Фигурин',
      category: 'Онцлох Цуглуулга',
      brands: ['TOONHUB'],
      description: 'Ирээдүйн 3D технологиор урласан, хязгаарлагдмал тоотой өхөөрдөм бөгөөд чамин дүрүүд. Гэр, оффисын ширээ чимэх шилдэг сонголт.',
      icon: Box,
      iconColor: 'text-blue-500 bg-blue-500/10',
      image: 'https://picsum.photos/seed/toonhub_collection/600/450',
      price: '120,000₮ - 180,000₮',
      features: ['Өндөр чанартай 3D хэвлэл', 'Гараар будаж гүйцэтгэсэн', 'Коллекционеруудын сонголт']
    }
  ];

  type ProductType = typeof products[0];

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [orderForm, setOrderForm] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: '1',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (!orderForm.name || !orderForm.phone) {
      alert('Нэр болон утасны дугаараа заавал бөглөнө үү.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a clean random order number (e.g. ORD-4821)
      const orderNum = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

      await addDoc(collection(db, 'orders'), {
        orderId: orderNum,
        customerName: orderForm.name,
        email: orderForm.email,
        phone: orderForm.phone,
        product: selectedProduct.title,
        price: selectedProduct.price,
        quantity: parseInt(orderForm.quantity) || 1,
        message: orderForm.message,
        status: 'New',
        createdAt: serverTimestamp(),
        notes: []
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setOrderForm({
        name: '',
        email: '',
        phone: '',
        quantity: '1',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Алдаа гарлаа. Дахин оролдоно уу.');
      setIsSubmitting(false);
      handleFirestoreError(error, OperationType.WRITE, 'orders');
    }
  };

  return (
    <section id="products" className="py-24 bg-[#121212] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1.5 rounded-full">
            Бидний санал болгох
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-4 mb-6">
            Хамгийн Онцлох Багцууд
          </h2>
          <p className="text-base sm:text-lg text-white/60 leading-relaxed">
            Хямд бөгөөд чанартай бараа бүтээгдэхүүнийг танд санал болгож байна. Доорх гол цуглуулгуудаас сонгож өөрийн хэв маягийг илэрхийлээрэй.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => {
            const IconComponent = product.icon;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-[#1c1c1c] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-950/5 group flex flex-col h-full"
              >
                {/* Image Wrap */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 text-xs font-semibold text-black bg-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {product.category}
                  </span>

                  {/* Icon */}
                  <div className={`absolute bottom-4 right-4 p-2.5 rounded-full ${product.iconColor} border border-white/10 backdrop-blur-md`}>
                    <IconComponent size={20} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-baseline mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {product.title}
                    </h3>
                    <span className="text-sm font-semibold text-amber-400 font-mono shrink-0">
                      {product.price}
                    </span>
                  </div>

                  {/* Brand Logos / Micro Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="text-[10px] text-white/40 uppercase font-semibold mr-1">Брэндүүд:</span>
                    {product.brands.map((brand) => (
                      <span
                        key={brand}
                        className="text-[10px] font-bold bg-white/5 border border-white/10 text-amber-400 px-2 py-0.5 rounded uppercase tracking-wider"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Bullet points inside card */}
                  <ul className="space-y-2 mb-8 border-t border-white/5 pt-4 flex-grow">
                    {product.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-white/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsSuccess(false);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white text-white hover:text-black py-3 rounded-xl font-semibold text-sm transition-all duration-300 group/btn border border-white/10 hover:border-white cursor-pointer"
                  >
                    <span>Одоо захиалах</span>
                    <ArrowUpRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic callout to TOONHUB */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-400/20 rounded-xl text-amber-400 shrink-0">
              <MessageSquareCode size={28} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Та өөрийн гэсэн загвараар захиалмаар байна уу?</h3>
              <p className="text-xs sm:text-sm text-white/60 mt-1">Хүссэн өнгө, хэмжээ, загвараар 3D TOONHUB фигурин болон тусгай гутал хувцсаа захиалан аваарай.</p>
            </div>
          </div>
          <a
            href="#contact"
            className="whitespace-nowrap bg-amber-400 text-black px-6 py-3 rounded-xl font-semibold text-sm hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Холбоо барих
          </a>
        </motion.div>
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden p-6 sm:p-8 z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded-full bg-white/5 border border-white/10 transition-colors"
              >
                <X size={18} />
              </button>

              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Захиалга амжилттай үүслээ!</h3>
                  <p className="text-sm text-white/60 max-w-sm mx-auto mb-6">
                    Таны <strong>{selectedProduct.title}</strong>-ийн захиалгыг хүлээн авлаа. Бид захиалгын дугаарын дагуу тун удахгүй тантай эргэн холбогдож баталгаажуулна.
                  </p>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="bg-amber-400 text-black text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-amber-300 transition-colors"
                  >
                    Хаах
                  </button>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-5">
                  <div>
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded-full inline-block mb-2">
                      Шууд захиалах
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {selectedProduct.title}
                    </h3>
                    <p className="text-sm text-white/50 mt-1">Үнэ: <span className="text-amber-400 font-mono font-semibold">{selectedProduct.price}</span></p>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="order-name" className="text-xs font-semibold text-white/70">Таны нэр <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="order-name"
                        name="name"
                        required
                        placeholder="Жишээ: Ану"
                        value={orderForm.name}
                        onChange={handleInputChange}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="order-phone" className="text-xs font-semibold text-white/70">Утасны дугаар <span className="text-red-500">*</span></label>
                        <input
                          type="tel"
                          id="order-phone"
                          name="phone"
                          required
                          placeholder="Жишээ: 99119911"
                          value={orderForm.phone}
                          onChange={handleInputChange}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors w-full"
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="order-email" className="text-xs font-semibold text-white/70">Имэйл хаяг</label>
                        <input
                          type="email"
                          id="order-email"
                          name="email"
                          placeholder="Жишээ: client@example.com"
                          value={orderForm.email}
                          onChange={handleInputChange}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Quantity */}
                      <div className="sm:col-span-1 flex flex-col gap-1.5">
                        <label htmlFor="order-quantity" className="text-xs font-semibold text-white/70">Тоо ширхэг</label>
                        <input
                          type="number"
                          id="order-quantity"
                          name="quantity"
                          min="1"
                          required
                          value={orderForm.quantity}
                          onChange={handleInputChange}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors w-full text-center"
                        />
                      </div>

                      {/* Additional detail */}
                      <div className="sm:col-span-2 flex flex-col gap-1.5">
                        <label htmlFor="order-message" className="text-xs font-semibold text-white/70">Нэмэлт тэмдэглэл (Хэмжээ, өнгө гэх мэт)</label>
                        <input
                          type="text"
                          id="order-message"
                          name="message"
                          placeholder="Жишээ: Размер L, Хар өнгө"
                          value={orderForm.message}
                          onChange={handleInputChange}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold py-3 px-6 rounded-xl text-sm hover:from-amber-400 hover:to-orange-400 transition-all duration-300 shadow-lg disabled:opacity-50 cursor-pointer mt-2"
                  >
                    {isSubmitting ? (
                      <span>Илгээж байна...</span>
                    ) : (
                      <span>Захиалга өгөх</span>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
