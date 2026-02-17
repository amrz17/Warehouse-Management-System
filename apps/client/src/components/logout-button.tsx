import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner"
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { getToken, isAuthenticated, removeToken } from '@/services/auth.service';
import { logoutApi } from '@/api/auth.api';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => { 
    setLoading(true);
  
    try {
      const token = getToken(); 
      console.log('token', token)
        if (token) {
          await logoutApi(token); 
        }
    } catch (error) {
      console.error("Gagal mencatat log logout di server:", error);
    } finally {
      removeToken();
      toast.info("Berhasil logout.");
      
      navigate('/login', { replace: true });
      setLoading(false);
    }
  };

  if (!isAuthenticated()) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
      className="hover:cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {/* {loading ? 'Keluar...' : 'Keluar'} */}
    </Button>
  );
}