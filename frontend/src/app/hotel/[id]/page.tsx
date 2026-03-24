'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Star, MapPin, Check, AlertCircle, MessageSquare, Send,
  Trash2, ShieldCheck, Share2, Heart, Calendar, Users,
  ChevronRight, Sparkles, Coffee, Wifi, Car, Dumbbell, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

function HotelDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [hotel, setHotel] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [guestCount, setGuestCount] = useState(1);
  const searchParams = useSearchParams();
  console.log("Linkdən gələn bütün datalar:", searchParams.toString());

  // URL-dən checkIn və checkOut (və ya startDate/endDate) parametrlərini oxuyuruq
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  // Ekranda göstərmək üçün yazını hazırlayırıq
  const displayDate = (checkIn && checkOut)
    ? `${checkIn} - ${checkOut}`
    : 'Seçilməyib';

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/hotel/${id}`);
      if (res.ok) setReviews(await res.json());
    } catch (err) { console.error("Reviews error:", err); }
  };

  const [isWishlisted, setIsWishlisted] = useState(false);

  // Səhifə yüklənəndə bu otelin favorit olub-olmadığını yoxlayaq
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token || !id) return;
      try {
        const res = await apiFetch('/api/favorites');
        if (res.ok) {
          const favorites = await res.json();
          // Siyahıda bu otelin olub-olmadığını yoxlayırıq
          const isFav = favorites.some((fav: any) =>
            (fav.hotelId?.toString() === id) || (fav.hotel?.id?.toString() === id)
          );
          setIsWishlisted(isFav);
        }
      } catch (err) {
        console.error("Favorit yoxlanarkən xəta:", err);
      }
    };
    checkFavoriteStatus();
  }, [id]);

  // Saxla düyməsinə basanda işləyəcək funksiya
  const handleSaveToggle = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error("Zəhmət olmasa, əvvəlcə daxil olun!");
      return;
    }

    try {
      const res = await apiFetch(`/api/favorites/${id}`, {
        method: 'POST'
      });

      if (res.ok) {
        setIsWishlisted(!isWishlisted);
        toast.success(!isWishlisted ? "Favoritlərinizə əlavə edildi! ✨" : "Siyahıdan çıxarıldı");
      } else {
        toast.error("Xəta baş verdi");
      }
    } catch (error) {
      toast.error("Bağlantı xətası!");
    }
  };

  useEffect(() => {
    async function loadData() {
      if (!id || id === 'undefined' || id === 'null') {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const hRes = await fetch(`${API_URL}/api/hotels/${id}`);
        const hData = await hRes.json();
        const actualHotel = Array.isArray(hData) ? hData[0] : hData;

        if (actualHotel?.id) {
          setHotel(actualHotel);
          const rRes = await fetch(`${API_URL}/api/rooms/hotel/${id}`);
          if (rRes.ok) setRooms(await rRes.json());
          await fetchReviews();
        }
      } catch (err) { console.error("Fetch error:", err); }
      finally { setIsLoading(false); }
    }
    loadData();
  }, [id]);

  const handleSubmitReview = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return toast.error("Rəy yazmaq üçün daxil olun!");
    if (!newComment.trim()) return toast.error("Zəhmət olmasa rəyinizi yazın.");

    setIsSubmittingReview(true);
    try {
      const res = await apiFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ hotelId: Number(id), rating: newRating, comment: newComment })
      });
      if (res.ok) {
        toast.success("Təcrübəniz paylaşıldı! ✨");
        setNewComment('');
        setNewRating(5);
        fetchReviews();
      }
    } catch (err) { toast.error("Xəta baş verdi!"); }
    finally { setIsSubmittingReview(false); }
  };

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin mb-4" />
      <p className="font-black text-slate-900 uppercase tracking-widest text-xs">DublStay yüklənir...</p>
    </div>
  );



  if (!hotel) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <div className="p-6 bg-red-50 rounded-full text-red-500"><AlertCircle size={40} /></div>
      <h2 className="text-3xl font-black text-slate-900">Otel tapılmadı!</h2>
      <Link href="/search"><Button className="bg-[#1E3A5F] px-10 rounded-2xl h-14 font-bold">Geri qayıt</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFE]">
      <Navbar />

      <div className="pt-32 max-w-7xl mx-auto px-4 pb-24">

        {/* TOP INFO & ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="space-y-3">
            <div className="flex gap-1">
              {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
                <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
              ))}
              <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Təstiq olunmuş Otel</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">{hotel.name}</h1>
            <div className="flex items-center gap-4 text-slate-500">
              <p className="flex items-center gap-1.5 text-sm font-medium">
                <MapPin size={16} className="text-orange-500" /> {hotel.city}, {hotel.address}
              </p>
              <button className="text-xs font-bold text-[#1E3A5F] underline underline-offset-4">Xəritədə göstər</button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="rounded-2xl gap-2 font-bold border-slate-200">
              <Share2 size={18} /> Paylaş
            </Button>

            <Button
              variant="outline"
              onClick={handleSaveToggle} // <--- Funksiyanı bağladıq
              className={`rounded-2xl gap-2 font-bold transition-all duration-300 ${isWishlisted
                ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                : 'border-slate-200 text-red-500 hover:bg-red-50'
                }`}
            >
              <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
              {isWishlisted ? 'Saxlanıldı' : 'Saxla'}
            </Button>
          </div>
        </div>

        {/* IMAGE GALLERY (Airbnb Style Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[500px] mb-12 rounded-[40px] overflow-hidden shadow-2xl">
          <div className="md:col-span-2 h-full">
            <img src={hotel.mainImageUrl} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" alt="main" />
          </div>
          <div className="hidden md:grid col-span-2 grid-cols-2 gap-3 h-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative group overflow-hidden">
                <img
                  src={hotel.images?.[i] || hotel.mainImageUrl}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="hotel"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="bg-slate-100/50 p-1.5 rounded-[20px] h-14 mb-8 w-full md:w-auto">
                <TabsTrigger value="about" className="rounded-xl px-8 font-bold text-xs uppercase tracking-widest">Haqqında</TabsTrigger>
                <TabsTrigger value="rooms" className="rounded-xl px-8 font-bold text-xs uppercase tracking-widest">Otaqlar ({rooms.length})</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-xl px-8 font-bold text-xs uppercase tracking-widest">Rəylər ({reviews.length})</TabsTrigger>
                <TabsTrigger value="amenities" className="rounded-xl px-8 font-bold text-xs uppercase tracking-widest">İmkanlar</TabsTrigger>
              </TabsList>

              {/* ABOUT CONTENT */}
              <TabsContent value="about" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Sparkles className="text-orange-500" /> Otel haqqında
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg font-medium">{hotel.description || "Bu lüks otel sizə unudulmaz istirahət vəd edir."}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-50">
                    <div className="text-center space-y-2">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl inline-block"><Wifi /></div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pulsuz Wifi</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl inline-block"><Coffee /></div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Səhər Yeməyi</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="p-3 bg-green-50 text-green-600 rounded-2xl inline-block"><Car /></div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Parking</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl inline-block"><Dumbbell /></div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fitness</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ROOMS CONTENT */}
              <TabsContent value="rooms" className="space-y-4 animate-in fade-in duration-500">
                {rooms.map(room => (
                  <div
                    key={room.id}
                    className={`group p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-6 ${selectedRoom?.id === room.id ? 'border-orange-500 bg-orange-50/20' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                      }`}
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80" className="w-full h-full object-cover" alt="room" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-black text-slate-900 group-hover:text-orange-500 transition-colors">{room.name}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Users size={14} /> {room.type} · Max {room.capacity} nəfər
                        </p>
                        <div className="flex gap-2 pt-2">
                          <Badge variant="outline" className="text-[10px] rounded-lg">Pulsuz ləğv</Badge>
                          <Badge variant="outline" className="text-[10px] rounded-lg">Öncədən ödəniş yoxdur</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                      <div className="text-right">
                        <span className="text-3xl font-black text-slate-900 leading-none">{room.price} AZN</span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">gecəlik / toplam</p>
                      </div>
                      <Button
                        onClick={() => setSelectedRoom(room)}
                        className={`w-full md:w-40 h-12 rounded-[18px] font-black text-xs uppercase tracking-[2px] shadow-lg transition-all active:scale-95 ${selectedRoom?.id === room.id ? 'bg-[#1E3A5F] text-white' : 'bg-[#FF6B35] hover:bg-orange-600 text-white'
                          }`}
                      >
                        {selectedRoom?.id === room.id ? <Check className="mr-2" /> : null}
                        {selectedRoom?.id === room.id ? 'Seçildi' : 'Seç'}
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* REVIEWS CONTENT */}
              <TabsContent value="reviews" className="space-y-10 animate-in fade-in duration-500">
                <div className="bg-[#1E3A5F] p-10 rounded-[40px] text-white space-y-6 shadow-xl relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                      <MessageSquare className="text-orange-400" /> Təcrübənizi bölüşün
                    </h3>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} onClick={() => setNewRating(s)} className="transition-transform active:scale-75">
                          <Star size={32} className={`${s <= newRating ? 'fill-orange-400 text-orange-400' : 'text-slate-500'}`} />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Möhtəşəm bir tətil keçirdiniz? Bizə danışın..."
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/30 rounded-2xl h-32 focus:ring-orange-500/50"
                      value={newComment} onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button
                      onClick={handleSubmitReview}
                      disabled={isSubmittingReview}
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl h-14 px-10 font-black uppercase tracking-widest shadow-xl shadow-orange-900/20"
                    >
                      {isSubmittingReview ? <Loader2 className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
                      Rəyi Göndər
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-xl border-2 border-white shadow-inner">
                            {rev.userName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm leading-none mb-1">{rev.userName}</p>
                            <div className="flex gap-0.5">
                              {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} size={10} className="fill-orange-400 text-orange-400" />)}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString('az-AZ')}</span>
                      </div>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* AMENITIES CONTENT */}
              <TabsContent value="amenities" className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in">
                {hotel.amenities?.map((a: string) => (
                  <div key={a} className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-slate-50 font-bold text-slate-700 hover:border-orange-500/30 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center"><Check size={18} strokeWidth={3} /></div>
                    <span className="text-xs uppercase tracking-wider">{a}</span>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* SIDEBAR BOOKING CARD - PREMIUM STICKY */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white rounded-[40px] border border-slate-100 shadow-2xl p-8 space-y-8 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/5 rounded-full" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">
                    {selectedRoom ? selectedRoom.price : hotel.basePrice}
                  </span>
                  <span className="text-xl font-bold text-slate-400 tracking-widest italic">AZN</span>
                  <span className="text-xs text-slate-400 font-medium tracking-tight">/ gecəlik</span>
                </div>

                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  {/* TARİX HİSSƏSİ */}
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-b pb-3 border-slate-200/50">
                    <span className="flex items-center gap-2"><Calendar size={16} className="text-orange-500" /> Tarix</span>
                    {/* DƏYİŞDİRİLƏN YER: Artıq displayDate oxunacaq */}
                    <span className="text-slate-900 uppercase">
                      {displayDate} {(!checkIn || !checkOut) && <ChevronRight size={14} className="inline" />}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-2">
                      <Users size={16} className="text-blue-500" /> Qonaqlar
                    </span>

                    {/* DƏYİŞDİRİLƏN HİSSƏ: (+ / -) düymələri ilə dinamik qonaq sayı */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-6 h-6 rounded bg-slate-200/50 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-slate-900 uppercase w-16 text-center">
                        {guestCount} Yetkin
                      </span>
                      <button
                        onClick={() => setGuestCount(guestCount + 1)}
                        className="w-6 h-6 rounded bg-slate-200/50 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {selectedRoom ? (
                  <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100/50">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Seçilmiş Otaq</p>
                    <p className="font-bold text-slate-900 text-sm">{selectedRoom.name}</p>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100/50 flex items-center gap-3">
                    <div className="animate-pulse w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Rezerv etmək üçün otaq seçin</p>
                  </div>
                )}

                <Button
                  onClick={() => {
                    if (!selectedRoom) return toast.warning("Zəhmət olmasa siyahıdan otaq seçin!");

                    if (guestCount > selectedRoom.capacity) {
                      return toast.error(`Seçdiyiniz otaq maksimum ${selectedRoom.capacity} nəfər üçündür!`);
                    }
                    // Əgər tarix seçilibsə, onu da linkə qoşuruq
                    let bookingUrl = `/booking?hotelId=${hotel.id}&roomId=${selectedRoom.id}&guests=${guestCount}`;
                    if (checkIn && checkOut) {
                      bookingUrl += `&checkIn=${checkIn}&checkOut=${checkOut}`;
                    }

                    router.push(bookingUrl);
                  }}
                  className="w-full h-16 bg-gradient-to-r from-[#FF6B35] to-[#FF8C61] hover:shadow-orange-500/30 text-white font-black rounded-2xl text-lg transition-all active:scale-95 shadow-xl shadow-orange-500/20"
                >
                  Rezervasiyaya Başla
                </Button>

                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <ShieldCheck size={14} className="text-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Zəmanətli Ödəniş</span>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Faylın düz ƏN SONUNA BURA YAPIŞDIR:

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Yüklənir...</p>
      </div>
    }>
      <HotelDetailContent params={params} />
    </Suspense>
  );
}

