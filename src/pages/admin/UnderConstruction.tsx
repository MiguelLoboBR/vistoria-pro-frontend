
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface UnderConstructionProps {
  pageName: string;
}

const UnderConstruction = ({ pageName }: UnderConstructionProps) => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">{pageName}</h1>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Construction size={64} className="text-vistoria-blue mb-4" />
            <h2 className="text-xl font-semibold mb-2">Página em Construção</h2>
            <p className="text-gray-500 text-center max-w-md">
              Esta página está sendo desenvolvida e estará disponível em breve.
              Agradecemos sua compreensão.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UnderConstruction;
