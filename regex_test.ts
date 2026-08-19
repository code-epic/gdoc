const text = "- Teniente de Corbeta BÁRBARA KIMBERLY DUEÑAS ROMERO, C.I. N° 27.903.277, Jefa, p/v.";
const regexPersona = /([^,]+),\s*(?:C\.I\.\s*N[°º]?|C\.I\.|N[°º])\s*([\d\.]+)\s*,\s*([^,]+)/i;
const matchPersona = text.match(regexPersona);
if (matchPersona) {
  const nombreRaw = matchPersona[1];
  const nombreMatches = nombreRaw.match(/[A-ZÁÉÍÓÚÑ\s]+$/);
  const nombre = nombreMatches ? nombreMatches[0].trim() : nombreRaw.trim();
  console.log("Nombre:", nombre);
  console.log("Cedula:", matchPersona[2]);
  console.log("Cargo:", matchPersona[3]);
}
