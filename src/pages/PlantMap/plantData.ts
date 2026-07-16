export interface PlantObject {
  id: string; type: string; name: string; x: number; y: number; w: number; h: number;
  floor: number; status?: string; color?: string; stroke?: string; meta?: Record<string, any>;
}

export interface WorkerData {
  id: string; name: string; role: string; x: number; y: number; zone: string; floor: number;
  speed: number; dx: number; dy: number; trail: {x:number;y:number}[];
}

export interface VehicleData {
  id: string; type: string; x: number; y: number; floor: number; status: string;
  route: {x:number;y:number}[]; routeIdx: number; speed: number; battery: number; task: string;
}

export interface SensorData {
  id: string; type: string; x: number; y: number; floor: number; value: number;
  unit: string; min: number; max: number; threshold: number; status: string; zone: string;
}

export interface ProductionLine {
  id: string; name: string; points: {x:number;y:number}[]; floor: number; active: boolean; flowOffset: number;
}

export interface Road {
  points: {x:number;y:number}[]; type: 'road'|'rail'|'conveyor'|'pipe'; color: string; label?: string;
}

export const FLOORS = [{id:0,name:'Ground Floor'},{id:1,name:'Mezzanine'},{id:2,name:'Upper Floor'}];

export const BUILDINGS: PlantObject[] = [
  {id:'bf',type:'building',name:'Blast Furnace Complex',x:50,y:50,w:280,h:220,floor:0,color:'#0d2a40',stroke:'#1a5a8c',meta:{zone_type:'production',capacity:45,risk:'high',indoorImage:'/images/blast_furnace.png'}},
  {id:'bof',type:'building',name:'Basic Oxygen Furnace',x:370,y:60,w:220,h:200,floor:0,color:'#0d2a40',stroke:'#1a5a8c',meta:{zone_type:'production',capacity:30,risk:'critical',indoorImage:'/images/bof.png'}},
  {id:'ccm',type:'building',name:'Continuous Casting',x:630,y:60,w:180,h:180,floor:0,color:'#0d2a40',stroke:'#1a5a8c',meta:{zone_type:'production',capacity:25,risk:'medium',indoorImage:'/images/continuous_casting.png'}},
  {id:'hrm',type:'building',name:'Hot Rolling Mill',x:50,y:320,w:300,h:180,floor:0,color:'#0d2a40',stroke:'#1a5a8c',meta:{zone_type:'production',capacity:35,risk:'high',indoorImage:'/images/rolling_mill.png'}},
  {id:'crm',type:'building',name:'Cold Rolling Mill',x:400,y:320,w:240,h:170,floor:0,color:'#0d2a40',stroke:'#1a5a8c',meta:{zone_type:'production',capacity:28,risk:'medium'}},
  {id:'coke',type:'building',name:'Coke Oven Battery',x:860,y:50,w:200,h:160,floor:0,color:'#1a1a0d',stroke:'#8c6a1a',meta:{zone_type:'production',capacity:20,risk:'high'}},
  {id:'sinter',type:'building',name:'Sinter Plant',x:860,y:250,w:200,h:140,floor:0,color:'#1a1a0d',stroke:'#8c6a1a',meta:{zone_type:'production',capacity:18,risk:'medium',indoorImage:'/images/sinter_plant.png'}},
  {id:'power',type:'building',name:'Power House',x:860,y:430,w:200,h:130,floor:0,color:'#0d1a2a',stroke:'#1a4a8c',meta:{zone_type:'utility',capacity:12,risk:'low'}},
  {id:'wh_a',type:'building',name:'Warehouse A',x:680,y:320,w:140,h:130,floor:0,color:'#0d2a1a',stroke:'#1a8c4a',meta:{zone_type:'storage',capacity:50,risk:'low',indoorImage:'/images/logistics.png'}},
  {id:'wh_b',type:'building',name:'Warehouse B',x:680,y:490,w:140,h:100,floor:0,color:'#0d2a1a',stroke:'#1a8c4a',meta:{zone_type:'storage',capacity:40,risk:'low'}},
  {id:'lab',type:'building',name:'Quality Lab',x:400,y:530,w:130,h:90,floor:0,color:'#1a0d2a',stroke:'#6a1a8c',meta:{zone_type:'laboratory',capacity:15,risk:'low'}},
  {id:'office',type:'building',name:'Admin Office',x:50,y:540,w:160,h:80,floor:0,color:'#0d1a2a',stroke:'#4a6a8c',meta:{zone_type:'office',capacity:60,risk:'low'}},
  {id:'maint',type:'building',name:'Maintenance Bay',x:250,y:540,w:120,h:80,floor:0,color:'#2a1a0d',stroke:'#8c4a1a',meta:{zone_type:'maintenance',capacity:20,risk:'medium'}},
  {id:'util',type:'building',name:'Utility Block',x:560,y:530,w:100,h:90,floor:0,color:'#0d1a2a',stroke:'#4a6a8c',meta:{zone_type:'utility',capacity:10,risk:'low'}},
  {id:'gate',type:'building',name:'Main Gate & Security',x:50,y:650,w:120,h:50,floor:0,color:'#0d2a2a',stroke:'#1a8c8c',meta:{zone_type:'security',capacity:8,risk:'low'}},
  {id:'mezz_ctrl',type:'building',name:'Control Room',x:370,y:80,w:200,h:160,floor:1,color:'#0d2a40',stroke:'#00d4ff',meta:{zone_type:'control',capacity:15,risk:'medium'}},
  {id:'mezz_elec',type:'building',name:'Electrical Room',x:620,y:80,w:150,h:120,floor:1,color:'#0d1a2a',stroke:'#3b82f6',meta:{zone_type:'utility',capacity:8,risk:'high'}},
  {id:'upper_hvac',type:'building',name:'HVAC Plant',x:100,y:100,w:200,h:150,floor:2,color:'#0d2a2a',stroke:'#1a8c8c',meta:{zone_type:'utility',capacity:6,risk:'low'}},
  {id:'upper_server',type:'building',name:'Server Room',x:400,y:100,w:160,h:120,floor:2,color:'#1a0d2a',stroke:'#8c3bf6',meta:{zone_type:'IT',capacity:4,risk:'medium'}},
];

export const MACHINES: PlantObject[] = [
  {id:'m_bf1',type:'machine',name:'Blast Furnace #1',x:80,y:80,w:60,h:60,floor:0,status:'running',meta:{parent:'bf',temp:1450,uptime:94}},
  {id:'m_bf2',type:'machine',name:'Blast Furnace #2',x:180,y:80,w:60,h:60,floor:0,status:'running',meta:{parent:'bf',temp:1420,uptime:87}},
  {id:'m_bf_crane',type:'machine',name:'BF Charging Crane',x:120,y:180,w:80,h:30,floor:0,status:'running',meta:{parent:'bf',load:25,uptime:91}},
  {id:'m_bof1',type:'machine',name:'BOF Converter #1',x:400,y:90,w:55,h:55,floor:0,status:'running',meta:{parent:'bof',temp:1650,uptime:89}},
  {id:'m_bof2',type:'machine',name:'BOF Converter #2',x:500,y:90,w:55,h:55,floor:0,status:'maintenance',meta:{parent:'bof',temp:0,uptime:0}},
  {id:'m_ladle',type:'machine',name:'Ladle Furnace',x:430,y:180,w:50,h:40,floor:0,status:'running',meta:{parent:'bof',temp:1580,uptime:92}},
  {id:'m_cast1',type:'machine',name:'Caster #1',x:660,y:90,w:50,h:50,floor:0,status:'running',meta:{parent:'ccm',speed:1.2,uptime:96}},
  {id:'m_cast2',type:'machine',name:'Caster #2',x:740,y:90,w:50,h:50,floor:0,status:'idle',meta:{parent:'ccm',speed:0,uptime:78}},
  {id:'m_hr1',type:'machine',name:'Roughing Mill',x:80,y:350,w:70,h:50,floor:0,status:'running',meta:{parent:'hrm',speed:3.5,uptime:93}},
  {id:'m_hr2',type:'machine',name:'Finishing Mill',x:200,y:350,w:90,h:50,floor:0,status:'running',meta:{parent:'hrm',speed:8.2,uptime:90}},
  {id:'m_hr_coiler',type:'machine',name:'Coiler',x:200,y:430,w:60,h:40,floor:0,status:'running',meta:{parent:'hrm',coils:142,uptime:95}},
  {id:'m_cr1',type:'machine',name:'Pickling Line',x:420,y:350,w:80,h:40,floor:0,status:'running',meta:{parent:'crm',speed:2.1,uptime:88}},
  {id:'m_cr2',type:'machine',name:'Tandem Mill',x:520,y:350,w:80,h:40,floor:0,status:'running',meta:{parent:'crm',speed:4.5,uptime:91}},
  {id:'m_cr_anneal',type:'machine',name:'Annealing Furnace',x:450,y:420,w:70,h:40,floor:0,status:'idle',meta:{parent:'crm',temp:680,uptime:85}},
  {id:'m_coke1',type:'machine',name:'Coke Battery #1',x:880,y:70,w:70,h:50,floor:0,status:'running',meta:{parent:'coke',temp:1100,uptime:97}},
  {id:'m_coke2',type:'machine',name:'Quenching Car',x:970,y:70,w:50,h:40,floor:0,status:'running',meta:{parent:'coke',cycles:340,uptime:93}},
  {id:'m_sinter1',type:'machine',name:'Sinter Machine',x:880,y:270,w:80,h:50,floor:0,status:'running',meta:{parent:'sinter',throughput:450,uptime:89}},
  {id:'m_turb1',type:'machine',name:'Turbine Generator',x:880,y:460,w:70,h:50,floor:0,status:'running',meta:{parent:'power',output:'45MW',uptime:99}},
  {id:'m_boiler',type:'machine',name:'Boiler',x:970,y:460,w:60,h:50,floor:0,status:'running',meta:{parent:'power',pressure:42,uptime:98}},
  {id:'m_comp',type:'machine',name:'Air Compressor',x:880,y:520,w:50,h:30,floor:0,status:'running',meta:{parent:'power',pressure:8,uptime:96}},
  {id:'m_forklift_wh',type:'machine',name:'Warehouse Crane',x:710,y:350,w:40,h:30,floor:0,status:'running',meta:{parent:'wh_a',load:18,uptime:90}},
];

export const ROADS: Road[] = [
  {points:[{x:40,y:280},{x:1080,y:280}],type:'road',color:'#1a2a3a',label:'Main East-West Road'},
  {points:[{x:40,y:510},{x:840,y:510}],type:'road',color:'#1a2a3a',label:'South Road'},
  {points:[{x:350,y:40},{x:350,y:700}],type:'road',color:'#1a2a3a',label:'Central Avenue'},
  {points:[{x:840,y:40},{x:840,y:600}],type:'road',color:'#1a2a3a',label:'East Perimeter'},
  {points:[{x:40,y:40},{x:40,y:700},{x:1080,y:700},{x:1080,y:40},{x:40,y:40}],type:'road',color:'#0f1f2f',label:'Ring Road'},
  {points:[{x:330,y:290},{x:330,y:300},{x:640,y:300},{x:640,y:290}],type:'rail',color:'#4a3a1a',label:'Rail Track'},
  {points:[{x:200,y:200},{x:370,y:200},{x:370,y:140},{x:590,y:140},{x:630,y:100}],type:'conveyor',color:'#00d4ff'},
  {points:[{x:780,y:130},{x:850,y:280},{x:860,y:280}],type:'conveyor',color:'#00d4ff'},
  {points:[{x:100,y:270},{x:100,y:330}],type:'pipe',color:'#ff4444',label:'Gas Line'},
  {points:[{x:600,y:60},{x:600,y:310}],type:'pipe',color:'#4488ff',label:'Water Main'},
  {points:[{x:850,y:200},{x:850,y:430}],type:'pipe',color:'#888888',label:'Steam Line'},
];

export const PRODUCTION_LINES: ProductionLine[] = [
  {id:'pl1',name:'Steel Making',points:[{x:140,y:140},{x:280,y:140},{x:420,y:140},{x:550,y:140},{x:700,y:140}],floor:0,active:true,flowOffset:0},
  {id:'pl2',name:'Hot Rolling',points:[{x:120,y:380},{x:240,y:380},{x:300,y:450},{x:240,y:460}],floor:0,active:true,flowOffset:0},
  {id:'pl3',name:'Cold Rolling',points:[{x:460,y:370},{x:560,y:370},{x:560,y:440},{x:490,y:440}],floor:0,active:true,flowOffset:0},
];

export const INITIAL_WORKERS: WorkerData[] = [
  {id:'w1',name:'Rajesh Kumar',role:'Operator',x:120,y:120,zone:'bf',floor:0,speed:0.04,dx:1,dy:0,trail:[]},
  {id:'w2',name:'Amit Singh',role:'Operator',x:200,y:150,zone:'bf',floor:0,speed:0.03,dx:0,dy:1,trail:[]},
  {id:'w3',name:'Priya Sharma',role:'Engineer',x:430,y:130,zone:'bof',floor:0,speed:0.05,dx:1,dy:0,trail:[]},
  {id:'w4',name:'Suresh Patel',role:'Technician',x:520,y:180,zone:'bof',floor:0,speed:0.03,dx:-1,dy:0,trail:[]},
  {id:'w5',name:'Deepak Yadav',role:'Operator',x:680,y:120,zone:'ccm',floor:0,speed:0.04,dx:0,dy:1,trail:[]},
  {id:'w6',name:'Anita Devi',role:'Supervisor',x:150,y:380,zone:'hrm',floor:0,speed:0.05,dx:1,dy:0,trail:[]},
  {id:'w7',name:'Vikram Reddy',role:'Operator',x:250,y:400,zone:'hrm',floor:0,speed:0.03,dx:0,dy:-1,trail:[]},
  {id:'w8',name:'Meena Kumari',role:'QC Inspector',x:440,y:380,zone:'crm',floor:0,speed:0.04,dx:1,dy:0,trail:[]},
  {id:'w9',name:'Ravi Tiwari',role:'Electrician',x:900,y:470,zone:'power',floor:0,speed:0.03,dx:0,dy:1,trail:[]},
  {id:'w10',name:'Santosh Gupta',role:'Forklift Op',x:720,y:380,zone:'wh_a',floor:0,speed:0.04,dx:1,dy:0,trail:[]},
  {id:'w11',name:'Kiran Joshi',role:'Lab Analyst',x:440,y:560,zone:'lab',floor:0,speed:0.02,dx:1,dy:0,trail:[]},
  {id:'w12',name:'Manoj Verma',role:'Maintenance',x:280,y:570,zone:'maint',floor:0,speed:0.03,dx:0,dy:-1,trail:[]},
  {id:'w13',name:'Neha Agarwal',role:'Safety Officer',x:100,y:560,zone:'office',floor:0,speed:0.04,dx:1,dy:0,trail:[]},
  {id:'w14',name:'Ramesh Chand',role:'Control Op',x:450,y:140,zone:'mezz_ctrl',floor:1,speed:0.02,dx:1,dy:0,trail:[]},
  {id:'w15',name:'Pooja Mishra',role:'IT Admin',x:460,y:150,zone:'upper_server',floor:2,speed:0.02,dx:0,dy:1,trail:[]},
];

export const INITIAL_VEHICLES: VehicleData[] = [
  {id:'agv1',type:'AGV',x:360,y:290,floor:0,status:'moving',route:[{x:360,y:290},{x:600,y:290},{x:600,y:510},{x:360,y:510},{x:360,y:290}],routeIdx:0,speed:0.12,battery:85,task:'Iron ore transport'},
  {id:'agv2',type:'AGV',x:700,y:510,floor:0,status:'moving',route:[{x:700,y:510},{x:840,y:510},{x:840,y:290},{x:700,y:290},{x:700,y:510}],routeIdx:0,speed:0.08,battery:72,task:'Slab transport'},
  {id:'agv3',type:'AGV',x:200,y:510,floor:0,status:'loading',route:[{x:200,y:510},{x:350,y:510},{x:350,y:290},{x:200,y:290},{x:200,y:510}],routeIdx:0,speed:0.10,battery:91,task:'Coil delivery'},
  {id:'fork1',type:'Forklift',x:720,y:400,floor:0,status:'moving',route:[{x:720,y:400},{x:750,y:520},{x:720,y:540},{x:690,y:400},{x:720,y:400}],routeIdx:0,speed:0.06,battery:65,task:'Warehouse ops'},
  {id:'fork2',type:'Forklift',x:900,y:300,floor:0,status:'idle',route:[{x:900,y:300},{x:950,y:350},{x:900,y:380},{x:870,y:350},{x:900,y:300}],routeIdx:0,speed:0.05,battery:45,task:'Material staging'},
  {id:'crane1',type:'Overhead Crane',x:160,y:100,floor:0,status:'moving',route:[{x:100,y:100},{x:280,y:100},{x:280,y:200},{x:100,y:200},{x:100,y:100}],routeIdx:0,speed:0.04,battery:100,task:'Charging BF'},
];

export const INITIAL_SENSORS: SensorData[] = [
  {id:'s1',type:'temperature',x:130,y:100,floor:0,value:1445,unit:'°C',min:1300,max:1600,threshold:1550,status:'normal',zone:'bf'},
  {id:'s2',type:'temperature',x:230,y:100,floor:0,value:1418,unit:'°C',min:1300,max:1600,threshold:1550,status:'normal',zone:'bf'},
  {id:'s3',type:'gas',x:160,y:200,floor:0,value:18,unit:'ppm',min:0,max:100,threshold:50,status:'normal',zone:'bf'},
  {id:'s4',type:'temperature',x:440,y:110,floor:0,value:1648,unit:'°C',min:1500,max:1700,threshold:1680,status:'warning',zone:'bof'},
  {id:'s5',type:'vibration',x:540,y:110,floor:0,value:2.1,unit:'mm/s',min:0,max:10,threshold:7,status:'normal',zone:'bof'},
  {id:'s6',type:'pressure',x:470,y:200,floor:0,value:3.2,unit:'bar',min:0,max:8,threshold:6,status:'normal',zone:'bof'},
  {id:'s7',type:'temperature',x:700,y:110,floor:0,value:1050,unit:'°C',min:900,max:1200,threshold:1150,status:'normal',zone:'ccm'},
  {id:'s8',type:'vibration',x:150,y:370,floor:0,value:4.5,unit:'mm/s',min:0,max:10,threshold:7,status:'normal',zone:'hrm'},
  {id:'s9',type:'temperature',x:250,y:370,floor:0,value:920,unit:'°C',min:800,max:1100,threshold:1050,status:'normal',zone:'hrm'},
  {id:'s10',type:'vibration',x:470,y:370,floor:0,value:3.2,unit:'mm/s',min:0,max:10,threshold:7,status:'normal',zone:'crm'},
  {id:'s11',type:'gas',x:920,y:90,floor:0,value:32,unit:'ppm',min:0,max:100,threshold:50,status:'normal',zone:'coke'},
  {id:'s12',type:'temperature',x:920,y:140,floor:0,value:1085,unit:'°C',min:900,max:1200,threshold:1150,status:'normal',zone:'coke'},
  {id:'s13',type:'pressure',x:920,y:480,floor:0,value:41,unit:'bar',min:20,max:60,threshold:55,status:'normal',zone:'power'},
  {id:'s14',type:'humidity',x:740,y:360,floor:0,value:45,unit:'%',min:20,max:80,threshold:70,status:'normal',zone:'wh_a'},
  {id:'s15',type:'noise',x:300,y:380,floor:0,value:88,unit:'dB',min:50,max:120,threshold:105,status:'normal',zone:'hrm'},
  {id:'s16',type:'gas',x:440,y:560,floor:0,value:5,unit:'ppm',min:0,max:50,threshold:25,status:'normal',zone:'lab'},
  {id:'s17',type:'temperature',x:430,y:130,floor:1,value:24,unit:'°C',min:18,max:30,threshold:28,status:'normal',zone:'mezz_ctrl'},
  {id:'s18',type:'humidity',x:660,y:120,floor:1,value:38,unit:'%',min:20,max:60,threshold:55,status:'normal',zone:'mezz_elec'},
  {id:'s19',type:'temperature',x:180,y:160,floor:2,value:22,unit:'°C',min:15,max:35,threshold:30,status:'normal',zone:'upper_hvac'},
  {id:'s20',type:'temperature',x:460,y:150,floor:2,value:21,unit:'°C',min:18,max:25,threshold:24,status:'normal',zone:'upper_server'},
];

export const SAFETY_MARKERS: PlantObject[] = [
  {id:'exit1',type:'exit',name:'North Emergency Exit',x:350,y:42,w:16,h:16,floor:0},
  {id:'exit2',type:'exit',name:'South Emergency Exit',x:350,y:690,w:16,h:16,floor:0},
  {id:'exit3',type:'exit',name:'East Emergency Exit',x:1070,y:280,w:16,h:16,floor:0},
  {id:'exit4',type:'exit',name:'West Gate Exit',x:42,y:660,w:16,h:16,floor:0},
  {id:'mp1',type:'muster',name:'Muster Point Alpha',x:200,y:650,w:20,h:20,floor:0},
  {id:'mp2',type:'muster',name:'Muster Point Beta',x:700,y:650,w:20,h:20,floor:0},
  {id:'fe1',type:'extinguisher',name:'Fire Ext. BF Area',x:310,y:140,w:10,h:10,floor:0},
  {id:'fe2',type:'extinguisher',name:'Fire Ext. BOF Area',x:560,y:140,w:10,h:10,floor:0},
  {id:'fe3',type:'extinguisher',name:'Fire Ext. HRM',x:330,y:400,w:10,h:10,floor:0},
  {id:'fe4',type:'extinguisher',name:'Fire Ext. Warehouse',x:810,y:400,w:10,h:10,floor:0},
  {id:'alarm1',type:'alarm',name:'Fire Alarm Panel',x:350,y:520,w:12,h:12,floor:0},
];

export const INITIAL_KPIS = {
  oee: 87.3, productionRate: 4250, energyConsumption: 38.5,
  safetyScore: 94, activeAlerts: 2, shift: 'Day Shift A',
};
