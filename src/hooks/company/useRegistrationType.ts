
import { useState, useEffect } from "react";

export const useRegistrationType = () => {
  const [registrationType, setRegistrationType] = useState<'company' | 'individual'>('company');
  
  // Load stored company details
  useEffect(() => {
    const storedCompanyDetails = localStorage.getItem('pendingCompanySetup');
    if (storedCompanyDetails) {
      try {
        const details = JSON.parse(storedCompanyDetails);
        setRegistrationType(details.type || 'company');
      } catch (e) {
        console.error("Error parsing stored registration details:", e);
      }
    }
  }, []);
  
  return {
    registrationType,
    setRegistrationType
  };
};
