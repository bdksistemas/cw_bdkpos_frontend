/** Rango por defecto de los reportes, en fecha LOCAL (toISOString() es UTC y de noche da el día siguiente). */
export function rangoPorDefecto(tipo: 'hoy' | 'mes'): { inicial: string; final: string } {
  const hoy = new Date();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  const final = `${hoy.getFullYear()}-${mm}-${dd}`;
  return { inicial: tipo === 'mes' ? `${hoy.getFullYear()}-${mm}-01` : final, final };
}
