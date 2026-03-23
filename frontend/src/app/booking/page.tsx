'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check, ChevronRight, User, Phone, Mail, Calendar, CreditCard,
  Building, AlertCircle, Eye, EyeOff, CheckCircle, MapPin,
  ShieldCheck, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

const STEPS = ['Məlumatlar', 'Ödəniş', 'Təsdiq'];

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');
  const guests = searchParams.get('guests') || '1';
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  let nights = 1;
  if (checkInParam && checkOutParam) {
    const start = new Date(checkInParam);
    const end = new Date(checkOutParam);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const [hotel, setHotel] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [finalReservation, setFinalReservation] = useState<any>(null);

  // Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');

  // 🔥 YENİ: Kart məlumatları üçün bütün State-lər (CVV və Tarix əksik idi!)
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);

  // 1. DATA LOADING
  useEffect(() => {
    async function loadData() {
      if (!hotelId || !roomId) return;
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const hRes = await fetch(`${API_URL}/api/hotels/${hotelId}`);
        const hData = await hRes.json();
        setHotel(Array.isArray(hData) ? hData[0] : hData);

        const rRes = await fetch(`${API_URL}/api/rooms/hotel/${hotelId}`);
        const rData = await rRes.json();
        setRoom(rData.find((r: any) => r.id.toString() === roomId));
      } catch (error) {
        toast.error("Məlumatlar yüklənmədi");
      } finally {
        setIsFetching(false);
      }
    }
    loadData();
  }, [hotelId, roomId]);

  // 2. PROCESS LOGIC (RESERVATION + PAYMENT + VALIDATION)
  const handleProcessBooking = async () => {
    // 🔥 ADDIM 1: Səyahətçi Məlumatlarının Yoxlanması (Validation)
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
        return toast.error("Zəhmət olmasa, bütün məlumatları doldurun!");
      }
      // Email formatı yoxlanışı
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return toast.error("Düzgün e-poçt ünvanı daxil edin! (məs: ad@domain.com)");
      }
      // Telefon formatı yoxlanışı (Backend regex-inə uyğun)
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, ''); // Boşluqları təmizləyirik
      if (!/^(?:\+994|0)(50|51|55|70|77|99|10|60)\d{7}$/.test(cleanPhone)) {
        return toast.error("Telefon nömrəsi düzgün formatda deyil! (məs: +994501234567)");
      }

      setStep(2);
      return;
    }

    // 🔥 ADDIM 2: Ödəniş Məlumatlarının Yoxlanması (Əgər KART seçilibsə)
    if (step === 2 && paymentMethod === 'CARD') {
      const cleanCard = cardNumber.replace(/\s/g, ''); // Kartdakı boşluqları silib yoxlayırıq
      if (!/^\d{16}$/.test(cleanCard)) {
        return toast.error("Kartın nömrəsi 16 rəqəmdən ibarət olmalıdır!");
      }
      if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate)) {
        return toast.error("Kartın bitmə tarixi düzgün deyil! (Format: MM/YY)");
      }

      // Kartın vaxtının bitib-bitmədiyini yoxlayırıq
      const [expMonth, expYear] = expiryDate.split('/');
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear() % 100; // 2024 -> 24

      if (parseInt(expYear) < currentYear || (parseInt(expYear) === currentYear && parseInt(expMonth) < currentMonth)) {
        return toast.error("Bu kartın istifadə müddəti bitib!");
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        return toast.error("CVV/CVC kodu 3 və ya 4 rəqəmli olmalıdır!");
      }
    }

    // --- ƏGƏR BURA QƏDƏR GƏLDİSƏ, HƏR ŞEY TƏMİZDİR! BACKEND-Ə GÖNDƏRİRİK ---
    setIsLoading(true);
    try {
      const resPayload = {
        roomId: Number(roomId),
        hotelId: Number(hotelId),
        checkIn: checkInParam ? format(new Date(checkInParam), 'yyyy-MM-dd') : format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        checkOut: checkOutParam ? format(new Date(checkOutParam), 'yyyy-MM-dd') : format(addDays(new Date(), 2), 'yyyy-MM-dd'),
        guestCount: Number(guests)
      };

      const resResponse = await apiFetch('/api/reservations', {
        method: 'POST',
        body: JSON.stringify(resPayload)
      });

      if (!resResponse.ok) throw new Error("Rezervasiya yaradıla bilmədi");
      const reservation = await resResponse.json();

      const paymentResponse = await apiFetch(`/api/payments/${reservation.id}/process`, {
        method: 'POST',
        body: JSON.stringify({ method: paymentMethod })
      });

      const paymentData = await paymentResponse.json();

      if (paymentData.status === 'PAID') {
        setFinalReservation(reservation);
        setStep(3);
        toast.success("Ödəniş uğurla tamamlandı! 🎉");
      } else {
        throw new Error("Ödəniş uğursuz oldu. Rezervasiya ləğv edildi.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="h-screen flex items-center justify-center">Yüklənir...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-24">

        {/* Stepper Dizaynı */}
        <div className="flex items-center justify-center mb-16 gap-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${step >= i + 1 ? 'bg-[#1E3A5F] text-white shadow-lg shadow-blue-900/20 rotate-3' : 'bg-white text-gray-400 border border-gray-100'}`}>
                  {step > i + 1 ? <Check size={18} /> : i + 1}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${step >= i + 1 ? 'text-[#1E3A5F]' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < 2 && <div className={`w-16 h-0.5 mx-4 rounded-full ${step > i + 1 ? 'bg-[#1E3A5F]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2">

            {/* STEP 1: ŞƏXSİ MƏLUMATLAR */}
            {step === 1 && (
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-[#1E3A5F] flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl text-[#1E3A5F]"><User size={24} /></div>
                    Səyahətçi Məlumatları
                  </h2>
                  <p className="text-gray-400 text-sm ml-12">Zəhmət olmasa, məlumatları daxil edin</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-500 ml-1">AD</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <Input placeholder="Məs: Vüsal" className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-500 ml-1">SOYAD</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <Input placeholder="Məs: Abbasov" className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all" value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-500 ml-1">EMAIL ÜNVANI</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <Input type="email" placeholder="vusal@example.com" className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-500 ml-1">TELEFON NÖMRƏSİ</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <Input placeholder="+994501234567" className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                  </div>
                </div>

                <Button className="w-full h-16 bg-[#FF6B35] hover:bg-[#e55a24] text-lg font-bold rounded-[20px] shadow-lg shadow-orange-200 transition-transform active:scale-[0.98]" onClick={handleProcessBooking}>
                  Ödənişə keç <ChevronRight className="ml-2" />
                </Button>
              </div>
            )}

            {/* STEP 2: ÖDƏNİŞ METODU */}
            {step === 2 && (
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-[#1E3A5F] flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl text-[#1E3A5F]"><CreditCard size={24} /></div>
                    Ödəniş Məlumatları
                  </h2>
                  <p className="text-gray-400 text-sm ml-12">Ödənişiniz 256-bit SSL ilə qorunur</p>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label htmlFor="card" className={`p-6 border-2 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'CARD' ? 'border-[#1E3A5F] bg-blue-50/30' : 'border-gray-50 hover:border-gray-200'}`}>
                    <RadioGroupItem value="CARD" id="card" className="border-[#1E3A5F]" />
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-xl shadow-sm"><CreditCard className="text-[#1E3A5F]" /></div>
                      <span className="font-bold text-[#1E3A5F]">Bank Kartı</span>
                    </div>
                  </label>
                  <label htmlFor="cash" className={`p-6 border-2 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'CASH' ? 'border-[#1E3A5F] bg-blue-50/30' : 'border-gray-50 hover:border-gray-200'}`}>
                    <RadioGroupItem value="CASH" id="cash" className="border-[#1E3A5F]" />
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-xl shadow-sm"><Building className="text-[#1E3A5F]" /></div>
                      <span className="font-bold text-[#1E3A5F]">Oteldə Ödəniş</span>
                    </div>
                  </label>
                </RadioGroup>

                {paymentMethod === 'CARD' && (
                  <div className="space-y-5 p-6 bg-gray-50 rounded-[24px] border border-gray-100">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-gray-400">Kartın üzərindəki 16 rəqəm</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        {/* 🔥 AĞILLI KART NÖMRƏSİ İNPUTU */}
                        <Input
                          placeholder="0000 0000 0000 0000"
                          className="pl-12 h-14 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-100 transition-all font-mono text-lg"
                          value={cardNumber}
                          onChange={(e) => {
                            // Sırf rəqəmləri saxla və 4-dən bir boşluq qoy (Avtomatik formatlama)
                            const val = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
                            setCardNumber(val);
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-gray-400">Bitmə tarixi</Label>
                        {/* 🔥 AĞILLI TARİX İNPUTU */}
                        <Input
                          placeholder="MM/YY"
                          className="h-14 rounded-xl border-gray-200 text-center font-mono text-lg"
                          value={expiryDate}
                          onChange={(e) => {
                            // Sırf rəqəmləri saxla və araya '/' qoy
                            const val = e.target.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').substring(0, 5);
                            setExpiryDate(val);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-gray-400">CVV/CVC</Label>
                        <div className="relative">
                          {/* 🔥 AĞILLI CVV İNPUTU */}
                          <Input
                            type={showCvv ? "text" : "password"}
                            placeholder="***"
                            className="h-14 rounded-xl border-gray-200 text-center font-mono text-lg"
                            value={cvv}
                            onChange={(e) => {
                              // Maksimum 4 rəqəm
                              const val = e.target.value.replace(/\D/g, '').substring(0, 4);
                              setCvv(val);
                            }}
                          />
                          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowCvv(!showCvv)}>
                            {showCvv ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button variant="outline" className="h-14 flex-1 rounded-2xl border-gray-200 text-gray-500 font-bold" onClick={() => setStep(1)}>Geri</Button>
                  <Button className="h-14 flex-[2] bg-[#1E3A5F] hover:bg-[#162d4a] rounded-2xl font-bold shadow-lg" onClick={handleProcessBooking} disabled={isLoading}>
                    {isLoading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Prosess edilir...</span> : "Rezervasiyanı Tamamla"}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: TƏSDİQ */}
            {step === 3 && (
              <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-700">
                <div className="w-24 h-24 bg-green-50 rounded-[32px] flex items-center justify-center mx-auto text-green-500 rotate-12">
                  <CheckCircle size={56} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-[#1E3A5F]">Uğurlu Rezervasiya!</h2>
                  <p className="text-gray-400">Səyahət sənədləriniz email ünvanınıza göndərildi.</p>
                </div>
                <div className="p-6 bg-[#F8FAFC] rounded-[24px] border-2 border-dashed border-gray-200 inline-block px-12">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rezervasiya ID</p>
                  <p className="text-3xl font-mono font-black text-[#1E3A5F]">#{finalReservation?.id}</p>
                </div>
                <div className="pt-4">
                  <Link href="/"><Button className="h-14 px-10 bg-[#1E3A5F] rounded-2xl font-bold shadow-xl">Ana Səhifəyə Qayıt</Button></Link>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR - MƏLUMAT KARTI */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E3A5F] text-white p-8 rounded-[32px] shadow-2xl sticky top-32 space-y-6 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full" />
              <h3 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-4">
                <Calendar size={20} className="text-orange-400" /> Səyahət Xülasəsi
              </h3>
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 flex-shrink-0">
                  <img src={hotel?.mainImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} className="w-full h-full object-cover" alt="hotel" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold leading-tight">{hotel?.name}</p>
                  <div className="flex items-center gap-1 text-white/50 text-xs">
                    <MapPin size={12} /> {hotel?.city}
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-400 border-none text-[10px]">{room?.name}</Badge>
                </div>
              </div>
              <div className="space-y-4 pt-4">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Gecəlik qiymət</span>
                  <span className="font-bold text-white">{room?.price} AZN</span>
                </div>
                <div className="flex justify-between text-sm text-white/60">
                  <span>Qonaq sayı</span>
                  <span className="font-bold text-white">{guests} nəfər</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-white/40">Toplam Məbləğ ({nights} gecə)</p>
                    <p className="text-3xl font-black text-white">
                      {room ? (room.price * nights) : 0} <span className="text-sm font-normal text-white/60">AZN</span>
                    </p>
                  </div>
                  <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                    <ShieldCheck size={20} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 p-4 bg-orange-50 rounded-2xl text-orange-700">
              <AlertCircle size={20} className="flex-shrink-0" />
              <p className="text-xs font-medium">Bu rezervasiya üçün pulsuz ləğv imkanı mövcuddur.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Yüklənir...</div>}>
      <BookingContent />
    </Suspense>
  );
}