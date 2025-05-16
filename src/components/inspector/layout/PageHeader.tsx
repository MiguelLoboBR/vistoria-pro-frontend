
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  showBackButton: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, showBackButton }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between h-16 px-4 bg-white border-b md:hidden">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <span className="font-medium truncate max-w-[200px]">{title}</span>
      </div>
    </div>
  );
};

export default PageHeader;
