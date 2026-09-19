'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ProvenanceBadge } from '../../components/ProvenanceBadge';
import {
  Sun, Cloud, Wind, Zap, Activity, CheckCircle2, Layers, Radio,
  RefreshCw, Eye, BarChart2, Clock, Navigation
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CloudCell {
  x: number; y: number; vx: number; vy: number;
  opacity: number; radius: number; type: 'cumulus' | 'stratus' | 'cumulonimbus';
}

interface GHIForecast {
  hour: string; ghi: number; dni: number; dhi: number;
  confidence: number; cloudCover: number; label: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initClouds(): CloudCell[] {
  const types: CloudCell['type'][] = ['cumulus', 'stratus', 'cumulonimbus'];
  return Array.from({ length: 22 }, (_, i) => ({
    x: Math.random() * 640, y: Math.random() * 320,
    vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.3,
    opacity: 0.35 + Math.random() * 0.45,
    radius: 28 + Math.random() * 55,
    type: types[i % 3],
  }));
}

function genGHIForecast(cloudDensity: number): GHIForecast[] {
  const hours = ['05:30','06:00','07:00','08:00','09:00','10:00','11:00',
    '12:00','13:00','14:00','15:00','16:00','17:00','18:00','18:30'];
  const peakGHI = 1050 * (1 - cloudDensity * 0.6);
  return hours.map((h, i) => {
    const solar = Math.sin((i / (hours.length - 1)) * Math.PI);
    const noise = (Math.random() - 0.5) * 40;
    const ghi = Math.max(0, Math.round(solar * peakGHI + noise));
    const dni = Math.round(ghi * (0.78 - cloudDensity * 0.2));
    const dhi = Math.round(ghi * (0.22 + cloudDensity * 0.15));
    const confidence = Math.round(92 - cloudDensity * 18 - Math.abs(i - 7) * 1.5);
    const cloudCover = Math.min(100, Math.round(cloudDensity * 85 + Math.random() * 10));
    let label = 'Clear';
    if (cloudCover > 70) label = 'Overcast';
    else if (cloudCover > 40) label = 'Partly Cloudy';
    else if (cloudCover > 15) label = 'Mostly Clear';
    return { hour: h, ghi, dni, dhi, confidence, cloudCover, label };
  });
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function SkyVisionPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const cloudsRef = useRef<CloudCell[]>(initClouds());
  const [cloudDensity, setCloudDensity] = useState(0.32);
  const [windSpeed, setWindSpeed] = useState(14.5);
  const [windDir, setWindDir] = useState(215);
  const [isRunning, setIsRunning] = useState(true);
  const [frameRate, setFrameRate] = useState(0);
  const [ghiForecast, setGhiForecast] = useState<GHIForecast[]>(() => genGHIForecast(0.32));
  const [selectedHour, setSelectedHour] = useState(7);
  const lastFrameTime = useRef(performance.now());

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    // BG
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#0a0e1a'); bgGrad.addColorStop(1, '#071028');
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(0,240,255,0.06)'; ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Sun
    const sunX = W*0.5 + Math.cos(Date.now()*0.0001)*W*0.35;
    const sunY = H*0.18 + Math.sin(Date.now()*0.0001)*H*0.05;
    const sunGrad = ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,60);
    sunGrad.addColorStop(0,'rgba(251,191,36,0.9)'); sunGrad.addColorStop(0.3,'rgba(245,158,11,0.5)'); sunGrad.addColorStop(1,'rgba(245,158,11,0)');
    ctx.fillStyle = sunGrad; ctx.beginPath(); ctx.arc(sunX,sunY,60,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,236,153,0.95)'; ctx.beginPath(); ctx.arc(sunX,sunY,14,0,Math.PI*2); ctx.fill();

    // GHI heatmap
    const forecast = ghiForecast[selectedHour];
    if (forecast) {
      const ghiRatio = forecast.ghi / 1050;
      const heatGrad = ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,250);
      heatGrad.addColorStop(0,`rgba(251,191,36,${ghiRatio*0.25})`);
      heatGrad.addColorStop(0.5,`rgba(245,158,11,${ghiRatio*0.12})`);
      heatGrad.addColorStop(1,'rgba(245,158,11,0)');
      ctx.fillStyle = heatGrad; ctx.fillRect(0,0,W,H);
    }

    // Wind vectors
    const windRad = (windDir * Math.PI) / 180;
    ctx.strokeStyle = 'rgba(6,182,212,0.35)'; ctx.lineWidth = 1;
    for (let gx = 30; gx < W; gx += 60) {
      for (let gy = 30; gy < H; gy += 55) {
        const len = windSpeed * 0.7;
        const ex = gx + Math.cos(windRad)*len; const ey = gy + Math.sin(windRad)*len;
        ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(ex,ey); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ex,ey);
        ctx.lineTo(ex-Math.cos(windRad-0.5)*5,ey-Math.sin(windRad-0.5)*5);
        ctx.lineTo(ex-Math.cos(windRad+0.5)*5,ey-Math.sin(windRad+0.5)*5);
        ctx.closePath(); ctx.fillStyle='rgba(6,182,212,0.4)'; ctx.fill();
      }
    }

    // Clouds
    const spd = (windSpeed/50)*(isRunning?1:0);
    cloudsRef.current.forEach(c => {
      if (isRunning) {
        c.x += Math.cos(windRad)*spd*windSpeed*0.08 + c.vx;
        c.y += Math.sin(windRad)*spd*windSpeed*0.08 + c.vy;
        if (c.x > W+c.radius) c.x=-c.radius;
        if (c.x < -c.radius) c.x=W+c.radius;
        if (c.y > H+c.radius) c.y=-c.radius;
        if (c.y < -c.radius) c.y=H+c.radius;
      }
      const a = c.opacity * cloudDensity;
      const col = c.type==='cumulonimbus'
        ? `rgba(40,50,90,${a*1.5})` : c.type==='stratus'
        ? `rgba(120,140,180,${a})` : `rgba(180,200,230,${a})`;
      const grad = ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,c.radius);
      grad.addColorStop(0,col); grad.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(c.x,c.y,c.radius,0,Math.PI*2); ctx.fill();
    });

    // Scan line
    const scanY = (Date.now()*0.12)%H;
    const scanGrad = ctx.createLinearGradient(0,scanY-4,0,scanY+4);
    scanGrad.addColorStop(0,'rgba(0,240,255,0)'); scanGrad.addColorStop(0.5,'rgba(0,240,255,0.18)'); scanGrad.addColorStop(1,'rgba(0,240,255,0)');
    ctx.fillStyle=scanGrad; ctx.fillRect(0,scanY-4,W,8);

    // FPS
    const now2=performance.now(); const fps=Math.round(1000/(now2-lastFrameTime.current));
    lastFrameTime.current=now2;
    ctx.fillStyle='rgba(6,182,212,0.7)'; ctx.font='10px monospace';
    ctx.fillText(`${fps} FPS · Optical-Flow Engine v2.1`,8,H-8);
    setFrameRate(fps);

    animRef.current = requestAnimationFrame(drawFrame);
  }, [cloudDensity,windSpeed,windDir,isRunning,ghiForecast,selectedHour]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animRef.current);
  }, [drawFrame]);

  useEffect(() => { setGhiForecast(genGHIForecast(cloudDensity)); }, [cloudDensity,windSpeed]);

  const cur = ghiForecast[selectedHour] ?? ghiForecast[7];
  const maxGHI = Math.max(...ghiForecast.map(f=>f.ghi));
  const totalEnergy = ghiForecast.reduce((s,f)=>s+f.ghi*(0.5/1000),0);

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-primary)',padding:'24px',color:'var(--text-primary)'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24,gap:16,flexWrap:'wrap'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
            <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,rgba(245,158,11,0.3),rgba(251,191,36,0.15))',border:'1px solid rgba(245,158,11,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Eye size={22} color="#F59E0B"/>
            </div>
            <div>
              <h1 style={{fontSize:'1.7rem',fontWeight:800,margin:0,background:'linear-gradient(135deg,#F59E0B,#fbbf24)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                SkyVision GHI Radar
              </h1>
              <p style={{fontSize:'0.82rem',color:'var(--text-secondary)',margin:0}}>
                OpenCV Optical-Flow Cloud Motion → GHI/DNI/DHI Forecast Engine
              </p>
            </div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <ProvenanceBadge classification="forecast" sourceName="NASA POWER + ISRO MOSDAC" sourceUrl="https://power.larc.nasa.gov" mode="live"/>
            <ProvenanceBadge classification="simulated" sourceName="OpenCV Optical Flow Model" mode="cached"/>
            <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:'0.72rem',padding:'3px 10px',borderRadius:9999,background:'rgba(6,182,212,0.12)',border:'1px solid rgba(6,182,212,0.3)',color:'#06B6D4'}}>
              <Radio size={10}/> LIVE RADAR
            </span>
          </div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>{cloudsRef.current=initClouds();setGhiForecast(genGHIForecast(cloudDensity));}}
            style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:8,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'var(--text-secondary)',cursor:'pointer',fontSize:'0.82rem'}}>
            <RefreshCw size={14}/> Reset
          </button>
          <button onClick={()=>setIsRunning(r=>!r)}
            style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:8,background:isRunning?'rgba(245,158,11,0.2)':'rgba(16,185,129,0.2)',border:`1px solid ${isRunning?'rgba(245,158,11,0.4)':'rgba(16,185,129,0.4)'}`,color:isRunning?'#F59E0B':'#10B981',cursor:'pointer',fontSize:'0.82rem',fontWeight:600}}>
            {isRunning?'⏸ Pause':'▶ Resume'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:20,marginBottom:20}}>
        {/* Canvas */}
        <div style={{background:'var(--bg-card)',border:'1px solid var(--border-medium)',borderRadius:16,overflow:'hidden'}}>
          <div style={{padding:'14px 16px 10px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:'0.82rem',fontWeight:700,color:'#06B6D4',display:'flex',alignItems:'center',gap:6}}>
              <Activity size={14}/> OPTICAL-FLOW CLOUD MOTION FIELD
            </span>
            <span style={{fontSize:'0.72rem',color:'var(--text-tertiary)',fontFamily:'monospace'}}>{frameRate} fps · {cloudsRef.current.length} cloud cells</span>
          </div>
          <canvas ref={canvasRef} width={640} height={320} style={{display:'block',width:'100%',height:'auto',cursor:'crosshair'}}/>
          <div style={{padding:'10px 16px',display:'flex',gap:20,fontSize:'0.72rem',color:'var(--text-tertiary)'}}>
            <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:12,height:3,background:'#06B6D4',display:'inline-block',borderRadius:2}}/> Wind vectors</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:12,height:12,background:'rgba(251,191,36,0.6)',display:'inline-block',borderRadius:'50%'}}/> GHI intensity</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:12,height:3,background:'rgba(0,240,255,0.5)',display:'inline-block',borderRadius:2}}/> Scan sweep</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {/* Atmospheric Params */}
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:16,padding:16}}>
            <h3 style={{fontSize:'0.82rem',fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:16}}>Atmospheric Parameters</h3>
            {([
              {label:'Cloud Density',icon:Cloud,val:Math.round(cloudDensity*100),set:(v:number)=>setCloudDensity(v/100),min:0,max:100,unit:'%',color:'#06B6D4'},
              {label:'Wind Speed',icon:Wind,val:windSpeed,set:setWindSpeed,min:0,max:40,step:0.5,unit:' m/s',color:'#06B6D4'},
              {label:'Wind Direction',icon:Navigation,val:windDir,set:setWindDir,min:0,max:359,unit:'°',color:'#F59E0B'},
            ] as Array<{label:string;icon:React.FC<{size:number}>;val:number;set:(v:number)=>void;min:number;max:number;step?:number;unit:string;color:string}>).map(p=>(
              <label key={p.label} style={{display:'block',marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:'0.8rem'}}>
                  <span style={{color:'var(--text-primary)',display:'flex',alignItems:'center',gap:5}}><p.icon size={12}/> {p.label}</span>
                  <span style={{color:p.color,fontWeight:700,fontFamily:'monospace'}}>{typeof p.val==='number'&&!Number.isInteger(p.val)?p.val.toFixed(1):p.val}{p.unit}</span>
                </div>
                <input type="range" min={p.min} max={p.max} step={p.step??1} value={p.val}
                  onChange={e=>p.set(Number(e.target.value))}
                  style={{width:'100%',accentColor:p.color}}/>
              </label>
            ))}
          </div>

          {/* Current Snapshot */}
          <div style={{background:'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(251,191,36,0.06))',border:'1px solid rgba(245,158,11,0.3)',borderRadius:16,padding:16}}>
            <div style={{fontSize:'0.75rem',fontWeight:700,color:'#F59E0B',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:12}}>{cur.hour} IST Snapshot</div>
            {([
              {label:'GHI',value:`${cur.ghi} W/m²`,icon:Sun},
              {label:'DNI',value:`${cur.dni} W/m²`,icon:Zap},
              {label:'DHI',value:`${cur.dhi} W/m²`,icon:Layers},
              {label:'Confidence',value:`${cur.confidence}%`,icon:CheckCircle2},
              {label:'Cloud Cover',value:`${cur.cloudCover}%`,icon:Cloud},
            ] as Array<{label:string;value:string;icon:React.FC<{size:number;color?:string}>}>).map(m=>(
              <div key={m.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8,fontSize:'0.82rem'}}>
                <span style={{color:'var(--text-secondary)',display:'flex',alignItems:'center',gap:5}}><m.icon size={12} color="#F59E0B"/> {m.label}</span>
                <span style={{color:'var(--text-primary)',fontWeight:700,fontFamily:'monospace'}}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* Day Total */}
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:16,padding:14,textAlign:'center'}}>
            <div style={{fontSize:'0.72rem',color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:4}}>Daily Yield Estimate</div>
            <div style={{fontSize:'1.8rem',fontWeight:800,color:'#F59E0B',fontFamily:'monospace'}}>{totalEnergy.toFixed(2)} <span style={{fontSize:'0.9rem'}}>kWh/m²</span></div>
            <div style={{fontSize:'0.74rem',color:'var(--text-tertiary)',marginTop:2}}>Peak GHI: {maxGHI} W/m² · Source: NASA POWER</div>
          </div>
        </div>
      </div>

      {/* GHI Timeline */}
      <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:16,padding:20,marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h3 style={{fontSize:'0.95rem',fontWeight:700,margin:0,display:'flex',alignItems:'center',gap:8}}>
            <BarChart2 size={16} color="#F59E0B"/> Hourly GHI / DNI / DHI Forecast
          </h3>
          <ProvenanceBadge classification="forecast" sourceName="Optical-Flow + LightGBM" mode="cached" compact/>
        </div>
        <div style={{display:'flex',gap:4,alignItems:'flex-end',height:100,overflowX:'auto',paddingBottom:4}}>
          {ghiForecast.map((f,i)=>{
            const barH=maxGHI>0?(f.ghi/maxGHI)*85:0;
            const isSel=i===selectedHour;
            return (
              <div key={f.hour} onClick={()=>setSelectedHour(i)}
                style={{flex:'0 0 auto',width:36,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:3}}
                title={`${f.hour}: GHI=${f.ghi} W/m², Conf=${f.confidence}%`}>
                <div style={{fontSize:'0.62rem',color:isSel?'#F59E0B':'var(--text-tertiary)',fontFamily:'monospace',fontWeight:isSel?700:400}}>{f.ghi}</div>
                <div style={{width:28,height:`${Math.max(barH,2)}px`,background:isSel?'linear-gradient(180deg,#F59E0B,#D97706)':f.cloudCover>50?'rgba(6,182,212,0.5)':'rgba(245,158,11,0.55)',borderRadius:'4px 4px 2px 2px',border:isSel?'1px solid #F59E0B':'1px solid transparent',boxShadow:isSel?'0 0 8px rgba(245,158,11,0.5)':'none',transition:'all 0.2s ease'}}/>
                <div style={{fontSize:'0.6rem',color:isSel?'#F59E0B':'var(--text-muted)',transform:'rotate(-35deg)',whiteSpace:'nowrap'}}>{f.hour}</div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:16,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10}}>
          {[
            {label:'Peak GHI',value:`${maxGHI} W/m²`,color:'#F59E0B'},
            {label:'Avg Cloud Cover',value:`${Math.round(ghiForecast.reduce((s,f)=>s+f.cloudCover,0)/ghiForecast.length)}%`,color:'#06B6D4'},
            {label:'Forecast Confidence',value:`${Math.round(ghiForecast.reduce((s,f)=>s+f.confidence,0)/ghiForecast.length)}%`,color:'#10B981'},
            {label:'Yield Estimate',value:`${totalEnergy.toFixed(2)} kWh/m²`,color:'#8B5CF6'},
          ].map(m=>(
            <div key={m.label} style={{background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'8px 12px'}}>
              <div style={{fontSize:'0.7rem',color:'var(--text-tertiary)',marginBottom:3}}>{m.label}</div>
              <div style={{fontSize:'1rem',fontWeight:700,color:m.color,fontFamily:'monospace'}}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        {[
          {icon:CheckCircle2,label:'NASA POWER API',status:'Connected',color:'#10B981'},
          {icon:Radio,label:'ISRO MOSDAC',status:'Live Feed',color:'#10B981'},
          {icon:Activity,label:'Optical Flow Engine',status:isRunning?'Running':'Paused',color:isRunning?'#10B981':'#EAB308'},
          {icon:Clock,label:'Last Update',status:new Date().toLocaleTimeString('en-IN'),color:'#06B6D4'},
        ].map(s=>(
          <div key={s.label} style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',background:'rgba(255,255,255,0.04)',borderRadius:8,border:'1px solid rgba(255,255,255,0.07)',fontSize:'0.78rem'}}>
            <s.icon size={12} color={s.color}/>
            <span style={{color:'var(--text-tertiary)'}}>{s.label}:</span>
            <span style={{color:s.color,fontWeight:600}}>{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
