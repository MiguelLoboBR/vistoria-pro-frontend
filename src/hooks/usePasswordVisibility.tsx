
import { useState } from "react";

export function usePasswordVisibility() {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  return {
    showPassword,
    togglePasswordVisibility
  };
}
