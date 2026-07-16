import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { MapContainer, Rectangle, Polygon, Polyline, Circle, CircleMarker, Tooltip, ZoomControl, Marker, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapGenieSidebar from './components/MapGenieSidebar';
import { Icons } from './components/CustomMarkers';
import { useSimulation } from './useSimulation';
import { SAFETY_MARKERS } from './plantData';
import { ZONES, EQUIPMENT, INFRASTRUCTURE, STOCKPILES, CIRCLES, toLL, rectBounds } from './factoryLayout';
import { ChevronLeft, Maximize2, Minimize2 } from 'lucide-react';

import './MapGenieOverrides.css';

// Activity/RUview styles
const RU_STYLE = {
  worker: { color: '#a855f7', fillColor: '#a855f7', fillOpacity: 0.4, radius: 8 },
  machine: { color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.3, radius: 14 },
  alarm: { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.5, radius: 18 },
};

// Map bounds lock
const MAP_BOUNDS: [[number, number], [number, number]] = [[0, 0], [750, 1100]];

// Component to fly to a zone when activated
function FlyToZone({ zone }: { zone: typeof ZONES[0] | null }) {
  const map = useMap();
  useEffect(() => {
    if (zone) {
      const center = toLL(zone.x + zone.w / 2, zone.y + zone.h / 2);
      map.flyTo(center, 3, { duration: 0.8 });
    } else {
      map.flyTo([375, 550], 0, { duration: 0.6 });
    }
  }, [zone, map]);
  return null;
}

export default function PlantMap() {
  const { machines, workers, vehicles, sensors } = useSimulation();

  const [floor] = useState(0);
  const [viewMode, setViewMode] = useState<'satellite' | 'heatmap' | 'activity'>('satellite');
  const [layers, setLayers] = useState<Record<string, boolean>>({
    buildings: true, machines: true, workers: true, vehicles: true,
    sensors: true, safety: true,
  });
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeZone = useMemo(() => activeZoneId ? ZONES.find(z => z.id === activeZoneId) || null : null, [activeZoneId]);
  const zoneEquipment = useMemo(() => activeZoneId ? EQUIPMENT.filter(eq => eq.parentZone === activeZoneId) : [], [activeZoneId]);

  const toggleLayer = useCallback((key: string) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div ref={containerRef} className="flex h-full relative overflow-hidden bg-[#040d14]">
      <MapGenieSidebar
        layers={layers}
        toggleLayer={toggleLayer}
        viewMode={viewMode}
        setViewMode={setViewMode}
        floor={0}
        setFloor={() => {}}
      />

      <div className="flex-1 h-full w-full relative">
        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-[1000] bg-[#1a1f2e] border border-gray-700 p-2 rounded-lg text-white hover:bg-gray-800 shadow-xl transition-all"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Back to Overview */}
        {activeZoneId && (
          <div className="absolute top-4 left-20 z-[1000] animate-fade-in">
            <button
              onClick={() => setActiveZoneId(null)}
              className="flex items-center gap-2 bg-[#1a1f2e] border border-gray-700 px-4 py-2 rounded-lg text-white hover:bg-gray-800 shadow-xl transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-bold">Back to Overview</span>
            </button>
            <div className="mt-2 bg-[#0d1117]/90 backdrop-blur border border-cyan-500/30 px-4 py-2 rounded-lg inline-block">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Inside: </span>
              <span className="text-sm text-white font-bold">{activeZone?.name}</span>
            </div>
          </div>
        )}

        <MapContainer
          key="factory-map"
          center={[375, 550]}
          zoom={0}
          minZoom={-1}
          maxZoom={5}
          crs={L.CRS.Simple}
          zoomControl={false}
          maxBounds={MAP_BOUNDS}
          maxBoundsViscosity={1.0}
          className="w-full h-full custom-map-bg"
        >
          <ZoomControl position="bottomright" />
          <FlyToZone zone={activeZone ?? null} />

          {/* ═══ INFRASTRUCTURE (Roads, Rail, Pipelines) ═══ */}
          {INFRASTRUCTURE.map((seg, i) => (
            <Polyline
              key={`infra_${i}`}
              positions={seg.points.map(([x, y]) => toLL(x, y))}
              pathOptions={{
                color: seg.color,
                weight: seg.weight,
                opacity: seg.type === 'road' ? 0.6 : seg.type === 'conveyor' ? 0.8 : 0.5,
                dashArray: seg.dashArray,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            >
              {seg.label && (
                <Tooltip className="mapgenie-tooltip" sticky>
                  <div className="text-xs font-bold text-gray-200 uppercase">{seg.label}</div>
                  <div className="text-[10px] text-gray-400 capitalize">{seg.type}</div>
                </Tooltip>
              )}
            </Polyline>
          ))}

          {/* ═══ STOCKPILES (Circles for ore/coke yards) ═══ */}
          {STOCKPILES.map((sp, i) => (
            <Circle
              key={`sp_${i}`}
              center={toLL(sp.x, sp.y)}
              radius={sp.radius}
              pathOptions={{ color: sp.color, fillColor: sp.color, fillOpacity: 0.5, weight: 1 }}
            >
              <Tooltip className="mapgenie-tooltip">{sp.label}</Tooltip>
            </Circle>
          ))}

          {/* ═══ CIRCLES (Cooling towers, harbor) ═══ */}
          {CIRCLES.map((c, i) => (
            <Circle
              key={`circ_${i}`}
              center={toLL(c.x, c.y)}
              radius={c.radius}
              pathOptions={{ color: c.color, fillColor: c.fillColor, fillOpacity: 0.6, weight: 2 }}
            >
              <Tooltip className="mapgenie-tooltip">{c.label}</Tooltip>
            </Circle>
          ))}

          {/* ═══ ZONE FILL IMAGES ═══ */}
          {viewMode !== 'heatmap' && ZONES.filter(z => z.image).map(zone => (
            <ImageOverlay
              key={`img_${zone.id}`}
              url={zone.image!}
              bounds={rectBounds(zone.x, zone.y, zone.w, zone.h)}
              opacity={0.85}
            />
          ))}

          {/* ═══ ZONES (Building Outlines) ═══ */}
          {layers.buildings && ZONES.map(zone => {
            const riskColor = zone.risk === 'critical' ? '#ef4444' : zone.risk === 'high' ? '#f97316' : zone.risk === 'medium' ? '#f59e0b' : '#22c55e';
            const isActive = activeZoneId === zone.id;

            if (viewMode === 'heatmap') {
              return (
                <Rectangle
                  key={zone.id}
                  bounds={rectBounds(zone.x, zone.y, zone.w, zone.h)}
                  pathOptions={{
                    color: riskColor, weight: 2, fillColor: riskColor, fillOpacity: 0.45,
                    dashArray: zone.risk === 'critical' ? '8,6' : undefined,
                  }}
                  eventHandlers={zone.hasInterior ? { click: () => setActiveZoneId(zone.id) } : {}}
                >
                  <Tooltip className="mapgenie-tooltip" sticky>
                    <div className="font-bold text-white">{zone.name}</div>
                    <div className="text-[10px] mt-1 uppercase font-bold" style={{ color: riskColor }}>{zone.risk} Risk</div>
                    {zone.hasInterior && <div className="text-xs text-cyan-400 mt-1">Click to enter</div>}
                  </Tooltip>
                </Rectangle>
              );
            }

            // Blueprint mode
            return (
              <Rectangle
                key={zone.id}
                bounds={rectBounds(zone.x, zone.y, zone.w, zone.h)}
                pathOptions={{
                  color: isActive ? '#0ea5e9' : zone.strokeColor,
                  weight: isActive ? 3 : 2,
                  fillColor: zone.fillColor,
                  fillOpacity: zone.image ? 0.15 : (isActive ? 0.3 : 0.7),
                }}
                eventHandlers={zone.hasInterior ? { click: () => setActiveZoneId(zone.id) } : {}}
                className={zone.hasInterior ? 'cursor-pointer' : ''}
              >
                <Tooltip className="mapgenie-tooltip" sticky>
                  <div className="font-bold text-white">{zone.name}</div>
                  <div className="text-[10px] text-gray-400 mt-1 uppercase capitalize">{zone.type}</div>
                  {zone.hasInterior && <div className="text-xs text-cyan-400 mt-1 font-bold">Click to enter →</div>}
                </Tooltip>
              </Rectangle>
            );
          })}

          {/* ═══ ZONE LABELS (SVG text overlays rendered as DivIcon markers) ═══ */}
          {layers.buildings && !activeZoneId && ZONES.map(zone => (
            <Marker
              key={`label_${zone.id}`}
              position={toLL(zone.x + zone.w / 2, zone.y + zone.h / 2)}
              icon={L.divIcon({
                className: 'zone-label-icon',
                html: `<div style="
                  color: ${zone.strokeColor};
                  font-size: ${zone.w > 150 ? '11px' : zone.w > 80 ? '9px' : '7px'};
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  text-shadow: 0 0 6px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.8);
                  white-space: nowrap;
                  pointer-events: none;
                  text-align: center;
                ">${zone.name}</div>`,
                iconSize: [zone.w, 20],
                iconAnchor: [zone.w / 2, 10],
              })}
              interactive={false}
            />
          ))}

          {/* ═══ INTERNAL EQUIPMENT (shown when zoomed into a zone) ═══ */}
          {activeZoneId && zoneEquipment.map(eq => (
            <Rectangle
              key={eq.id}
              bounds={rectBounds(eq.x, eq.y, eq.w, eq.h)}
              pathOptions={{
                color: eq.strokeColor,
                weight: 2,
                fillColor: eq.fillColor,
                fillOpacity: 0.8,
              }}
            >
              <Tooltip className="mapgenie-tooltip" sticky>
                <div className="font-bold text-white">{eq.name}</div>
                <div className="text-[10px] text-gray-400 mt-1 uppercase">{eq.type}</div>
              </Tooltip>
            </Rectangle>
          ))}

          {/* ═══ EQUIPMENT LABELS (inside view) ═══ */}
          {activeZoneId && zoneEquipment.map(eq => (
            <Marker
              key={`eqlabel_${eq.id}`}
              position={toLL(eq.x + eq.w / 2, eq.y + eq.h / 2)}
              icon={L.divIcon({
                className: 'zone-label-icon',
                html: `<div style="
                  color: ${eq.strokeColor};
                  font-size: 8px;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 0.3px;
                  text-shadow: 0 0 4px rgba(0,0,0,0.9);
                  white-space: nowrap;
                  pointer-events: none;
                  text-align: center;
                ">${eq.name}</div>`,
                iconSize: [eq.w + 40, 14],
                iconAnchor: [(eq.w + 40) / 2, 7],
              })}
              interactive={false}
            />
          ))}


          {/* ═══ ACTIVITY MAP (RUview) ═══ */}
          {viewMode === 'activity' && (
            <>
              {layers.workers && workers.filter(w => w.floor === floor).map(w => (
                <CircleMarker
                  key={`act_${w.id}`}
                  center={toLL(w.x, w.y)}
                  pathOptions={RU_STYLE.worker}
                  radius={RU_STYLE.worker.radius}
                >
                  <Tooltip className="mapgenie-tooltip" direction="top">
                    <div className="font-bold text-white">{w.name}</div>
                    <div className="text-[10px] text-purple-400 mt-1 uppercase">RF Tag: Active</div>
                  </Tooltip>
                </CircleMarker>
              ))}
              {layers.machines && machines.filter(m => m.floor === floor).map(m => {
                const style = m.status === 'alarm' ? RU_STYLE.alarm : RU_STYLE.machine;
                if (m.status === 'idle' || m.status === 'maintenance') return null;
                return (
                  <CircleMarker
                    key={`act_${m.id}`}
                    center={toLL(m.x + m.w / 2, m.y + m.h / 2)}
                    pathOptions={style}
                    radius={style.radius}
                  >
                    <Tooltip className="mapgenie-tooltip" direction="top">
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[10px] text-cyan-400 mt-1 uppercase">IoT: Active</div>
                    </Tooltip>
                  </CircleMarker>
                );
              })}
            </>
          )}

          {/* ═══ TEARDROP MARKERS (Blueprint mode) ═══ */}
          {viewMode === 'satellite' && (
            <>
              {layers.machines && machines.filter(m => m.floor === floor).map(m => (
                <Marker
                  key={m.id}
                  position={toLL(m.x + m.w / 2, m.y + m.h / 2)}
                  icon={m.status === 'alarm' ? Icons.MachineAlarm : m.status === 'idle' ? Icons.MachineIdle : Icons.Machine}
                >
                  <Tooltip className="mapgenie-tooltip" direction="top" offset={[0, -25]}>
                    <div className="font-bold text-white">{m.name}</div>
                    <div className="text-[10px] text-gray-400 mt-1 uppercase">Status: <span className={m.status === 'alarm' ? 'text-red-400' : 'text-green-400'}>{m.status}</span></div>
                    {m.meta?.temp && <div className="text-xs text-gray-300 mt-1">Temp: {m.meta.temp}°C</div>}
                  </Tooltip>
                </Marker>
              ))}

              {layers.workers && workers.filter(w => w.floor === floor).map(w => (
                <Marker key={w.id} position={toLL(w.x, w.y)} icon={Icons.Worker}>
                  <Tooltip className="mapgenie-tooltip" direction="top" offset={[0, -25]}>
                    <div className="font-bold text-white">{w.name}</div>
                    <div className="text-[10px] text-cyan-400 mt-1 uppercase">{w.role}</div>
                  </Tooltip>
                </Marker>
              ))}

              {layers.vehicles && vehicles.filter(v => v.floor === floor).map(v => (
                <Marker key={v.id} position={toLL(v.x, v.y)} icon={Icons.Vehicle}>
                  <Tooltip className="mapgenie-tooltip" direction="top" offset={[0, -25]}>
                    <div className="font-bold text-white uppercase">{v.type} - {v.id}</div>
                    <div className="text-[10px] text-purple-400 mt-1 uppercase">Task: {v.task}</div>
                    <div className="text-xs text-gray-300 mt-1">Battery: {Math.round(v.battery)}%</div>
                  </Tooltip>
                </Marker>
              ))}

              {layers.sensors && sensors.filter(s => s.floor === floor).map(s => (
                <Marker key={s.id} position={toLL(s.x, s.y)} icon={Icons.Sensor}>
                  <Tooltip className="mapgenie-tooltip" direction="top" offset={[0, -25]}>
                    <div className="font-bold text-white capitalize">{s.type} Sensor</div>
                    <div className="text-xl font-bold text-orange-400 mt-1">{s.value}<span className="text-sm ml-1">{s.unit}</span></div>
                    <div className="text-[10px] text-gray-400 mt-1 uppercase">Status: {s.status}</div>
                  </Tooltip>
                </Marker>
              ))}

              {layers.safety && SAFETY_MARKERS.filter(m => m.floor === floor).map(m => {
                let icon = Icons.Building;
                if (m.type === 'exit') icon = Icons.Exit;
                else if (m.type === 'extinguisher') icon = Icons.FireExtinguisher;
                else if (m.type === 'muster') icon = Icons.Muster;
                else if (m.type === 'alarm') icon = Icons.MachineAlarm;
                return (
                  <Marker key={m.id} position={toLL(m.x, m.y)} icon={icon}>
                    <Tooltip className="mapgenie-tooltip" direction="top" offset={[0, -25]}>
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[10px] text-gray-400 mt-1 uppercase">{m.type}</div>
                    </Tooltip>
                  </Marker>
                );
              })}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
