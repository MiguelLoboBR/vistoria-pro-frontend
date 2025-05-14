
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building, Mail, Phone, User, MapPin, Calendar, FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export const AdminProfile = () => {
  const { company, user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handlePasswordReset = () => {
    toast.success("E-mail de redefinição de senha enviado com sucesso!");
  };
  
  const handleRequestChange = () => {
    toast.info("Para alterar os dados cadastrais da empresa, entre em contato com o suporte: contato@vistoriapro.app.br");
  };

  const handleUploadLogo = () => {
    // In a real implementation, we would handle file upload here
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success("Logo enviado com sucesso!");
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil da Empresa</h1>
          <p className="text-gray-500">Gerencie os dados da sua empresa e personalizações.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-7">
          {/* Company Information */}
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>Informações cadastrais da sua imobiliária.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex gap-2 items-center text-gray-500 text-sm mb-1">
                    <Building className="h-4 w-4" />
                    <span>Nome da Empresa</span>
                  </div>
                  <p className="font-medium">{company?.name || "Nome não disponível"}</p>
                </div>
                
                <div>
                  <div className="flex gap-2 items-center text-gray-500 text-sm mb-1">
                    <MapPin className="h-4 w-4" />
                    <span>Endereço</span>
                  </div>
                  <p className="font-medium">{company?.address || "Endereço não disponível"}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex gap-2 items-center text-gray-500 text-sm mb-1">
                    <Phone className="h-4 w-4" />
                    <span>Telefone</span>
                  </div>
                  <p className="font-medium">{company?.phone || "Telefone não disponível"}</p>
                </div>
                
                <div>
                  <div className="flex gap-2 items-center text-gray-500 text-sm mb-1">
                    <Mail className="h-4 w-4" />
                    <span>E-mail</span>
                  </div>
                  <p className="font-medium">{company?.email || "Email não disponível"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex gap-2 items-center text-gray-500 text-sm mb-1">
                    <FileText className="h-4 w-4" />
                    <span>CNPJ</span>
                  </div>
                  <p className="font-medium">{company?.cnpj || "CNPJ não disponível"}</p>
                </div>
              </div>
              
              <Button variant="outline" onClick={handleRequestChange} className="w-full">
                Solicitar Alteração de Dados
              </Button>
            </CardContent>
          </Card>
          
          {/* Administrator Information */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Administrador da Empresa</CardTitle>
              <CardDescription>Dados do administrador responsável</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex gap-2 items-center text-gray-500 text-sm mb-1">
                  <User className="h-4 w-4" />
                  <span>Nome Completo</span>
                </div>
                <p className="font-medium">{user?.full_name || "Nome não disponível"}</p>
              </div>
              
              <div>
                <div className="flex gap-2 items-center text-gray-500 text-sm mb-1">
                  <FileText className="h-4 w-4" />
                  <span>CPF</span>
                </div>
                <p className="font-medium">{user?.cpf || "CPF não disponível"}</p>
              </div>
              
              <div>
                <div className="flex gap-2 items-center text-gray-500 text-sm mb-1">
                  <Phone className="h-4 w-4" />
                  <span>Telefone</span>
                </div>
                <p className="font-medium">{user?.phone || "Telefone não disponível"}</p>
              </div>
              
              <div>
                <div className="flex gap-2 items-center text-gray-500 text-sm mb-1">
                  <Mail className="h-4 w-4" />
                  <span>E-mail</span>
                </div>
                <p className="font-medium">{user?.email || "Email não disponível"}</p>
              </div>
              
              <Button onClick={handlePasswordReset}>
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Brand Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Personalização da Marca</CardTitle>
            <CardDescription>Configure a aparência dos seus relatórios e vistorias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Logo Upload */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Logo da Empresa</h3>
                <p className="text-sm text-gray-500">
                  Envie o logo da sua empresa para ser usado nos relatórios e no painel.
                </p>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center">
                  {company?.logo_url ? (
                    <div className="mb-4">
                      <img 
                        src={company.logo_url} 
                        alt="Logo da empresa" 
                        className="h-20 w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  )}
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Arraste e solte seu arquivo aqui, ou clique para selecionar
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleUploadLogo}
                    disabled={isUploading}
                  >
                    {isUploading ? "Enviando..." : "Escolher Arquivo"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB
                </p>
              </div>
              
              {/* Colors */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Cores da Empresa</h3>
                <p className="text-sm text-gray-500">
                  Escolha as cores que serão usadas nos laudos e relatórios.
                </p>
                
                <div className="flex gap-4 items-center mt-6">
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">Cor Primária</label>
                    <div className="w-16 h-16 rounded-lg bg-vistoria-blue relative cursor-pointer">
                      <span className="absolute bottom-0 right-0 bg-white rounded-tl-lg p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">#1A73E8</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">Cor Secundária</label>
                    <div className="w-16 h-16 rounded-lg bg-vistoria-green relative cursor-pointer">
                      <span className="absolute bottom-0 right-0 bg-white rounded-tl-lg p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">#34A853</p>
                  </div>
                </div>
                
                <Button className="mt-4" variant="outline">
                  Salvar Personalização
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
