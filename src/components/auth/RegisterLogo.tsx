
import React from 'react';

interface RegisterLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const RegisterLogo: React.FC<RegisterLogoProps> = ({ 
  className = "", 
  size = "md",
  showText = true 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-10';
      case 'lg': return 'h-20';
      default: return 'h-16';
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src="/lovable-uploads/723b248a-59de-4007-9e41-5fb830c428d3.png" 
        alt="VistoriaPro Logo" 
        className={`${getSizeClass()} w-auto`}
      />
      {showText && (
        <div className="mt-2 text-center font-semibold">
          <span className="text-vistoria-blue">Vistoria</span>
          <span className="text-vistoria-green">Pro</span>
        </div>
      )}
    </div>
  );
};

export default RegisterLogo;
