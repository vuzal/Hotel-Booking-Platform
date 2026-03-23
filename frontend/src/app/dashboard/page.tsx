'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar, Settings, Heart, MessageSquare, LogOut, BookOpen,
  Download, X, ChevronRight, Star, Edit, QrCode, Check, Clock,
  Building, Trash2, Loader2, HeartOff, MapPin, ShieldCheck, User as UserIcon, ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useSearchParams } from 'next/navigation';


const NAV_ITEMS = [
  { id: 'bookings', label: 'Rezervasiyalar', icon: BookOpen },
  { id: 'saved', label: 'Saxlanılanlar', icon: Heart },
  { id: 'reviews', label: 'Rəylərim', icon: MessageSquare },
  { id: 'settings', label: 'Profil Ayarları', icon: Settings },
];

const STATUS_THEME = {
  confirmed: { label: 'Təsdiqləndi', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <Check size={12} strokeWidth={3} /> },
  completed: { label: 'Tamamlandı', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Check size={12} strokeWidth={3} /> },
  cancelled: { label: 'Ləğv edildi', color: 'bg-red-50 text-red-600 border-red-100', icon: <X size={12} strokeWidth={3} /> },
};

function BookingCard({ booking, onCancel }: { booking: any; onCancel: (id: string) => void }) {
  const [showQr, setShowQr] = useState(false);
  const status = STATUS_THEME[booking.status as keyof typeof STATUS_THEME] || STATUS_THEME.confirmed;
  const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945";

  return (
    <div className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-56 h-48 md:h-auto overflow-hidden">
          <img
            src={booking.hotelImage || defaultImage}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={booking.hotelName}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <Badge className={`absolute top-4 left-4 border backdrop-blur-md shadow-sm ${status.color}`}>
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
              {status.icon} {status.label}
            </span>
          </Badge>
        </div>

        {/* Info Section */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">{booking.reference}</p>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-[#FF6B35] transition-colors line-clamp-1">{booking.hotelName}</h3>
              <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                <Building size={14} className="text-[#1E3A5F]" /> {booking.roomName}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Giriş</span>
                  <span className="text-sm font-bold text-slate-700">{new Date(booking.checkIn).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="w-8 h-px bg-slate-100 hidden sm:block" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Çıxış</span>
                  <span className="text-sm font-bold text-slate-700">{new Date(booking.checkOut).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center min-w-[120px]">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Toplam</p>
              <p className="text-2xl font-black text-[#1E3A5F]">{booking.totalPrice} <span className="text-xs italic">AZN</span></p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-slate-50">
            <Link href={`/hotel/${booking.hotelId}`}>
              <Button variant="outline" className="rounded-xl h-10 px-6 font-bold text-xs border-slate-200 hover:bg-slate-50">
                Detallar <ExternalLink size={14} className="ml-2" />
              </Button>
            </Link>

            {booking.status === 'confirmed' && (
              <Button
                variant="outline"
                className="rounded-xl h-10 px-6 font-bold text-xs text-red-500 border-red-100 hover:bg-red-50"
                onClick={() => onCancel(booking.id)}
              >
                Ləğv et
              </Button>
            )}

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <Button variant="ghost" className="rounded-xl h-10 w-10 p-0 text-slate-400 hover:text-[#1E3A5F]" onClick={() => setShowQr(!showQr)}>
                <QrCode size={20} />
              </Button>
              <Button variant="ghost" className="rounded-xl h-10 w-10 p-0 text-slate-400 hover:text-[#1E3A5F]">
                <Download size={20} />
              </Button>
            </div>
          </div>

          {showQr && (
            <div className="mt-6 p-6 bg-[#1E3A5F] rounded-3xl flex items-center gap-6 animate-in zoom-in-95 duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="bg-white p-2 rounded-2xl shadow-xl">
                <div className="w-20 h-20 grid grid-cols-5 gap-1">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-[#1E3A5F]' : 'bg-slate-100'}`} />
                  ))}
                </div>
              </div>
              <div className="text-white">
                <p className="text-xs font-black uppercase tracking-[2px] mb-1">Digital Check-in</p>
                <p className="text-[11px] text-white/60 leading-relaxed max-w-[200px]">Bu QR kodu oteldə qeydiyyat zamanı təqdim edin.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [savedHotels, setSavedHotels] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab'); // URL-dən "saved" sözünü çəkirik

  // Əgər URL-də tab varsa onu aç, yoxdursa standart "bookings" aç
  const [activeNav, setActiveNav] = useState(tabFromUrl || 'bookings');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await apiFetch('/api/users/me');
        if (profileRes.ok) {
          const userData = await profileRes.json();
          setUser(userData);
          setEditForm({ firstName: userData.firstName, lastName: userData.lastName, phone: userData.phone || '' });
        } else {
          router.push('/');
          return;
        }

        const bookingsRes = await apiFetch('/api/reservations/my');
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          // Ekrana çapetmə: Backend sənə əslində nə göndərir? (Konsolda baxmaq üçün)
          console.log("Backend-dən gələn Rezervasiya Dataları:", bookingsData);
          setBookings(bookingsData.map((b: any) => ({
            id: b.id.toString(),
            // 🔥 DƏYİŞDİRİLƏN YER: Bütün mümkün ehtimalları (DTO variantlarını) yoxlayırıq!
            hotelId: (b.hotelId || b.hotel?.id || b.room?.hotelId || b.room?.hotel?.id)?.toString(),
            hotelName: b.hotelName || "Lüks Otel",
            hotelImage: b.hotelMainImageUrl,
            roomName: b.roomName || "Standart Otaq",
            reference: `AZB-${1000 + b.id}`,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            totalPrice: b.totalPrice,
            status: b.status?.toLowerCase() || 'confirmed'
          })));
        }
      } catch (error) { toast.error('Yüklnəmə xətası'); }
      finally { setIsLoadingUser(false); }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };
  // --- REZERVASIYANI LƏĞV ETMƏ FUNKSİYASI ---
  const handleCancel = async (id: string) => {
    // İstifadəçidən təsdiq istəyirik
    const confirmCancel = window.confirm("Bu rezervasiyanı ləğv etmək istədiyinizə əminsiniz?");
    if (!confirmCancel) return;

    try {
      const res = await apiFetch(`/api/reservations/${id}/cancel`, {
        method: 'PATCH',
      });

      if (res.ok) {
        // Local state-də statusu dərhal 'cancelled' edirik ki, UI yenilənsin
        setBookings(prev =>
          prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)
        );
        toast.success('Rezervasiya uğurla ləğv edildi');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Ləğv edilərkən xəta baş verdi');
      }
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error('Bağlantı xətası baş verdi');
    }
  };
  // --- SAXLANILANLARI ÇƏKMƏK ---
  useEffect(() => {
    if (activeNav === 'saved') {
      const fetchSaved = async () => {
        try {
          const res = await apiFetch('/api/favorites');
          if (res.ok) setSavedHotels(await res.json());
        } catch (err) { toast.error("Saxlanılanlar yüklənmədi"); }
      };
      fetchSaved();
    }
  }, [activeNav]);

  // --- RƏYLƏRİ ÇƏKMƏK ---
  useEffect(() => {
    if (activeNav === 'reviews') {
      const fetchReviews = async () => {
        try {
          const res = await apiFetch('/api/reviews/my');
          if (res.ok) setMyReviews(await res.json());
        } catch (err) { toast.error("Rəylər yüklənmədi"); }
      };
      fetchReviews();
    }
  }, [activeNav]);

  // --- RƏY SİLMƏK ---
  const handleDeleteReview = async (id: number) => {
    if (!window.confirm("Rəyi silmək istəyirsiniz?")) return;
    try {
      const res = await apiFetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMyReviews(prev => prev.filter(r => r.id !== id));
        toast.success("Rəyiniz silindi");
      }
    } catch (err) { toast.error("Xəta baş verdi"); }
  };

  // --- PROFİLİ YENİLƏMƏ FUNKSİYASI ---
  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const res = await apiFetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          phone: editForm.phone
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser); // Ekranda dərhal ad/soyad yenilənsin
        toast.success("Məlumatlarınız uğurla yeniləndi! ✨");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Yenilənmə zamanı xəta baş verdi");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      toast.error("Bağlantı xətası");
    } finally {
      setIsUpdating(false);
    }
  };

  // Saxlanılan oteli siyahıdan çıxarmaq üçün funksiya
  const handleRemoveFavorite = async (e: React.MouseEvent, targetHotelId: number) => {
    e.preventDefault();
    e.stopPropagation(); // 🔥 1. Kliklənəndə arxadakı karta keçməsinin qarşısını alırıq!

    try {
      // 🔥 DÜZƏLİŞ: Geri POST-a qaytardıq, çünki sənin Backend-in "Toggle" (əlavə et/sil) məntiqiylə işləyir!
      const res = await apiFetch(`/api/favorites/${targetHotelId}`, {
        method: 'POST',
      });

      if (res.ok) {
        setSavedHotels((prev) =>
          prev.filter((fav) => {
            const currentId = fav.hotelId || (fav.hotel && fav.hotel.id) || fav.id;
            return currentId !== targetHotelId;
          })
        );
        toast.success("Siyahıdan çıxarıldı");
      } else {
        toast.error("Xəta baş verdi, silinmədi.");
      }
    } catch (err) {
      console.error("Unsave error:", err);
      toast.error("Bağlantı xətası");
    }
  };

  if (isLoadingUser) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Yüklənir...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFE]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">

        {/* Welcome Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <Badge className="bg-orange-50 text-orange-600 border-orange-100 font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full">
              Üzv Paneli
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic">
              Xoş gəldin, <span className="text-[#1E3A5F]">{user?.firstName}!</span>
            </h1>
            <p className="text-slate-400 font-medium italic">Səyahət tarixçəniz və şəxsi ayarlarınız burada toplanıb.</p>
          </div>
          <div className="flex gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</p>
              <p className="text-sm font-black text-[#1E3A5F] flex items-center gap-2">
                Premium Üzv <ShieldCheck size={16} className="text-orange-500" />
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <Avatar className="w-24 h-24 border-4 border-white shadow-2xl">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`} alt="User" />
                  <AvatarFallback className="bg-[#1E3A5F] text-white text-2xl font-black">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-xs font-bold text-slate-400 mt-1">{user?.email}</p>
                </div>
              </div>

              <div className="mt-10 space-y-2 relative z-10">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeNav === item.id
                      ? 'bg-[#1E3A5F] text-white shadow-xl shadow-blue-900/20'
                      : 'text-slate-400 hover:bg-slate-50'
                      }`}
                  >
                    <item.icon size={18} className={activeNav === item.id ? 'text-orange-500' : ''} />
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-slate-50">
                  <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-50 transition-all">
                    <LogOut size={18} /> Çıxış
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#1E3A5F] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10"><MapPin size={80} /></div>
              <h4 className="font-black text-lg mb-2 relative z-10">Növbəti Macəra?</h4>
              <p className="text-xs text-white/60 leading-relaxed mb-6 relative z-10 font-medium">Yeni otellər və eksklüziv endirimlər sizi gözləyir.</p>
              <Link href="/search">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 rounded-xl font-black text-[10px] uppercase tracking-widest h-12">Kəşf et</Button>
              </Link>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1">
            {activeNav === 'bookings' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Tabs defaultValue="upcoming" className="w-full">
                  <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl h-14 mb-8">
                    <TabsTrigger value="upcoming" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest">
                      Qarşıdan gələn ({bookings.filter(b => b.status === 'confirmed').length})
                    </TabsTrigger>
                    <TabsTrigger value="past" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest">
                      Keçmiş ({bookings.filter(b => b.status === 'completed').length})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest">
                      Ləğv edilmiş ({bookings.filter(b => b.status === 'cancelled').length})
                    </TabsTrigger>
                  </TabsList>

                  {/* 1. QARŞIDAN GƏLƏN REZERVASIYALAR */}
                  <TabsContent value="upcoming" className="space-y-6 animate-in fade-in duration-500">
                    {bookings.filter(b => b.status === 'confirmed').length > 0 ? (
                      bookings.filter(b => b.status === 'confirmed').map(b => (
                        <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4">
                          <Calendar size={32} />
                        </div>
                        <p className="text-slate-400 font-bold italic">Aktiv rezervasiyanız yoxdur.</p>
                        <Link href="/search">
                          <Button variant="link" className="text-orange-500 font-black text-xs uppercase tracking-widest mt-2">İndi axtarışa başla</Button>
                        </Link>
                      </div>
                    )}
                  </TabsContent>

                  {/* 2. KEÇMİŞ REZERVASIYALAR */}
                  <TabsContent value="past" className="space-y-6 animate-in fade-in duration-500">
                    {bookings.filter(b => b.status === 'completed').length > 0 ? (
                      bookings.filter(b => b.status === 'completed').map(b => (
                        <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4">
                          <Check size={32} />
                        </div>
                        <p className="text-slate-400 font-bold italic">Heç bir keçmiş səyahətiniz tapılmadı.</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* 3. LƏĞV EDİLMİŞ REZERVASIYALAR */}
                  <TabsContent value="cancelled" className="space-y-6 animate-in fade-in duration-500">
                    {bookings.filter(b => b.status === 'cancelled').length > 0 ? (
                      bookings.filter(b => b.status === 'cancelled').map(b => (
                        <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4">
                          <X size={32} />
                        </div>
                        <p className="text-slate-400 font-bold italic">Ləğv edilmiş rezervasiyanız yoxdur.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeNav === 'settings' && (
              <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-50">
                  <div className="p-4 bg-orange-50 rounded-[20px] text-orange-500"><UserIcon size={32} /></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Profil Məlumatları</h3>
                    <p className="text-sm font-medium text-slate-400 italic">Məlumatlarınızı güncəl saxlayın.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adınız</label>
                    <input
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl h-14 px-6 font-bold text-slate-700 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Soyadınız</label>
                    <input
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl h-14 px-6 font-bold text-slate-700 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefon</label>
                    <input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl h-14 px-6 font-bold text-slate-700 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">E-poçt (Dəyişdirilə bilməz)</label>
                    <input value={user?.email} disabled className="w-full bg-slate-100 border-none rounded-2xl h-14 px-6 font-bold text-slate-400 cursor-not-allowed outline-none" />
                  </div>
                </div>

                <Button
                  onClick={handleUpdateProfile} // <-- FUNKSİYANI BURA BAĞLADIQ
                  disabled={isUpdating}         // <-- Yüklənərkən düyməni dondururuq
                  className="mt-12 bg-[#1E3A5F] hover:bg-orange-500 text-white rounded-2xl h-14 px-10 font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 transition-all flex items-center justify-center"
                >
                  {isUpdating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" /> Yenilənir...
                    </span>
                  ) : (
                    "Dəyişiklikləri Saxla"
                  )}
                </Button>
              </div>
            )}
            {/* 3. SAXLANILAN OTELLƏR */}
            {activeNav === 'saved' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Yadda saxladığım <span className="text-orange-500">Məkanlar</span></h2>
                  <Badge className="bg-slate-100 text-slate-500 font-black">{savedHotels.length} Otel</Badge>
                </div>

                {savedHotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedHotels.map((fav) => {
                      // 🔥 ƏN VACİB YER: Əsl Otel ID-sini və məlumatları dəqiq çəkirik!
                      const realHotelId = fav.hotelId || fav.hotel?.id;
                      const hotelName = fav.hotelName || fav.hotel?.name || "Otel";
                      const city = fav.city || fav.hotel?.city || "";
                      const basePrice = fav.basePrice || fav.hotel?.basePrice || 0;
                      const imageUrl = fav.mainImageUrl || fav.hotel?.mainImageUrl || fav.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945';

                      return (
                        <div key={fav.id} className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={hotelName}
                              className="w-full h-full object-cover"
                            />
                            <button
                              // 🔥 DÜZƏLİŞ 1: Artıq fav.id yox, realHotelId gedir!
                              onClick={(e) => handleRemoveFavorite(e, realHotelId)}
                              className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all z-10"
                            >
                              <HeartOff size={18} />
                            </button>
                          </div>
                          <div className="p-6">
                            <h3 className="font-black text-slate-900 text-lg line-clamp-1 mb-1">{hotelName}</h3>
                            <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-4 uppercase tracking-wider">
                              <MapPin size={12} className="text-orange-500" /> {city}
                            </p>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                              <div>
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Başlayan qiymət</p>
                                <p className="text-xl font-black text-[#1E3A5F]">{basePrice} <span className="text-xs italic">AZN</span></p>
                              </div>
                              {/* 🔥 DÜZƏLİŞ 2: Artıq səhv otelə yox, əsl Otel ID-sinə gedir! */}
                              <Link href={`/hotel/${realHotelId}`}>
                                <Button size="sm" className="bg-[#1E3A5F] hover:bg-orange-500 rounded-xl px-6 h-10 font-black text-[10px] uppercase tracking-widest">Bax</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                    <Heart size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-slate-400 font-bold italic">Hələ heç bir oteli bəyənməmisiniz.</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. RƏYLƏRİM BÖLMƏSİ */}
            {activeNav === 'reviews' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Paylaşdığım <span className="text-orange-500">Təcrübələr</span></h2>

                {myReviews.length > 0 ? (
                  <div className="space-y-4">
                    {myReviews.map((rev) => (
                      <div key={rev.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                <Building size={20} />
                              </div>
                              <div>
                                <h4 className="font-black text-slate-900 text-lg leading-none">{rev.hotelName || "Otel Adı"}</h4>
                                <div className="flex gap-0.5 mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={10} className={i < rev.rating ? "fill-orange-400 text-orange-400" : "text-slate-100"} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed italic border-l-4 border-slate-100 pl-4 py-1">
                              "{rev.comment}"
                            </p>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">
                              {new Date(rev.createdAt).toLocaleDateString('az-AZ')}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                    <MessageSquare size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-slate-400 font-bold italic">Hələ heç bir rəy yazmamısınız.</p>
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}