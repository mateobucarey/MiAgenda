const FERIADOS_API_BASE_URL = process.env.FERIADOS_API_BASE_URL
  || "https://api.argentinadatos.com/v1/feriados";

const PROXIMOS_FERIADOS_CANTIDAD = 5;
const REVALIDATE_24_HORAS = 60 * 60 * 24;

const toISODate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isValidFeriado = (item) => item
  && typeof item.fecha === "string"
  && typeof item.nombre === "string";

async function fetchFeriadosDeAnio(year) {
  const response = await fetch(`${FERIADOS_API_BASE_URL}/${year}`, {
    next: { revalidate: REVALIDATE_24_HORAS },
  });

  if (!response.ok) {
    throw new Error(`La API de feriados respondió ${response.status}.`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("La API de feriados devolvió una respuesta inválida.");
  }

  return data
    .filter(isValidFeriado)
    .map((item) => ({
      fecha: item.fecha,
      nombre: item.nombre,
      tipo: typeof item.tipo === "string" ? item.tipo : null,
    }));
}

export async function getProximosFeriados({
  desde = new Date(),
  cantidad = PROXIMOS_FERIADOS_CANTIDAD,
} = {}) {
  try {
    const anioActual = desde.getFullYear();
    const hoy = toISODate(desde);

    const feriados = await fetchFeriadosDeAnio(anioActual);
    const proximos = feriados
      .filter((feriado) => feriado.fecha >= hoy)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    // Cerca de fin de año puede no alcanzar; se completa con el año siguiente.
    if (proximos.length < cantidad) {
      const feriadosSiguienteAnio = await fetchFeriadosDeAnio(anioActual + 1);
      proximos.push(
        ...feriadosSiguienteAnio.sort((a, b) => a.fecha.localeCompare(b.fecha)),
      );
    }

    return { feriados: proximos.slice(0, cantidad), error: null };
  } catch {
    return { feriados: [], error: "No se pudieron cargar los feriados." };
  }
}
