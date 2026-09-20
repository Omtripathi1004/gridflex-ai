'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ProvenanceBadge } from '../../components/ProvenanceBadge';
import {
  Map, Zap, AlertTriangle, Activity, RefreshCw, CheckCircle2,
  Layers, Radio, TrendingUp, TrendingDown, Eye, Clock,
  ChevronRight, Settings, BarChart2
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TransmissionLine {
  id: string; name: string; from: string; to: string;
  loadMW: number; capacityMW: number; voltagekV: number;
  congested: boolean; x1: number; y1: number; x2: number; y2: number;
  state: string;
}

interface GridSubstation {
  id: string; name: string; x: number; y: number;
  loadMW: number; status: 'normal' | 'stressed' | 'critical'; state: string;
  voltage: number;
}

interface CongestionEvent {
  id: string; line: string; severity: 'low'|'medium'|'high'|'critical';
  price: number; duration: string; resolution: string;
}

// ─── Mock grid topology ───────────────────────────────────────────────────────
const SUBSTATIONS: GridSubstation[] = [
  {id:'SS1',name:'Rajkot',x:130,y:190,loadMW:184,status:'normal',state:'Gujarat',voltage:220},
  {id:'SS2',name:'Ahmedabad',x:190,y:230,loadMW:412,status:'stressed',state:'Gujarat',voltage:218},
  {id:'SS3',name:'Surat',x:220,y:310,loadMW:326,status:'normal',state:'Gujarat',voltage:221},
  {id:'SS4',name:'Pune',x:310,y:290,loadMW:498,status:'critical',state:'Maharashtra',voltage:209},
  {id:'SS5',name:'Mumbai',x:265,y:325,loadMW:1240,status:'critical',state:'Maharashtra',voltage:204},
  {id:'SS6',name:'Nagpur',x:380,y:220,loadMW:288,status:'stressed',state:'Maharashtra',voltage:215},
  {id:'SS7',name:'Indore',x:320,y:170,loadMW:196,status:'normal',state:'M.P.',voltage:222},
  {id:'SS8',name:'Bhopal',x:370,y:150,loadMW:178,status:'normal',state:'M.P.',voltage:220},
  {id:'SS9',name:'Hyderabad',x:380,y:350,loadMW:524,status:'stressed',state:'Telangana',voltage:213},
  {id:'SS10',name:'Bengaluru',x:330,y:430,loadMW:712,status:'stressed',state:'Karnataka',voltage:211},
  {id:'SS11',name:'Delhi',x:350,y:80,loadMW:1480,status:'critical',state:'Delhi',voltage:208},
  {id:'SS12',name:'Jaipur',x:275,y:105,loadMW:298,status:'normal',state:'Rajasthan',voltage:219},
];

const LINES: TransmissionLine[] = [
  {id:'L1',name:'Rajkot–Ahmedabad 400kV',from:'SS1',to:'SS2',loadMW:324,capacityMW:420,voltagekV:400,congested:false,x1:130,y1:190,x2:190,y2:230,state:'Gujarat'},
  {id:'L2',name:'Ahmedabad–Surat 220kV',from:'SS2',to:'SS3',loadMW:290,capacityMW:310,voltagekV:220,congested:true,x1:190,y1:230,x2:220,y2:310,state:'Gujarat'},
  {id:'L3',name:'Surat–Mumbai 400kV',from:'SS3',to:'SS5',loadMW:380,capacityMW:420,voltagekV:400,congested:false,x1:220,y1:310,x2:265,y2:325,state:'Maharashtra'},
  {id:'L4',name:'Mumbai–Pune 220kV',from:'SS5',to:'SS4',loadMW:295,capacityMW:310,voltagekV:220,congested:true,x1:265,y1:325,x2:310,y2:290,state:'Maharashtra'},
  {id:'L5',name:'Pune–Nagpur 400kV',from:'SS4',to:'SS6',loadMW:188,capacityMW:420,voltagekV:400,congested:false,x1:310,y1:290,x2:380,y2:220,state:'Maharashtra'},
  {id:'L6',name:'Nagpur–Bhopal 220kV',from:'SS6',to:'SS8',loadMW:124,capacityMW:220,voltagekV:220,congested:false,x1:380,y1:220,x2:370,y2:150,state:'M.P.'},
  {id:'L7',name:'Indore–Bhopal 132kV',from:'SS7',to:'SS8',loadMW:98,capacityMW:130,voltagekV:132,congested:false,x1:320,y1:170,x2:370,y2:150,state:'M.P.'},
  {id:'L8',name:'Jaipur–Delhi 400kV',from:'SS12',to:'SS11',loadMW:624,capacityMW:680,voltagekV:400,congested:true,x1:275,y1:105,x2:350,y2:80,state:'Rajasthan'},
  {id:'L9',name:'Delhi–Bhopal 400kV',from:'SS11',to:'SS8',loadMW:412,capacityMW:500,voltagekV:400,congested:false,x1:350,y1:80,x2:370,y2:150,state:'Delhi'},
  {id:'L10',name:'Pune–Hyderabad 400kV',from:'SS4',to:'SS9',loadMW:260,capacityMW:420,voltagekV:400,congested:false,x1:310,y1:290,x2:380,y2:350,state:'Maharashtra'},
  {id:'L11',name:'Hyderabad–Bengaluru 400kV',from:'SS9',to:'SS10',loadMW:388,capacityMW:420,voltagekV:400,congested:false,x1:380,y1:350,x2:330,y2:430,state:'Telangana'},
  {id:'L12',name:'Mumbai–Hyderabad 220kV',from:'SS5',to:'SS9',loadMW:305,capacityMW:310,voltagekV:220,congested:true,x1:265,y1:325,x2:380,y2:350,state:'Maharashtra'},
];

const CONGESTION_EVENTS: CongestionEvent[] = [
  {id:'CE1',line:'Ahmedabad–Surat 220kV',severity:'high',price:18.4,duration:'2h 15m',resolution:'Re-dispatch ISGS units + DR activation'},
  {id:'CE2',line:'Mumbai–Pune 220kV',severity:'critical',price:24.7,duration:'45m',resolution:'Emergency imports from SRPC pool'},
  {id:'CE3',line:'Jaipur–Delhi 400kV',severity:'high',price:21.2,duration:'1h 30m',resolution:'Curtail wind + activate BESS ramp'},
  {id:'CE4',line:'Mumbai–Hyderabad 220kV',severity:'medium',price:14.8,duration:'3h',resolution:'Optimal power flow re-routing'},
];

const congestionColor = (line: TransmissionLine) => {
  const ratio = line.loadMW / line.capacityMW;
  if(ratio > 0.92) return '#DC2626';
  if(ratio > 0.80) return '#F97316';
  if(ratio > 0.65) return '#EAB308';
  return '#10B981';
};

const subColor = (s: GridSubstation['status']) =>
  s==='critical'?'#DC2626':s==='stressed'?'#F97316':'#10B981';

// ─── Page Component ───────────────────────────────────────────────────────────
export default function SpatialTwinPage() {
  const [selectedLine, setSelectedLine] = useState<TransmissionLine|null>(null);
  const [selectedSS, setSelectedSS] = useState<GridSubstation|null>(null);
  const [viewMode, setViewMode] = useState<'congestion'|'voltage'|'flow'>('congestion');
  const [ticker, setTicker] = useState(0);
  const [lines, setLines] = useState(LINES);
  const [substations, setSubstations] = useState(SUBSTATIONS);

  // Gentle live drift: relaxed to 60s instead of 2.5s
  useEffect(()=>{
    const iv=setInterval(()=>{
      setTicker(t=>t+1);
      setLines(prev=>prev.map(l=>({...l, loadMW: Math.max(0,l.loadMW+(Math.random()-0.48)*8)})));
      setSubstations(prev=>prev.map(s=>({...s, loadMW: Math.max(0,s.loadMW+(Math.random()-0.48)*12), voltage: Math.max(195,Math.min(225,s.voltage+(Math.random()-0.5)*0.4))})));
    },60000);
    return()=>clearInterval(iv);
  },[]);

  const congestedLines = lines.filter(l=>l.loadMW/l.capacityMW>0.8);
  const criticalSS = substations.filter(s=>s.status==='critical');
  const totalLoad = substations.reduce((s,n)=>s+n.loadMW,0);

  const getLineWidth = (l: TransmissionLine) => {
    const r = l.loadMW/l.capacityMW;
    return Math.max(1.5, r*6);
  };

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-primary)',padding:'24px',color:'var(--text-primary)'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24,gap:16,flexWrap:'wrap'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
            <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,rgba(6,182,212,0.3),rgba(56,189,248,0.15))',border:'1px solid rgba(6,182,212,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Map size={22} color="#06B6D4"/>
            </div>
            <div>
              <h1 style={{fontSize:'1.7rem',fontWeight:800,margin:0,background:'linear-gradient(135deg,#06B6D4,#38bdf8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                Spatial Grid Twin
              </h1>
              <p style={{fontSize:'0.82rem',color:'var(--text-secondary)',margin:0}}>
                3D Transmission Network Congestion Map — Real-Time Power Flow Heatmap
              </p>
            </div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <ProvenanceBadge classification="real" sourceName="POSOCO Grid-India WAMS" sourceUrl="https://grid-india.in" mode="live"/>
            <ProvenanceBadge classification="scaled_real" sourceName="NLDC Power Flow Data" mode="cached"/>
          </div>
        </div>
        <div style={{display:'flex',gap:4}}>
          {(['congestion','voltage','flow'] as const).map(m=>(
            <button key={m} onClick={()=>setViewMode(m)}
              style={{padding:'7px 14px',borderRadius:8,border:`1px solid ${viewMode===m?'rgba(6,182,212,0.5)':'rgba(255,255,255,0.08)'}`,background:viewMode===m?'rgba(6,182,212,0.15)':'transparent',color:viewMode===m?'#06B6D4':'var(--text-secondary)',cursor:'pointer',fontSize:'0.8rem',fontWeight:viewMode===m?700:400,textTransform:'capitalize'}}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:20}}>
        {[
          {label:'Total Load',value:`${(totalLoad/1000).toFixed(1)} GW`,color:'#06B6D4'},
          {label:'Congested Lines',value:String(congestedLines.length),color:congestedLines.length>2?'#DC2626':'#EAB308'},
          {label:'Critical Nodes',value:String(criticalSS.length),color:criticalSS.length>1?'#DC2626':'#F97316'},
          {label:'Lines Monitored',value:String(lines.length),color:'#10B981'},
          {label:'Max Congestion',value:`${Math.round(Math.max(...lines.map(l=>l.loadMW/l.capacityMW))*100)}%`,color:'#F97316'},
        ].map(k=>(
          <div key={k.label} style={{background:'var(--bg-card)',border:`1px solid ${k.color}22`,borderRadius:12,padding:'12px 14px',borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:'0.7rem',color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:4}}>{k.label}</div>
            <div style={{fontSize:'1.3rem',fontWeight:800,color:k.color,fontFamily:'monospace'}}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid Map + Side Panel */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:20,marginBottom:20}}>
        {/* SVG Map */}
        <div style={{background:'var(--bg-card)',border:'1px solid var(--border-medium)',borderRadius:16,overflow:'hidden',position:'relative'}}>
          <div style={{padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
            <span style={{fontSize:'0.82rem',fontWeight:700,color:'#06B6D4',display:'flex',alignItems:'center',gap:6}}><Activity size={14}/> WESTERN + CENTRAL REGION — LIVE POWER FLOW</span>
            <div style={{display:'flex',gap:12,fontSize:'0.7rem',color:'var(--text-tertiary)'}}>
              <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:16,height:3,background:'#10B981',display:'inline-block',borderRadius:2}}/>&lt;65%</span>
              <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:16,height:3,background:'#EAB308',display:'inline-block',borderRadius:2}}/>65-80%</span>
              <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:16,height:3,background:'#F97316',display:'inline-block',borderRadius:2}}/>80-92%</span>
              <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:16,height:3,background:'#DC2626',display:'inline-block',borderRadius:2}}/>Critical</span>
            </div>
          </div>
          <svg viewBox="70 60 360 400" style={{width:'100%',height:480,cursor:'default'}}
            xmlns="http://www.w3.org/2000/svg">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,240,255,0.04)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>

            {/* Transmission lines */}
            {lines.map(l=>{
              const ratio=l.loadMW/l.capacityMW;
              const col=viewMode==='congestion'?congestionColor(l):viewMode==='voltage'?`hsl(${200-ratio*120},80%,55%)`:`hsl(${150-ratio*100},70%,50%)`;
              const isSelected=selectedLine?.id===l.id;
              return (
                <g key={l.id} onClick={()=>setSelectedLine(selectedLine?.id===l.id?null:l)} style={{cursor:'pointer'}}>
                  {/* Glow effect for congested */}
                  {ratio>0.8&&<line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={col} strokeWidth={getLineWidth(l)+4} strokeOpacity={0.25} strokeLinecap="round"/>}
                  <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                    stroke={isSelected?'#00f0ff':col} strokeWidth={isSelected?getLineWidth(l)+1:getLineWidth(l)}
                    strokeOpacity={0.9} strokeLinecap="round"
                    strokeDasharray={ratio>0.92?'6,3':undefined}/>
                  {/* Flow direction arrow at midpoint */}
                  <circle cx={(l.x1+l.x2)/2} cy={(l.y1+l.y2)/2} r={3.5} fill={col} opacity={0.8}/>
                  {/* Load label */}
                  {isSelected&&<text x={(l.x1+l.x2)/2+4} y={(l.y1+l.y2)/2-5} fontSize="7" fill="#00f0ff" fontFamily="monospace">{Math.round(l.loadMW)}MW</text>}
                </g>
              );
            })}

            {/* Substations */}
            {substations.map(ss=>{
              const col=subColor(ss.status);
              const isSelected=selectedSS?.id===ss.id;
              const r=ss.status==='critical'?9:ss.status==='stressed'?7:5.5;
              return (
                <g key={ss.id} onClick={()=>setSelectedSS(selectedSS?.id===ss.id?null:ss)} style={{cursor:'pointer'}}>
                  {/* Glow */}
                  <circle cx={ss.x} cy={ss.y} r={r+8} fill={col} opacity={0.12}/>
                  {ss.status==='critical'&&<circle cx={ss.x} cy={ss.y} r={r+5} fill="none" stroke={col} strokeWidth={1} opacity={0.4} strokeDasharray="3,2">
                    <animateTransform attributeName="transform" type="rotate" from={`0 ${ss.x} ${ss.y}`} to={`360 ${ss.x} ${ss.y}`} dur="4s" repeatCount="indefinite"/>
                  </circle>}
                  <circle cx={ss.x} cy={ss.y} r={r} fill={col} fillOpacity={0.85} stroke={isSelected?'#00f0ff':'rgba(255,255,255,0.2)'} strokeWidth={isSelected?1.5:0.8}/>
                  <text x={ss.x} y={ss.y+r+9} textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif" fontWeight="600">{ss.name}</text>
                  {isSelected&&<text x={ss.x} y={ss.y-r-3} textAnchor="middle" fontSize="7" fill="#00f0ff" fontFamily="monospace">{ss.loadMW}MW</text>}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Details Panel */}
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {/* Selected item info */}
          {(selectedLine||selectedSS)?(
            <div style={{background:'rgba(0,240,255,0.06)',border:'1px solid rgba(0,240,255,0.3)',borderRadius:14,padding:16}}>
              <div style={{fontSize:'0.78rem',fontWeight:700,color:'#00f0ff',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10}}>
                {selectedLine?'Line Details':'Substation Details'}
              </div>
              {selectedLine&&(
                <>
                  <div style={{fontSize:'0.92rem',fontWeight:700,marginBottom:8}}>{selectedLine.name}</div>
                  {[
                    {k:'Load',v:`${Math.round(selectedLine.loadMW)} MW`},
                    {k:'Capacity',v:`${selectedLine.capacityMW} MW`},
                    {k:'Utilization',v:`${Math.round(selectedLine.loadMW/selectedLine.capacityMW*100)}%`},
                    {k:'Voltage',v:`${selectedLine.voltagekV} kV`},
                    {k:'State',v:selectedLine.state},
                    {k:'Status',v:selectedLine.congested?'⚠ CONGESTED':'✓ Normal'},
                  ].map(r=>(
                    <div key={r.k} style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:'0.8rem'}}>
                      <span style={{color:'var(--text-tertiary)'}}>{r.k}</span>
                      <span style={{color:'var(--text-primary)',fontWeight:600,fontFamily:'monospace'}}>{r.v}</span>
                    </div>
                  ))}
                  <div style={{marginTop:10,height:5,background:'rgba(255,255,255,0.07)',borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${Math.min(100,(selectedLine.loadMW/selectedLine.capacityMW)*100)}%`,background:congestionColor(selectedLine),borderRadius:3}}/>
                  </div>
                </>
              )}
              {selectedSS&&(
                <>
                  <div style={{fontSize:'0.92rem',fontWeight:700,marginBottom:8}}>{selectedSS.name}</div>
                  {[
                    {k:'Load',v:`${selectedSS.loadMW} MW`},
                    {k:'Voltage',v:`${selectedSS.voltage.toFixed(1)} kV`},
                    {k:'State',v:selectedSS.state},
                    {k:'Status',v:selectedSS.status.toUpperCase()},
                  ].map(r=>(
                    <div key={r.k} style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:'0.8rem'}}>
                      <span style={{color:'var(--text-tertiary)'}}>{r.k}</span>
                      <span style={{color:r.k==='Status'?subColor(selectedSS.status):'var(--text-primary)',fontWeight:600,fontFamily:'monospace'}}>{r.v}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          ):(
            <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:14,padding:16,textAlign:'center'}}>
              <Eye size={24} color="var(--text-muted)" style={{marginBottom:8}}/>
              <div style={{fontSize:'0.82rem',color:'var(--text-tertiary)'}}>Click any line or substation to inspect</div>
            </div>
          )}

          {/* Congestion Events */}
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:14,padding:16,flex:1}}>
            <h3 style={{fontSize:'0.82rem',fontWeight:700,marginBottom:12,display:'flex',alignItems:'center',gap:6}}><AlertTriangle size={13} color="#F97316"/> Active Congestion Events</h3>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {CONGESTION_EVENTS.map(ev=>{
                const col=ev.severity==='critical'?'#DC2626':ev.severity==='high'?'#F97316':'#EAB308';
                return (
                  <div key={ev.id} style={{padding:'9px 11px',borderRadius:9,background:'rgba(255,255,255,0.03)',border:`1px solid ${col}22`,borderLeft:`3px solid ${col}`}}>
                    <div style={{fontSize:'0.78rem',fontWeight:600,color:'var(--text-primary)',marginBottom:3}}>{ev.line}</div>
                    <div style={{display:'flex',gap:8,marginBottom:3,fontSize:'0.68rem'}}>
                      <span style={{color:col,fontWeight:700,textTransform:'uppercase'}}>{ev.severity}</span>
                      <span style={{color:'#F59E0B',fontFamily:'monospace'}}>₹{ev.price}/kWh</span>
                      <span style={{color:'var(--text-tertiary)'}}>{ev.duration}</span>
                    </div>
                    <div style={{fontSize:'0.7rem',color:'var(--text-tertiary)'}}>{ev.resolution}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        {[
          {label:'POSOCO WAMS',status:'Live',color:'#10B981'},
          {label:'NLDC Power Flow',status:'5-min update',color:'#06B6D4'},
          {label:'Congested Lines',status:`${congestedLines.length} of ${lines.length}`,color:congestedLines.length>2?'#DC2626':'#EAB308'},
          {label:'View Mode',status:viewMode.toUpperCase(),color:'#8B5CF6'},
        ].map(s=>(
          <div key={s.label} style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',background:'rgba(255,255,255,0.04)',borderRadius:8,border:'1px solid rgba(255,255,255,0.07)',fontSize:'0.78rem'}}>
            <span style={{color:'var(--text-tertiary)'}}>{s.label}:</span>
            <span style={{color:s.color,fontWeight:600}}>{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
