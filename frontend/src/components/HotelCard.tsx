'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { Star, MapPin, Wifi, Coffee, Car, Dumbbell, Waves, ChevronLeft, ChevronRight, Heart, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRatingColor } from '@/lib/data';
import { Hotel } from '@/lib/types';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';




interface HotelCardProps {
  hotel: Hotel;
  variant?: 'grid' | 'list';
  isFavorite?: boolean;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'WiFi': <Wifi size={14} />,
  'Hovuz': <Waves size={14} />,
  'Parking': <Car size={14} />,
  'Gym': <Dumbbell size={14} />,
  'Səhər yeməyi': <Coffee size={14} />,
};

function HotelCardContent({ hotel, variant = 'grid', isFavorite = false }: HotelCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(isFavorite);
  const [isHovered, setIsHovered] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentRating = hotel.rating || 0;
  const ratingBg = getRatingColor(currentRating);
  const images = hotel.images && hotel.images.length > 0
    ? hotel.images
    : [hotel.mainImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'];

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setImgIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  };

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setImgIndex((p) => (p === images.length - 1 ? 0 : p + 1));
  };

  const handleCardClick = () => {
    const query = searchParams.toString();
    // Əgər query boşdursa, lüzumsuz sual işarəsi (?) qoymamaq üçün:
    const url = query ? `/hotel/${hotel.id}?${query}` : `/hotel/${hotel.id}`;
    router.push(url);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const token = localStorage.getItem('accessToken');
    if (!token) return toast.error("Zəhmət olmasa, əvvəlcə daxil olun!");

    try {
      const res = await apiFetch(`/api/favorites/${hotel.id}`, { method: 'POST' });
      if (res.ok) {
        setIsWishlisted(!isWishlisted);
        toast.success(!isWishlisted ? "Favoritlərinizə əlavə edildi! ✨" : "Siyahıdan çıxarıldı");
      }
    } catch (error) {
      toast.error("Xəta baş verdi");
    }
  };

  return (
    <div onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative bg-white rounded-[24px] border border-slate-100 transition-all duration-500 
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden h-full flex 
        ${variant === 'list' ? 'flex-col md:flex-row' : 'flex-col'}
      `}>

      {/* ŞƏKİL BÖLMƏSİ */}
      <div className={`relative overflow-hidden ${variant === 'list' ? 'w-full md:w-[320px] h-[240px] md:h-auto' : 'h-[220px]'}`}>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 to-transparent" />

        <img
          src={images[imgIndex]}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Rating Badge - Şəklin üzərində "Glassmorphism" */}
        <div className="absolute top-4 left-4 z-20 backdrop-blur-md bg-white/90 px-2.5 py-1 rounded-xl shadow-sm border border-white/20 flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${ratingBg.replace('bg-', 'bg-')}`} />
          <span className="text-xs font-black text-slate-800">{currentRating}</span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 right-4 z-20 w-9 h-9 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white'
            }`}
        >
          <Heart size={16} strokeWidth={2.5} className={isWishlisted ? 'fill-current' : ''} />
        </button>

        {/* Naviqasiya Oxları (Yalnız Hover olanda) */}
        {images.length > 1 && (
          <div className={`absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 flex justify-between transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button onClick={prevImg} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white active:scale-90 transition-all">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextImg} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white active:scale-90 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Image Dots (Pagination) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 px-2 py-1.5 rounded-full bg-black/10 backdrop-blur-sm">
          {images.slice(0, 5).map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === imgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
          ))}
        </div>
      </div>

      {/* MƏLUMAT BÖLMƏSİ */}
      <div className="p-5 flex-1 flex flex-col justify-between" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-0.5">
              {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
                <Star key={i} size={12} className="fill-orange-400 text-orange-400" />
              ))}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{hotel.reviewCount || 0} rəy</span>
          </div>

          <h3 className="font-black text-slate-800 text-lg leading-tight mb-1 group-hover:text-[#FF6B35] transition-colors line-clamp-1">
            {hotel.name}
          </h3>

          <div className="flex items-center gap-1.5 text-slate-400 mb-4">
            <MapPin size={13} className="text-orange-500" />
            <span className="text-xs font-medium truncate">{hotel.city}, {hotel.address}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {hotel.amenities?.slice(0, 3).map((amenity: string) => (
              <div key={amenity} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100/50">
                {AMENITY_ICONS[amenity] || null}
                <span className="uppercase tracking-wider">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-end justify-between">
          <div className="space-y-0.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Gecəlik qiymət</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#1E3A5F] tracking-tighter">{hotel.basePrice}</span>
              <span className="text-xs font-bold text-slate-400 tracking-wide italic">AZN</span>
            </div>
          </div>

          <Button className="bg-[#1E3A5F] hover:bg-orange-500 text-white rounded-xl h-12 px-6 shadow-lg shadow-blue-900/10 transition-all active:scale-95 group/btn">
            Seç <ArrowUpRight size={18} className="ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
export default function HotelCard(props: HotelCardProps) {
  return (
    <Suspense fallback={<div className="w-full h-[380px] bg-slate-50 animate-pulse rounded-[24px]"></div>}>
      <HotelCardContent {...props} />
    </Suspense>
  );
}