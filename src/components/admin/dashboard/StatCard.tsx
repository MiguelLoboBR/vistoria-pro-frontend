
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  color?: "blue" | "green" | "yellow" | "red" | "gray";
  trend?: {
    value: string;
    positive: boolean;
  };
}

export const StatCard = ({ 
  title, 
  value, 
  icon, 
  description,
  color = "gray",
  trend
}: StatCardProps) => {
  const getProgressColor = () => {
    switch (color) {
      case "blue": return "bg-blue-500";
      case "green": return "bg-green-500";
      case "yellow": return "bg-yellow-500";
      case "red": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <p className={`text-xs ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.value}
          </p>
        )}
        {typeof value === 'number' && (
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressColor()}`} 
                style={{ width: `${Math.min(100, value > 0 ? 100 : 0)}%` }} 
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
