
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompanySetup } from "@/hooks/useCompanySetup";
import { CompanyForm } from "@/components/company-setup/CompanyForm";
import { IndividualForm } from "@/components/company-setup/IndividualForm";
import { LoadingState } from "@/components/company-setup/LoadingState";
import { AuthErrorState } from "@/components/company-setup/AuthErrorState";

export const CompanySetup = () => {
  const {
    user,
    isSubmitting,
    loading,
    authChecked,
    registrationType,
    setRegistrationType,
    logoPreview,
    handleLogoChange,
    createCompany,
    createIndividualProfile
  } = useCompanySetup();
  
  // If already loaded and no user is found, show the error state
  if (authChecked && !user) {
    return <AuthErrorState />;
  }
  
  // Show loading state while checking authentication
  if (loading) {
    return <LoadingState />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Configuração Inicial</h1>
          <p className="text-gray-600 mt-2">
            Complete seus dados para começar a usar o sistema VistoriaPro
          </p>
        </div>
        
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Selecione o tipo de perfil</CardTitle>
            <CardDescription>
              Escolha entre uma empresa ou perfil individual
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs 
              value={registrationType} 
              onValueChange={(value) => setRegistrationType(value as 'company' | 'individual')} 
              className="space-y-6"
            >
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                <TabsTrigger value="company">Empresa</TabsTrigger>
                <TabsTrigger value="individual">Individual</TabsTrigger>
              </TabsList>
              
              <TabsContent value="company" className="mt-6 space-y-6">
                <CompanyForm 
                  onSubmit={createCompany}
                  isSubmitting={isSubmitting}
                  logoPreview={logoPreview}
                  onLogoChange={handleLogoChange}
                />
              </TabsContent>
              
              <TabsContent value="individual" className="mt-6 space-y-6">
                <IndividualForm 
                  onSubmit={createIndividualProfile}
                  isSubmitting={isSubmitting}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanySetup;
