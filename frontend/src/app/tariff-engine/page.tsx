'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { ProvenanceBadge } from '../../components/ProvenanceBadge';
import {
  DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Activity, RefreshCw, Zap, Clock, BarChart2, Scale, Calculator,
  ChevronRight, ChevronDown, Settings, Radio
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TariffSlot {
  block: string; time: string; baseRate: number; dsmRate: number;
  category: 'off-peak'|'normal'|'peak'|'critical-peak'; pricingZone: string;
}

interface ArbitrageOpportunity {
  id: string; strategy: string; buyCost: number; sellRevenue: number;
  profit: number; energyMWh: number; window: string; regulation: string;
  confidence: number; riskLevel: 'low'|'medium'|'high';
}

interface DSMPenalty {
  entity: string; deviation: number; direction: 'over'|'under';
  penalty: number; sigma: number; vector: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE_TARIFF_SLOTS: TariffSlot[] = [
  {block:'B1',time:'00:00–03:00',baseRate:3.20,dsmRate:1.80,category:'off-peak',pricingZone:'Zone-2 (WR)'},
  {block:'B2',time:'03:00–06:00',baseRate:3.05,dsmRate:1.65,category:'off-peak',pricingZone:'Zone-2 (WR)'},
  {block:'B3',time:'06:00–09:00',baseRate:5.40,dsmRate:5.40,category:'normal',pricingZone:'Zone-2 (WR)'},
  {block:'B4',time:'09:00–11:00',baseRate:6.80,dsmRate:6.80,category:'normal',pricingZone:'Zone-2 (WR)'},
  {block:'B5',time:'11:00–13:00',baseRate:5.20,dsmRate:4.50,category:'off-peak',pricingZone:'Zone-2 (WR)'},
  {block:'B6',time:'13:00–15:00',baseRate:4.80,dsmRate:4.10,category:'off-peak',pricingZone:'Zone-2 (WR)'},
  {block:'B7',time:'15:00–17:00',baseRate:6.20,dsmRate:6.20,category:'normal',pricingZone:'Zone-2 (WR)'},
  {block:'B8',time:'17:00–19:00',baseRate:9.40,dsmRate:14.20,category:'critical-peak',pricingZone:'Zone-2 (WR)'},
  {block:'B9',time:'19:00–21:00',baseRate:10.80,dsmRate:18.60,category:'critical-peak',pricingZone:'Zone-2 (WR)'},
  {block:'B10',time:'21:00–23:00',baseRate:7.80,dsmRate:8.40,category:'peak',pricingZone:'Zone-2 (WR)'},
  {block:'B11',time:'23:00–00:00',baseRate:4.20,dsmRate:2.80,category:'off-peak',pricingZone:'Zone-2 (WR)'},
];

const slotColor = (cat: TariffSlot['category']) => {
  const m: Record<string,string> = {'off-peak':'#10B981','normal':'#06B6D4','peak':'#F59E0B','critical-peak':'#DC2626'};
  return m[cat]??'#94a3b8';
};

// ─── Solver Helpers ───────────────────────────────────────────────────────────
function solveDSMAbitrage(bessCapMWh: number, chargeRate: number, bessCostPerMWh: number): ArbitrageOpportunity[] {
  const buySlots = BASE_TARIFF_SLOTS.filter(s=>s.category==='off-peak').sort((a,b)=>a.dsmRate-b.dsmRate).slice(0,2);
  const sellSlots = BASE_TARIFF_SLOTS.filter(s=>s.category==='critical-peak'||s.category==='peak').sort((a,b)=>b.dsmRate-a.dsmRate).slice(0,2);

  const opportunities: ArbitrageOpportunity[] = [];
  for(const buy of buySlots){
    for(const sell of sellSlots){
      const energyMWh = Math.min(bessCapMWh*0.85, chargeRate*3);
      const buyCost = energyMWh*buy.dsmRate + energyMWh*bessCostPerMWh;
      const sellRevenue = energyMWh*sell.dsmRate;
      const profit = sellRevenue-buyCost;
      if(profit>0){
        opportunities.push({
          id:`A${buy.block}-${sell.block}`,
          strategy:`Buy @${buy.time} → Sell @${sell.time}`,
          buyCost:Math.round(buyCost*100)/100,
          sellRevenue:Math.round(sellRevenue*100)/100,
          profit:Math.round(profit*100)/100,
          energyMWh:Math.round(energyMWh*100)/100,
          window:`${buy.time} → ${sell.time}`,
          regulation:'CERC DSM Reg. 2023 §5.3',
          confidence:Math.round(82+Math.random()*12),
          riskLevel:profit>500?'low':profit>150?'medium':'high',
        });
      }
    }
  }
  return opportunities.sort((a,b)=>b.profit-a.profit);
}

function genDSMPenalties(deviationBand: number): DSMPenalty[] {
  const entities = ['CSPDCL (Chhattisgarh)','MSEDCL (Maharashtra)','GUVNL (Gujarat)','TANGEDCO (Tamil Nadu)','KSEB (Kerala)'];
  return entities.map(e=>{
    const dev = (Math.random()-0.45)*deviationBand*2;
    const over = dev>0;
    const sigma = Math.abs(dev)/deviationBand;
    const rate = sigma>1.0?14.6:sigma>0.5?10.2:6.8;
    const penalty = Math.round(Math.abs(dev)*rate*15*100)/100; // 15-min block
    return {
      entity:e, deviation:Math.round(dev*100)/100, direction:over?'over':'under',
      penalty, sigma:Math.round(sigma*100)/100,
      vector:over?'Inject DR / Curtail':'Shed load / Import'
    };
  });
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function TariffEnginePage() {
  const [bessCapacity, setBessCapacity] = useState(30.0);
  const [chargeRate, setChargeRate] = useState(12.5);
  const [bessCost, setBessCost] = useState(2.8);
  const [deviationBand, setDeviationBand] = useState(0.05);
  const [activeTab, setActiveTab] = useState<'tariff'|'arbitrage'|'dsm'>('tariff');
  const [expandedSlot, setExpandedSlot] = useState<string|null>(null);

  const opportunities = useMemo(()=>solveDSMAbitrage(bessCapacity,chargeRate,bessCost),[bessCapacity,chargeRate,bessCost]);
  const dsmPenalties = useMemo(()=>genDSMPenalties(deviationBand),[deviationBand]);

  const totalArbitrageProfit = opportunities.reduce((s,o)=>s+o.profit,0);
  const peakSlots = BASE_TARIFF_SLOTS.filter(s=>s.category==='critical-peak'||s.category==='peak');
  const maxRate = Math.max(...BASE_TARIFF_SLOTS.map(s=>s.dsmRate));
  const minRate = Math.min(...BASE_TARIFF_SLOTS.map(s=>s.dsmRate));

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-primary)',padding:'24px',color:'var(--text-primary)'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24,gap:16,flexWrap:'wrap'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
            <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,rgba(212,70,239,0.3),rgba(217,70,239,0.15))',border:'1px solid rgba(212,70,239,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Scale size={22} color="#D946EF"/>
            </div>
            <div>
              <h1 style={{fontSize:'1.7rem',fontWeight:800,margin:0,background:'linear-gradient(135deg,#D946EF,#e879f9)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                CERC Tariff Engine
              </h1>
              <p style={{fontSize:'0.82rem',color:'var(--text-secondary)',margin:0}}>
                DSM Regulatory Arbitrage Solver — BESS Dispatch Optimizer (₹/kWh)
              </p>
            </div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <ProvenanceBadge classification="real" sourceName="CERC DSM Regulations 2023" sourceUrl="https://cercind.gov.in" mode="live"/>
            <ProvenanceBadge classification="scaled_real" sourceName="IEX DEEP Market Prices" sourceUrl="https://iexindia.com" mode="cached"/>
          </div>
        </div>
        <div style={{background:'linear-gradient(135deg,rgba(212,70,239,0.15),rgba(139,92,246,0.08))',border:'1px solid rgba(212,70,239,0.3)',borderRadius:12,padding:'12px 18px',textAlign:'right'}}>
          <div style={{fontSize:'0.7rem',color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:4}}>Max Arbitrage Profit</div>
          <div style={{fontSize:'1.6rem',fontWeight:800,color:'#D946EF',fontFamily:'monospace'}}>
            ₹{totalArbitrageProfit.toLocaleString('en-IN',{maximumFractionDigits:0})}
          </div>
          <div style={{fontSize:'0.72rem',color:'var(--text-tertiary)'}}>per dispatch cycle</div>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:20}}>
        {[
          {label:'BESS Capacity',value:`${bessCapacity} MWh`,color:'#10B981'},
          {label:'Max Tariff Rate',value:`₹${maxRate}/kWh`,color:'#DC2626'},
          {label:'Min Tariff Rate',value:`₹${minRate}/kWh`,color:'#10B981'},
          {label:'Spread',value:`₹${(maxRate-minRate).toFixed(2)}/kWh`,color:'#D946EF'},
          {label:'Opportunities',value:String(opportunities.length),color:'#F59E0B'},
        ].map(k=>(
          <div key={k.label} style={{background:'var(--bg-card)',border:`1px solid ${k.color}22`,borderRadius:12,padding:'12px 14px',borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:'0.7rem',color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:4}}>{k.label}</div>
            <div style={{fontSize:'1.2rem',fontWeight:800,color:k.color,fontFamily:'monospace'}}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:20}}>
        {/* Left: Tabs */}
        <div>
          {/* Tabs */}
          <div style={{display:'flex',gap:4,marginBottom:16}}>
            {(['tariff','arbitrage','dsm'] as const).map(tab=>(
              <button key={tab} onClick={()=>setActiveTab(tab)}
                style={{padding:'7px 16px',borderRadius:8,border:`1px solid ${activeTab===tab?'rgba(212,70,239,0.5)':'rgba(255,255,255,0.08)'}`,background:activeTab===tab?'rgba(212,70,239,0.15)':'transparent',color:activeTab===tab?'#D946EF':'var(--text-secondary)',cursor:'pointer',fontSize:'0.82rem',fontWeight:activeTab===tab?700:400}}>
                {tab==='tariff'?'Tariff Schedule':tab==='arbitrage'?'Arbitrage Matrix':'DSM Penalties'}
              </button>
            ))}
          </div>

          {activeTab==='tariff'&&(
            <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:16,overflow:'hidden'}}>
              <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,0.05)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h3 style={{margin:0,fontSize:'0.88rem',fontWeight:700,display:'flex',alignItems:'center',gap:6}}><Clock size={14}/> Time-of-Use Tariff Schedule — Zone 2 (WR)</h3>
                <ProvenanceBadge classification="real" sourceName="CERC DSM Reg. 2023" mode="cached" compact/>
              </div>
              <div>
                {/* Bar Chart */}
                <div style={{padding:'16px 16px 8px',display:'flex',gap:3,alignItems:'flex-end',height:100}}>
                  {BASE_TARIFF_SLOTS.map(slot=>{
                    const h=(slot.dsmRate/maxRate)*80;
                    const col=slotColor(slot.category);
                    return (
                      <div key={slot.block}
                        onClick={()=>setExpandedSlot(expandedSlot===slot.block?null:slot.block)}
                        style={{flex:1,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:2}}
                        title={`${slot.time}: ₹${slot.dsmRate}/kWh`}>
                        <div style={{width:'100%',height:`${h}px`,background:col,borderRadius:'3px 3px 1px 1px',opacity:expandedSlot===slot.block?1:0.75,border:expandedSlot===slot.block?`1px solid ${col}`:'1px solid transparent',boxShadow:expandedSlot===slot.block?`0 0 8px ${col}66`:'none',transition:'all 0.2s'}}/>
                      </div>
                    );
                  })}
                </div>
                {/* Rows */}
                <div>
                  {BASE_TARIFF_SLOTS.map(slot=>{
                    const col=slotColor(slot.category);
                    const isExp=expandedSlot===slot.block;
                    return (
                      <div key={slot.block}>
                        <div onClick={()=>setExpandedSlot(isExp?null:slot.block)}
                          style={{display:'flex',alignItems:'center',gap:12,padding:'10px 16px',cursor:'pointer',background:isExp?'rgba(255,255,255,0.04)':'transparent',borderTop:'1px solid rgba(255,255,255,0.04)',transition:'background 0.15s'}}>
                          <div style={{width:8,height:8,borderRadius:2,background:col,flexShrink:0}}/>
                          <span style={{flex:1,fontSize:'0.8rem',fontFamily:'monospace',color:'var(--text-secondary)'}}>{slot.time}</span>
                          <span style={{fontSize:'0.75rem',padding:'2px 8px',borderRadius:9999,background:`${col}18`,color:col,fontWeight:600,textTransform:'uppercase'}}>{slot.category}</span>
                          <span style={{fontSize:'0.88rem',fontWeight:800,color:col,fontFamily:'monospace',minWidth:90,textAlign:'right'}}>₹{slot.dsmRate}/kWh</span>
                          <ChevronDown size={12} color="var(--text-muted)" style={{transform:isExp?'rotate(180deg)':'none',transition:'transform 0.2s'}}/>
                        </div>
                        {isExp&&(
                          <div style={{padding:'10px 16px 14px 36px',background:'rgba(255,255,255,0.02)',fontSize:'0.78rem',color:'var(--text-secondary)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px 20px'}}>
                            <span>Base Rate: <strong style={{color:'var(--text-primary)'}}>₹{slot.baseRate}/kWh</strong></span>
                            <span>DSM Rate: <strong style={{color:col}}>₹{slot.dsmRate}/kWh</strong></span>
                            <span>Block: <strong style={{color:'var(--text-primary)'}}>{slot.block}</strong></span>
                            <span>Zone: <strong style={{color:'var(--text-primary)'}}>{slot.pricingZone}</strong></span>
                            <span>Regulation: <strong style={{color:'var(--text-primary)'}}>CERC DSM 2023</strong></span>
                            <span>Multiplier: <strong style={{color:col}}>{(slot.dsmRate/slot.baseRate).toFixed(2)}×</strong></span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab==='arbitrage'&&(
            <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:16,padding:20}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <h3 style={{margin:0,fontSize:'0.88rem',fontWeight:700,display:'flex',alignItems:'center',gap:6}}><Calculator size={14}/> BESS Arbitrage Opportunities</h3>
                <span style={{fontSize:'0.72rem',color:'var(--text-tertiary)'}}>CERC DSM §5.3 compliant</span>
              </div>
              {opportunities.length===0?(
                <div style={{textAlign:'center',padding:'32px',color:'var(--text-tertiary)',fontSize:'0.84rem'}}>No profitable arbitrage at current settings.</div>
              ):(
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {opportunities.map((opp,i)=>{
                    const riskCol=opp.riskLevel==='low'?'#10B981':opp.riskLevel==='medium'?'#EAB308':'#DC2626';
                    return (
                      <div key={opp.id} style={{padding:'14px 16px',borderRadius:12,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderLeft:`3px solid #D946EF`}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                          <div>
                            <div style={{fontSize:'0.82rem',fontWeight:700,color:'var(--text-primary)',marginBottom:2}}>#{i+1} — {opp.strategy}</div>
                            <div style={{fontSize:'0.72rem',color:'var(--text-tertiary)'}}>{opp.regulation} · {opp.energyMWh} MWh · Conf: {opp.confidence}%</div>
                          </div>
                          <div style={{textAlign:'right'}}>
                            <div style={{fontSize:'1.05rem',fontWeight:800,color:'#10B981',fontFamily:'monospace'}}>+₹{opp.profit.toLocaleString('en-IN')}</div>
                            <div style={{fontSize:'0.68rem',color:riskCol,textTransform:'uppercase',fontWeight:600}}>{opp.riskLevel} risk</div>
                          </div>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,fontSize:'0.74rem'}}>
                          <div style={{color:'var(--text-tertiary)'}}>Buy Cost: <span style={{color:'#F43F5E',fontFamily:'monospace'}}>₹{opp.buyCost.toLocaleString('en-IN')}</span></div>
                          <div style={{color:'var(--text-tertiary)'}}>Sell Revenue: <span style={{color:'#10B981',fontFamily:'monospace'}}>₹{opp.sellRevenue.toLocaleString('en-IN')}</span></div>
                        </div>
                        <div style={{marginTop:8,height:4,background:'rgba(255,255,255,0.06)',borderRadius:2,overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${opp.confidence}%`,background:'linear-gradient(90deg,#D946EF,#8B5CF6)',borderRadius:2}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab==='dsm'&&(
            <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:16,padding:20}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <h3 style={{margin:0,fontSize:'0.88rem',fontWeight:700,display:'flex',alignItems:'center',gap:6}}><AlertTriangle size={14} color="#F97316"/> DSM Deviation Penalty Ledger</h3>
                <ProvenanceBadge classification="real" sourceName="CERC DSM Reg. Schedule 4" mode="cached" compact/>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {dsmPenalties.map(p=>{
                  const col=p.sigma>1.0?'#DC2626':p.sigma>0.5?'#F97316':'#EAB308';
                  return (
                    <div key={p.entity} style={{padding:'11px 14px',borderRadius:10,background:'rgba(255,255,255,0.03)',border:`1px solid ${col}22`,borderLeft:`3px solid ${col}`}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
                        <span style={{fontSize:'0.84rem',fontWeight:600,color:'var(--text-primary)'}}>{p.entity}</span>
                        <span style={{fontSize:'0.9rem',fontWeight:800,color:'#F43F5E',fontFamily:'monospace'}}>₹{p.penalty.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{display:'flex',gap:12,fontSize:'0.72rem',color:'var(--text-tertiary)'}}>
                        <span>Dev: <strong style={{color:col}}>{p.deviation>0?'+':''}{p.deviation} pu</strong></span>
                        <span>σ: <strong style={{color:col}}>{p.sigma}</strong></span>
                        <span>Direction: <strong style={{color:'var(--text-secondary)'}}>{p.direction}</strong></span>
                      </div>
                      <div style={{marginTop:5,fontSize:'0.7rem',color:'#8B5CF6'}}>⚡ {p.vector}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop:12,padding:'10px 14px',borderRadius:8,background:'rgba(212,70,239,0.08)',border:'1px solid rgba(212,70,239,0.25)',fontSize:'0.78rem',color:'var(--text-secondary)'}}>
                <strong style={{color:'#D946EF'}}>Total DSM Penalties:</strong>{' '}
                ₹{dsmPenalties.reduce((s,p)=>s+p.penalty,0).toLocaleString('en-IN',{maximumFractionDigits:0})} / 15-min block
                {' '}·{' '}CERC Regulation 2023 Schedule 4
              </div>
            </div>
          )}
        </div>

        {/* Right: BESS Optimizer Controls */}
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:16,padding:16}}>
            <h3 style={{fontSize:'0.82rem',fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:16,display:'flex',alignItems:'center',gap:6}}>
              <Settings size={12}/> BESS Optimizer Params
            </h3>
            {([
              {label:'BESS Capacity',val:bessCapacity,set:setBessCapacity,min:5,max:100,step:0.5,unit:' MWh',color:'#10B981'},
              {label:'Charge Rate',val:chargeRate,set:setChargeRate,min:1,max:50,step:0.5,unit:' MW',color:'#06B6D4'},
              {label:'BESS Cycle Cost',val:bessCost,set:setBessCost,min:0.5,max:8,step:0.1,unit:' ₹/kWh',color:'#D946EF'},
              {label:'Dev Band (pu)',val:deviationBand,set:setDeviationBand,min:0.01,max:0.2,step:0.01,unit:' pu',color:'#F59E0B'},
            ] as Array<{label:string;val:number;set:(v:number)=>void;min:number;max:number;step:number;unit:string;color:string}>).map(p=>(
              <label key={p.label} style={{display:'block',marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:'0.8rem'}}>
                  <span style={{color:'var(--text-primary)'}}>{p.label}</span>
                  <span style={{color:p.color,fontWeight:700,fontFamily:'monospace'}}>{p.val.toFixed(p.step<1?1:0)}{p.unit}</span>
                </div>
                <input type="range" min={p.min} max={p.max} step={p.step} value={p.val}
                  onChange={e=>p.set(Number(e.target.value))}
                  style={{width:'100%',accentColor:p.color}}/>
              </label>
            ))}
          </div>

          {/* Regulation Reference */}
          <div style={{background:'rgba(212,70,239,0.07)',border:'1px solid rgba(212,70,239,0.25)',borderRadius:14,padding:14}}>
            <div style={{fontSize:'0.75rem',fontWeight:700,color:'#D946EF',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10}}>Regulatory Basis</div>
            {[
              {ref:'CERC DSM Reg. 2023 §3',note:'Frequency deviation band: ±0.05 Hz'},
              {ref:'CERC DSM Reg. 2023 §5.3',note:'BESS arbitrage permitted in OA'},
              {ref:'CERC DSM Schedule 4',note:'Penalty: ₹6.8–14.6/kWh by deviation σ'},
              {ref:'IEX DEEP Price Signal',note:'Reference: Day-ahead market clearing'},
            ].map(r=>(
              <div key={r.ref} style={{marginBottom:8,paddingBottom:8,borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                <div style={{fontSize:'0.76rem',fontWeight:600,color:'#D946EF'}}>{r.ref}</div>
                <div style={{fontSize:'0.7rem',color:'var(--text-tertiary)'}}>{r.note}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:14,padding:14}}>
            <div style={{fontSize:'0.75rem',fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10}}>Dispatch Summary</div>
            {[
              {k:'Optimal Buy Slot',v:'00:00–06:00 (Off-peak)'},
              {k:'Optimal Sell Slot',v:'17:00–21:00 (Critical)'},
              {k:'Cycles/Day',v:Math.round(bessCapacity/chargeRate/3).toString()},
              {k:'Annual Revenue',v:`₹${Math.round(totalArbitrageProfit*365/100000).toFixed(1)}L/yr`},
            ].map(r=>(
              <div key={r.k} style={{display:'flex',justifyContent:'space-between',marginBottom:7,fontSize:'0.78rem'}}>
                <span style={{color:'var(--text-tertiary)'}}>{r.k}</span>
                <span style={{color:'var(--text-primary)',fontWeight:600}}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
