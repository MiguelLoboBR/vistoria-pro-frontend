
import { useState } from "react";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/company-setup/LoadingState";
import { AuthErrorState } from "@/components/company-setup/AuthErrorState";
import { CompanyForm } from "@/components/company-setup/CompanyForm";
import { IndividualForm } from "@/components/company-setup/IndividualForm";
import { useCompanySetup } from "@/hooks/useCompanySetup";
import Logo from "@/components/Logo";

const CompanySetup = () => {
  const {
    user,
    isSubmitting,
    userId,
    loading,
    authChecked,
    registrationType,
    setRegistrationType,
    logoFile,
    logoPreview,
    handleLogoChange,
    createCompany,
    createIndividualProfile
  } = useCompanySetup();

  if (loading) {
    return <LoadingState message="Verificando sessão..." />;
  }

  if (!authChecked || !userId) {
    return <AuthErrorState />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center">
            <Logo className="mx-auto mb-4" />
          </div>
          <h1 className="text-2xl font-bold">Configuração de Perfil</h1>
          <p className="text-gray-600 mt-2">
            {user?.full_name ? `Olá, ${user.full_name}! ` : ''}
            Complete suas informações para continuar.
          </p>
        </div>

        <Tabs defaultValue={registrationType} onValueChange={(value) => setRegistrationType(value as 'company' | 'individual')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="company">Empresa (CNPJ)</TabsTrigger>
            <TabsTrigger value="individual">Pessoa Física (CPF)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company">
            <CompanyForm 
              onSubmit={createCompany}
              isSubmitting={isSubmitting}
              logoPreview={logoPreview}
              onLogoChange={handleLogoChange}
            />
          </TabsContent>
          
          <TabsContent value="individual">
            <IndividualForm 
              onSubmit={createIndividualProfile}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanySetup;
