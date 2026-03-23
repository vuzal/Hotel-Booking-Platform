import { toast } from 'sonner';

// 1. Dinamik URL (Localhost xətası düzəldildi)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    // 2. SSR Qorunması (Əgər serverdə işləyirsə, sadəcə fetch et və çıx)
    if (typeof window === 'undefined') {
        return fetch(`${BASE_URL}${endpoint}`, options);
    }

    let token = localStorage.getItem('accessToken');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    let response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401 || response.status === 403) {
        console.log("🚨 1. Access token öldü! Refresh prosesi başlayır...");
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            console.log("✅ 2. LocalStorage-də Refresh Token tapıldı, backend-ə göndərilir...");
            try {
                const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken })
                });

                console.log("📡 3. Backend-dən Refresh sorğusuna gələn cavabın statusu:", refreshRes.status);

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    console.log("🎁 4. Backend-dən gələn təzə data:", data);

                    // 3. MƏNTİQ XƏTASI DÜZƏLDİLDİ: "tokens" obyektinin olub-olmadığını yoxlayırıq
                    const newAccessToken = data.tokens ? data.tokens.accessToken : data.accessToken;
                    const newRefreshToken = data.tokens ? data.tokens.refreshToken : data.refreshToken;

                    if (newAccessToken) localStorage.setItem('accessToken', newAccessToken);
                    if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

                    const retryHeaders: Record<string, string> = {
                        ...headers as Record<string, string>,
                        'Authorization': `Bearer ${newAccessToken}`
                    };

                    response = await fetch(`${BASE_URL}${endpoint}`, {
                        ...options,
                        headers: retryHeaders,
                    });

                    console.log("🚀 5. Yarımçıq qalan sorğu yeni tokenlə uğurla təkrarlandı!");
                } else {
                    console.log("❌ 5. Backend Refresh tokeni QƏBUL ETMƏDİ. Status:", refreshRes.status);
                    throw new Error("Refresh token expired");
                }
            } catch (error) {
                console.log("💥 6. Nəsə partladı, istifadəçi çölə atılır:", error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/';
                toast.error('Sessiyanın vaxtı bitdi, zəhmət olmasa yenidən daxil olun.');
            }
        } else {
            console.log("❌ 2. LocalStorage-də Refresh token YOXDUR!");
            localStorage.removeItem('accessToken');
            window.location.href = '/';
        }
    }

    return response;
}