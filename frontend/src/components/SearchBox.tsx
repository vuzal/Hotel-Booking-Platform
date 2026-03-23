'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, addDays } from 'date-fns';
import { az } from 'date-fns/locale';
import { MapPin, Calendar, Users, Search, ChevronDown, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { destinations } from '@/lib/data';
import { toast } from 'sonner';

interface SearchBoxProps {
  variant?: 'hero' | 'compact';
  initialDestination?: string;
  initialCheckIn?: Date;
  initialCheckOut?: Date;
  initialAdults?: number;
  initialChildren?: number;
}

export default function SearchBox({
  variant = 'hero',
  initialDestination = '',
  initialCheckIn,
  initialCheckOut,
  initialAdults = 2,
  initialChildren = 0,
}: SearchBoxProps) {
  const router = useRouter();

  const getCityName = (val: string) => {
    const found = destinations.find(d => d.slug === val || d.name === val);
    return found ? found.name : val;
  };

  const [destination, setDestination] = useState(getCityName(initialDestination));
  const [cityCounts, setCityCounts] = useState<Record<string, number>>({});
  const [checkIn, setCheckIn] = useState<Date | undefined>(initialCheckIn || addDays(new Date(), 1));
  const [checkOut, setCheckOut] = useState<Date | undefined>(initialCheckOut || addDays(new Date(), 3));
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);

  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
    from: checkIn,
    to: checkOut,
  });

  const destRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRealCounts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const res = await fetch(`${API_URL}/api/hotels/city-counts`);
        if (res.ok) {
          const data = await res.json();
          setCityCounts(data);
        }
      } catch (err) {
        console.error("Şəhər sayları yüklənərkən xəta:", err);
      }
    };
    fetchRealCounts();
  }, []);

  useEffect(() => {
    setDestination(getCityName(initialDestination));
  }, [initialDestination]);

  const filteredCities = destinations.filter(c =>
    destination === '' || c.name.toLowerCase().includes(destination.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) setShowDestDropdown(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDatePicker(false);
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) setShowGuestPicker(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (checkIn && checkOut && checkIn >= checkOut) {
      return toast.error("Çıxış tarixi giriş tarixindən ən azı 1 gün sonra olmalıdır! 📅");
    }
    const params = new URLSearchParams();
    if (destination) {
      const cityObj = destinations.find(d => d.name === destination || d.slug === destination);
      params.set('destination', cityObj ? cityObj.name : destination);
    }
    if (checkIn) params.set('checkIn', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) params.set('checkOut', format(checkOut, 'yyyy-MM-dd'));
    params.set('adults', adults.toString());
    params.set('children', children.toString());
    router.push(`/search?${params.toString()}`);
  };

  const formatDateDisplay = () => {
    if (!checkIn && !checkOut) return 'Tarixi seçin';
    if (checkIn && checkOut) {
      return `${format(checkIn, 'd MMM', { locale: az })} – ${format(checkOut, 'd MMM', { locale: az })}`;
    }
    return checkIn ? format(checkIn, 'd MMMM', { locale: az }) : 'Tarixi seçin';
  };

  const nights = checkIn && checkOut
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const isHero = variant === 'hero';

  return (
    <div className={`
      ${isHero
        ? 'bg-white/15 backdrop-blur-xl border border-white/20 p-2 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] rounded-[24px]'
        : 'bg-white border border-slate-200 p-1.5 shadow-xl rounded-[18px]'} 
      w-full max-w-6xl mx-auto transition-all duration-500
    `}>
      <div className={`
        flex flex-col ${isHero ? 'lg:flex-row' : 'md:flex-row'} 
        items-stretch bg-white rounded-[18px] overflow-visible
      `}>

        {/* Bölmə 1: İstiqamət */}
        <div ref={destRef} className="relative flex-[1.4] group">
          <div
            className="h-full flex items-center gap-4 px-6 py-4 cursor-text transition-all hover:bg-slate-50 rounded-[18px] lg:rounded-r-none"
            onClick={() => setShowDestDropdown(true)}
          >
            <div className="p-2.5 bg-orange-50 rounded-xl text-orange-500 group-hover:scale-110 transition-transform">
              <MapPin size={20} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Haraya gedirsiz?</p>
              <input
                className="bg-transparent text-sm font-bold text-slate-900 w-full outline-none placeholder-slate-300"
                placeholder="Şəhər və ya otel..."
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setShowDestDropdown(true); }}
                onFocus={() => setShowDestDropdown(true)}
              />
            </div>
            {destination && (
              <button onClick={(e) => { e.stopPropagation(); setDestination(''); }} className="p-1 hover:bg-slate-200 rounded-full text-slate-400">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-slate-100" />

          {/* Dropdown Dizaynı */}
          {showDestDropdown && filteredCities.length > 0 && (
            <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-[100] p-3 animate-in fade-in zoom-in-95 duration-200">
              <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Populyar Şəhərlər</p>
              <div className="mt-2 space-y-1">
                {filteredCities.map((city) => (
                  <button
                    key={city.slug}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-all group/item"
                    onClick={() => { setDestination(city.name); setShowDestDropdown(false); }}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm group-hover/item:shadow-md transition-all">
                      <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">{city.name}</p>
                      <p className="text-xs text-slate-400 font-medium">
                        {cityCounts[city.name] !== undefined ? cityCounts[city.name] : city.hotelCount} mövcud otel
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bölmə 2: Tarixlər */}
        <div ref={dateRef} className="relative flex-1 group">
          <div
            className="h-full flex items-center gap-4 px-6 py-4 cursor-pointer transition-all hover:bg-slate-50"
            onClick={() => { setShowDatePicker(!showDatePicker); setShowGuestPicker(false); setShowDestDropdown(false); }}
          >
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
              <Calendar size={20} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                Tarixlər {nights > 0 && <span className="text-emerald-500 font-black ml-1">({nights} GECƏ)</span>}
              </p>
              <p className="text-sm font-bold text-slate-900 whitespace-nowrap">{formatDateDisplay()}</p>
            </div>
          </div>

          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-slate-100" />

          {showDatePicker && (
            <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-[100] p-6 animate-in fade-in zoom-in-95 duration-200">
              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range || { from: undefined, to: undefined });
                  setCheckIn(range?.from);
                  setCheckOut(range?.to);
                  if (range?.from && range?.to) setShowDatePicker(false);
                }}
                disabled={{ before: new Date() }}
                numberOfMonths={2}
                locale={az}
                className="premium-calendar"
              />
            </div>
          )}
        </div>

        {/* Bölmə 3: Qonaqlar */}
        <div ref={guestRef} className="relative flex-1 group">
          <div
            className="h-full flex items-center gap-4 px-6 py-4 cursor-pointer transition-all hover:bg-slate-50"
            onClick={() => { setShowGuestPicker(!showGuestPicker); setShowDatePicker(false); setShowDestDropdown(false); }}
          >
            <div className="p-2.5 bg-purple-50 rounded-xl text-purple-500 group-hover:scale-110 transition-transform">
              <Users size={20} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Qonaqlar</p>
              <p className="text-sm font-bold text-slate-900">{adults} yetkin{children > 0 ? `, ${children} uşaq` : ''}</p>
            </div>
            <ChevronDown size={16} className={`text-slate-300 transition-transform duration-300 ${showGuestPicker ? 'rotate-180' : ''}`} />
          </div>

          {showGuestPicker && (
            <div className="absolute top-[calc(100%+12px)] right-0 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-[100] p-6 w-80 animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Yetkinlər</p>
                    <p className="text-[10px] text-slate-400 font-medium">13+ yaş</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-9 h-9 rounded-xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors"><Minus size={16} /></button>
                    <span className="text-sm font-black w-4 text-center">{adults}</span>
                    <button onClick={() => setAdults(Math.min(10, adults + 1))} className="w-9 h-9 rounded-xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors"><Plus size={16} /></button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Uşaqlar</p>
                    <p className="text-[10px] text-slate-400 font-medium">2-12 yaş</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-9 h-9 rounded-xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors"><Minus size={16} /></button>
                    <span className="text-sm font-black w-4 text-center">{children}</span>
                    <button onClick={() => setChildren(Math.min(10, children + 1))} className="w-9 h-9 rounded-xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors"><Plus size={16} /></button>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-8 bg-[#1E3A5F] hover:bg-[#0F172A] text-white rounded-xl h-12 font-bold transition-all" onClick={() => setShowGuestPicker(false)}>Seçimi tamamla</Button>
            </div>
          )}
        </div>

        {/* Axtar Düyməsi */}
        <div className="p-2 lg:p-3 bg-white lg:rounded-r-[18px]">
          <Button
            onClick={handleSearch}
            className="w-full lg:w-auto h-full min-h-[56px] bg-[#FF6B35] hover:bg-[#FF8254] text-white rounded-[14px] font-black px-10 gap-3 shadow-[0_10px_25px_-5px_rgba(255,107,53,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search size={20} strokeWidth={3} />
            <span className="uppercase tracking-widest text-xs">Axtar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}