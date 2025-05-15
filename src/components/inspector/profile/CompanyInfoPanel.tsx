
import { Building, Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Company } from "@/contexts/types";

interface CompanyInfoPanelProps {
  company: Company | null;
}

export const CompanyInfoPanel = ({ company }: CompanyInfoPanelProps) => {
  return (
    <Card className="md:col-span-4">
      <CardHeader>
        <CardTitle>Empresa</CardTitle>
        <CardDescription>Informações da empresa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {company?.logo_url ? (
            <img 
              src={company.logo_url} 
              alt="Logo da empresa"
              className="h-12 w-auto object-contain" 
            />
          ) : (
            <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
              <Building className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-medium">{company?.name || "Nome da Empresa"}</p>
            <p className="text-xs text-gray-500">{company?.cnpj || "CNPJ não disponível"}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <MapPin className="h-3 w-3" />
              Endereço
            </div>
            <p className="text-sm">{company?.address || "Endereço não disponível"}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Phone className="h-3 w-3" />
              Telefone
            </div>
            <p className="text-sm">{company?.phone || "Telefone não disponível"}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Mail className="h-3 w-3" />
              Email
            </div>
            <p className="text-sm">{company?.email || "Email não disponível"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoPanel;
