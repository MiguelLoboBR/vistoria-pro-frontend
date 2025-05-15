
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/services/types";

export const useInspectors = (companyId?: string) => {
  const queryClient = useQueryClient();
  
  // Query to fetch inspectors
  const inspectorsQuery = useQuery({
    queryKey: ['inspectors', companyId],
    queryFn: async () => {
      if (!companyId) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId)
        .eq('role', 'inspector');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as UserProfile[];
    },
    enabled: !!companyId
  });
  
  // Mutation to create inspector
  const createInspectorMutation = useMutation({
    mutationFn: async ({ fullName, email, password }: { fullName: string, email: string, password: string }) => {
      if (!companyId) {
        throw new Error("Company ID not found");
      }
      
      const { data, error } = await supabase.functions.invoke('add_inspector_to_company', {
        body: {
          company_id: companyId,
          email,
          password,
          full_name: fullName
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspectors', companyId] });
      toast.success("Inspetor criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar inspetor", {
        description: error.message
      });
    },
  });
  
  // Function to delete inspector
  const deleteInspector = async (inspectorId: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este inspetor?");
    if (!confirmDelete) return;
    
    const { error } = await supabase.from('profiles').delete().eq('id', inspectorId);
    if (error) {
      toast.error("Erro ao excluir inspetor", {
        description: error.message
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ['inspectors', companyId] });
      toast.success("Inspetor excluído com sucesso!");
    }
  };
  
  return {
    inspectors: inspectorsQuery.data || [],
    isLoadingInspectors: inspectorsQuery.isLoading,
    inspectorsError: inspectorsQuery.error,
    createInspector: createInspectorMutation.mutate,
    isCreatingInspector: createInspectorMutation.isPending,
    deleteInspector
  };
};
