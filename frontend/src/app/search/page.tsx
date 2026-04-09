'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  SlidersHorizontal, LayoutGrid, List, X, Star, Filter,
  MapPin, Search, ChevronDown, CheckCircle2, RotateCcw,
  ChevronLeft, ChevronRight // YENİ İKONLAR ƏLAVƏ EDİLDİ
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBox from '@/components/SearchBox';
import HotelCard from '@/components/HotelCard';
import { Hotel } from '@/lib/types';

const AMENITY_OPTIONS = ['WiFi', 'Hovuz', 'Spa', 'Səhər yeməyi', 'Parking', 'Gym', 'Sea view', 'Restaurant', 'Bar'];

function HotelSkeleton() {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      <div className="h-64 bg-slate-200" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between">
          <div className="h-6 bg-slate-200 rounded-lg w-2/3" />
          <div className="h-6 bg-slate-200 rounded-lg w-12" />
        </div>
        <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
        <div className="flex gap-2">
          <div className="h-8 bg-slate-50 rounded-xl w-20" />
          <div className="h-8 bg-slate-50 rounded-xl w-20" />
        </div>
        <div className="h-12 bg-slate-200 rounded-2xl w-full mt-4" />
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const destination = searchParams.get('destination') || '';

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

  // 🔥 YENİ: PAGINATION STATE-LƏRİ 🔥
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 6; // Hər səhifədə neçə otel görünsün

  // Filter States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

        // 🔥 YENİ: URL-ə page və size parametrlərini qoşuruq 🔥
        let url = destination
          ? `${API_URL}/api/hotels/city/${encodeURIComponent(destination)}?page=${currentPage}&size=${PAGE_SIZE}`
          : `${API_URL}/api/hotels?page=${currentPage}&size=${PAGE_SIZE}`;

        const res = await fetch(url);
        const data = await res.json();

        // 🔥 YENİ: Backend Page obyekti qaytarırsa, content-i götür. Yoxsa adi massivi.
        const hotelsArray = data.content ? data.content : (Array.isArray(data) ? data : []);

        setAllHotels(hotelsArray);
        setFilteredHotels(hotelsArray);

        // Backenddən gələn səhifə sayını state-ə yazırıq (Əgər yoxdursa default 1)
        if (data.totalPages !== undefined) {
          setTotalPages(data.totalPages);
        }

      } catch (error) {
        console.error("Məlumat yüklənərkən xəta:", error);
        setAllHotels([]);
        setFilteredHotels([]);
      } finally {
        setTimeout(() => setIsLoading(false), 600);
      }
    };

    fetchHotels();
  }, [destination, currentPage]); // currentPage dəyişəndə API yenidən işə düşəcək

  // Filter məntiqi
  useEffect(() => {
    if (!Array.isArray(allHotels) || allHotels.length === 0) {
      setFilteredHotels([]);
      return;
    }

    let results = [...allHotels];

    results = results.filter(h => h.basePrice >= priceRange[0] && h.basePrice <= priceRange[1]);
    if (selectedStars.length > 0) results = results.filter(h => selectedStars.includes(h.stars));
    if (selectedAmenities.length > 0) results = results.filter(h => selectedAmenities.every(a => h.amenities?.includes(a)));

    if (sortBy === 'price_asc') results.sort((a, b) => a.basePrice - b.basePrice);
    else if (sortBy === 'price_desc') results.sort((a, b) => b.basePrice - a.basePrice);
    else if (sortBy === 'rating') results.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    setFilteredHotels(results);
  }, [allHotels, priceRange, selectedStars, selectedAmenities, sortBy]);

  const toggleStar = (star: number) => setSelectedStars(p => p.includes(star) ? p.filter(s => s !== star) : [...p, star]);
  const toggleAmenity = (a: string) => setSelectedAmenities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedStars([]);
    setSelectedAmenities([]);
    setCurrentPage(0); // Filter sıfırlananda 1-ci səhifəyə qayıt
  };

  // Səhifə dəyişəndə yuxarı scroll etmək üçün funksiya
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE]">
      <Navbar />

      <div className="sticky top-10 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 py-4 shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-1 shadow-sm">
            <SearchBox variant="compact" initialDestination={destination} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 sticky top-32 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                  <Filter size={20} className="text-orange-500" /> Filter
                </h3>
                {(selectedStars.length > 0 || selectedAmenities.length > 0) && (
                  <button onClick={clearFilters} className="text-[10px] font-black uppercase text-orange-500 tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                    <RotateCcw size={12} /> Sıfırla
                  </button>
                )}
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Büdcə (AZN)</p>
                  <Slider
                    min={0} max={5000} step={20}
                    value={priceRange}
                    onValueChange={(v) => setPriceRange([v[0], v[1]])}
                    className="pt-2"
                  />
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-sm font-black text-slate-700">{priceRange[0]} ₼</span>
                    <div className="h-px w-4 bg-slate-300" />
                    <span className="text-sm font-black text-slate-700">{priceRange[1]} ₼</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Reytinq / Ulduz</p>
                  <div className="space-y-2">
                    {[5, 4, 3].map((star) => (
                      <label key={star} className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${selectedStars.includes(star) ? 'border-orange-500 bg-orange-50/20' : 'border-transparent hover:bg-slate-50'}`}>
                        <div className="flex gap-1">
                          {Array.from({ length: star }).map((_, i) => <Star key={i} size={14} className="fill-orange-400 text-orange-400" />)}
                        </div>
                        <Checkbox checked={selectedStars.includes(star)} onCheckedChange={() => toggleStar(star)} className="rounded-lg border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Xidmətlər</p>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map((a) => (
                      <button
                        key={a} onClick={() => toggleAmenity(a)}
                        className={`text-[10px] font-black px-4 py-2.5 rounded-xl border transition-all uppercase tracking-wider ${selectedAmenities.includes(a) ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-lg shadow-blue-900/20' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-orange-500 font-black text-[10px] uppercase tracking-[4px]">Axtarış Nəticələri</p>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                  {isLoading ? 'Məlumatlar yüklənir...' : `${destination || 'Azərbaycan'} üzrə Seçimlər`}
                </h1>
              </div>

              <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 h-10 border-none bg-transparent font-bold text-xs uppercase tracking-wider text-slate-500 focus:ring-0">
                    <SelectValue placeholder="Sıralama" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                    <SelectItem value="recommended">Tövsiyə edilən</SelectItem>
                    <SelectItem value="price_asc">Əvvəlcə Ucuz</SelectItem>
                    <SelectItem value="price_desc">Əvvəlcə Bahalı</SelectItem>
                    <SelectItem value="rating">Ən Yüksək Reytinq</SelectItem>
                  </SelectContent>
                </Select>
                <div className="h-6 w-px bg-slate-100" />
                <div className="flex gap-1">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#1E3A5F] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><LayoutGrid size={18} strokeWidth={2.5} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#1E3A5F] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><List size={18} strokeWidth={2.5} /></button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => <HotelSkeleton key={i} />)}
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[48px] border-2 border-dashed border-slate-100 text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200 mb-6">
                  <Search size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Təəssüf, heç nə tapılmadı</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8 font-medium italic">Seçdiyiniz kriteriyalara uyğun otel yoxdur. Filterləri sıfırlayaraq yenidən yoxlayın.</p>
                <Button onClick={clearFilters} className="bg-orange-500 hover:bg-orange-600 rounded-2xl h-14 px-10 font-black uppercase tracking-widest shadow-xl shadow-orange-500/20">Filterləri təmizlə</Button>
              </div>
            ) : (
              <>
                {/* OTELLƏRİN SİYAHISI */}
                <div className={`animate-in fade-in duration-700 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-6'}`}>
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} variant={viewMode} />
                  ))}
                </div>

                {/* 🔥 YENİ: PAGINATION DÜYMƏLƏRİ 🔥 */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-slate-200/50">

                    {/* Geri Düyməsi */}
                    <Button
                      variant="outline"
                      disabled={currentPage === 0}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="w-12 h-12 rounded-2xl p-0 border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </Button>

                    {/* Səhifə Nömrələri (1, 2, 3...) */}
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <Button
                          key={i}
                          variant={currentPage === i ? 'default' : 'outline'}
                          onClick={() => handlePageChange(i)}
                          className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${currentPage === i
                              ? 'bg-[#1E3A5F] text-white shadow-lg shadow-blue-900/20'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>

                    {/* İrəli Düyməsi */}
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages - 1}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="w-12 h-12 rounded-2xl p-0 border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all"
                    >
                      <ChevronRight size={20} />
                    </Button>

                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">DublStay</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}