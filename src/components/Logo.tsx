
import { Search, Home } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo = ({ className, size = 'md', showText = true }: LogoProps) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${sizes[size]}`}>
        {/* House icon */}
        <div className="text-vistoria-blue">
          <Home className={sizes[size]} strokeWidth={2.5} />
        </div>
        
        {/* Magnifying glass icon */}
        <div className="absolute -right-3 -bottom-1 text-vistoria-green">
          <Search className={`${size === 'sm' ? 'h-5' : size === 'md' ? 'h-6' : 'h-8'}`} strokeWidth={2.5} />
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSizes[size]} text-vistoria-blue leading-tight`}>
            VISTORIA
            <span className="text-vistoria-green">PRO</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
