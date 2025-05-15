
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterLogo from '@/components/auth/RegisterLogo';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/landing', { replace: true });
  }, [navigate]);

  // Componente de carregamento enquanto o redirecionamento acontece
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <RegisterLogo size="lg" className="mb-6" />
      <div className="text-gray-500">Carregando...</div>
    </div>
  );
};

export default Index;
