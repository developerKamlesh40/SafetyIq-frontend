/**
 * Complete Steel Plant Vector Layout
 * Everything is drawn with Leaflet vectors — no images.
 * Coordinate space: 0-1100 x, 0-750 y (top-left origin)
 * Leaflet L.CRS.Simple uses [lat, lng] = [750-y, x]
 */

// ─── Types ──────────────────────────────────────────────────
export interface ZoneShape {
  id: string;
  name: string;
  type: 'production' | 'storage' | 'utility' | 'logistics' | 'office' | 'road' | 'rail' | 'water';
  x: number; y: number; w: number; h: number;
  fillColor: string;
  strokeColor: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  hasInterior: boolean;
  label?: string;
  image?: string;
}

export interface InternalEquipment {
  id: string;
  parentZone: string;
  name: string;
  x: number; y: number; w: number; h: number;
  fillColor: string;
  strokeColor: string;
  type: 'furnace' | 'tank' | 'crane' | 'conveyor' | 'machine' | 'storage' | 'fan' | 'pipe' | 'control';
}

export interface RoadSegment {
  points: [number, number][];
  type: 'road' | 'rail' | 'pipeline' | 'conveyor';
  color: string;
  weight: number;
  dashArray?: string;
  label?: string;
}

// ─── Coordinate Helper ──────────────────────────────────────
export const toLL = (x: number, y: number): [number, number] => [750 - y, x];
export const rectBounds = (x: number, y: number, w: number, h: number): [[number, number], [number, number]] => [
  [750 - (y + h), x],
  [750 - y, x + w],
];

// ─── MAIN ZONES (Overview Level) ────────────────────────────
export const ZONES: ZoneShape[] = [
  // === TOP ROW ===
  // Raw Material Section (top-left)
  { id: 'rm', name: 'Raw Material Bunkers', type: 'storage', x: 20, y: 20, w: 120, h: 80, fillColor: '#2d1f0e', strokeColor: '#8b6914', risk: 'low', hasInterior: true, image: '/images/zone_rm.png' },
  { id: 'iron_ore', name: 'Iron Ore Storage', type: 'storage', x: 20, y: 110, w: 55, h: 50, fillColor: '#3d1a0a', strokeColor: '#a0522d', risk: 'low', hasInterior: false, image: '/images/zone_iron_ore.png' },
  { id: 'flux', name: 'Flux (Limestone)', type: 'storage', x: 85, y: 110, w: 55, h: 50, fillColor: '#2a2a1a', strokeColor: '#8b8b5e', risk: 'low', hasInterior: false, image: '/images/zone_iron_ore.png' },
  { id: 'coke_breeze', name: 'Coke Breeze', type: 'storage', x: 20, y: 170, w: 55, h: 40, fillColor: '#1a1a1a', strokeColor: '#555', risk: 'low', hasInterior: false, image: '/images/zone_iron_ore.png' },
  { id: 'return_fines', name: 'Return Fines', type: 'storage', x: 85, y: 170, w: 55, h: 40, fillColor: '#2a1a0a', strokeColor: '#6b4226', risk: 'low', hasInterior: false, image: '/images/zone_iron_ore.png' },

  // Sinter Plant (top-center)
  { id: 'sinter', name: 'Sinter Plant', type: 'production', x: 200, y: 20, w: 200, h: 120, fillColor: '#1a1e2e', strokeColor: '#4a6fa5', risk: 'medium', hasInterior: true, image: '/images/zone_sinter.png' },

  // Power Station (top-right)
  { id: 'power_station', name: 'Power Station', type: 'utility', x: 450, y: 20, w: 120, h: 80, fillColor: '#0e1a2d', strokeColor: '#2563eb', risk: 'low', hasInterior: false, image: '/images/zone_power.png' },
  { id: 'bfb2', name: 'BFB-2', type: 'utility', x: 580, y: 20, w: 60, h: 50, fillColor: '#0e1a2d', strokeColor: '#3b82f6', risk: 'low', hasInterior: false, image: '/images/zone_utilities.png' },

  // Cooling & Water Towers
  { id: 'cooling_tower', name: 'Cooling Tower', type: 'utility', x: 450, y: 110, w: 60, h: 50, fillColor: '#0a1a2a', strokeColor: '#0891b2', risk: 'low', hasInterior: false, image: '/images/zone_cooling.png' },
  { id: 'water_tower', name: 'Water Tower', type: 'utility', x: 520, y: 110, w: 50, h: 50, fillColor: '#0a1a2a', strokeColor: '#06b6d4', risk: 'low', hasInterior: false, image: '/images/zone_cooling.png' },

  // === CENTRAL PRODUCTION AREA ===
  // Blast Furnace Complex (center-left)
  { id: 'bf', name: 'Blast Furnace Complex', type: 'production', x: 150, y: 180, w: 200, h: 170, fillColor: '#1a0e0e', strokeColor: '#dc2626', risk: 'high', hasInterior: true, image: '/images/zone_bf.png' },

  // Hot Metal Mixers
  { id: 'hmm', name: 'Hot Metal Mixers', type: 'production', x: 150, y: 360, w: 90, h: 60, fillColor: '#2a1a0a', strokeColor: '#ea580c', risk: 'high', hasInterior: false, image: '/images/zone_hotmetal.png' },
  { id: 'bf1', name: 'BF-1', type: 'production', x: 250, y: 360, w: 60, h: 60, fillColor: '#1a0e0e', strokeColor: '#b91c1c', risk: 'critical', hasInterior: false, image: '/images/zone_hotmetal.png' },

  // BOF (center)
  { id: 'bof', name: 'Basic Oxygen Furnace (BOF)', type: 'production', x: 370, y: 180, w: 180, h: 150, fillColor: '#1e0a0a', strokeColor: '#ef4444', risk: 'critical', hasInterior: true, image: '/images/zone_bof.png' },

  // Continuous Casting Shop (center-right)
  { id: 'ccm', name: 'Continuous Casting Shop', type: 'production', x: 570, y: 180, w: 140, h: 160, fillColor: '#1a1a2e', strokeColor: '#7c3aed', risk: 'medium', hasInterior: true, image: '/images/zone_ccm.png' },

  // === RIGHT SIDE (Warehouses & Storage) ===
  { id: 'wh_c', name: 'Warehouse C-Block', type: 'storage', x: 750, y: 180, w: 130, h: 80, fillColor: '#0e1e0e', strokeColor: '#16a34a', risk: 'low', hasInterior: false, image: '/images/zone_warehouse.png' },
  { id: 'wh_d', name: 'Warehouse D-Block', type: 'storage', x: 750, y: 270, w: 130, h: 80, fillColor: '#0e1e0e', strokeColor: '#16a34a', risk: 'low', hasInterior: false, image: '/images/zone_warehouse.png' },
  { id: 'wh_e', name: 'Warehouse E-Block', type: 'storage', x: 750, y: 360, w: 130, h: 80, fillColor: '#0e1e0e', strokeColor: '#16a34a', risk: 'low', hasInterior: false, image: '/images/zone_warehouse.png' },
  { id: 'iron_yard', name: 'Raw Material Storage (Iron Ore Yard)', type: 'storage', x: 900, y: 180, w: 170, h: 120, fillColor: '#3d1a0a', strokeColor: '#92400e', risk: 'low', hasInterior: false, image: '/images/zone_iron_ore.png' },
  { id: 'coke_yard', name: 'Raw Material Storage (Coke Stockpiles)', type: 'storage', x: 900, y: 320, w: 170, h: 130, fillColor: '#1a1a1a', strokeColor: '#525252', risk: 'low', hasInterior: false, image: '/images/zone_scrap.png' },

  // === BOTTOM LEFT (Utilities) ===
  { id: 'utilities', name: 'Utilities', type: 'utility', x: 20, y: 460, w: 100, h: 70, fillColor: '#0e1a2d', strokeColor: '#2563eb', risk: 'low', hasInterior: false, image: '/images/zone_utilities.png' },
  { id: 'water_treatment', name: 'Water Treatment', type: 'utility', x: 20, y: 540, w: 100, h: 70, fillColor: '#0a2030', strokeColor: '#0ea5e9', risk: 'low', hasInterior: false, image: '/images/zone_water.png' },
  { id: 'power_plant', name: 'Power Plant', type: 'utility', x: 20, y: 620, w: 100, h: 80, fillColor: '#0e1a2d', strokeColor: '#3b82f6', risk: 'medium', hasInterior: false, image: '/images/zone_power.png' },

  // === BOTTOM CENTER (Rolling Mill) ===
  { id: 'rolling_mill', name: 'Rolling Mill', type: 'production', x: 200, y: 460, w: 350, h: 170, fillColor: '#1a1a0e', strokeColor: '#ca8a04', risk: 'high', hasInterior: true, image: '/images/zone_rolling.png' },

  // === BOTTOM RIGHT (Logistics & Scrap) ===
  { id: 'logistics', name: 'Logistics', type: 'logistics', x: 600, y: 500, w: 120, h: 110, fillColor: '#0e1e1e', strokeColor: '#0d9488', risk: 'low', hasInterior: false, image: '/images/zone_logistics.png' },
  { id: 'scrap_yard', name: 'Scrap Yard', type: 'storage', x: 750, y: 470, w: 150, h: 100, fillColor: '#2a1a0a', strokeColor: '#78350f', risk: 'medium', hasInterior: false, image: '/images/zone_scrap.png' },

  // Dock / Port Area (far right, circular)
  { id: 'dock', name: 'Dock / Port Area', type: 'logistics', x: 950, y: 480, w: 120, h: 120, fillColor: '#0a1a30', strokeColor: '#0369a1', risk: 'low', hasInterior: false, image: '/images/zone_dock.png' },
];

// ─── INTERNAL EQUIPMENT (Inside Buildings — shown on zoom) ──
export const EQUIPMENT: InternalEquipment[] = [
  // -- Blast Furnace Complex internals --
  { id: 'eq_bf_furnace1', parentZone: 'bf', name: 'Blast Furnace #1', x: 170, y: 200, w: 50, h: 60, fillColor: '#4a1010', strokeColor: '#ef4444', type: 'furnace' },
  { id: 'eq_bf_furnace2', parentZone: 'bf', name: 'Blast Furnace #2', x: 240, y: 200, w: 50, h: 60, fillColor: '#4a1010', strokeColor: '#ef4444', type: 'furnace' },
  { id: 'eq_bf_stove1', parentZone: 'bf', name: 'Hot Blast Stove 1', x: 310, y: 200, w: 25, h: 50, fillColor: '#3a0a0a', strokeColor: '#b91c1c', type: 'furnace' },
  { id: 'eq_bf_stove2', parentZone: 'bf', name: 'Hot Blast Stove 2', x: 310, y: 260, w: 25, h: 50, fillColor: '#3a0a0a', strokeColor: '#b91c1c', type: 'furnace' },
  { id: 'eq_bf_casthouse', parentZone: 'bf', name: 'Cast House', x: 170, y: 280, w: 80, h: 40, fillColor: '#2a1010', strokeColor: '#dc2626', type: 'machine' },
  { id: 'eq_bf_crane', parentZone: 'bf', name: 'Charging Crane', x: 260, y: 310, w: 70, h: 20, fillColor: '#1a2a3a', strokeColor: '#64748b', type: 'crane' },
  { id: 'eq_bf_skip', parentZone: 'bf', name: 'Skip Hoist', x: 170, y: 330, w: 30, h: 15, fillColor: '#2a2a2a', strokeColor: '#737373', type: 'machine' },

  // -- Sinter Plant internals --
  { id: 'eq_si_mixer', parentZone: 'sinter', name: 'Mixing Drum', x: 220, y: 40, w: 50, h: 40, fillColor: '#1a2a3a', strokeColor: '#4a6fa5', type: 'machine' },
  { id: 'eq_si_strand', parentZone: 'sinter', name: 'Sinter Strand', x: 280, y: 40, w: 100, h: 30, fillColor: '#3a2010', strokeColor: '#ea580c', type: 'machine' },
  { id: 'eq_si_cooler', parentZone: 'sinter', name: 'Sinter Cooler', x: 280, y: 80, w: 80, h: 30, fillColor: '#0a2a3a', strokeColor: '#0891b2', type: 'fan' },
  { id: 'eq_si_screen', parentZone: 'sinter', name: 'Screening Plant', x: 220, y: 90, w: 50, h: 30, fillColor: '#2a2a2a', strokeColor: '#737373', type: 'machine' },
  { id: 'eq_si_dedusting', parentZone: 'sinter', name: 'Dedusting System', x: 370, y: 40, w: 20, h: 60, fillColor: '#1a1a2e', strokeColor: '#6366f1', type: 'fan' },

  // -- BOF internals --
  { id: 'eq_bof_conv1', parentZone: 'bof', name: 'BOF Converter #1', x: 390, y: 200, w: 50, h: 50, fillColor: '#4a0a0a', strokeColor: '#ef4444', type: 'furnace' },
  { id: 'eq_bof_conv2', parentZone: 'bof', name: 'BOF Converter #2', x: 460, y: 200, w: 50, h: 50, fillColor: '#4a0a0a', strokeColor: '#ef4444', type: 'furnace' },
  { id: 'eq_bof_ladle', parentZone: 'bof', name: 'Ladle Furnace', x: 390, y: 270, w: 60, h: 40, fillColor: '#3a1a0a', strokeColor: '#f97316', type: 'furnace' },
  { id: 'eq_bof_crane', parentZone: 'bof', name: 'Charging Crane', x: 460, y: 270, w: 70, h: 20, fillColor: '#1a2a3a', strokeColor: '#64748b', type: 'crane' },
  { id: 'eq_bof_lance', parentZone: 'bof', name: 'Oxygen Lance', x: 420, y: 300, w: 20, h: 20, fillColor: '#0a2a3a', strokeColor: '#22d3ee', type: 'pipe' },

  // -- Continuous Casting internals --
  { id: 'eq_cc_tundish', parentZone: 'ccm', name: 'Tundish', x: 590, y: 200, w: 40, h: 30, fillColor: '#3a1a0a', strokeColor: '#f97316', type: 'machine' },
  { id: 'eq_cc_mold', parentZone: 'ccm', name: 'Mold', x: 640, y: 200, w: 30, h: 30, fillColor: '#2a2a3a', strokeColor: '#818cf8', type: 'machine' },
  { id: 'eq_cc_strand1', parentZone: 'ccm', name: 'Strand #1', x: 590, y: 245, w: 100, h: 15, fillColor: '#2a1a0a', strokeColor: '#ea580c', type: 'machine' },
  { id: 'eq_cc_strand2', parentZone: 'ccm', name: 'Strand #2', x: 590, y: 270, w: 100, h: 15, fillColor: '#2a1a0a', strokeColor: '#ea580c', type: 'machine' },
  { id: 'eq_cc_cutter', parentZone: 'ccm', name: 'Torch Cutter', x: 590, y: 300, w: 40, h: 25, fillColor: '#3a0a0a', strokeColor: '#dc2626', type: 'machine' },
  { id: 'eq_cc_rollers', parentZone: 'ccm', name: 'Roller Table', x: 640, y: 300, w: 50, h: 25, fillColor: '#2a2a2a', strokeColor: '#737373', type: 'conveyor' },

  // -- Rolling Mill internals --
  { id: 'eq_rm_reheat', parentZone: 'rolling_mill', name: 'Reheat Furnace', x: 220, y: 480, w: 60, h: 50, fillColor: '#4a1a0a', strokeColor: '#ef4444', type: 'furnace' },
  { id: 'eq_rm_roughing', parentZone: 'rolling_mill', name: 'Roughing Stand', x: 300, y: 480, w: 50, h: 50, fillColor: '#2a2a1a', strokeColor: '#ca8a04', type: 'machine' },
  { id: 'eq_rm_finishing', parentZone: 'rolling_mill', name: 'Finishing Stands', x: 370, y: 480, w: 80, h: 50, fillColor: '#2a2a1a', strokeColor: '#ca8a04', type: 'machine' },
  { id: 'eq_rm_cooling', parentZone: 'rolling_mill', name: 'Cooling Bed', x: 460, y: 480, w: 70, h: 50, fillColor: '#0a2a3a', strokeColor: '#0ea5e9', type: 'machine' },
  { id: 'eq_rm_coiler', parentZone: 'rolling_mill', name: 'Coiler', x: 220, y: 560, w: 50, h: 40, fillColor: '#1a2a1a', strokeColor: '#16a34a', type: 'machine' },
  { id: 'eq_rm_shear', parentZone: 'rolling_mill', name: 'Shear', x: 290, y: 560, w: 40, h: 40, fillColor: '#2a1a2a', strokeColor: '#a855f7', type: 'machine' },
  { id: 'eq_rm_rollertable', parentZone: 'rolling_mill', name: 'Roller Table', x: 350, y: 560, w: 100, h: 25, fillColor: '#2a2a2a', strokeColor: '#737373', type: 'conveyor' },

  // -- Raw Material Bunkers internals --
  { id: 'eq_rm_b1', parentZone: 'rm', name: 'Bunker 1', x: 25, y: 25, w: 25, h: 30, fillColor: '#3d1a0a', strokeColor: '#a0522d', type: 'storage' },
  { id: 'eq_rm_b2', parentZone: 'rm', name: 'Bunker 2', x: 55, y: 25, w: 25, h: 30, fillColor: '#3d1a0a', strokeColor: '#a0522d', type: 'storage' },
  { id: 'eq_rm_b3', parentZone: 'rm', name: 'Bunker 3', x: 85, y: 25, w: 25, h: 30, fillColor: '#3d1a0a', strokeColor: '#a0522d', type: 'storage' },
  { id: 'eq_rm_b4', parentZone: 'rm', name: 'Bunker 4', x: 115, y: 25, w: 20, h: 30, fillColor: '#3d1a0a', strokeColor: '#a0522d', type: 'storage' },
  { id: 'eq_rm_feeder', parentZone: 'rm', name: 'Belt Feeder', x: 25, y: 65, w: 110, h: 15, fillColor: '#2a2a2a', strokeColor: '#737373', type: 'conveyor' },
];

// ─── ROADS, RAIL, PIPELINES, CONVEYORS ──────────────────────
export const INFRASTRUCTURE: RoadSegment[] = [
  // Internal Roads
  { points: [[20, 160], [1080, 160]], type: 'road', color: '#1e293b', weight: 8, label: 'North Road' },
  { points: [[20, 440], [900, 440]], type: 'road', color: '#1e293b', weight: 8, label: 'Central Road' },
  { points: [[20, 650], [900, 650]], type: 'road', color: '#1e293b', weight: 8, label: 'South Road' },
  { points: [[140, 20], [140, 720]], type: 'road', color: '#1e293b', weight: 6, label: 'West Avenue' },
  { points: [[560, 20], [560, 650]], type: 'road', color: '#1e293b', weight: 6, label: 'Central Avenue' },
  { points: [[730, 160], [730, 650]], type: 'road', color: '#1e293b', weight: 6, label: 'East Avenue' },

  // Ring road (perimeter)
  { points: [[10, 10], [1090, 10], [1090, 730], [10, 730], [10, 10]], type: 'road', color: '#0f172a', weight: 10, label: 'Perimeter Road' },

  // Rail Tracks
  { points: [[20, 450], [730, 450]], type: 'rail', color: '#713f12', weight: 3, dashArray: '12,8', label: 'Rail Track North' },
  { points: [[200, 660], [730, 660]], type: 'rail', color: '#713f12', weight: 3, dashArray: '12,8', label: 'Rail Track South' },

  // Pipelines
  { points: [[140, 180], [200, 180], [200, 270]], type: 'pipeline', color: '#ef4444', weight: 2, dashArray: '4,4', label: 'Gas Line' },
  { points: [[450, 160], [450, 180]], type: 'pipeline', color: '#3b82f6', weight: 2, dashArray: '4,4', label: 'Water Main' },
  { points: [[520, 160], [520, 180], [570, 180]], type: 'pipeline', color: '#06b6d4', weight: 2, dashArray: '4,4', label: 'Cooling Water' },

  // Conveyors (material flow)
  { points: [[140, 60], [200, 60]], type: 'conveyor', color: '#f59e0b', weight: 3, label: 'RM to Sinter' },
  { points: [[400, 140], [400, 180]], type: 'conveyor', color: '#f59e0b', weight: 3, label: 'Sinter to BF' },
  { points: [[350, 350], [370, 350], [370, 330]], type: 'conveyor', color: '#f59e0b', weight: 3, label: 'HM to BOF' },
  { points: [[550, 260], [570, 260]], type: 'conveyor', color: '#f59e0b', weight: 3, label: 'BOF to CCM' },
  { points: [[640, 340], [640, 460]], type: 'conveyor', color: '#f59e0b', weight: 3, label: 'CCM to RM' },
  { points: [[550, 570], [600, 570], [600, 500]], type: 'conveyor', color: '#f59e0b', weight: 3, label: 'RM to Logistics' },
];

// ─── Stockpile shapes (circular mounds for ore/coke yards) ──
export const STOCKPILES: { x: number; y: number; radius: number; color: string; label: string }[] = [
  { x: 940, y: 220, radius: 20, color: '#92400e', label: 'Iron Ore Pile 1' },
  { x: 990, y: 220, radius: 18, color: '#78350f', label: 'Iron Ore Pile 2' },
  { x: 1040, y: 220, radius: 22, color: '#a0522d', label: 'Iron Ore Pile 3' },
  { x: 960, y: 270, radius: 15, color: '#92400e', label: 'Iron Ore Pile 4' },
  { x: 1020, y: 270, radius: 17, color: '#78350f', label: 'Iron Ore Pile 5' },

  { x: 940, y: 360, radius: 20, color: '#404040', label: 'Coke Pile 1' },
  { x: 990, y: 360, radius: 22, color: '#333333', label: 'Coke Pile 2' },
  { x: 1040, y: 360, radius: 18, color: '#404040', label: 'Coke Pile 3' },
  { x: 960, y: 410, radius: 16, color: '#333333', label: 'Coke Pile 4' },
  { x: 1020, y: 410, radius: 19, color: '#404040', label: 'Coke Pile 5' },
];

// ─── Cooling tower fan circles ──────────────────────────────
export const CIRCLES: { x: number; y: number; radius: number; color: string; fillColor: string; label: string }[] = [
  { x: 465, y: 125, radius: 12, color: '#0891b2', fillColor: '#083344', label: 'Cooling Fan 1' },
  { x: 495, y: 125, radius: 12, color: '#0891b2', fillColor: '#083344', label: 'Cooling Fan 2' },
  { x: 535, y: 125, radius: 10, color: '#06b6d4', fillColor: '#083344', label: 'Water Tank' },
  // Dock harbor arc
  { x: 1010, y: 540, radius: 40, color: '#0369a1', fillColor: '#0a1a30', label: 'Harbor Basin' },
];
