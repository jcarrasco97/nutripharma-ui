export const obtenerUltimos6Meses = () => {
  const mesesNombres = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];
  
  const resultado = [];
  const fechaActual = new Date();
  
  for (let i = 0; i < 6; i++) {
    const d = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - i, 1);
    resultado.push(`${mesesNombres[d.getMonth()]}-${d.getFullYear()}`);
  }
  return resultado;
};
