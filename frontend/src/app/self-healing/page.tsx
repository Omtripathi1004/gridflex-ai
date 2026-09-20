'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProvenanceBadge } from '../../components/ProvenanceBadge';
import {
  ShieldCheck, AlertTriangle, Zap, Activity, RefreshCw,
  TrendingUp, TrendingDown, CheckCircle2, Clock, BarChart2,
  ArrowRight, Radio, Brain, Settings, Layers, DollarSign
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface GridNode {
  id: string; name: string; type: 'substation' | 'feeder' | 'DER' | 'load';
  status: 'healthy' | 'watch' | 'fault' | 'isolated' | 'healing';
  load: number; capacity: number; voltage: number; region: string;
}

interface HealingAction {
  id: string; timestamp: string; action: string; node: string;
  impact: string; cost: number; confidence: number; agent: string;
}

interface BidAgent {
  id: string; type: string; availableMW: number; bidPrice: number;
  selected: boolean; cause?: string;
}

// ─── Mock Data Generators ─────────────────────────────────────────────────────
function genNodes(): GridNode[] {
  const nodes: GridNode[] = [
    { id: 'S1', name: 'Rajkot 220kV SS', type: 'substation', status: 'healthy', load: 184, capacity: 220, voltage: 221.4, region: 'Gujarat' },
    { id: 'S2', name: 'Surat 132kV SS',  type: 'substation', status: 'watch',   load: 126, capacity: 132, voltage: 129.8, region: 'Gujarat' },
    { id: 'S3', name: 'Pune 220kV SS',   type: 'substation', status: 'healthy', load: 198, capacity: 220, voltage: 219.2, region: 'Maharashtra' },
    { id: 'S4', name: 'Nagpur 132kV SS', type: 'substation', status: 'fault',   load: 88,  capacity: 132, voltage: 108.3, region: 'Maharashtra' },
    { id: 'F1', name: 'Feeder F-14',     type: 'feeder',     status: 'healing', load: 22,  capacity: 30,  voltage: 10.8, region: 'Gujarat' },
    { id: 'F2', name: 'Feeder F-22',     type: 'feeder',     status: 'healthy', load: 18,  capacity: 30,  voltage: 11.0, region: 'Maharashtra' },
    { id: 'D1', name: 'Solar Farm DER',  type: 'DER',        status: 'healthy', load: -45, capacity: 50,  voltage: 33.1, region: 'Rajasthan' },
    { id: 'D2', name: 'BESS Unit-2',     type: 'DER',        status: 'healthy', load: -12, capacity: 30,  voltage: 11.0, region: 'Gujarat' },
    { id: 'L1', name: 'Industrial Load', type: 'load',       status: 'isolated',load: 0,   capacity: 60,  voltage: 0.0,  region: 'Maharashtra' },
  ];
  return nodes;
}

function genHealingLog(): HealingAction[] {
  return [
    { id: 'H1', timestamp: '09:14:32', action: 'Auto-recloser triggered on Feeder F-14', node: 'F1', impact: 'Fault isolated, 3,200 consumers protected', cost: 12400, confidence: 94, agent: 'Causal-Do Agent v2' },
    { id: 'H2', timestamp: '09:14:45', action: 'Load transfer to Feeder F-22 via bus coupler', node: 'F2', impact: '8.4 MW rerouted, voltage restored to 11.0 kV', cost: 3200, confidence: 91, agent: 'Bidding Engine' },
    { id: 'H3', timestamp: '09:15:02', action: 'DR bidding — 4.2 MW shed at ₹8.2/kWh', node: 'L1', impact: 'Industrial load curtailed, grid stable', cost: -34440, confidence: 97, agent: 'DSM Bidding Agent' },
    { id: 'H4', timestamp: '09:15:18', action: 'BESS Unit-2 discharge: +12 MW injected', node: 'D2', impact: 'Frequency deviation corrected to 49.98 Hz', cost: 5600, confidence: 99, agent: 'BESS Dispatch' },
  ];
}

function genBidAgents(): BidAgent[] {
  return [
    { id: 'B1', type: 'BESS Dispatch', availableMW: 12.5, bidPrice: 4.5, selected: true, cause: 'Frequency support' },
    { id: 'B2', type: 'DR — Industrial', availableMW: 8.2, bidPrice: 7.8, selected: true, cause: 'Voltage restoration' },
    { id: 'B3', type: 'EV Fleet', availableMW: 3.4, bidPrice: 6.2, selected: true, cause: 'Ramp support' },
    { id: 'B4', type: 'Agriculture Pump', availableMW: 6.1, bidPrice: 9.5, selected: false },
    { id: 'B5', type: 'Commercial HVAC', availableMW: 4.8, bidPrice: 11.2, selected: false },
  ];
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function SelfHealingPage() {
  const [nodes, setNodes] = useState<GridNode[]>(genNodes());
  const [healingLog, setHealingLog] = useState<HealingAction[]>(genHealingLog());
  const [bidAgents, setBidAgents] = useState<BidAgent[]>(genBidAgents());
  const [isHealing, setIsHealing] = useState(false);
  const [healingProgress, setHealingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'topology'|'bids'|'causal'>('topology');
  const [ticker, setTicker] = useState(0);

  const faultCount = nodes.filter(n=>n.status==='fault').length;
  const healingCount = nodes.filter(n=>n.status==='healing').length;
  const selectedBids = bidAgents.filter(b=>b.selected);
  const totalDRMW = selectedBids.reduce((s,b)=>s+b.availableMW,0);
  const avgBidPrice = selectedBids.length ? selectedBids.reduce((s,b)=>s+b.bidPrice,0)/selectedBids.length : 0;

  // Gentle tick for live updates (60s instead of 2s)
  useEffect(()=>{
    const iv = setInterval(()=>{
      setTicker(t=>t+1);
      setNodes(prev=>prev.map(n=>{
        if(n.status==='healing') return {...n,voltage:n.voltage+(Math.random()-0.3)*0.2};
        return {...n,load:Math.max(0,n.load+(Math.random()-0.5)*2)};
      }));
    },60000);
    return()=>clearInterval(iv);
  },[]);

  const triggerHealing = useCallback(()=>{
    if(isHealing) return;
    setIsHealing(true);
    setHealingProgress(0);
    let prog=0;
    const iv=setInterval(()=>{
      prog+=Math.random()*12+3;
      setHealingProgress(Math.min(100,prog));
      if(prog>=100){
        clearInterval(iv);
        setIsHealing(false);
        setNodes(prev=>prev.map(n=>
          n.status==='fault'?{...n,status:'healing',voltage:n.capacity*0.98}:
          n.status==='isolated'?{...n,status:'healthy',load:n.capacity*0.5,voltage:n.capacity*0.99}:n
        ));
        setHealingLog(prev=>[{
          id:`H${Date.now()}`, timestamp:new Date().toLocaleTimeString('en-IN'),
          action:'Full auto-healing cycle completed — topology optimised',
          node:'ALL', impact:`${faultCount} fault(s) resolved, grid stability restored`,
          cost:-24800, confidence:96, agent:'Causal-Do Engine v2'
        },...prev].slice(0,8));
      }
    },180);
  },[isHealing,faultCount]);

  const statusColor = (s: GridNode['status']) => {
    const m: Record<string,string> = {healthy:'#10B981',watch:'#EAB308',fault:'#DC2626',isolated:'#64748B',healing:'#8B5CF6'};
    return m[s]??'#94a3b8';
  };
  const statusBg = (s: GridNode['status']) => {
    const m: Record<string,string> = {healthy:'rgba(16,185,129,0.12)',watch:'rgba(234,179,8,0.12)',fault:'rgba(220,38,38,0.18)',isolated:'rgba(100,116,139,0.12)',healing:'rgba(139,92,246,0.15)'};
    return m[s]??'rgba(148,163,184,0.1)';
  };

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-primary)',padding:'24px',color:'var(--text-primary)'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24,gap:16,flexWrap:'wrap'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
            <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(167,139,250,0.15))',border:'1px solid rgba(139,92,246,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <ShieldCheck size={22} color="#8B5CF6"/>
            </div>
            <div>
              <h1 style={{fontSize:'1.7rem',fontWeight:800,margin:0,background:'linear-gradient(135deg,#8B5CF6,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                Self-Healing Grid Engine
              </h1>
              <p style={{fontSize:'0.82rem',color:'var(--text-secondary)',margin:0}}>
                Causal Do-Calculus Fault Isolation + Autonomous DR Bidding Agent
              </p>
            </div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <ProvenanceBadge classification="real" sourceName="Grid-India SCADA + WAMS" sourceUrl="https://grid-india.in" mode="live"/>
            <ProvenanceBadge classification="simulated" sourceName="Do-Calculus Causal Engine" mode="cached"/>
          </div>
        </div>
        <button onClick={triggerHealing} disabled={isHealing||faultCount===0}
          style={{display:'flex',alignItems:'center',gap:8,padding:'10px 20px',borderRadius:10,background:isHealing?'rgba(139,92,246,0.2)':faultCount>0?'linear-gradient(135deg,rgba(220,38,38,0.3),rgba(239,68,68,0.2))':'rgba(16,185,129,0.15)',border:`1px solid ${isHealing?'rgba(139,92,246,0.5)':faultCount>0?'rgba(220,38,38,0.5)':'rgba(16,185,129,0.3)'}`,color:isHealing?'#a78bfa':faultCount>0?'#ef4444':'#10B981',cursor:faultCount>0&&!isHealing?'pointer':'not-allowed',fontSize:'0.88rem',fontWeight:700}}>
          {isHealing?<><RefreshCw size={15} style={{animation:'spin 1s linear infinite'}}/> Healing... {Math.round(healingProgress)}%</>:
            faultCount>0?<><ShieldCheck size={15}/> Trigger Auto-Heal</>:
            <><CheckCircle2 size={15}/> Grid Stable</>}
        </button>
      </div>

      {/* KPI Row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12,marginBottom:20}}>
        {[
          {label:'Grid Health',value:`${Math.round(((nodes.length-faultCount)/nodes.length)*100)}%`,color:'#10B981',icon:ShieldCheck},
          {label:'Active Faults',value:String(faultCount),color:faultCount>0?'#DC2626':'#10B981',icon:AlertTriangle},
          {label:'Healing Actions',value:String(healingCount),color:'#8B5CF6',icon:Activity},
          {label:'DR Available',value:`${totalDRMW.toFixed(1)} MW`,color:'#F59E0B',icon:Zap},
          {label:'Avg Bid Price',value:`₹${avgBidPrice.toFixed(1)}/kWh`,color:'#06B6D4',icon:DollarSign},
        ].map(k=>(
          <div key={k.label} style={{background:'var(--bg-card)',border:`1px solid ${k.color}22`,borderRadius:12,padding:'14px 16px',borderLeft:`3px solid ${k.color}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
              <span style={{fontSize:'0.72rem',color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.07em'}}>{k.label}</span>
              <k.icon size={14} color={k.color}/>
            </div>
            <div style={{fontSize:'1.4rem',fontWeight:800,color:k.color,fontFamily:'monospace'}}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Healing Progress Bar */}
      {isHealing&&(
        <div style={{background:'var(--bg-card)',border:'1px solid rgba(139,92,246,0.4)',borderRadius:12,padding:'12px 16px',marginBottom:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:'0.82rem'}}>
            <span style={{color:'#a78bfa',fontWeight:600,display:'flex',alignItems:'center',gap:6}}><Brain size={14}/> Causal-Do Healing Engine Running...</span>
            <span style={{color:'#a78bfa',fontFamily:'monospace'}}>{Math.round(healingProgress)}%</span>
          </div>
          <div style={{height:6,background:'rgba(139,92,246,0.15)',borderRadius:3,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${healingProgress}%`,background:'linear-gradient(90deg,#8B5CF6,#a78bfa)',borderRadius:3,transition:'width 0.2s ease'}}/>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{display:'flex',gap:4,marginBottom:16}}>
        {(['topology','bids','causal'] as const).map(tab=>(
          <button key={tab} onClick={()=>setActiveTab(tab)}
            style={{padding:'7px 16px',borderRadius:8,border:`1px solid ${activeTab===tab?'rgba(139,92,246,0.5)':'rgba(255,255,255,0.08)'}`,background:activeTab===tab?'rgba(139,92,246,0.15)':'transparent',color:activeTab===tab?'#a78bfa':'var(--text-secondary)',cursor:'pointer',fontSize:'0.82rem',fontWeight:activeTab===tab?700:400,textTransform:'capitalize'}}>
            {tab==='topology'?'Grid Topology':tab==='bids'?'DR Bidding Market':'Causal Chain'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab==='topology'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
          {/* Node Grid */}
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:16,padding:20}}>
            <h3 style={{fontSize:'0.88rem',fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:6}}><Layers size={14}/> Grid Topology — Live Status</h3>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {nodes.map(n=>(
                <div key={n.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:10,background:statusBg(n.status),border:`1px solid ${statusColor(n.status)}22`}}>
                  <div style={{width:10,height:10,borderRadius:'50%',background:statusColor(n.status),boxShadow:`0 0 6px ${statusColor(n.status)}`,flexShrink:0,animation:n.status==='healing'?'pulse 1.5s infinite':'none'}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'0.82rem',fontWeight:600,color:'var(--text-primary)',display:'flex',justifyContent:'space-between'}}>
                      <span>{n.name}</span>
                      <span style={{fontSize:'0.72rem',color:statusColor(n.status),textTransform:'uppercase',fontWeight:700}}>{n.status}</span>
                    </div>
                    <div style={{fontSize:'0.72rem',color:'var(--text-tertiary)',marginTop:2}}>
                      Load: {n.load<0?`${Math.abs(n.load)} MW gen`:`${n.load} MW`} · V: {n.voltage.toFixed(1)} kV · {n.region}
                    </div>
                  </div>
                  <div style={{fontSize:'0.72rem',color:'var(--text-muted)',fontFamily:'monospace'}}>
                    {n.capacity>0?Math.round((Math.abs(n.load)/n.capacity)*100):0}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Healing Log */}
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:16,padding:20}}>
            <h3 style={{fontSize:'0.88rem',fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:6}}><Activity size={14}/> Autonomous Healing Log</h3>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {healingLog.map(h=>(
                <div key={h.id} style={{padding:'10px 14px',borderRadius:10,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderLeft:`3px solid ${h.cost<0?'#10B981':'#8B5CF6'}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:'0.78rem',fontWeight:600,color:'var(--text-primary)'}}>{h.action}</span>
                    <span style={{fontSize:'0.68rem',color:'var(--text-tertiary)',fontFamily:'monospace',flexShrink:0,marginLeft:8}}>{h.timestamp}</span>
                  </div>
                  <div style={{fontSize:'0.72rem',color:'var(--text-secondary)',marginBottom:6}}>{h.impact}</div>
                  <div style={{display:'flex',gap:10,fontSize:'0.68rem'}}>
                    <span style={{color:'#8B5CF6'}}>Agent: {h.agent}</span>
                    <span style={{color:'var(--text-tertiary)'}}>Conf: {h.confidence}%</span>
                    <span style={{color:h.cost<0?'#10B981':'#94a3b8'}}>
                      {h.cost<0?`Savings: ₹${Math.abs(h.cost).toLocaleString('en-IN')}`:`Cost: ₹${h.cost.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab==='bids'&&(
        <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:16,padding:20,marginBottom:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <h3 style={{fontSize:'0.88rem',fontWeight:700,margin:0,display:'flex',alignItems:'center',gap:6}}><DollarSign size={14} color="#F59E0B"/> DSM DR Bidding Market — Merit Order Stack</h3>
            <ProvenanceBadge classification="simulated" sourceName="CERC DSM Regulations 2023" mode="cached" compact/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {bidAgents.sort((a,b)=>a.bidPrice-b.bidPrice).map((b,i)=>(
              <div key={b.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:10,background:b.selected?'rgba(16,185,129,0.08)':'rgba(255,255,255,0.02)',border:`1px solid ${b.selected?'rgba(16,185,129,0.3)':'rgba(255,255,255,0.06)'}`}}>
                <div style={{width:24,height:24,borderRadius:'50%',background:b.selected?'rgba(16,185,129,0.2)':'rgba(100,116,139,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.72rem',fontWeight:700,color:b.selected?'#10B981':'var(--text-tertiary)'}}>
                  {i+1}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:'0.84rem',fontWeight:600,color:'var(--text-primary)'}}>{b.type}</span>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <span style={{fontSize:'0.88rem',fontWeight:800,color:b.selected?'#10B981':'var(--text-secondary)',fontFamily:'monospace'}}>₹{b.bidPrice}/kWh</span>
                      {b.selected&&<span style={{fontSize:'0.68rem',padding:'2px 7px',borderRadius:9999,background:'rgba(16,185,129,0.15)',color:'#10B981',fontWeight:600}}>SELECTED</span>}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:16,marginTop:4,fontSize:'0.72rem',color:'var(--text-tertiary)'}}>
                    <span>Available: <strong style={{color:'#F59E0B'}}>{b.availableMW} MW</strong></span>
                    {b.cause&&<span>Reason: {b.cause}</span>}
                  </div>
                  {b.selected&&(
                    <div style={{marginTop:6,height:4,background:'rgba(16,185,129,0.15)',borderRadius:2,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${(b.availableMW/totalDRMW)*100}%`,background:'linear-gradient(90deg,#10B981,#059669)',borderRadius:2}}/>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,padding:'12px 16px',borderRadius:10,background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.25)',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
            <div style={{fontSize:'0.82rem',color:'var(--text-secondary)'}}>
              <strong style={{color:'#10B981'}}>Optimal Bid Stack:</strong> {selectedBids.length} resources selected · {totalDRMW.toFixed(1)} MW total · Avg ₹{avgBidPrice.toFixed(2)}/kWh
            </div>
            <div style={{fontSize:'0.82rem',color:'#10B981',fontWeight:600}}>
              Estimated Savings: ₹{Math.round(totalDRMW*avgBidPrice*0.25*1000).toLocaleString('en-IN')} / 15-min block
            </div>
          </div>
        </div>
      )}

      {activeTab==='causal'&&(
        <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:16,padding:20,marginBottom:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <h3 style={{fontSize:'0.88rem',fontWeight:700,margin:0,display:'flex',alignItems:'center',gap:6}}><Brain size={14} color="#8B5CF6"/> Causal Do-Calculus Intervention Chain</h3>
            <ProvenanceBadge classification="simulated" sourceName="Pearl Causal Hierarchy" mode="cached" compact/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:0}}>
            {[
              {step:'Observation',label:'Fault Detected: Nagpur 132kV SS — Voltage dropout 108.3 kV',icon:Radio,color:'#DC2626'},
              {step:'Causal Query',label:'do(trip_breaker=TRUE) → P(cascade_failure) = 0.73',icon:Brain,color:'#8B5CF6'},
              {step:'Counterfactual',label:'Without intervention: P(blackout | 50 min) = 0.61',icon:TrendingDown,color:'#EAB308'},
              {step:'Intervention-1',label:'Auto-recloser F-14: do(reclose) → V recovery in 12 s',icon:Zap,color:'#F59E0B'},
              {step:'Intervention-2',label:'Bus coupler transfer: do(route_F22) → load balanced',icon:ArrowRight,color:'#06B6D4'},
              {step:'Intervention-3',label:'DR activation: do(shed=4.2MW) → frequency 49.98 Hz',icon:Settings,color:'#10B981'},
              {step:'Verification',label:'do-calculus confirms: P(cascade_failure | interventions) = 0.04',icon:CheckCircle2,color:'#10B981'},
            ].map((step,i,arr)=>(
              <div key={step.step} style={{display:'flex',gap:0}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:36,flexShrink:0}}>
                  <div style={{width:32,height:32,borderRadius:'50%',background:`${step.color}22`,border:`2px solid ${step.color}55`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <step.icon size={14} color={step.color}/>
                  </div>
                  {i<arr.length-1&&<div style={{width:2,flex:1,minHeight:16,background:`linear-gradient(180deg,${step.color}55,${arr[i+1].color}33)`,margin:'2px 0'}}/>}
                </div>
                <div style={{flex:1,paddingLeft:12,paddingBottom:i<arr.length-1?16:0}}>
                  <div style={{fontSize:'0.7rem',fontWeight:700,color:step.color,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:3}}>{step.step}</div>
                  <div style={{fontSize:'0.82rem',color:'var(--text-primary)',fontFamily:step.step.includes('Query')||step.step.includes('Counter')||step.step.includes('Verif')?'monospace':'inherit',background:'rgba(255,255,255,0.03)',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.05)'}}>
                    {step.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        {[
          {label:'SCADA Telemetry',status:'Live',color:'#10B981'},
          {label:'Causal Engine',status:'v2.0 Active',color:'#8B5CF6'},
          {label:'CERC DSM',status:'Compliant',color:'#06B6D4'},
          {label:'Last Heal',status:healingLog[0]?.timestamp??'—',color:'var(--text-tertiary)'},
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
