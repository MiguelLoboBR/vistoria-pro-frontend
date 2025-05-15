
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Use Navigate component for immediate redirection without loading state
  return <Navigate to="/landing" replace />;
};

export default Index;
