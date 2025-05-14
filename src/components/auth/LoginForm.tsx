
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

interface LoginFormProps {
  userType: UserRole;
}

export const LoginForm = ({ userType }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [emailForConfirmation, setEmailForConfirmation] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleResendConfirmation = async () => {
    if (!emailForConfirmation) return;
    
    setIsLoading(true);
    try {
      await supabase.auth.resend({
        type: 'signup',
        email: emailForConfirmation,
      });
      toast.success("Link de confirmação reenviado para seu e-mail!");
    } catch (error: any) {
      toast.error(`Erro ao reenviar o e-mail de confirmação: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setShowResendConfirmation(false);
    
    try {
      console.log("Tentando fazer login com:", values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) throw error;
      
      toast.success("Login bem-sucedido!");
      console.log("Login bem-sucedido, redirecionando...");
      
      // Get user metadata to check actual role
      const role = data.user?.user_metadata?.role || "inspector";
      
      // Force redirection based on actual user role from metadata
      if (role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/inspector/dashboard";
      }
      
    } catch (error: any) {
      console.error("Erro de login:", error);
      
      if (error.message.includes("Email não confirmado") || 
          error.message.includes("Email not confirmed")) {
        setShowResendConfirmation(true);
        setEmailForConfirmation(values.email);
        toast.error(
          "Email não confirmado. Por favor, verifique sua caixa de entrada para o link de confirmação."
        );
      } else {
        toast.error(`Erro ao fazer login: ${error.message}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input 
                  placeholder="seu@email.com" 
                  type="email" 
                  {...field} 
                  disabled={isLoading} 
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="Sua senha" 
                    type={showPassword ? "text" : "password"} 
                    {...field} 
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        
        {showResendConfirmation && (
          <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800 mb-2">
              Seu email ainda não foi confirmado. Verifique sua caixa de entrada ou reenvie o email de confirmação.
            </p>
            <Button 
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResendConfirmation}
              disabled={isLoading}
            >
              Reenviar email de confirmação
            </Button>
          </div>
        )}
        
        <div className="text-center">
          <Button variant="link" className="text-sm text-vistoria-blue" disabled={isLoading}>
            Esqueci minha senha
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
