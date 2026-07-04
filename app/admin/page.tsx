'use client';

import { useState, useEffect } from 'react';
import { 
  db, 
  auth 
} from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  arrayUnion, 
  Timestamp 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  BarChart3, 
  ShoppingBag, 
  MessageSquare, 
  LogOut, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Calendar, 
  ChevronRight, 
  User as UserIcon, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Send,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Order and Contact Types
interface InternalNote {
  id: string;
  text: string;
  createdAt: any; // Firestore Timestamp
  author: string;
}

interface Order {
  id: string; // firestore doc id
  orderId: string; // "ORD-1234"
  customerName: string;
  email: string;
  phone: string;
  product: string;
  price: string;
  quantity: number;
  message: string;
  status: 'New' | 'In Progress' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: any;
  notes: InternalNote[];
}

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  productType: string;
  message: string;
  status: 'Unread' | 'Contacted' | 'Resolved' | 'Closed';
  createdAt: any;
  notes: InternalNote[];
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Firestore Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Navigation State: 'dashboard' | 'orders' | 'contacts'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'contacts'>('dashboard');

  // Search & Filter & Sort States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const [orderSort, setOrderSort] = useState<'date-desc' | 'date-asc'>('date-desc');

  const [contactSearch, setContactSearch] = useState('');
  const [contactFilter, setContactFilter] = useState<string>('All');
  const [contactSort, setContactSort] = useState<'date-desc' | 'date-asc'>('date-desc');

  // Details Modal States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);
  
  // Internal Note Input
  const [newNoteText, setNewNoteText] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  // Monitor Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Monitor Firestore collections in real-time
  useEffect(() => {
    if (!user) return;

    // 1. Subscribe to orders
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        ordersData.push({
          id: docSnap.id,
          orderId: data.orderId || 'ORD-UNKNOWN',
          customerName: data.customerName || '',
          email: data.email || '',
          phone: data.phone || '',
          product: data.product || '',
          price: data.price || '',
          quantity: data.quantity || 1,
          message: data.message || '',
          status: data.status || 'New',
          createdAt: data.createdAt,
          notes: data.notes || [],
        });
      });
      setOrders(ordersData);
    }, (err) => console.error('Error fetching orders:', err));

    // 2. Subscribe to contact requests
    const qContacts = query(collection(db, 'contact_requests'), orderBy('createdAt', 'desc'));
    const unsubscribeContacts = onSnapshot(qContacts, (snapshot) => {
      const contactsData: ContactRequest[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        contactsData.push({
          id: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          productType: data.productType || '',
          message: data.message || '',
          status: data.status || 'Unread',
          createdAt: data.createdAt,
          notes: data.notes || [],
        });
      });
      setContactRequests(contactsData);
      setDataLoading(false);
    }, (err) => console.error('Error fetching contacts:', err));

    return () => {
      unsubscribeOrders();
      unsubscribeContacts();
    };
  }, [user]);

  // Handle Admin Auth Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Имэйл болон нууц үгээ оруулна уу.');
      return;
    }

    setAuthError('');
    setAuthSubmitting(true);

    try {
      // Standard sign in
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.log('Login failed, checking if we can register the default credentials...', error.code);
      
      // Zero-configuration fallback: If they attempt logging in using the default credentials
      // and it fails, register them on the fly! This makes onboarding completely foolproof.
      if (email === 'admin@natso.mn' && password === 'adminpassword' && error.code === 'auth/user-not-found') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (createErr: any) {
          setAuthError('Системд админ хэрэглэгч үүсгэхэд алдаа гарлаа: ' + createErr.message);
        }
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setAuthError('Нууц үг буруу байна.');
      } else {
        setAuthError('Нэвтрэхэд алдаа гарлаа: ' + error.message);
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      console.error('Logout failed:', err);
    }
  };

  // Change Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, { status: newStatus });
      
      // Update selected modal view state
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Статус өөрчлөхөд алдаа гарлаа.');
    }
  };

  // Change Contact Request Status
  const handleUpdateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const contactDocRef = doc(db, 'contact_requests', contactId);
      await updateDoc(contactDocRef, { status: newStatus });

      // Update selected modal view state
      if (selectedContact && selectedContact.id === contactId) {
        setSelectedContact(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (err) {
      console.error('Error updating contact status:', err);
      alert('Статус өөрчлөхөд алдаа гарлаа.');
    }
  };

  // Add Internal Note to Order
  const handleAddOrderNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !newNoteText.trim()) return;

    setNoteSubmitting(true);
    try {
      const newNote: InternalNote = {
        id: 'note-' + Math.floor(10000 + Math.random() * 90000),
        text: newNoteText.trim(),
        createdAt: Timestamp.now(),
        author: user?.email || 'Админ'
      };

      const orderDocRef = doc(db, 'orders', selectedOrder.id);
      await updateDoc(orderDocRef, {
        notes: arrayUnion(newNote)
      });

      // Update local state in modal instantly
      setSelectedOrder(prev => prev ? {
        ...prev,
        notes: [...prev.notes, newNote]
      } : null);

      setNewNoteText('');
    } catch (err) {
      console.error('Error adding order note:', err);
      alert('Тэмдэглэл нэмэхэд алдаа гарлаа.');
    } finally {
      setNoteSubmitting(false);
    }
  };

  // Add Internal Note to Contact Request
  const handleAddContactNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !newNoteText.trim()) return;

    setNoteSubmitting(true);
    try {
      const newNote: InternalNote = {
        id: 'note-' + Math.floor(10000 + Math.random() * 90000),
        text: newNoteText.trim(),
        createdAt: Timestamp.now(),
        author: user?.email || 'Админ'
      };

      const contactDocRef = doc(db, 'contact_requests', selectedContact.id);
      await updateDoc(contactDocRef, {
        notes: arrayUnion(newNote)
      });

      // Update local state in modal instantly
      setSelectedContact(prev => prev ? {
        ...prev,
        notes: [...prev.notes, newNote]
      } : null);

      setNewNoteText('');
    } catch (err) {
      console.error('Error adding contact note:', err);
      alert('Тэмдэглэл нэмэхэд алдаа гарлаа.');
    } finally {
      setNoteSubmitting(false);
    }
  };

  // Helper: Format Dates nicely
  const formatDate = (firestoreTimestamp: any) => {
    if (!firestoreTimestamp) return 'Одоогоор байхгүй';
    const date = firestoreTimestamp.toDate ? firestoreTimestamp.toDate() : new Date(firestoreTimestamp);
    return date.toLocaleString('mn-MN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter & Search Orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.phone.includes(orderSearch) ||
      order.orderId.toLowerCase().includes(orderSearch.toLowerCase());
    
    const matchesStatus = orderFilter === 'All' || order.status === orderFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return orderSort === 'date-desc' ? timeB - timeA : timeA - timeB;
  });

  // Filter & Search Contacts
  const filteredContacts = contactRequests.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      contact.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
      contact.phone.includes(contactSearch) ||
      contact.message.toLowerCase().includes(contactSearch.toLowerCase());
    
    const matchesStatus = contactFilter === 'All' || contact.status === contactFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return contactSort === 'date-desc' ? timeB - timeA : timeA - timeB;
  });

  // Statistics calculation for Dashboard
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter(o => o.status === 'New').length;
  const openContactsCount = contactRequests.filter(c => c.status === 'Unread' || c.status === 'Contacted').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wide text-white/60">Түр хүлээнэ үү...</p>
        </div>
      </div>
    );
  }

  // Render Login page if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 text-white font-sans selection:bg-amber-400 selection:text-black relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-[#161616] border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
        >
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3.5 py-1.5 rounded-full inline-block">
              Хамгаалалттай хэсэг
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">Админ Систем</h1>
            <p className="text-xs sm:text-sm text-white/50 mt-2">
              Зөвхөн админ эрхтэй хэрэглэгчид нэвтрэх боломжтой
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Message */}
            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold text-white/75">Имэйл хаяг</label>
              <input
                type="email"
                id="login-email"
                required
                placeholder="admin@natso.mn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all w-full"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-xs font-semibold text-white/75">Нууц үг</label>
              <input
                type="password"
                id="login-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all w-full"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold py-3.5 px-6 rounded-xl text-sm hover:from-amber-400 hover:to-orange-400 transition-all duration-300 shadow-lg disabled:opacity-50 cursor-pointer mt-4"
            >
              {authSubmitting ? (
                <span>Шалгаж байна...</span>
              ) : (
                <span>Нэвтрэх</span>
              )}
            </button>
          </form>

          {/* Setup Help Badge */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Түр туршилтын хандалт</h4>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left">
              <p className="text-[11px] text-white/60 leading-relaxed">
                Туршиж үзэхийн тулд доорх хаягаар шууд нэвтрэх боломжтой (Систем автоматаар бүртгэж нэвтрүүлнэ):
              </p>
              <div className="mt-2 text-xs font-mono bg-black/40 p-2 rounded-lg border border-white/5 flex flex-col gap-0.5 select-all">
                <div><span className="text-amber-400">Имэйл:</span> admin@natso.mn</div>
                <div><span className="text-amber-400">Нууц үг:</span> adminpassword</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render Full Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans selection:bg-amber-400 selection:text-black">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-[#121212] border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-black font-extrabold text-sm">
              N
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest font-mono">
                Admin Panel
              </span>
              <h1 className="text-sm sm:text-base font-bold text-white leading-tight">Админ удирдлагын систем</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-white/50 hidden sm:inline-block font-mono bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Гарах</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs Header */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/10'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 size={16} />
            <span>Хянах Самбар</span>
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/10'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag size={16} />
            <span>Захиалгууд</span>
            {newOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono">
                {newOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'contacts'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/10'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare size={16} />
            <span>Холбоо Барих Хүсэлтүүд</span>
            {openContactsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono">
                {openContactsCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Body contents */}
        {dataLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs text-white/40">Мэдээллийг татаж байна...</p>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            
            {/* 1. DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Total Orders Card */}
                  <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/15 flex items-center justify-center text-amber-400">
                      <ShoppingBag size={22} />
                    </div>
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Нийт Захиалга</span>
                    <h3 className="text-3xl font-extrabold text-white mt-3 font-mono">{totalOrdersCount}</h3>
                    <p className="text-xs text-white/40 mt-2">Хэрэглэгчдийн үүсгэсэн нийт захиалгууд</p>
                  </div>

                  {/* New Orders Card */}
                  <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center text-orange-400">
                      <Clock size={22} />
                    </div>
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Шинэ Захиалга</span>
                    <h3 className="text-3xl font-extrabold text-orange-400 mt-3 font-mono">{newOrdersCount}</h3>
                    <p className="text-xs text-white/40 mt-2">Баталгаажуулах шаардлагатай захиалгууд</p>
                  </div>

                  {/* Open Contacts Card */}
                  <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-400">
                      <MessageSquare size={22} />
                    </div>
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Нээлттэй Хүсэлтүүд</span>
                    <h3 className="text-3xl font-extrabold text-emerald-400 mt-3 font-mono">{openContactsCount}</h3>
                    <p className="text-xs text-white/40 mt-2">Шийдвэрлэгдээгүй байгаа холбоо барих хүсэлтүүд</p>
                  </div>
                </div>

                {/* Recent Activities Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Orders List */}
                  <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ShoppingBag size={18} className="text-amber-400" />
                        Сүүлийн үеийн захиалгууд
                      </h3>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold text-amber-400 hover:underline transition-all cursor-pointer"
                      >
                        Бүгдийг харах
                      </button>
                    </div>

                    {orders.length === 0 ? (
                      <div className="py-12 text-center text-white/40 text-xs">Захиалга байхгүй байна.</div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {orders.slice(0, 5).map((order) => (
                          <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="py-3.5 flex items-center justify-between hover:bg-white/5 px-2.5 rounded-xl transition-all duration-200 cursor-pointer group"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                                  {order.orderId}
                                </span>
                                <span className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                                  {order.customerName}
                                </span>
                              </div>
                              <p className="text-xs text-white/45 font-mono">{order.product} • {order.quantity}ш • {order.price}</p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                                order.status === 'New' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' :
                                order.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                order.status === 'Confirmed' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {order.status}
                              </span>
                              <ChevronRight size={14} className="text-white/30 group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Contact Requests */}
                  <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MessageSquare size={18} className="text-emerald-400" />
                        Сүүлийн хүсэлтүүд
                      </h3>
                      <button 
                        onClick={() => setActiveTab('contacts')}
                        className="text-xs font-semibold text-emerald-400 hover:underline transition-all cursor-pointer"
                      >
                        Бүгдийг харах
                      </button>
                    </div>

                    {contactRequests.length === 0 ? (
                      <div className="py-12 text-center text-white/40 text-xs">Хүсэлт байхгүй байна.</div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {contactRequests.slice(0, 5).map((contact) => (
                          <div 
                            key={contact.id} 
                            onClick={() => setSelectedContact(contact)}
                            className="py-3.5 flex items-center justify-between hover:bg-white/5 px-2.5 rounded-xl transition-all duration-200 cursor-pointer group"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                  {contact.name}
                                </span>
                                <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                  {contact.productType === 'shoes' ? 'Trendy Shoes' : 
                                   contact.productType === 'clothes' ? 'Clothes' : 
                                   contact.productType === 'toonhub' ? 'TOONHUB 3D' : 'Other'}
                                </span>
                              </div>
                              <p className="text-xs text-white/50 max-w-sm truncate">{contact.message || 'Мессеж байхгүй'}</p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                                contact.status === 'Unread' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                contact.status === 'Contacted' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' :
                                contact.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                'bg-white/10 text-white/60 border border-white/20'
                              }`}>
                                {contact.status}
                              </span>
                              <ChevronRight size={14} className="text-white/30 group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                {/* Search & Filter Header */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#141414] border border-white/5 rounded-2xl p-4">
                  {/* Search bar */}
                  <div className="relative flex-grow max-w-md">
                    <Search className="absolute top-1/2 left-3.5 -translate-y-1/2 text-white/30" size={16} />
                    <input
                      type="text"
                      placeholder="Захиалгын №, Нэр, Имэйл, Утас хайх..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  {/* Filter & Sort Controls */}
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Status filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white/50">Статус:</span>
                      <select
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value)}
                        className="bg-[#1e1e1e] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs font-semibold focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                      >
                        <option value="All">Бүх статус</option>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Date sort */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white/50">Эрэмбэ:</span>
                      <button
                        onClick={() => setOrderSort(prev => prev === 'date-desc' ? 'date-asc' : 'date-desc')}
                        className="flex items-center gap-1.5 bg-[#1e1e1e] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <ArrowUpDown size={12} />
                        <span>{orderSort === 'date-desc' ? 'Шинэ нь эхэндээ' : 'Хуучин нь эхэндээ'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Orders Data Table */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                  {filteredOrders.length === 0 ? (
                    <div className="py-20 text-center">
                      <ShoppingBag size={32} className="text-white/20 mx-auto mb-4" />
                      <p className="text-sm text-white/50">Захиалга олдсонгүй.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-xs text-white/40 uppercase font-semibold tracking-wider bg-white/[0.01]">
                            <th className="px-6 py-4">Захиалгын №</th>
                            <th className="px-6 py-4">Харилцагчийн нэр</th>
                            <th className="px-6 py-4">Холбоо барих</th>
                            <th className="px-6 py-4">Захиалсан бүтээгдэхүүн</th>
                            <th className="px-6 py-4">Огноо</th>
                            <th className="px-6 py-4">Статус</th>
                            <th className="px-6 py-4 text-right">Үйлдэл</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                          {filteredOrders.map((order) => (
                            <tr 
                              key={order.id}
                              className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <td className="px-6 py-4">
                                <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/10">
                                  {order.orderId}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                                  {order.customerName}
                                </span>
                              </td>
                              <td className="px-6 py-4 space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-white/70">
                                  <Phone size={12} className="text-amber-400/70" />
                                  <span>{order.phone}</span>
                                </div>
                                {order.email && (
                                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                                    <Mail size={12} className="text-white/30" />
                                    <span className="truncate max-w-[150px]">{order.email}</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-medium text-white">{order.product}</div>
                                <div className="text-xs text-white/50 font-mono mt-0.5">{order.quantity} ширхэг • {order.price}</div>
                              </td>
                              <td className="px-6 py-4 text-xs font-mono text-white/50">
                                {formatDate(order.createdAt)}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                  order.status === 'New' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' :
                                  order.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                  order.status === 'Confirmed' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                  order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="text-xs font-semibold text-amber-400 bg-amber-400/5 border border-amber-400/15 px-3 py-1.5 rounded-xl hover:bg-amber-400 hover:text-black transition-all cursor-pointer"
                                >
                                  Харах
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. CONTACT REQUESTS TAB */}
            {activeTab === 'contacts' && (
              <div className="space-y-6">
                {/* Search & Filter Header */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#141414] border border-white/5 rounded-2xl p-4">
                  {/* Search bar */}
                  <div className="relative flex-grow max-w-md">
                    <Search className="absolute top-1/2 left-3.5 -translate-y-1/2 text-white/30" size={16} />
                    <input
                      type="text"
                      placeholder="Нэр, имэйл, утас, мессеж хайх..."
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  {/* Filter & Sort Controls */}
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Status filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white/50">Статус:</span>
                      <select
                        value={contactFilter}
                        onChange={(e) => setContactFilter(e.target.value)}
                        className="bg-[#1e1e1e] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs font-semibold focus:outline-none focus:border-emerald-400 appearance-none cursor-pointer"
                      >
                        <option value="All">Бүх статус</option>
                        <option value="Unread">Unread</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    {/* Date sort */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white/50">Эрэмбэ:</span>
                      <button
                        onClick={() => setContactSort(prev => prev === 'date-desc' ? 'date-asc' : 'date-desc')}
                        className="flex items-center gap-1.5 bg-[#1e1e1e] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <ArrowUpDown size={12} />
                        <span>{contactSort === 'date-desc' ? 'Шинэ нь эхэндээ' : 'Хуучин нь эхэндээ'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contacts Data Table */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                  {filteredContacts.length === 0 ? (
                    <div className="py-20 text-center">
                      <MessageSquare size={32} className="text-white/20 mx-auto mb-4" />
                      <p className="text-sm text-white/50">Холбоо барих хүсэлт олдсонгүй.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-xs text-white/40 uppercase font-semibold tracking-wider bg-white/[0.01]">
                            <th className="px-6 py-4">Харилцагч</th>
                            <th className="px-6 py-4">Утас, Имэйл</th>
                            <th className="px-6 py-4">Сонирхож буй ангилал</th>
                            <th className="px-6 py-4">Мессеж</th>
                            <th className="px-6 py-4">Илгээсэн Огноо</th>
                            <th className="px-6 py-4">Статус</th>
                            <th className="px-6 py-4 text-right">Үйлдэл</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                          {filteredContacts.map((contact) => (
                            <tr 
                              key={contact.id}
                              className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                              onClick={() => setSelectedContact(contact)}
                            >
                              <td className="px-6 py-4 font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                {contact.name}
                              </td>
                              <td className="px-6 py-4 space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-white/70">
                                  <Phone size={12} className="text-emerald-400/70" />
                                  <span>{contact.phone}</span>
                                </div>
                                {contact.email && (
                                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                                    <Mail size={12} className="text-white/30" />
                                    <span>{contact.email}</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-white/5 border border-white/10 text-white/80">
                                  {contact.productType === 'shoes' ? 'Тренди Гутал' : 
                                   contact.productType === 'clothes' ? 'Чанартай Өдөр Тутмын Хувцас' : 
                                   contact.productType === 'toonhub' ? 'TOONHUB 3D фигурин' : 'Бусад'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <p className="max-w-[200px] truncate text-white/70">{contact.message || '-'}</p>
                              </td>
                              <td className="px-6 py-4 text-xs font-mono text-white/50">
                                {formatDate(contact.createdAt)}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                  contact.status === 'Unread' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                  contact.status === 'Contacted' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' :
                                  contact.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  'bg-white/10 text-white/60 border border-white/20'
                                }`}>
                                  {contact.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => setSelectedContact(contact)}
                                  className="text-xs font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 px-3 py-1.5 rounded-xl hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
                                >
                                  Харах
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </div>

      {/* A. ORDER DETAIL POPUP MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedOrder(null);
                setNewNoteText('');
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Sidebar Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-lg h-full bg-[#141414] border-l border-white/10 shadow-2xl flex flex-col z-10 rounded-l-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#191919]">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/10">
                    {selectedOrder.orderId}
                  </span>
                  <h3 className="text-lg font-bold text-white">Захиалгын мэдээлэл</h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    setNewNoteText('');
                  }}
                  className="text-white/40 hover:text-white p-1.5 rounded-full bg-white/5 border border-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-grow overflow-y-auto p-6 space-y-8">
                {/* Status Selector Card */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Захиалгын статус өөрчлөх</h4>
                  <div className="flex flex-wrap gap-2">
                    {['New', 'In Progress', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          selectedOrder.status === st
                            ? st === 'New' ? 'bg-amber-400 text-black border-amber-400' :
                              st === 'In Progress' ? 'bg-blue-500 text-white border-blue-500' :
                              st === 'Confirmed' ? 'bg-purple-500 text-white border-purple-500' :
                              st === 'Completed' ? 'bg-emerald-500 text-white border-emerald-500' :
                              'bg-red-500 text-white border-red-500'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Details Block */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Харилцагчийн мэдээлэл</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-white/40 uppercase">Нэр</span>
                      <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <UserIcon size={14} className="text-amber-400" />
                        {selectedOrder.customerName}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-white/40 uppercase">Утасны дугаар</span>
                      <p className="text-sm font-semibold text-white flex items-center gap-1.5 font-mono">
                        <Phone size={14} className="text-amber-400" />
                        {selectedOrder.phone}
                      </p>
                    </div>
                    {selectedOrder.email && (
                      <div className="space-y-0.5 sm:col-span-2">
                        <span className="text-[10px] text-white/40 uppercase">Имэйл хаяг</span>
                        <p className="text-sm font-semibold text-white/80 flex items-center gap-1.5 font-mono">
                          <Mail size={14} className="text-amber-400" />
                          {selectedOrder.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details Block */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Бүтээгдэхүүний сонголт</h4>
                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                      <span className="text-sm font-semibold text-white">{selectedOrder.product}</span>
                      <span className="text-xs font-mono font-bold text-amber-400">{selectedOrder.price}</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Тоо ширхэг:</span>
                      <span className="font-mono font-bold text-white">{selectedOrder.quantity} ширхэг</span>
                    </div>
                    <div className="text-xs text-white/60">
                      <span className="block text-white/40 mb-1">Захиалгын нэмэлт тэмдэглэл:</span>
                      <p className="bg-black/30 border border-white/5 rounded-xl p-2.5 text-white italic">
                        {selectedOrder.message || 'Тэмдэглэл үлдээгээгүй байна.'}
                      </p>
                    </div>
                    <div className="text-[10px] text-white/40 pt-1 font-mono">
                      Үүсгэсэн огноо: {formatDate(selectedOrder.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Internal Admin Notes History & Input */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} className="text-amber-400" />
                    Дотоод тэмдэглэлүүд (Internal Notes)
                  </h4>
                  
                  {/* Notes List */}
                  <div className="space-y-3">
                    {selectedOrder.notes.length === 0 ? (
                      <p className="text-xs text-white/40 italic py-2 text-center bg-white/[0.01] rounded-xl border border-white/5">Одоогоор дотоод тэмдэглэл байхгүй байна.</p>
                    ) : (
                      selectedOrder.notes.map((nt) => (
                        <div key={nt.id} className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-white/40">
                            <span className="font-semibold text-amber-400">{nt.author}</span>
                            <span className="font-mono">{formatDate(nt.createdAt)}</span>
                          </div>
                          <p className="text-xs text-white/90 leading-relaxed">{nt.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddOrderNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Админ тэмдэглэл бичих..."
                      required
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-grow bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={noteSubmitting || !newNoteText.trim()}
                      className="bg-amber-400 text-black px-3 rounded-xl hover:bg-amber-300 disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* B. CONTACT REQUEST DETAIL POPUP MODAL */}
      <AnimatePresence>
        {selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedContact(null);
                setNewNoteText('');
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Sidebar Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-lg h-full bg-[#141414] border-l border-white/10 shadow-2xl flex flex-col z-10 rounded-l-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#191919]">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest font-mono">
                    Contact Request
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">Хүсэлтийн мэдээлэл</h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedContact(null);
                    setNewNoteText('');
                  }}
                  className="text-white/40 hover:text-white p-1.5 rounded-full bg-white/5 border border-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-grow overflow-y-auto p-6 space-y-8">
                {/* Status Selector Card */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Шийдвэрлэлтийн статус</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Unread', 'Contacted', 'Resolved', 'Closed'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateContactStatus(selectedContact.id, st)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          selectedContact.status === st
                            ? st === 'Unread' ? 'bg-red-500 text-white border-red-500' :
                              st === 'Contacted' ? 'bg-amber-400 text-black border-amber-400' :
                              st === 'Resolved' ? 'bg-emerald-500 text-white border-emerald-500' :
                              'bg-white/40 text-black border-white'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Customer Block */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Илгээгчийн мэдээлэл</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-white/40 uppercase">Нэр</span>
                      <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <UserIcon size={14} className="text-emerald-400" />
                        {selectedContact.name}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-white/40 uppercase">Утасны дугаар</span>
                      <p className="text-sm font-semibold text-white flex items-center gap-1.5 font-mono">
                        <Phone size={14} className="text-emerald-400" />
                        {selectedContact.phone}
                      </p>
                    </div>
                    {selectedContact.email && (
                      <div className="space-y-0.5 sm:col-span-2">
                        <span className="text-[10px] text-white/40 uppercase">Имэйл хаяг</span>
                        <p className="text-sm font-semibold text-white/80 flex items-center gap-1.5 font-mono">
                          <Mail size={14} className="text-emerald-400" />
                          {selectedContact.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Body Block */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Хүсэлт, Мессеж</h4>
                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/50">Ангилал:</span>
                      <span className="font-semibold text-emerald-400">
                        {selectedContact.productType === 'shoes' ? 'Trendy Shoes' : 
                         selectedContact.productType === 'clothes' ? 'Clothes' : 
                         selectedContact.productType === 'toonhub' ? 'TOONHUB 3D' : 'Other'}
                      </span>
                    </div>
                    <div className="text-sm text-white/90 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 whitespace-pre-wrap">
                      {selectedContact.message || 'Мессеж бичээгүй байна.'}
                    </div>
                    <div className="text-[10px] text-white/40 font-mono">
                      Хүлээн авсан огноо: {formatDate(selectedContact.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Internal Admin Notes History & Input */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} className="text-emerald-400" />
                    Дотоод тэмдэглэлүүд (Internal Notes)
                  </h4>

                  {/* Notes List */}
                  <div className="space-y-3">
                    {selectedContact.notes.length === 0 ? (
                      <p className="text-xs text-white/40 italic py-2 text-center bg-white/[0.01] rounded-xl border border-white/5">Одоогоор дотоод тэмдэглэл байхгүй байна.</p>
                    ) : (
                      selectedContact.notes.map((nt) => (
                        <div key={nt.id} className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-white/40">
                            <span className="font-semibold text-emerald-400">{nt.author}</span>
                            <span className="font-mono">{formatDate(nt.createdAt)}</span>
                          </div>
                          <p className="text-xs text-white/90 leading-relaxed">{nt.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddContactNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Админ тэмдэглэл бичих..."
                      required
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-grow bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={noteSubmitting || !newNoteText.trim()}
                      className="bg-emerald-400 text-black px-3 rounded-xl hover:bg-emerald-300 disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
