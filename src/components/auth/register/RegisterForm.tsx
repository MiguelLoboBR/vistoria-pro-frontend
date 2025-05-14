
import { Link } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CompanyFieldsSection } from "../CompanyFieldsSection";
import { AdminFieldsSection } from "../AdminFieldsSection";
import { AccessFieldsSection } from "../AccessFieldsSection";
import { useRegisterForm } from "@/hooks/useRegisterForm";

export const RegisterForm = () => {
  const { form, isSubmitting, logoPreview, handleLogoChange, onSubmit } = useRegisterForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Company Fields */}
        <CompanyFieldsSection 
          form={form} 
          logoPreview={logoPreview} 
          handleLogoChange={handleLogoChange} 
        />
        
        {/* Admin Fields */}
        <AdminFieldsSection form={form} />
        
        {/* Common Auth Fields */}
        <AccessFieldsSection form={form} />
        
        <Button type="submit" className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-gray-500">Já tem uma conta? <Link to="/login" className="text-vistoria-blue font-medium hover:underline">Entrar</Link></p>
        </div>
      </form>
    </Form>
  );
};
