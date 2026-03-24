'use client';

import { useState, FormEvent } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Facebook, Mail, Lock, User, Phone, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onLogin?: () => void;
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onLogin }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // States... (Məntiq eynidir)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Giriş uğursuzdur');
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      toast.success('Xoş gəldiniz!');
      onLogin?.();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Şifrələr uyğun gəlmir!");
    }
    if (!agreeTerms) {
      return toast.error("Şərtləri qəbul etməlisiniz!");
    }

    setIsLoading(true);
    try {
      // 1. QEYDİYYAT SORĞUSU
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        let errorMessages = "";
        if (data.validationErrors && typeof data.validationErrors === 'object') {
          errorMessages = Object.values(data.validationErrors)
            .map(err => {
              if (String(err).includes('match "^(?:\\+994')) return 'Telefon nömrəsi düzgün formatda deyil (məs: +994501234567)';
              return err;
            }).join('\n• ');
        } else if (data.message && data.message !== "Input validation failed") {
          errorMessages = data.message;
        } else {
          errorMessages = "Məlumatları düzgün daxil etdiyinizdən əmin olun.";
        }
        throw new Error(`Düzəliş edin:\n• ${errorMessages}`);
      }

      // 2. QEYDİYYAT UĞURLUDURSA, DƏRHAL LOGIN EDİRİK (AUTO-LOGIN)
      toast.success('Qeydiyyat uğurludur! Sistemə daxil olunur...');

      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Bayaq qeydiyyatdan keçdiyi email və şifrə
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        // Tokenləri yaddaşa yazırıq
        localStorage.setItem('accessToken', loginData.tokens.accessToken);
        localStorage.setItem('refreshToken', loginData.tokens.refreshToken);

        toast.success('Xoş gəldiniz!');

        // Modalı bağla və valideyn komponentə (Header-ə) daxil olduğunu xəbər ver
        onLogin?.();
        onClose();

        // Formu təmizləyək
        setFirstName(''); setLastName(''); setEmail('');
        setPhone(''); setPassword(''); setConfirmPassword(''); setAgreeTerms(false);
      } else {
        // Əgər auto-login alınmasa (nadir hallarda), login tabına ataq özü girsin
        toast.error('Giriş zamanı xəta oldu. Zəhmət olmasa daxil olun.');
        setActiveTab('login');
      }

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-[28px] border-none shadow-2xl bg-white max-h-[95vh] overflow-y-auto z-[101] no-scrollbar">
        <DialogTitle className="sr-only">AzerBook</DialogTitle>

        {/* HEADER: Minimalist & Premium */}
        <div className="pt-8 pb-4 px-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1E3A5F] mb-4 shadow-lg shadow-blue-900/10">
            <span className="text-white font-black text-2xl italic">A</span>
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            {activeTab === 'login' ? 'Yenidən Xoş Gəldiniz' : 'Hesab Yaradın'}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {activeTab === 'login' ? 'Davam etmək üçün məlumatlarınızı daxil edin' : 'Azərbaycanın ən yaxşı otelləri sizi gözləyir'}
          </p>
        </div>

        <div className="px-8 pb-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
            <TabsList className="w-full mb-6 bg-slate-100/50 p-1 h-10 rounded-xl">
              <TabsTrigger value="login" className="flex-1 rounded-lg text-[11px] font-bold uppercase tracking-wider">Daxil ol</TabsTrigger>
              <TabsTrigger value="register" className="flex-1 rounded-lg text-[11px] font-bold uppercase tracking-wider">Qeydiyyat</TabsTrigger>
            </TabsList>

            {/* LOGIN CONTENT */}
            <TabsContent value="login" className="space-y-4 animate-in fade-in duration-300">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm" required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Şifrə</Label>
                    <button type="button" className="text-[10px] font-bold text-orange-500">Unutmusunuz?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="px-10 h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm" required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-11 bg-[#FF6B35] hover:bg-[#FF8254] text-white font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all active:scale-95">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Giriş Et'}
                </Button>
              </form>

              <div className="relative flex items-center py-2">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="px-3 text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Və ya</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-10 rounded-xl border-slate-100 hover:bg-slate-50 transition-all active:scale-95">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4 mr-2" />
                  <span className="text-[11px] font-bold">Google</span>
                </Button>
                <Button variant="outline" className="h-10 rounded-xl border-slate-100 hover:bg-slate-50 transition-all active:scale-95">
                  <Facebook size={16} className="mr-2 text-[#1877F2] fill-[#1877F2]" />
                  <span className="text-[11px] font-bold">Facebook</span>
                </Button>
              </div>
            </TabsContent>

            {/* REGISTER CONTENT - Compact Mode */}
            <TabsContent value="register" className="space-y-3 animate-in fade-in duration-300">
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ad</Label>
                    <Input placeholder="Vusal" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-10 rounded-xl border-slate-100 bg-slate-50/50 text-sm" required />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Soyad</Label>
                    <Input placeholder="Abbasov" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-10 rounded-xl border-slate-100 bg-slate-50/50 text-sm" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</Label>
                  <Input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-xl border-slate-100 bg-slate-50/50 text-sm" required />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Telefon</Label>
                  <Input placeholder="+994" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-10 rounded-xl border-slate-100 bg-slate-50/50 text-sm" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Şifrə</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 rounded-xl border-slate-100 bg-slate-50/50 text-sm" required />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Təsdiq</Label>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-10 rounded-xl border-slate-100 bg-slate-50/50 text-sm" required />
                  </div>
                </div>

                <div className="flex items-start gap-2 py-1">
                  <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(c) => setAgreeTerms(c as boolean)} className="mt-0.5 h-3.5 w-3.5" />
                  <label htmlFor="terms" className="text-[9px] font-medium text-slate-400 leading-tight">
                    <span className="text-orange-500 font-bold">Şərtləri</span> qəbul edirəm.
                  </label>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-11 bg-[#1E3A5F] hover:bg-[#162d4a] text-white font-bold rounded-xl active:scale-95 transition-all">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Qeydiyyatı Tamamla'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}