import L from 'leaflet';

export const createTeardropIcon = (
  iconHtml: string,
  bgColor: string = '#1e293b',
  iconColor: string = '#ffffff'
) => {
  return L.divIcon({
    className: 'custom-teardrop-icon',
    html: `
      <div class="marker-pin" style="background-color: ${bgColor};"></div>
      <div class="marker-icon" style="color: ${iconColor};">${iconHtml}</div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -35],
  });
};

// Lucide SVG icon helpers — all 16x16, stroke-based
const svg = (paths: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

// Gear/Cog icon for Machinery (Settings icon from Lucide)
const GEAR = svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>');

// Hard hat worker icon (HardHat from Lucide)
const HARDHAT = svg('<path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6h0"/><path d="M14 6a6 6 0 0 1 6 6v3"/>');

// Forklift/Truck icon for Vehicles & AGVs
const FORKLIFT = svg('<path d="M5 17h14v-2H5"/><path d="M5 15V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10"/><rect x="14" y="7" width="5" height="8" rx="1"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>');

// Building icon
const BUILDING = svg('<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>');

// Warning triangle for alarms
const WARNING = svg('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>');

// Wifi/Signal icon for IoT Sensors
const SIGNAL = svg('<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/>');

// Fire extinguisher
const FIRE_EXT = svg('<path d="M10 2v3"/><path d="M14 2v3"/><path d="M12 2v9"/><path d="M7 8a5 5 0 0 1 10 0v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2Z"/><path d="M12 8h.01"/>');

// Exit door
const EXIT = svg('<path d="M9 12h11"/><path d="M16 8l4 4-4 4"/><path d="M2 12V6a2 2 0 0 1 2-2h4"/><path d="M2 12v6a2 2 0 0 0 2 2h4"/>');

// Group/Users for muster
const USERS = svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>');

export const Icons = {
  Building: createTeardropIcon(BUILDING, '#1e293b', '#0ea5e9'),
  Machine: createTeardropIcon(GEAR, '#1e293b', '#22c55e'),
  MachineIdle: createTeardropIcon(GEAR, '#1e293b', '#f59e0b'),
  MachineAlarm: createTeardropIcon(WARNING, '#581c87', '#ef4444'),
  Worker: createTeardropIcon(HARDHAT, '#1e293b', '#38bdf8'),
  Vehicle: createTeardropIcon(FORKLIFT, '#1e293b', '#a855f7'),
  Sensor: createTeardropIcon(SIGNAL, '#1e293b', '#f97316'),
  FireExtinguisher: createTeardropIcon(FIRE_EXT, '#7f1d1d', '#ef4444'),
  Exit: createTeardropIcon(EXIT, '#14532d', '#22c55e'),
  Muster: createTeardropIcon(USERS, '#1e293b', '#facc15'),
};
