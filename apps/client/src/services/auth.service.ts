export const TOKEN_KEY = "access_token";

// Helper untuk SSR compatibility
const isBrowser = typeof window !== 'undefined';

export function saveToken(token: string): void {
    if (isBrowser) {
        localStorage.setItem(TOKEN_KEY, token);
    }
}

export function getToken(): string | null {
    if (isBrowser) {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
}

export function removeToken(): void {
    if (isBrowser) {
        localStorage.removeItem(TOKEN_KEY);
    }
}

// Safe base64url decode untuk JWT
function decodeJWT(token: string): any | null {
    try {
        // JWT menggunakan base64url, bukan base64 biasa
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        
        // Convert base64url to base64
        const base64 = base64Url
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        // Add padding
        const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
        
        const jsonPayload = decodeURIComponent(
            atob(padded)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export function isAuthenticated(): boolean {
    if (!isBrowser) return false;
    
    const token = getToken();
    if (!token) return false;

    // Jika token bukan JWT (tidak ada titik), anggap valid
    if (!token.includes('.')) {
        return true; // atau false, tergantung kebutuhan
    }

    try {
        const payload = decodeJWT(token);
        
        if (!payload) {
            removeToken();
            return false;
        }

        // Cek expiration
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            removeToken();
            return false;
        }

        return true;
    } catch {
        removeToken();
        return false;
    }
}

// Optional: Tambahkan fungsi untuk mendapatkan info user dari token
export function getTokenPayload(): any | null {
    const token = getToken();
    if (!token || !token.includes('.')) return null;
    
    return decodeJWT(token);
}