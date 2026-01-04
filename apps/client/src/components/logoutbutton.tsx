// components/SimpleLogoutButton.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner"
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { isAuthenticated, removeToken } from '@/services/auth.service';

export function SimpleLogoutButton() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoading(true);
    
    // Simulasi loading
    setTimeout(() => {
      removeToken();
      
      toast.info("Berhasil logout. Sampai jumpa kembali!");

      
      navigate('/login', { replace: true });
      setLoading(false);
    }, 500);
  };

  if (!isAuthenticated()) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? 'Keluar...' : 'Keluar'}
    </Button>
  );
}