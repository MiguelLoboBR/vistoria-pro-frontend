
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile, Inspector } from '@/services/types';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/services/authService/types';

export type InspectorFormValues = {
  fullName: string;
  email: string;
  password: string;
};

export function useInspectors(companyId: string | undefined) {
  const [inspectors, setInspectors] = useState<Inspector[]>([]);
  const [isLoadingInspectors, setIsLoadingInspectors] = useState(false);
  const [isCreatingInspector, setIsCreatingInspector] = useState(false);
  const { registerInspector } = useAuth();

  const fetchInspectors = async () => {
    if (!companyId) {
      console.log("useInspectors: No companyId provided, cannot fetch inspectors");
      return;
    }
    
    setIsLoadingInspectors(true);
    console.log("useInspectors: Fetching inspectors for company", companyId);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId)
        .eq('role', 'inspector');
      
      if (error) {
        throw error;
      }
      
      console.log("useInspectors: Found", data?.length || 0, "inspectors");
      
      // Convert to Inspector type
      const inspectorData = data?.map(profile => ({
        ...profile,
        role: profile.role as UserRole,
        inspections_count: 0
      })) || [];
      
      setInspectors(inspectorData);
    } catch (error: any) {
      toast.error('Failed to load inspectors: ' + error.message);
      console.error('Error fetching inspectors:', error);
    } finally {
      setIsLoadingInspectors(false);
    }
  };

  const createInspector = async (values: InspectorFormValues, options?: { onSuccess?: () => void }) => {
    if (!companyId) {
      toast.error('No company ID available');
      return;
    }
    
    console.log("useInspectors: Creating inspector for company", companyId);
    setIsCreatingInspector(true);
    
    try {
      const { fullName, email, password } = values;
      
      const inspector = await registerInspector(email, password, fullName, companyId);
      
      if (inspector) {
        toast.success('Inspector created successfully');
        await fetchInspectors(); // Refresh the list
        options?.onSuccess?.();
        return inspector;
      }
    } catch (error: any) {
      toast.error('Error creating inspector: ' + error.message);
      console.error('Error creating inspector:', error);
    } finally {
      setIsCreatingInspector(false);
    }
  };

  const deleteInspector = async (inspectorId: string) => {
    try {
      // Note: This requires a Supabase function or admin privileges
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', inspectorId)
        .eq('role', 'inspector');
      
      if (error) throw error;
      
      toast.success('Inspector deleted successfully');
      // Update the local state
      setInspectors(inspectors.filter(inspector => inspector.id !== inspectorId));
    } catch (error: any) {
      toast.error('Failed to delete inspector: ' + error.message);
      console.error('Error deleting inspector:', error);
    }
  };

  // Fetch inspectors when companyId changes
  useEffect(() => {
    if (companyId) {
      console.log("useInspectors: CompanyId changed, fetching inspectors");
      fetchInspectors();
    }
  }, [companyId]);

  return {
    inspectors,
    isLoadingInspectors,
    fetchInspectors,
    createInspector,
    isCreatingInspector,
    deleteInspector
  };
}
