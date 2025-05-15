
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Format a date string to a readable date format
export const formatDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy", { locale: ptBR });
  } catch (error) {
    return dateStr; // Return the original string if parsing fails
  }
};

// Format a date string to a readable date and time format
export const formatDateTime = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy HH:mm", { locale: ptBR });
  } catch (error) {
    return dateStr; // Return the original string if parsing fails
  }
};

// Format a date string to a readable time format
export const formatTime = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), "HH:mm", { locale: ptBR });
  } catch (error) {
    return dateStr; // Return the original string if parsing fails
  }
};
