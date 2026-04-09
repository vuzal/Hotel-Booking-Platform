'use client';

import { useEffect, useRef, useState, FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Tag, Clock, Star, ChevronLeft, ChevronRight, Mail, Loader2, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBox from '@/components/SearchBox';
import HotelCard from '@/components/HotelCard';
import { destinations } from '@/lib/data';
import { toast } from 'sonner';


function useCountUp(end: number, duration: number = 2000, shouldStart: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(end * progress));
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, shouldStart]);
  return count;
}

export default function HomePage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const statsRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [cityCounts, setCityCounts] = useState<Record<string, number>>({});
  const [featuredHotels, setFeaturedHotels] = useState<any[]>([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState(true);

  const hotels500 = useCountUp(500, 1500, statsVisible);
  const customers = useCountUp(50000, 2000, statsVisible);
  const rating = useCountUp(49, 1000, statsVisible);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Simulyasiya: 1.5 saniyə gözlədirik (Premium hissiyat üçün)
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Təbriklər! Xüsusi endirimlər artıq yolunuzdadır. ✨');
    setEmail('');
    setIsSubmitting(false);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const countsRes = await fetch(`${API_URL}/api/hotels/city-counts`);
        if (countsRes.ok) setCityCounts(await countsRes.json());

        const hotelsRes = await fetch(`${API_URL}/api/hotels`);
        if (hotelsRes.ok) {
          const data = await hotelsRes.json();
          const hotelsArray = data.content ? data.content : data;

          setFeaturedHotels(hotelsArray.slice(0, 6).map((h: any) => ({
            ...h,
            id: h.id.toString(),
            image: h.mainImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            location: h.city,
            price: h.basePrice,
          })));
        }
      } catch (error) {
        console.error("Xəta:", error);
      } finally {
        setIsLoadingHotels(false);
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.1 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] selection:bg-orange-100 selection:text-orange-600">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      {/* Diqqət: Dropdown kəsilməsin deyə overflow-hidden yoxdur, z-index verilib */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-32 z-40">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1920&q=80"
            alt="Azerbaijan"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#FBFBFE]" />
        </div>

        <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-white/20 animate-in fade-in slide-in-from-bottom-4">
            <Sparkles size={14} className="text-orange-400 fill-orange-400" />
            <span className="text-white text-xs font-bold uppercase tracking-[2px]">Azərbaycanın Lider Otel Portalı</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Sizin <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 italic">Xəyalınızdakı</span>
            <br />İstirahət Burada Başlayır
          </h1>

          <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Bakının modern otellərindən Qəbələnin yaşıl meşələrinə qədər — ən yaxşı qiymətlərlə unudulmaz anlar yaşayın.
          </p>

          <div className="flex justify-center relative z-50">
            <SearchBox variant="hero" />
          </div>

          <div ref={statsRef} className="flex flex-wrap justify-center gap-12 mt-16 opacity-90">
            {[
              { value: `${hotels500}+`, label: 'Eksklüziv Otel' },
              { value: customers >= 1000 ? `${Math.floor(customers / 1000)}K+` : `${customers}+`, label: 'Xoşbəxt Müştəri' },
              { value: `${(rating / 10).toFixed(1)}`, label: 'Müştəri Məmnuniyyəti', suffix: '/5' },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <p className="text-4xl font-black text-white mb-1 transition-transform group-hover:scale-110">
                  {stat.value}<span className="text-orange-500">{stat.suffix}</span>
                </p>
                <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR DESTINATIONS ===== */}
      <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <p className="text-orange-500 font-black text-xs uppercase tracking-[3px]">İstiqamətlər</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-none">Haraya Getmək <br />İstərdiniz?</h2>
          </div>
          <Link href="/search">
            <Button variant="outline" className="rounded-2xl border-slate-200 px-8 py-6 font-bold text-slate-700 hover:bg-slate-50 transition-all hover:gap-4">
              Hamısını Kəşf Et <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {destinations.map((dest, index) => {
            const dynamicCount = cityCounts[dest.name] ?? dest.hotelCount;
            // İlk 2 şəkil daha böyük görünsün
            const isLarge = index === 0 || index === 1;
            return (
              <Link
                key={dest.id}
                href={`/search?destination=${dest.name}`}
                className={`group relative overflow-hidden rounded-[32px] shadow-sm hover:shadow-2xl transition-all duration-500 ${isLarge ? 'md:col-span-2 lg:col-span-3 h-[450px]' : 'md:col-span-2 lg:col-span-2 h-[350px]'
                  }`}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                      {dest.tagline}
                    </span>
                    <h3 className="text-white font-black text-3xl mb-1">{dest.name}</h3>
                    <p className="text-white/60 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">{dynamicCount} Möhtəşəm Otel</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== FEATURED HOTELS ===== */}
      <section className="py-24 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-2">
              <p className="text-orange-500 font-black text-xs uppercase tracking-[3px]">Eksklüziv</p>
              <h2 className="text-4xl font-black text-slate-900">Seçilmiş Təkliflər</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={() => scrollCarousel('left')} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1E3A5F] hover:text-white transition-all shadow-sm active:scale-90">
                <ChevronLeft size={24} />
              </button>
              <button onClick={() => scrollCarousel('right')} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1E3A5F] hover:text-white transition-all shadow-sm active:scale-90">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {isLoadingHotels ? (
            <div className="flex justify-center items-center h-80">
              <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
          ) : (
            <div
              ref={carouselRef}
              className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar pb-10 px-2"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {featuredHotels.map((hotel) => (
                <div key={hotel.id} className="flex-shrink-0 w-[350px] scroll-snap-start">
                  <HotelCard hotel={hotel} variant="grid" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-orange-500 font-black text-xs uppercase tracking-[3px]">Niyə Biz?</p>
              <h2 className="text-5xl font-black text-slate-900 leading-tight">Səyahətinizi Bizimlə <br />Daha Sadə Edin</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: Tag, title: 'Ən Yaxşı Qiymət', desc: 'Bazarda tapa biləcəyiniz ən uyğun təkliflər bizdədir.' },
                { icon: Clock, title: 'Sürətli Rezervasiya', desc: 'Cəmi 2 dəqiqəyə oteliniz hazırdır.' },
                { icon: Shield, title: 'Güvənli Ödəniş', desc: 'Bütün məlumatlarınız 256-bit SSL ilə qorunur.' },
                { icon: Star, title: 'Real Rəylər', desc: 'Yalnız oteldə qalmış real müştəri rəyləri.' }
              ].map((f, i) => (
                <div key={i} className="space-y-3 group">
                  <div className="w-12 h-12 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center text-orange-500 transition-all group-hover:bg-orange-500 group-hover:text-white">
                    <f.icon size={24} />
                  </div>
                  <h3 className="font-black text-slate-900">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            {/* Vizual olaraq premium hiss üçün şəkil kompozisiyası */}
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80" alt="luxury" className="w-full h-[600px] object-cover" />
              <div className="absolute inset-0 bg-orange-600/10 mix-blend-multiply" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl max-w-[250px] animate-bounce-slow">
              <p className="text-slate-900 font-black text-lg mb-1">Möhtəşəm!</p>
              <p className="text-slate-500 text-xs">"Həyatımın ən yaxşı istirahəti idi, hər şey çox peşəkar idi."</p>
              <div className="flex gap-1 mt-3 text-orange-400">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="currentColor" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-[#1E3A5F] rounded-[48px] p-12 md:p-24 relative overflow-hidden text-center space-y-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="space-y-4 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white">Yeniliklərdən İlk Sən <br />Xəbərdar Ol</h2>
            <p className="text-blue-200 text-lg max-w-xl mx-auto">Hər həftə seçilmiş endirimlər və gizli təkliflər birbaşa email ünvanınıza gəlsin.</p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto relative z-10">
            <div className="flex-1 relative group">
              <Input
                type="email"
                placeholder="E-mail ünvanınız..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="h-16 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:bg-white/20 focus:ring-2 focus:ring-orange-500/50 transition-all text-lg px-8 backdrop-blur-md"
              />
              {/* İnputun altındakı incə xətt animasiyası */}
              <div className="absolute bottom-0 left-0 h-[2px] bg-orange-500 w-0 group-focus-within:w-full transition-all duration-500 rounded-full" />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-16 px-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-xl shadow-orange-900/40 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Göndərilir...
                </>
              ) : (
                'Abunə Ol'
              )}
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}