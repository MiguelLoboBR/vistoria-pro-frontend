
import { Home, Search } from "lucide-react";

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
      <div className={`${sizes[size]}`}>
        <img 
          src="/lovable-uploads/5f177951-9411-4feb-ab50-3e454df28a29.png" 
          alt="VistoriaPro Logo" 
          className={`${sizes[size]} h-auto w-auto`}
        />
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
