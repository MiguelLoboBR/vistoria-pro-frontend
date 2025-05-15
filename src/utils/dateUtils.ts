
export const formatDate = (dateString: string): string => {
  if (!dateString) return "--/--/----";
  
  // Try to parse the date string
  try {
    // Handle ISO format or simple date format
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      // If input is already in DD/MM/YYYY format, return it
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        return dateString;
      }
      return "--/--/----";
    }
    
    // Format as DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "--/--/----";
  }
};

export const formatTime = (timeString: string | null): string => {
  if (!timeString) return "--:--";
  
  // If it's already in HH:MM format, return it
  if (/^\d{2}:\d{2}$/.test(timeString)) {
    return timeString;
  }
  
  // Try to parse as date
  try {
    const date = new Date(timeString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "--:--";
    }
    
    // Format as HH:MM
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return "--:--";
  }
};

export const formatDateTime = (dateString: string, timeString: string | null): string => {
  return `${formatDate(dateString)} ${formatTime(timeString)}`;
};
