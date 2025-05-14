import { useState } from "react";
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, User, Building, MapPin, Camera } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  phone: z.string().optional(),
  currentPassword: z.string().min(6, "A senha atual deve ter pelo menos 6 caracteres"),
  newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
});

export const InspectorProfile = () => {
  const { user, company } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.full_name || "",
      phone: user?.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleUpdateProfile = () => {
    setIsUpdatingProfile(true);
    
    setTimeout(() => {
      setIsUpdatingProfile(false);
      toast.success("Perfil atualizado com sucesso!");
    }, 1500);
  };

  const handleChangePassword = (values: z.infer<typeof formSchema>) => {
    // In a real implementation, we would verify the current password and update it
    toast.success("Senha alterada com sucesso!");
    setIsPasswordDialogOpen(false);
    form.reset({
      fullName: values.fullName,
      phone: values.phone,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleUpdatePhoto = () => {
    toast.info("Recurso de atualização de foto em desenvolvimento");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <InspectorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <p className="text-gray-500">Gerencie suas informações pessoais</p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Left Column - User Info */}
          <Card className="md:col-span-8">
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name || "User"} />
                    <AvatarFallback className="text-lg bg-vistoria-blue text-white">
                      {user?.full_name ? getInitials(user.full_name) : "UN"}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 bg-white"
                    onClick={handleUpdatePhoto}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{user?.full_name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="flex items-center gap-2 text-gray-500 mb-1">
                      <User className="h-4 w-4" />
                      Nome Completo
                    </Label>
                    <Input 
                      value={user?.full_name || ""} 
                      onChange={(e) => {}} 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 text-gray-500 mb-1">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input 
                      value={user?.email || ""} 
                      disabled 
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="flex items-center gap-2 text-gray-500 mb-1">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </Label>
                    <Input 
                      value={user?.phone || ""} 
                      onChange={(e) => {}} 
                      className="mt-1"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 text-gray-500 mb-1">
                      <User className="h-4 w-4" />
                      CPF
                    </Label>
                    <Input 
                      value={user?.cpf || ""} 
                      disabled 
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Alterar Senha</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Alterar Senha</DialogTitle>
                    <DialogDescription>
                      Digite sua senha atual e a nova senha para atualizar.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleChangePassword)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha Atual</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button type="submit">Alterar Senha</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Button 
                onClick={handleUpdateProfile}
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardFooter>
          </Card>

          {/* Right Column - Company Info */}
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
        </div>
      </div>
    </InspectorLayout>
  );
};

export default InspectorProfile;
