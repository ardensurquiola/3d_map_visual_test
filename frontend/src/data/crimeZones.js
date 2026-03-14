/**
 * Crime risk zones for the CDMX Metropolitan Area.
 * Polygon coordinates are approximate administrative boundaries
 * (simplified for visualization).
 *
 * crime_index: 0.0 (safe) → 1.0 (very dangerous)
 * Source: SESNSP Incidencia Delictiva 2024 (delitos del fuero común por municipio).
 * Polygons: simplified approximations of official INEGI boundaries.
 *
 * GeoJSON coordinate order: [longitude, latitude]
 */

export const CRIME_ZONES = {
  type: 'FeatureCollection',
  features: [

    // ══════════════════════════════════════════════════════════════
    //  CIUDAD DE MÉXICO — Alcaldías
    // ══════════════════════════════════════════════════════════════

    {
      type: 'Feature',
      properties: {
        name: 'Iztapalapa',
        state: 'Ciudad de México',
        crime_index: 0.90,
        risk_level: 'Muy Alto',
        info: 'Mayor volumen delictivo de CDMX. ~4,200 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.110, 19.386],
          [-99.107, 19.358],
          [-99.096, 19.328],
          [-99.075, 19.315],
          [-99.050, 19.316],
          [-99.025, 19.328],
          [-99.000, 19.343],
          [-98.982, 19.360],
          [-98.975, 19.380],
          [-98.980, 19.403],
          [-99.005, 19.430],
          [-99.042, 19.434],
          [-99.072, 19.428],
          [-99.094, 19.418],
          [-99.110, 19.400],
          [-99.110, 19.386],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Gustavo A. Madero',
        state: 'Ciudad de México',
        crime_index: 0.80,
        risk_level: 'Alto',
        info: '2ª alcaldía más peligrosa de CDMX. ~3,100 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.148, 19.476],
          [-99.138, 19.467],
          [-99.112, 19.464],
          [-99.085, 19.464],
          [-99.067, 19.468],
          [-99.068, 19.492],
          [-99.073, 19.522],
          [-99.082, 19.546],
          [-99.098, 19.558],
          [-99.120, 19.557],
          [-99.140, 19.545],
          [-99.150, 19.523],
          [-99.152, 19.498],
          [-99.148, 19.476],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Cuauhtémoc',
        state: 'Ciudad de México',
        crime_index: 0.75,
        risk_level: 'Alto',
        info: 'Incluye Tepito, La Merced y Centro Histórico. ~3,500 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.174, 19.440],
          [-99.168, 19.428],
          [-99.152, 19.418],
          [-99.132, 19.414],
          [-99.112, 19.420],
          [-99.105, 19.432],
          [-99.108, 19.448],
          [-99.120, 19.464],
          [-99.142, 19.473],
          [-99.165, 19.472],
          [-99.178, 19.460],
          [-99.178, 19.447],
          [-99.174, 19.440],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Iztacalco',
        state: 'Ciudad de México',
        crime_index: 0.70,
        risk_level: 'Alto',
        info: '~2,800 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.132, 19.414],
          [-99.118, 19.404],
          [-99.105, 19.398],
          [-99.092, 19.400],
          [-99.082, 19.406],
          [-99.080, 19.420],
          [-99.086, 19.432],
          [-99.108, 19.436],
          [-99.132, 19.432],
          [-99.142, 19.422],
          [-99.138, 19.415],
          [-99.132, 19.414],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Venustiano Carranza',
        state: 'Ciudad de México',
        crime_index: 0.65,
        risk_level: 'Alto',
        info: '~2,600 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.132, 19.432],
          [-99.108, 19.436],
          [-99.086, 19.432],
          [-99.082, 19.443],
          [-99.086, 19.458],
          [-99.105, 19.466],
          [-99.128, 19.466],
          [-99.142, 19.458],
          [-99.146, 19.444],
          [-99.140, 19.434],
          [-99.132, 19.432],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Tláhuac',
        state: 'Ciudad de México',
        crime_index: 0.72,
        risk_level: 'Alto',
        info: '~2,900 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.048, 19.332],
          [-99.032, 19.318],
          [-99.010, 19.310],
          [-98.990, 19.308],
          [-98.968, 19.320],
          [-98.958, 19.340],
          [-98.962, 19.362],
          [-98.978, 19.380],
          [-98.998, 19.384],
          [-99.022, 19.372],
          [-99.040, 19.354],
          [-99.052, 19.342],
          [-99.048, 19.332],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Azcapotzalco',
        state: 'Ciudad de México',
        crime_index: 0.65,
        risk_level: 'Alto',
        info: 'Zona industrial norte. ~2,500 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.222, 19.478],
          [-99.212, 19.468],
          [-99.195, 19.462],
          [-99.172, 19.462],
          [-99.158, 19.466],
          [-99.150, 19.478],
          [-99.152, 19.496],
          [-99.164, 19.512],
          [-99.186, 19.522],
          [-99.212, 19.520],
          [-99.228, 19.508],
          [-99.226, 19.490],
          [-99.222, 19.478],
        ]],
      },
    },

    // ══════════════════════════════════════════════════════════════
    //  ESTADO DE MÉXICO — Municipios
    // ══════════════════════════════════════════════════════════════

    {
      type: 'Feature',
      properties: {
        name: 'Ecatepec de Morelos',
        state: 'Estado de México',
        crime_index: 0.95,
        risk_level: 'Muy Alto',
        info: 'Municipio más peligroso del EdoMex. ~5,100 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.074, 19.542],
          [-99.056, 19.533],
          [-99.030, 19.526],
          [-99.005, 19.530],
          [-98.984, 19.540],
          [-98.964, 19.558],
          [-98.957, 19.582],
          [-98.959, 19.606],
          [-98.972, 19.632],
          [-98.996, 19.658],
          [-99.027, 19.672],
          [-99.057, 19.674],
          [-99.082, 19.660],
          [-99.098, 19.638],
          [-99.100, 19.610],
          [-99.092, 19.582],
          [-99.076, 19.558],
          [-99.074, 19.542],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Nezahualcóyotl',
        state: 'Estado de México',
        crime_index: 0.85,
        risk_level: 'Muy Alto',
        info: '~3,800 delitos/100k hab. Alta densidad de tiendas.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.064, 19.372],
          [-99.050, 19.364],
          [-99.030, 19.358],
          [-99.008, 19.357],
          [-98.990, 19.362],
          [-98.978, 19.378],
          [-98.975, 19.400],
          [-98.980, 19.420],
          [-98.998, 19.434],
          [-99.020, 19.440],
          [-99.046, 19.436],
          [-99.066, 19.428],
          [-99.080, 19.415],
          [-99.082, 19.396],
          [-99.074, 19.381],
          [-99.064, 19.372],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Chimalhuacán',
        state: 'Estado de México',
        crime_index: 0.87,
        risk_level: 'Muy Alto',
        info: '~4,000 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-98.980, 19.410],
          [-98.972, 19.398],
          [-98.964, 19.384],
          [-98.952, 19.374],
          [-98.938, 19.370],
          [-98.922, 19.375],
          [-98.916, 19.390],
          [-98.918, 19.412],
          [-98.928, 19.432],
          [-98.948, 19.450],
          [-98.968, 19.456],
          [-98.986, 19.452],
          [-98.994, 19.436],
          [-98.986, 19.420],
          [-98.980, 19.410],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Tlalnepantla de Baz',
        state: 'Estado de México',
        crime_index: 0.72,
        risk_level: 'Alto',
        info: 'Corredor industrial NW. ~2,900 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.232, 19.500],
          [-99.222, 19.488],
          [-99.208, 19.480],
          [-99.186, 19.477],
          [-99.163, 19.478],
          [-99.148, 19.486],
          [-99.142, 19.500],
          [-99.148, 19.522],
          [-99.162, 19.538],
          [-99.186, 19.548],
          [-99.212, 19.550],
          [-99.235, 19.542],
          [-99.250, 19.526],
          [-99.250, 19.510],
          [-99.238, 19.500],
          [-99.232, 19.500],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Naucalpan de Juárez',
        state: 'Estado de México',
        crime_index: 0.68,
        risk_level: 'Alto',
        info: '~2,600 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.332, 19.476],
          [-99.320, 19.458],
          [-99.300, 19.444],
          [-99.278, 19.438],
          [-99.255, 19.440],
          [-99.238, 19.450],
          [-99.230, 19.466],
          [-99.232, 19.487],
          [-99.246, 19.507],
          [-99.264, 19.522],
          [-99.284, 19.532],
          [-99.310, 19.532],
          [-99.328, 19.520],
          [-99.338, 19.500],
          [-99.332, 19.476],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Tultitlán',
        state: 'Estado de México',
        crime_index: 0.70,
        risk_level: 'Alto',
        info: '~2,800 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.178, 19.616],
          [-99.164, 19.600],
          [-99.144, 19.590],
          [-99.122, 19.585],
          [-99.100, 19.588],
          [-99.086, 19.598],
          [-99.082, 19.614],
          [-99.088, 19.630],
          [-99.106, 19.648],
          [-99.130, 19.658],
          [-99.156, 19.658],
          [-99.178, 19.648],
          [-99.188, 19.634],
          [-99.185, 19.620],
          [-99.178, 19.616],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Coacalco de Berriozábal',
        state: 'Estado de México',
        crime_index: 0.65,
        risk_level: 'Alto',
        info: '~2,400 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.100, 19.658],
          [-99.085, 19.645],
          [-99.068, 19.638],
          [-99.052, 19.638],
          [-99.040, 19.646],
          [-99.038, 19.660],
          [-99.045, 19.674],
          [-99.062, 19.682],
          [-99.082, 19.682],
          [-99.100, 19.674],
          [-99.108, 19.664],
          [-99.100, 19.658],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Valle de Chalco Solidaridad',
        state: 'Estado de México',
        crime_index: 0.80,
        risk_level: 'Alto',
        info: '~3,200 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-99.020, 19.326],
          [-99.008, 19.313],
          [-98.994, 19.302],
          [-98.978, 19.297],
          [-98.960, 19.300],
          [-98.947, 19.311],
          [-98.942, 19.326],
          [-98.945, 19.342],
          [-98.958, 19.354],
          [-98.975, 19.360],
          [-98.995, 19.360],
          [-99.012, 19.350],
          [-99.024, 19.338],
          [-99.020, 19.326],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Chalco',
        state: 'Estado de México',
        crime_index: 0.82,
        risk_level: 'Muy Alto',
        info: '~3,400 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-98.950, 19.312],
          [-98.938, 19.298],
          [-98.922, 19.285],
          [-98.902, 19.278],
          [-98.882, 19.280],
          [-98.867, 19.292],
          [-98.864, 19.310],
          [-98.872, 19.328],
          [-98.888, 19.342],
          [-98.910, 19.348],
          [-98.932, 19.344],
          [-98.948, 19.330],
          [-98.954, 19.318],
          [-98.950, 19.312],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'Ixtapaluca',
        state: 'Estado de México',
        crime_index: 0.75,
        risk_level: 'Alto',
        info: '~3,000 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-98.928, 19.382],
          [-98.918, 19.365],
          [-98.908, 19.350],
          [-98.893, 19.338],
          [-98.873, 19.332],
          [-98.852, 19.336],
          [-98.836, 19.349],
          [-98.834, 19.366],
          [-98.840, 19.384],
          [-98.856, 19.398],
          [-98.880, 19.405],
          [-98.904, 19.402],
          [-98.922, 19.393],
          [-98.930, 19.386],
          [-98.928, 19.382],
        ]],
      },
    },

    {
      type: 'Feature',
      properties: {
        name: 'La Paz',
        state: 'Estado de México',
        crime_index: 0.73,
        risk_level: 'Alto',
        info: '~2,900 delitos/100k hab.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-98.960, 19.364],
          [-98.950, 19.354],
          [-98.940, 19.345],
          [-98.928, 19.342],
          [-98.916, 19.347],
          [-98.910, 19.358],
          [-98.912, 19.370],
          [-98.922, 19.382],
          [-98.938, 19.390],
          [-98.956, 19.388],
          [-98.966, 19.378],
          [-98.964, 19.368],
          [-98.960, 19.364],
        ]],
      },
    },

  ],
};

/**
 * Returns a fill color [R, G, B, A] based on crime_index (0–1).
 * Only zones with index >= 0.65 are shown (Alto / Muy Alto).
 * 0.65 → orange semi-transparent → 1.0 → deep red opaque.
 */
export function crimeIndexToColor(index) {
  if (index < 0.65) return [0, 0, 0, 0]; // hide moderate zones
  const t = Math.max(0, Math.min(1, (index - 0.65) / 0.35)); // normalise 0.65–1.0 → 0–1
  const r = 255;
  const g = Math.round(140 * (1 - t));
  const b = 0;
  const a = Math.round(80 + 130 * t);
  return [r, g, b, a];
}

export const RISK_LEVELS = [
  { label: 'Alto',     color: 'rgba(255,120,0,0.60)', range: '0.65 – 0.80' },
  { label: 'Muy Alto', color: 'rgba(255,20,0,0.78)',  range: '0.80+' },
];
