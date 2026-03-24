'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Globe, User, Heart, Bell, LogOut, ShieldAlert, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';
import { apiFetch } from '@/lib/api';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isHeroPage = pathname === '/';

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      try {
        const res = await apiFetch('/api/users/me');
        if (res.ok) {
          const data = await res.json();
          const roleString = JSON.stringify(data).toUpperCase();
          setIsAdmin(roleString.includes('"ADMIN"') || roleString.includes('"ROLE_ADMIN"'));
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const openLogin = () => { setAuthMode('login'); setAuthModalOpen(true); setIsMobileMenuOpen(false); };
  const openRegister = () => { setAuthMode('register'); setAuthModalOpen(true); setIsMobileMenuOpen(false); };

  // Dizayn sabitlərini təyin edək
  const isTransparent = isHeroPage && !isScrolled;
  const navClass = isTransparent
    ? 'bg-transparent border-transparent pt-4'
    : 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm py-0';

  const textColor = isTransparent ? 'text-white' : 'text-slate-700';
  const iconHover = isTransparent ? 'hover:bg-white/10' : 'hover:bg-slate-100';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${navClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-500 ${isTransparent ? 'h-20' : 'h-16'}`}>

            {/* 1. LOGO SƏHƏSİ */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8C61] flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform">
                <span className="text-white font-black text-xl italic tracking-tighter">D</span>
              </div>
              <span className={`font-black text-2xl tracking-tight transition-colors ${isTransparent ? 'text-white' : 'text-[#1E3A5F]'}`}>
                Dubl<span className="text-[#FF6B35]">Stay</span>
              </span>
            </Link>

            {/* 2. DESKTOP NAVİQASİYA (Mərkəzdə) */}
            <div className="hidden md:flex items-center bg-white/5 backdrop-blur-sm rounded-full px-1 border border-transparent transition-all">
              {[
                { name: 'Əsas Səhifə', href: '/' },
                { name: 'Otellər', href: '/search' },
                { name: 'İstiqamətlər', href: '/search?destination=baku' }
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-5 py-2 text-xs font-bold uppercase tracking-widest hover:text-[#FF6B35] transition-all relative group ${textColor}`}
                >
                  {link.name}
                  <span className="absolute bottom-1 left-5 right-5 h-0.5 bg-[#FF6B35] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </div>

            {/* 3. DESKTOP AKSİYALAR (Sağda) */}
            <div className="hidden md:flex items-center gap-2">
              <button className={`p-2.5 rounded-full transition-all ${iconHover} ${textColor}`}>
                <Globe size={18} strokeWidth={2.5} />
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-1 ml-2">
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="ghost" size="sm" className={`gap-2 font-black text-[10px] uppercase tracking-tighter border-2 border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white rounded-xl`}>
                        <ShieldAlert size={14} /> Admin
                      </Button>
                    </Link>
                  )}

                  <div className="flex items-center gap-0.5 bg-slate-100/10 p-1 rounded-full border border-white/5">
                    <Link href="/dashboard?tab=saved" className={`p-2.5 rounded-full transition-all flex items-center justify-center ${iconHover} ${textColor}`}>
                      <Heart size={18} strokeWidth={2.5} />
                    </Link>
                    <button className={`p-2.5 rounded-full transition-all ${iconHover} ${textColor}`}>
                      <Bell size={18} strokeWidth={2.5} />
                    </button>

                    <div className="h-8 w-[1px] bg-slate-200/20 mx-1" />

                    <div className="flex items-center gap-2 pl-1 pr-1 group cursor-pointer">
                      <Link href="/dashboard" className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white/10 transition-all">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 flex items-center justify-center text-white shadow-md ring-2 ring-white/20">
                          <User size={16} />
                        </div>
                        <ChevronDown size={14} className={`transition-transform group-hover:rotate-180 ${textColor}`} />
                      </Link>

                      <button onClick={handleLogout} className="p-2.5 rounded-full text-red-400 hover:bg-red-50 hover:text-red-500 transition-all" title="Çıxış">
                        <LogOut size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={openLogin}
                    className={`font-bold text-sm ${textColor} ${iconHover} rounded-xl px-5`}
                  >
                    Daxil ol
                  </Button>
                  <Button
                    size="sm"
                    onClick={openRegister}
                    className="bg-[#FF6B35] hover:bg-[#FF8254] text-white font-bold text-sm rounded-xl px-6 shadow-lg shadow-orange-500/30 transition-all active:scale-95"
                  >
                    Qeydiyyat
                  </Button>
                </div>
              )}
            </div>

            {/* MOBİL MENYU DÜYMƏSİ */}
            <button
              className={`md:hidden p-2 rounded-xl ${iconHover} ${textColor}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* MOBİL MENYU DİZAYNI */}
        <div className={`md:hidden absolute top-full left-4 right-4 mt-2 bg-white rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 transform origin-top ${isMobileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
          <div className="px-6 py-8 space-y-4">
            {[{ name: 'Əsas Səhifə', href: '/' },
            { name: 'Otellər', href: '/search' },
            { name: 'İstiqamətlər', href: '/search?destination=baku' }].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)} // DƏYİŞDİ: Klikləyəndə menyu bağlansın
                className="block text-lg font-black text-slate-900 hover:text-[#FF6B35] transition-colors"
              >
                {item.name}
              </Link>
            ))}

            <div className="h-px bg-slate-100 my-6" />

            {isLoggedIn ? (
              <div className="space-y-4">
                <Link href="/dashboard" className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl font-bold text-slate-700">
                  <User size={20} /> Profilim
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl font-bold text-orange-600">
                    <ShieldAlert size={20} /> Admin Panel
                  </Link>
                )}
                <Button variant="destructive" className="w-full h-14 rounded-2xl font-bold" onClick={handleLogout}>
                  Çıxış et
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-14 rounded-2xl font-bold border-slate-200" onClick={openLogin}>Daxil ol</Button>
                <Button className="h-14 rounded-2xl font-bold bg-[#FF6B35]" onClick={openRegister}>Qeydiyyat</Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onLogin={() => { checkAuthStatus(); setAuthModalOpen(false); }}
      />
    </>
  );
}