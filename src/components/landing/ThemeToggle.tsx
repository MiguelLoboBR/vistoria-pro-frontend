
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  // Carrega o tema atual ao montar o componente
  useEffect(() => {
    const savedTheme = localStorage.getItem("vistoria-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (prefersDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("vistoria-theme", newTheme);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Alternar tema"
      className="rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-500 dark:border-gray-600"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-gray-400 dark:text-gray-300" />
      ) : (
        <Sun className="h-5 w-5 text-gray-400 dark:text-gray-300" />
      )}
    </Button>
  );
}

export default ThemeToggle;
