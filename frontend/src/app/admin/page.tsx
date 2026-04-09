'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard, Building, BedDouble,
    CalendarCheck, Users, LogOut, CheckCircle,
    XCircle, Clock, Plus, Trash2, Edit, Star, Hash,
    Wallet, Activity, TrendingUp, CheckCircle2, UserCog, ShieldCheck, Ban, Menu
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

const ADMIN_MENU = [
    { id: 'dashboard', label: 'Əsas Panel', icon: LayoutDashboard },
    { id: 'reservations', label: 'Rezervasiyalar', icon: CalendarCheck },
    { id: 'hotels', label: 'Otellər', icon: Building },
    { id: 'rooms', label: 'Otaqlar', icon: BedDouble },
    { id: 'users', label: 'İstifadəçilər', icon: Users },
];

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // <--- YENİ STATE

    // --- STATELƏR ---
    const [reservations, setReservations] = useState<any[]>([]);
    const [hotels, setHotels] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]); // YENİ: İstifadəçilər
    // Yeniləmə (Edit) üçün statelər
    const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
    const [editingRoomId, setEditingRoomId] = useState<number | null>(null);

    // Otel Modalı
    const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
    const [isSubmittingHotel, setIsSubmittingHotel] = useState(false);
    const [hotelForm, setHotelForm] = useState({
        name: '', description: '', city: '', address: '', stars: 5, basePrice: '', mainImageUrl: '', amenities: ''
    });

    // Otaq Modalı
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [isSubmittingRoom, setIsSubmittingRoom] = useState(false);
    const [roomForm, setRoomForm] = useState({
        hotelId: '', name: '', type: '', price: '', capacity: 2
    });

    // 1. Səhifə açılanda bütün əsas məlumatları çəkirik (Dashboard üçün)
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                // Rezervasiyalar
                const resRes = await apiFetch('/api/reservations');
                if (resRes.ok) {
                    const data = await resRes.json();
                    setReservations(data.content ? data.content : (Array.isArray(data) ? data : []));
                } else if (resRes.status === 403) {
                    toast.error('Sizin bu səhifəyə giriş hüququnuz yoxdur!');
                    router.push('/');
                    return;
                }

                // Otellər
                const hotRes = await apiFetch('/api/hotels');
                if (hotRes.ok) {
                    const data = await hotRes.json();
                    setHotels(data.content ? data.content : (Array.isArray(data) ? data : []));
                }

            } catch (error) {
                console.error("Admin data xətası:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, [router]);

    // 2. Tab "rooms" olanda OTAQLARI çəkirik
    useEffect(() => {
        if (activeTab === 'rooms') {
            const fetchRooms = async () => {
                try {
                    const rRes = await apiFetch('/api/rooms');
                    if (rRes.ok) {
                        const data = await rRes.json();
                        setRooms(data.content ? data.content : (Array.isArray(data) ? data : []));
                    }
                } catch (error) {
                    toast.error("Otaqlar çəkilərkən xəta baş verdi");
                }
            };
            fetchRooms();
        }
    }, [activeTab]);

    // 3. Tab "users" olanda İSTİFADƏÇİLƏRİ çəkirik
    useEffect(() => {
        if (activeTab === 'users') {
            const fetchUsers = async () => {
                try {
                    const uRes = await apiFetch('/api/users');
                    if (uRes.ok) {
                        const data = await uRes.json();
                        setUsers(data.content ? data.content : (Array.isArray(data) ? data : []));
                    } else {
                        toast.error("İstifadəçiləri çəkmək mümkün olmadı.");
                        setUsers([]);
                    }
                } catch (error) {
                    console.error("İstifadəçi xətası:", error);
                    toast.error("Sistem xətası baş verdi");
                    setUsers([]);
                }
            };
            fetchUsers();
        }
    }, [activeTab]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/');
    };

    // --- REZERVASIYA ---
    const handleComplete = async (id: number) => {
        try {
            const res = await apiFetch(`/api/reservations/${id}/complete`, { method: 'PATCH' });
            if (res.ok) {
                toast.success(`Rezervasiya #${id} tamamlandı!`);
                setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'COMPLETED' } : r));
            } else { toast.error('Əməliyyat zamanı xəta baş verdi'); }
        } catch (error) { toast.error('Sistem xətası'); }
    };

    // --- OTEL ---
    const handleCreateHotel = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingHotel(true);
        try {
            const payload = {
                name: hotelForm.name, description: hotelForm.description, city: hotelForm.city, address: hotelForm.address,
                stars: hotelForm.stars, rating: Number(hotelForm.stars), basePrice: parseFloat(hotelForm.basePrice),
                mainImageUrl: hotelForm.mainImageUrl,
                amenities: typeof hotelForm.amenities === 'string' ? hotelForm.amenities.split(',').map(item => item.trim()).filter(item => item !== '') : hotelForm.amenities
            };

            // Dinamik URL və Metod
            const url = editingHotelId ? `/api/hotels/${editingHotelId}` : '/api/hotels';
            const method = editingHotelId ? 'PUT' : 'POST';

            const res = await apiFetch(url, { method, body: JSON.stringify(payload) });

            if (res.ok) {
                const savedHotel = await res.json();
                if (editingHotelId) {
                    setHotels(prev => prev.map(h => h.id === editingHotelId ? savedHotel : h));
                    toast.success('Otel uğurla yeniləndi!');
                } else {
                    setHotels(prev => [...prev, savedHotel]);
                    toast.success('Yeni otel uğurla əlavə edildi!');
                }
                setIsHotelModalOpen(false);
                setEditingHotelId(null);
                setHotelForm({ name: '', description: '', city: '', address: '', stars: 5, basePrice: '', mainImageUrl: '', amenities: '' });
            } else { toast.error('Xəta baş verdi'); }
        } catch (error) { toast.error('Sistem xətası'); }
        finally { setIsSubmittingHotel(false); }
    };

    const handleDeleteHotel = async (id: number) => {
        if (!window.confirm('Bu oteli silmək istədiyinizə əminsiniz?')) return;
        try {
            const res = await apiFetch(`/api/hotels/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setHotels(prev => prev.filter(h => h.id !== id));
                toast.success('Otel uğurla silindi!');
            } else { toast.error('Xəta! Aktiv rezervasiyalar ola bilər.'); }
        } catch (error) { toast.error('Sistem xətası'); }
    };

    // --- OTAQ ---
    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingRoom(true);
        try {
            const payload = {
                hotelId: Number(roomForm.hotelId), name: roomForm.name, type: roomForm.type, price: parseFloat(roomForm.price), capacity: Number(roomForm.capacity),
            };

            // Dinamik URL və Metod
            const url = editingRoomId ? `/api/rooms/${editingRoomId}` : '/api/rooms';
            const method = editingRoomId ? 'PUT' : 'POST';

            const res = await apiFetch(url, { method, body: JSON.stringify(payload) });

            if (res.ok) {
                const savedRoom = await res.json();
                if (editingRoomId) {
                    setRooms(prev => prev.map(r => r.id === editingRoomId ? savedRoom : r));
                    toast.success('Otaq uğurla yeniləndi!');
                } else {
                    setRooms(prev => [...prev, savedRoom]);
                    toast.success('Yeni otaq uğurla əlavə edildi!');
                }
                setIsRoomModalOpen(false);
                setEditingRoomId(null);
                setRoomForm({ hotelId: '', name: '', type: '', price: '', capacity: 2 });
            } else { toast.error('Otaq yadda saxlanılarkən xəta baş verdi'); }
        } catch (error) { toast.error('Sistem xətası'); }
        finally { setIsSubmittingRoom(false); }
    };

    const handleDeleteRoom = async (id: number) => {
        if (!window.confirm('Bu otağı silmək istədiyinizə əminsiniz?')) return;
        try {
            const res = await apiFetch(`/api/rooms/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setRooms(prev => prev.filter(r => r.id !== id));
                toast.success('Otaq uğurla silindi!');
            } else { toast.error('Xəta! Bu otaqda aktiv rezervasiya ola bilər.'); }
        } catch (error) { toast.error('Sistem xətası'); }
    };

    const getStatusBadge = (status: string) => {
        const s = status?.toUpperCase();
        if (s === 'CONFIRMED' || s === 'PENDING') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700"><Clock size={12} /> Gözləyir</span>;
        if (s === 'COMPLETED') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle size={12} /> Tamamlanıb</span>;
        if (s === 'CANCELLED') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700"><XCircle size={12} /> Ləğv edilib</span>;
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    };

    // Oteli Yeniləmək üçün Modalı açan funksiya
    const openHotelEditModal = (hotel: any) => {
        setHotelForm({
            name: hotel.name || '',
            description: hotel.description || '',
            city: hotel.city || '',
            address: hotel.address || '',
            stars: hotel.stars || 5,
            basePrice: hotel.basePrice?.toString() || '',
            mainImageUrl: hotel.mainImageUrl || '',
            // Əgər amenities massivdirsə (array), onu vergüllü stringə çeviririk ki, inputda görünsün
            amenities: Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : (hotel.amenities || '')
        });
        setEditingHotelId(hotel.id);
        setIsHotelModalOpen(true);
    };

    // Otağı Yeniləmək üçün Modalı açan funksiya
    const openRoomEditModal = (room: any) => {
        setRoomForm({
            hotelId: room.hotelId?.toString() || '',
            name: room.name || '',
            type: room.type || '',
            price: room.price?.toString() || '',
            capacity: room.capacity || 2
        });
        setEditingRoomId(room.id);
        setIsRoomModalOpen(true);
    };

    // Dinamik Dashboard Statistikaları
    const totalRevenue = reservations.filter(r => r.status?.toUpperCase() !== 'CANCELLED').reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    const recentBookings = [...reservations].sort((a, b) => b.id - a.id).slice(0, 5);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-12 h-12 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen flex bg-gray-50 relative">
            {/* MOBİL ÜÇÜN QARA ARXA PLAN (OVERLAY) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-[#0F172A]/70 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`w-64 bg-[#1E3A5F] text-white flex flex-col fixed h-full z-50 shadow-2xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FF6B35] flex items-center justify-center font-bold">A</div>
                        <span className="font-bold text-xl tracking-wide">Admin<span className="text-[#FF6B35]">Panel</span></span>
                    </div>
                    {/* Mobil menyunu bağlamaq üçün X düyməsi */}
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-white/70 hover:text-white">
                        <XCircle size={24} />
                    </button>
                </div>

                <div className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
                    {ADMIN_MENU.map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileMenuOpen(false); // Menyu seçiləndə avtomatik bağlansın
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/30' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}
                        >
                            <item.icon size={18} /> {item.label}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 transition-all">
                        <LogOut size={18} /> Çıxış
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-0 md:ml-64 p-8 max-w-[1600px] mx-auto">

                <header className="flex justify-between items-center mb-4 md:mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        {/* Mobil menyu düyməsi */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">İdarəetmə Paneli</h1>
                            <p className="text-xs md:text-sm text-gray-500 hidden sm:block">DublStay sisteminə tam nəzarət</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900">Super Admin</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-[#FF6B35] overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=Admin`} alt="admin" />
                        </div>
                    </div>
                </header>

                {/* --- ƏSAS PANEL (DASHBOARD) TABI --- */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* STATS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl w-max mb-4"><Wallet size={24} /></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ümumi Gəlir</p>
                                <h3 className="text-3xl font-black text-slate-900">{totalRevenue.toLocaleString()} <span className="text-sm text-slate-400">AZN</span></h3>
                            </div>
                            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl w-max mb-4"><CalendarCheck size={24} /></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rezervasiyalar</p>
                                <h3 className="text-3xl font-black text-slate-900">{reservations.length}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl w-max mb-4"><Building size={24} /></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Otellər</p>
                                <h3 className="text-3xl font-black text-slate-900">{hotels.length}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl w-max mb-4"><Users size={24} /></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">İstifadəçilər</p>
                                <h3 className="text-3xl font-black text-slate-900">{users.length > 0 ? users.length : '800+'}</h3>
                            </div>
                        </div>

                        {/* RECENT BOOKINGS & QUICK ACTIONS */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900">Son Rezervasiyalar</h3>
                                    <button onClick={() => setActiveTab('reservations')} className="text-xs font-bold text-orange-500 hover:underline">Hamısına bax</button>
                                </div>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                                        <tr><th className="px-6 py-3">ID</th><th className="px-6 py-3">Otel</th><th className="px-6 py-3">Məbləğ</th><th className="px-6 py-3">Status</th></tr>
                                    </thead>
                                    <tbody>
                                        {recentBookings.map((b) => (
                                            <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                <td className="px-6 py-4 font-mono text-slate-500">#{b.id}</td>
                                                <td className="px-6 py-4 font-bold text-slate-900">{b.hotelName}</td>
                                                <td className="px-6 py-4 font-bold text-[#1E3A5F]">{b.totalPrice} AZN</td>
                                                <td className="px-6 py-4">{getStatusBadge(b.status)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* QUICK PANEL */}
                            <div className="bg-[#1E3A5F] rounded-[24px] p-6 text-white relative overflow-hidden shadow-xl">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                                <h3 className="text-lg font-black mb-6 flex items-center gap-2"><TrendingUp className="text-orange-500" /> Qısa Yollar</h3>
                                <div className="space-y-3">
                                    <button onClick={() => { setActiveTab('hotels'); setIsHotelModalOpen(true); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-bold text-sm">
                                        <div className="p-1.5 bg-orange-500 rounded-lg"><Building size={16} /></div> Yeni Otel Əlavə Et
                                    </button>
                                    <button onClick={() => { setActiveTab('rooms'); setIsRoomModalOpen(true); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-bold text-sm">
                                        <div className="p-1.5 bg-blue-500 rounded-lg"><BedDouble size={16} /></div> Yeni Otaq Yarat
                                    </button>
                                    <button onClick={() => setActiveTab('reservations')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-bold text-sm">
                                        <div className="p-1.5 bg-emerald-500 rounded-lg"><CalendarCheck size={16} /></div> Təsdiq Gözləyənlər
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- İSTİFADƏÇİLƏR TABI (YENİ) --- */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Sistem İstifadəçiləri</h2>
                            <p className="text-sm text-gray-500">Qeydiyyatdan keçmiş bütün müştəri və adminlər</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-500">
                                <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">İstifadəçi</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Rol</th>
                                        <th className="px-6 py-4">Qeydiyyat Tarixi</th>
                                        <th className="px-6 py-4 text-right">Əməliyyat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? users.map((u: any) => (
                                        <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                                                    {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                                                </div>
                                                <span className="font-bold text-gray-900">{u.firstName} {u.lastName}</span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-600">{u.email}</td>
                                            <td className="px-6 py-4">
                                                {u.role === 'ADMIN' || u.role === 'ROLE_ADMIN' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700"><ShieldCheck size={12} /> Admin</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600"><UserCog size={12} /> İstifadəçi</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('az-AZ') : '-'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Blokla / Sil">
                                                    <Ban size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (<tr><td colSpan={5} className="px-6 py-10 text-center">İstifadəçi tapılmadı</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- REZERVASIYALAR TABI --- */}
                {activeTab === 'reservations' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Bütün Rezervasiyalar</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-500">
                                <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">İstifadəçi</th>
                                        <th className="px-6 py-4">Otel / Otaq</th>
                                        <th className="px-6 py-4">Məbləğ</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Əməliyyat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.length > 0 ? reservations.map((res: any) => (
                                        <tr key={res.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium text-gray-900">#{res.id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {res.guestName || res.userName || res.user?.firstName || res.user?.email || 'Bilinməyən'}
                                            </td>
                                            <td className="px-6 py-4">{res.hotelName} <br /><span className="text-xs text-slate-400">{res.roomName}</span></td>
                                            <td className="px-6 py-4 font-bold text-[#FF6B35]">{res.totalPrice} AZN</td>
                                            <td className="px-6 py-4">{getStatusBadge(res.status)}</td>
                                            <td className="px-6 py-4 text-right">
                                                {(res.status?.toUpperCase() === 'CONFIRMED' || res.status?.toUpperCase() === 'PENDING') && (
                                                    <button onClick={() => handleComplete(res.id)} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold">
                                                        Təsdiqlə
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (<tr><td colSpan={6} className="px-6 py-10 text-center">Heç nə tapılmadı</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- OTELLƏR TABI --- */}
                {activeTab === 'hotels' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900">Otellərin Siyahısı</h2>
                            <button onClick={() => {
                                setEditingHotelId(null);
                                setHotelForm({ name: '', description: '', city: '', address: '', stars: 5, basePrice: '', mainImageUrl: '', amenities: '' });
                                setIsHotelModalOpen(true);
                            }} className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e55a24] text-white px-4 py-2 rounded-xl text-sm font-medium">                                <Plus size={16} /> Yeni Otel
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-500">
                                <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Şəkil</th><th className="px-6 py-4">Adı</th><th className="px-6 py-4">Şəhər / Ünvan</th>
                                        <th className="px-6 py-4">Ulduz</th><th className="px-6 py-4">Baza Qiyməti</th><th className="px-6 py-4 text-right">Əməliyyat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hotels.length > 0 ? hotels.map((hotel: any) => (
                                        <tr key={hotel.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden">
                                                    <img src={hotel.mainImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} alt="hotel" className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">{hotel.name}</td>
                                            <td className="px-6 py-4 font-medium text-[#1E3A5F]">{hotel.city}</td>
                                            <td className="px-6 py-4"><div className="flex items-center gap-1 text-amber-400">{hotel.stars} <Star size={12} className="fill-amber-400" /></div></td>
                                            <td className="px-6 py-4 font-bold text-[#FF6B35]">{hotel.basePrice} AZN</td>
                                            <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                                <button onClick={() => openHotelEditModal(hotel)} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Yenilə">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteHotel(hotel.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Sil">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (<tr><td colSpan={6} className="px-6 py-10 text-center">Otellər yüklənir...</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- OTAQLAR TABI --- */}
                {activeTab === 'rooms' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Otaqların Siyahısı</h2>
                                <p className="text-sm text-gray-500">Otellərə aid otaqları idarə edin</p>
                            </div>
                            <button onClick={() => {
                                setEditingRoomId(null);
                                setRoomForm({ hotelId: '', name: '', type: '', price: '', capacity: 2 });
                                setIsRoomModalOpen(true);
                            }} className="flex items-center gap-2 bg-[#1E3A5F] hover:bg-blue-900 text-white px-4 py-2 rounded-xl text-sm font-medium">                                <Plus size={16} /> Yeni Otaq
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-500">
                                <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">ID</th><th className="px-6 py-4">Otel</th><th className="px-6 py-4">Otağın Adı</th>
                                        <th className="px-6 py-4">Tipi</th><th className="px-6 py-4">Tutum</th><th className="px-6 py-4">Qiymət</th><th className="px-6 py-4 text-right">Əməliyyat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.length > 0 ? rooms.map((room: any) => (
                                        <tr key={room.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-gray-400">#{room.id}</td>
                                            <td className="px-6 py-4 font-bold text-[#1E3A5F]">{room.hotelName || hotels.find(h => h.id === room.hotelId)?.name || `ID: ${room.hotelId}`}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{room.name}</td>
                                            <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{room.type}</span></td>
                                            <td className="px-6 py-4 flex items-center gap-1 font-bold"><Users size={14} className="text-blue-500" /> {room.capacity}</td>
                                            <td className="px-6 py-4 font-bold text-[#FF6B35]">{room.price} AZN</td>
                                            <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                                <button onClick={() => openRoomEditModal(room)} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Yenilə">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteRoom(room.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Sil">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (<tr><td colSpan={7} className="px-6 py-10 text-center">Heç bir otaq tapılmadı</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </main>

            {/* --- OTEL MODALI --- */}
            {isHotelModalOpen && (
                <div className="fixed inset-0 bg-[#0F172A]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="font-bold text-xl text-[#1E3A5F]">{editingHotelId ? 'Oteli Yenilə' : 'Yeni Otel'}</h2>
                            <button onClick={() => setIsHotelModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><XCircle size={24} /></button>
                        </div>
                        <form onSubmit={handleCreateHotel} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input required value={hotelForm.name} onChange={e => setHotelForm({ ...hotelForm, name: e.target.value })} className="border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" placeholder="Otel Adı" />
                                <input required value={hotelForm.city} onChange={e => setHotelForm({ ...hotelForm, city: e.target.value })} className="border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" placeholder="Şəhər" />
                            </div>
                            <input required value={hotelForm.address} onChange={e => setHotelForm({ ...hotelForm, address: e.target.value })} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" placeholder="Ünvan" />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" min="1" max="5" value={hotelForm.stars} onChange={e => setHotelForm({ ...hotelForm, stars: Number(e.target.value) })} className="border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" placeholder="Ulduz" />
                                <input required type="number" min="0" value={hotelForm.basePrice} onChange={e => setHotelForm({ ...hotelForm, basePrice: e.target.value })} className="border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" placeholder="Başlanğıc Qiymət" />
                            </div>
                            <input required value={hotelForm.amenities} onChange={e => setHotelForm({ ...hotelForm, amenities: e.target.value })} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" placeholder="Xidmətlər (məs: WiFi, Hovuz)" />
                            <input required value={hotelForm.mainImageUrl} onChange={e => setHotelForm({ ...hotelForm, mainImageUrl: e.target.value })} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" placeholder="Şəkil URL" />
                            <textarea required value={hotelForm.description} onChange={e => setHotelForm({ ...hotelForm, description: e.target.value })} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 min-h-[100px]" placeholder="Məlumat" />
                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                <button type="button" onClick={() => setIsHotelModalOpen(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100">Ləğv et</button>
                                <button type="submit" disabled={isSubmittingHotel} className="px-6 py-3 rounded-xl text-sm font-bold bg-[#FF6B35] hover:bg-[#e55a24] text-white disabled:opacity-50 shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                                    {isSubmittingHotel ? 'Gözləyin...' : 'Yadda Saxla'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- OTAQ MODALI --- */}
            {isRoomModalOpen && (
                <div className="fixed inset-0 bg-[#0F172A]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="font-bold text-xl text-[#1E3A5F]">{editingRoomId ? 'Otağı Yenilə' : 'Yeni Otaq'}</h2>
                            <button onClick={() => setIsRoomModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><XCircle size={24} /></button>
                        </div>
                        <form onSubmit={handleCreateRoom} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hansı Otelə Aiddir?</label>
                                <select required value={roomForm.hotelId} onChange={e => setRoomForm({ ...roomForm, hotelId: e.target.value })} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#1E3A5F]">
                                    <option value="" disabled>Otel seçin...</option>
                                    {hotels.map(hotel => <option key={hotel.id} value={hotel.id}>{hotel.name} ({hotel.city})</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Otağın Adı</label>
                                <input required value={roomForm.name} onChange={e => setRoomForm({ ...roomForm, name: e.target.value })} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#1E3A5F]" placeholder="Məs: Presidential Suite" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Otağın Tipi</label>
                                <input required value={roomForm.type} onChange={e => setRoomForm({ ...roomForm, type: e.target.value })} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#1E3A5F]" placeholder="Məs: Deluxe" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tutum</label>
                                    <input required type="number" min="1" max="10" value={roomForm.capacity} onChange={e => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#1E3A5F]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qiymət (AZN)</label>
                                    <input required type="number" step="0.01" min="0.1" value={roomForm.price} onChange={e => setRoomForm({ ...roomForm, price: e.target.value })} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#1E3A5F]" />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                <button type="button" onClick={() => setIsRoomModalOpen(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100">Ləğv et</button>
                                <button type="submit" disabled={isSubmittingRoom} className="px-6 py-3 rounded-xl text-sm font-bold bg-[#1E3A5F] hover:bg-blue-900 text-white disabled:opacity-50 shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                                    {isSubmittingRoom ? 'Gözləyin...' : 'Otağı Yarat'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}