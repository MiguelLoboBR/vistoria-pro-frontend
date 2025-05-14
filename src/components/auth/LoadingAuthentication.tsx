
import React from "react";

export const LoadingAuthentication = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vistoria-blue mb-4"></div>
        <p className="text-gray-600">Verificando autenticação...</p>
      </div>
    </div>
  );
};
