
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/layouts/AdminLayout";
import { CalendarDays, Users, CheckCircle2, Clock, AlertCircle, BarChart3 } from "lucide-react";

export const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Bem-vindo ao painel administrativo do VistoriaPro.</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vistorias Totais</CardTitle>
              <CalendarDays className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-gray-500">+22% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vistoriadores Ativos</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-gray-500">+1 novo este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vistorias Concluídas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-gray-500">90% de taxa de conclusão</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42 min</div>
              <p className="text-xs text-gray-500">-5 min em relação ao mês anterior</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Inspections */}
        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Vistorias Recentes</CardTitle>
              <CardDescription>Últimas vistorias realizadas pela sua equipe.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500 bg-gray-50 border-b">
                      <th className="py-2 px-4 text-left">ID</th>
                      <th className="py-2 px-4 text-left">Endereço</th>
                      <th className="py-2 px-4 text-left">Vistoriador</th>
                      <th className="py-2 px-4 text-left">Data</th>
                      <th className="py-2 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: "VIS-1234",
                        address: "Av. Paulista, 1000, Apto 123",
                        inspector: "João Silva",
                        date: "15/05/2025",
                        status: "concluída"
                      },
                      {
                        id: "VIS-1235",
                        address: "R. Augusta, 500, Casa 2",
                        inspector: "Maria Oliveira",
                        date: "14/05/2025",
                        status: "concluída"
                      },
                      {
                        id: "VIS-1236",
                        address: "R. Oscar Freire, 200, Sala 45",
                        inspector: "Carlos Santos",
                        date: "13/05/2025",
                        status: "pendente"
                      },
                      {
                        id: "VIS-1237",
                        address: "Av. Brigadeiro, 800, Apto 42",
                        inspector: "Ana Pereira",
                        date: "12/05/2025",
                        status: "concluída"
                      },
                    ].map((item, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{item.id}</td>
                        <td className="py-3 px-4 text-sm">{item.address}</td>
                        <td className="py-3 px-4 text-sm">{item.inspector}</td>
                        <td className="py-3 px-4 text-sm">{item.date}</td>
                        <td className="py-3 px-4">
                          <span className={item.status === "concluída" ? "status-ok" : "status-warning"}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Vistorias por Status</CardTitle>
              <CardDescription>Distribuição atual de vistorias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Concluídas</span>
                    </div>
                    <span className="font-medium">128</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span>Em andamento</span>
                    </div>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "6%" }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span>Pendentes</span>
                    </div>
                    <span className="font-medium">6</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "4%" }}></div>
                  </div>
                </div>
                
                {/* Small chart placeholder */}
                <div className="flex items-center justify-center pt-4">
                  <BarChart3 className="h-32 w-32 text-gray-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Alerts and notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="flex-1">
              <CardTitle>Alertas e Notificações</CardTitle>
              <CardDescription>Informações importantes que precisam de sua atenção</CardDescription>
            </div>
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3 items-start pb-3 border-b">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                <div>
                  <p className="font-medium">Vistoria atrasada</p>
                  <p className="text-sm text-gray-500">
                    A vistoria VIS-1230 (R. Haddock Lobo, 595) está 2 dias atrasada.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start pb-3 border-b">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div>
                <div>
                  <p className="font-medium">Contrato próximo do vencimento</p>
                  <p className="text-sm text-gray-500">
                    O contrato do vistoriador Carlos Santos vence em 5 dias.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="font-medium">Atualização disponível</p>
                  <p className="text-sm text-gray-500">
                    Nova versão do app VistoriaPro disponível para vistoriadores.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
