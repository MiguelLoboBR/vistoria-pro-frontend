
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirecionamento direto para a página de landing
  return <Navigate to="/landing" replace />;
};

export default Index;
