
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "./RegisterForm";

interface CompanyFieldsSectionProps {
  form: UseFormReturn<RegisterFormValues>;
  logoPreview: string | null;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CompanyFieldsSection = ({ 
  form,
  logoPreview,
  handleLogoChange
}: CompanyFieldsSectionProps) => {
  return (
    <div className="space-y-5">
      <h2 className="font-bold text-lg border-b pb-2">Dados da Empresa</h2>
      
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da Empresa</FormLabel>
            <FormControl>
              <Input placeholder="Nome da empresa" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="cnpj"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CNPJ/CPF</FormLabel>
            <FormControl>
              <Input placeholder="Digite o CNPJ ou CPF" {...field} />
            </FormControl>
            <FormDescription>
              Aceita ambos CNPJ ou CPF
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="companyAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Input placeholder="Endereço completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="companyPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone da Empresa</FormLabel>
              <FormControl>
                <Input placeholder="(00) 0000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="companyEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail da Empresa</FormLabel>
              <FormControl>
                <Input placeholder="empresa@exemplo.com" type="email" {...field} />
              </FormControl>
              <FormDescription>
                Opcional, se diferente do e-mail de login
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="space-y-3">
        <FormLabel>Logo da Empresa</FormLabel>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
          {logoPreview ? (
            <div className="mb-4">
              <img 
                src={logoPreview} 
                alt="Logo preview" 
                className="max-h-32 max-w-full object-contain" 
              />
            </div>
          ) : (
            <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
          )}
          
          <p className="text-sm text-gray-500 mb-2">Arraste ou clique para fazer upload</p>
          
          <Input
            id="logo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
          <label htmlFor="logo">
            <div className="bg-vistoria-blue text-white px-4 py-2 rounded cursor-pointer hover:bg-vistoria-darkBlue text-sm">
              Selecionar arquivo
            </div>
          </label>
          <p className="text-xs text-gray-400 mt-2">
            PNG ou JPEG, max 2MB
          </p>
        </div>
      </div>
    </div>
  );
};
