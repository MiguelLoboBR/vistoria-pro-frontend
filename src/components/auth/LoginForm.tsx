
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { UserRole } from '@/services/types';

interface LoginFormProps {
  userType: 'admin' | 'inspector';
}

const LoginForm: React.FC<LoginFormProps> = ({ userType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (signIn) {
        // Map userType to actual role
        const role: UserRole = userType === 'admin' ? 'admin_tenant' : 'inspector';
        await signIn(email, password);
        
        // Redirect based on user type
        const redirectPath = userType === 'inspector' ? '/inspector/dashboard' : '/admin/dashboard';
        navigate(redirectPath);
      } else {
        toast("Erro", { 
          description: "signIn function is not available.",
          type: "error"
        });
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast("Falha ao fazer login", {
        description: error.message || "Ocorreu um erro ao tentar fazer login.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="seuemail@exemplo.com"
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha
        </label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="********"
          disabled={loading}
        />
      </div>
      <div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
