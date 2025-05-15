
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ListFilter } from "lucide-react";

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchHeader = ({ searchQuery, setSearchQuery }: SearchHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Buscar por endereço..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <ListFilter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
