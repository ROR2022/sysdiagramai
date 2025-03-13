/**
 * Formatear una fecha en formato legible
 * @param date Fecha a formatear (objeto Date, string o número)
 * @returns Fecha formateada como string (ej: "12 Mar 2025, 14:30")
 */
export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date);
  
  // Opciones de formato
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return new Intl.DateTimeFormat('es-ES', options).format(dateObj);
}
