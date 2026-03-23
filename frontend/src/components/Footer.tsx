import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1E3A5F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#FF6B35] flex items-center justify-center">
                <span className="text-white font-bold text-base">A</span>
              </div>
              <span className="font-bold text-2xl">
                Azer<span className="text-[#FF6B35]">Book</span>
              </span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Azərbaycanın premier otel rezervasiya platforması. 500+ otel, ən yaxşı qiymətlər, pulsuz ləğv.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6B35] transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Sürətli Keçidlər</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Əsas Səhifə', href: '/' },
                { label: 'Otel Axtarış', href: '/search' },
                { label: 'Rezervasiyalarım', href: '/dashboard' },
                { label: 'Haqqımızda', href: '#' },
                { label: 'Əlaqə', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-blue-200 hover:text-[#FF6B35] text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Populyar Şəhərlər</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Bakı Otelləri', href: '/search?destination=baku' },
                { label: 'Şəki Otelləri', href: '/search?destination=sheki' },
                { label: 'Qəbələ Otelləri', href: '/search?destination=gabala' },
                { label: 'Quba Otelləri', href: '/search?destination=quba' },
                { label: 'Şahdağ Otelləri', href: '/search?destination=shahdag' },
                { label: 'Naftalan Otelləri', href: '/search?destination=naftalan' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-blue-200 hover:text-[#FF6B35] text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Əlaqə</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#FF6B35] mt-0.5 flex-shrink-0" />
                <span className="text-blue-200 text-sm">Nizami küçəsi 96, AZ1010 Bakı, Azərbaycan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#FF6B35] flex-shrink-0" />
                <a href="tel:+994124008000" className="text-blue-200 hover:text-[#FF6B35] text-sm transition-colors">
                  +994 12 400 80 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#FF6B35] flex-shrink-0" />
                <a href="mailto:info@azerbook.az" className="text-blue-200 hover:text-[#FF6B35] text-sm transition-colors">
                  info@azerbook.az
                </a>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="mt-5">
              <p className="text-xs text-blue-300 mb-2">Ödəniş üsulları</p>
              <div className="flex gap-2 flex-wrap">
                {['Visa', 'MC', 'Amex', 'PayPal'].map((method) => (
                  <div
                    key={method}
                    className="bg-white/10 rounded px-2 py-1 text-xs text-white font-medium"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-blue-300 text-xs">
            © 2025 AzerBook. Bütün hüquqlar qorunur.
          </p>
          <div className="flex items-center gap-4">
            {['Məxfilik Siyasəti', 'İstifadə Şərtləri', 'Cookie'].map((item) => (
              <a key={item} href="#" className="text-blue-300 hover:text-[#FF6B35] text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
