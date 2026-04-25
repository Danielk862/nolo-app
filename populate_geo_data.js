const { createClient } = require("@supabase/supabase-js");

// ⚠️ CONFIGURA ESTOS VALORES con los de tu proyecto Supabase
const SUPABASE_URL = "https://voowvmuuthicknuxsugi.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvb3d2bXV1dGhpY2tudXhzdWdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk1MDIxNSwiZXhwIjoyMDkyNTI2MjE1fQ.nYygYOH-0buS2ccMc581yCPkUmFhz4aKvWkhx8sDp6s"; // Usa service_role, NO la anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const API_BASE = "https://countriesnow.space/api/v0.1";

// Función para esperar (evitar saturar la API)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Obtener países con estados
async function fetchCountriesWithStates() {
  console.log("📡 Obteniendo países y estados...");
  const res = await fetch(`${API_BASE}/countries/states`);
  const json = await res.json();

  if (json.error) throw new Error("Error en API countries/states");
  return json.data; // [{ name, iso2, iso3, states: [{ name, state_code }] }]
}

// Obtener ciudades de un estado específico
async function fetchCities(country, state) {
  try {
    const res = await fetch(`${API_BASE}/countries/state/cities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, state }),
    });
    const json = await res.json();
    return json.error ? [] : json.data; // ["Ciudad1", "Ciudad2", ...]
  } catch {
    return [];
  }
}

// Insertar en lotes para no exceder límites de Supabase
async function insertBatch(table, rows, batchSize = 500) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from(table).insert(batch);
    if (error) {
      console.error(`❌ Error insertando en ${table} (lote ${i}):`, error.message, error.details, error.hint);
      throw new Error(`Insert falló en tabla "${table}": ${error.message}`);
    }
  }
}

async function main() {
  console.log("🚀 Iniciando carga de datos geográficos...\n");

  // 0. Limpiar tablas (CASCADE borra estados y ciudades automáticamente)
  console.log("🗑️ Limpiando tablas existentes...");
  const { error: delErr } = await supabase.from("countries").delete().gte("id", 1);
  if (delErr) throw new Error("No se pudieron limpiar las tablas: " + delErr.message);
  console.log("✅ Tablas limpias\n");

  // 1. Obtener países y estados desde la API
  const countriesData = await fetchCountriesWithStates();
  console.log(`✅ ${countriesData.length} países obtenidos\n`);

  // 2. Insertar países
  console.log("💾 Insertando países...");
  // Deduplicar por nombre (la API puede devolver el mismo país más de una vez)
  const countryRowsMap = new Map();
  for (const c of countriesData) {
    if (!countryRowsMap.has(c.name)) {
      countryRowsMap.set(c.name, {
        name: c.name,
        iso2: c.iso2 || null,
        iso3: c.iso3 || null,
        phone_code: c.phone_code || null,
      });
    }
  }
  const countryRows = [...countryRowsMap.values()];
  await insertBatch("countries", countryRows);
  console.log("✅ Países insertados\n");

  // 3. Obtener IDs de países insertados
  const { data: dbCountries, error: cErr } = await supabase
    .from("countries")
    .select("id, name");
  if (cErr) throw new Error("No se pudieron leer los países: " + cErr.message);

  const countryMap = {};
  dbCountries.forEach((c) => (countryMap[c.name] = c.id));

  // 4. Insertar estados/departamentos
  console.log("💾 Insertando estados/departamentos...");
  const stateRows = [];
  const seenStates = new Set();
  for (const country of countriesData) {
    const countryId = countryMap[country.name];
    if (!countryId || !country.states) continue;

    for (const state of country.states) {
      const key = `${countryId}-${state.name}`;
      if (seenStates.has(key)) continue;
      seenStates.add(key);
      stateRows.push({
        name: state.name,
        state_code: state.state_code || null,
        country_id: countryId,
      });
    }
  }
  await insertBatch("states", stateRows);
  console.log(`✅ ${stateRows.length} estados insertados\n`);

  // 5. Obtener IDs de estados insertados
  const { data: dbStates, error: sErr } = await supabase
    .from("states")
    .select("id, name, country_id");
  if (sErr) throw new Error("No se pudieron leer los estados: " + sErr.message);

  // Mapa: "countryId-stateName" => stateId
  const stateMap = {};
  dbStates.forEach((s) => (stateMap[`${s.country_id}-${s.name}`] = s.id));

  // 6. Insertar ciudades (esto toma tiempo por las llamadas a la API)
  console.log("💾 Obteniendo e insertando ciudades (esto puede tardar varios minutos)...\n");

  let totalCities = 0;
  let countryIndex = 0;

  for (const country of countriesData) {
    countryIndex++;
    const countryId = countryMap[country.name];
    if (!countryId || !country.states) continue;

    const cityRows = [];

    for (const state of country.states) {
      const stateId = stateMap[`${countryId}-${state.name}`];
      if (!stateId) continue;

      const cities = await fetchCities(country.name, state.name);
      const seenCities = new Set();
      for (const cityName of cities) {
        if (seenCities.has(cityName)) continue;
        seenCities.add(cityName);
        cityRows.push({
          name: cityName,
          state_id: stateId,
        });
      }

      // Pausa breve para no saturar la API
      await sleep(100);
    }

    if (cityRows.length > 0) {
      await insertBatch("cities", cityRows);
      totalCities += cityRows.length;
    }

    console.log(
      `  [${countryIndex}/${countriesData.length}] ${country.name}: ${cityRows.length} ciudades`
    );
  }

  console.log(`\n🎉 ¡Carga completada!`);
  console.log(`   Países: ${countryRows.length}`);
  console.log(`   Estados: ${stateRows.length}`);
  console.log(`   Ciudades: ${totalCities}`);
}

main().catch((err) => {
  console.error("💥 Error fatal:", err.message);
  process.exit(1);
});
