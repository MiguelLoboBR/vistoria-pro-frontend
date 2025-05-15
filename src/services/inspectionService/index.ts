
import { createInspection } from './createInspection';
import { 
  getCompanyInspections, 
  getInspectorInspections,
  getInspectionById 
} from './getInspections';
import { updateInspection } from './updateInspection';
import { deleteInspection } from './deleteInspection';
import { getCompanyStats } from './getStats';
import { Inspection } from './types';

export type { Inspection };
export type { InspectionStats } from './types';

export const inspectionService = {
  createInspection,
  getCompanyInspections,
  getInspectorInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
  getCompanyStats
};
