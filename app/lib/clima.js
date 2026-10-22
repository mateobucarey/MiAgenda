const GEOCODING_API_URL = process.env.GEOCODING_API_URL
  || "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_API_URL = process.env.FORECAST_API_URL
  || "https://api.open-meteo.com/v1/forecast";

const REVALIDATE_1_HORA = 60 * 60;

// Códigos WMO "Weather interpretation codes" usados por Open-Meteo,
// traducidos a descripciones breves en español.
const WMO_DESCRIPCIONES = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna leve",
  53: "Llovizna moderada",
  55: "Llovizna intensa",
  56: "Llovizna helada leve",
  57: "Llovizna helada intensa",
  61: "Lluvia leve",
  63: "Lluvia moderada",
  65: "Lluvia intensa",
  66: "Lluvia helada leve",
  67: "Lluvia helada intensa",
  71: "Nevada leve",
  73: "Nevada moderada",
  75: "Nevada intensa",
  77: "Granos de nieve",
  80: "Chaparrones leves",
  81: "Chaparrones moderados",
  82: "Chaparrones intensos",
  85: "Chaparrones de nieve leves",
  86: "Chaparrones de nieve intensos",
  95: "Tormenta eléctrica",
  96: "Tormenta con granizo leve",
  99: "Tormenta con granizo intenso",
};

const normalizarTexto = (value) => (value || "")
  .normalize("NFD")
  .replace(/[̀-ͯ]/g, "")
  .toLowerCase()
  .trim();

const errorResult = (error) => ({ clima: null, error });

async function buscarGeocodificacion(nombre) {
  const url = new URL(GEOCODING_API_URL);
  url.search = new URLSearchParams({
    name: nombre,
    count: "10",
    language: "es",
    format: "json",
  }).toString();

  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_1_HORA },
  });

  if (!response.ok) {
    throw new Error(`La geocodificación respondió ${response.status}.`);
  }

  const data = await response.json();
  return Array.isArray(data?.results) ? data.results : [];
}

async function geocodificarLocalidad({ localidad, provincia }) {
  // Nombres como "Neuquén Capital" no siempre figuran completos en la API;
  // si no hay resultados, se reintenta con la primera palabra significativa.
  let resultados = await buscarGeocodificacion(localidad);
  if (!resultados.length) {
    const primeraPalabra = localidad.split(/\s+/)[0];
    if (primeraPalabra && primeraPalabra !== localidad) {
      resultados = await buscarGeocodificacion(primeraPalabra);
    }
  }

  // Solo se aceptan resultados de Argentina: nunca elegir una localidad
  // de otro país por coincidencia de nombre.
  const argentinos = resultados.filter(
    (lugar) => lugar?.country_code === "AR" || lugar?.country === "Argentina",
  );

  if (!argentinos.length) return null;

  if (provincia) {
    const provinciaBuscada = normalizarTexto(provincia);
    const porProvincia = argentinos.find((lugar) => {
      const admin1 = normalizarTexto(lugar?.admin1);
      return admin1 && (admin1.includes(provinciaBuscada) || provinciaBuscada.includes(admin1));
    });
    if (porProvincia) return porProvincia;
  }

  // Open-Meteo ya ordena por relevancia/población.
  return argentinos[0];
}

async function obtenerPronostico({ latitude, longitude }) {
  const url = new URL(FORECAST_API_URL);
  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,weather_code",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "3",
  }).toString();

  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_1_HORA },
  });

  if (!response.ok) {
    throw new Error(`El pronóstico respondió ${response.status}.`);
  }

  const data = await response.json();
  if (!data?.current || !data?.daily || !Array.isArray(data.daily.time)) {
    throw new Error("El pronóstico devolvió una respuesta inválida.");
  }

  return data;
}

export async function getClima({ localidad, provincia } = {}) {
  const localidadLimpia = typeof localidad === "string" ? localidad.trim() : "";
  if (!localidadLimpia) {
    return {
      clima: null,
      error: "Completá tu localidad en tu perfil para ver el clima.",
      code: "sin-localidad",
    };
  }

  try {
    const lugar = await geocodificarLocalidad({
      localidad: localidadLimpia,
      provincia,
    });

    if (!lugar) {
      return errorResult(`No se encontró la localidad "${localidadLimpia}" en Argentina.`);
    }

    const pronostico = await obtenerPronostico(lugar);

    const dias = pronostico.daily.time.slice(0, 3).map((fecha, index) => ({
      fecha,
      maxima: pronostico.daily.temperature_2m_max?.[index] ?? null,
      minima: pronostico.daily.temperature_2m_min?.[index] ?? null,
      probabilidadLluvia:
        pronostico.daily.precipitation_probability_max?.[index] ?? null,
    }));

    return {
      clima: {
        localidadNombre: lugar.name,
        provinciaNombre: lugar.admin1 || null,
        temperatura: pronostico.current.temperature_2m ?? null,
        humedad: pronostico.current.relative_humidity_2m ?? null,
        descripcion: WMO_DESCRIPCIONES[pronostico.current.weather_code] || "Sin datos",
        dias,
      },
      error: null,
    };
  } catch {
    return errorResult("No se pudo cargar el clima.");
  }
}
