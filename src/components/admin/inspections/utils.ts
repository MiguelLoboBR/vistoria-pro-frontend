
export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium";
    case "in_progress":
      return "bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium";
    case "pending":
      return "bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium";
    case "canceled":
      return "bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-medium";
    default:
      return "bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-medium";
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed": return "Concluída";
    case "in_progress": return "Em Andamento";
    case "pending": return "Pendente";
    case "canceled": return "Cancelada";
    default: return status;
  }
};

export const MOCK_INSPECTIONS = [
  {
    id: "VIS-1001",
    address: "Av. Paulista, 1000, Apto 123",
    type: "Entrada",
    date: "15/05/2025",
    inspector: "João Silva",
    status: "completed"
  },
  {
    id: "VIS-1002",
    address: "R. Augusta, 500, Casa 2",
    type: "Saída",
    date: "14/05/2025",
    inspector: "Maria Oliveira",
    status: "completed"
  },
  {
    id: "VIS-1003",
    address: "R. Oscar Freire, 200, Sala 45",
    type: "Periódica",
    date: "13/05/2025",
    inspector: "Carlos Santos", 
    status: "pending"
  },
  {
    id: "VIS-1004",
    address: "Av. Brigadeiro, 800, Apto 42",
    type: "Entrada",
    date: "12/05/2025",
    inspector: "Ana Pereira",
    status: "in_progress"
  },
  {
    id: "VIS-1005",
    address: "R. Haddock Lobo, 595, Sala 204",
    type: "Saída",
    date: "11/05/2025",
    inspector: "Pedro Santos",
    status: "canceled"
  },
];
