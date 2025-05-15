
export const formatDateTime = (dateString: string, timeString?: string | null) => {
  if (!dateString) return "Data não informada";
  
  try {
    // If dateString already has time information
    if (dateString.includes("T")) {
      const date = new Date(dateString);
      return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } 
    // If we have separate date and time strings
    else if (timeString) {
      return `${dateString} às ${timeString}`;
    } 
    // If we only have date string
    else {
      return dateString;
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};
