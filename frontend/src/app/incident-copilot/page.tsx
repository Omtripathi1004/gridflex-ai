'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ProvenanceBadge } from '../../components/ProvenanceBadge';
import {
  Mic, MicOff, MessageSquare, Globe, Send, AlertTriangle,
  CheckCircle2, RefreshCw, Activity, Radio, Zap, Clock,
  ChevronRight, Volume2, Languages, BookOpen, Search
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RAGDocument {
  id: string; title: string; source: string; relevance: number;
  excerpt: string; language: string;
}

interface ChatMessage {
  id: string; role: 'user'|'assistant'|'system';
  content: string; language: string; timestamp: string;
  ragDocs?: RAGDocument[]; confidence?: number;
}

interface Language {
  code: string; name: string; nativeName: string; flag: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const LANGUAGES: Language[] = [
  {code:'en',name:'English',nativeName:'English',flag:'🇬🇧'},
  {code:'hi',name:'Hindi',nativeName:'हिन्दी',flag:'🇮🇳'},
  {code:'mr',name:'Marathi',nativeName:'मराठी',flag:'🇮🇳'},
  {code:'gu',name:'Gujarati',nativeName:'ગુજરાતી',flag:'🇮🇳'},
  {code:'ta',name:'Tamil',nativeName:'தமிழ்',flag:'🇮🇳'},
  {code:'te',name:'Telugu',nativeName:'తెలుగు',flag:'🇮🇳'},
  {code:'kn',name:'Kannada',nativeName:'ಕನ್ನಡ',flag:'🇮🇳'},
  {code:'ml',name:'Malayalam',nativeName:'മലയാളം',flag:'🇮🇳'},
  {code:'bn',name:'Bengali',nativeName:'বাংলা',flag:'🇮🇳'},
  {code:'pa',name:'Punjabi',nativeName:'ਪੰਜਾਬੀ',flag:'🇮🇳'},
  {code:'or',name:'Odia',nativeName:'ଓଡ଼ିଆ',flag:'🇮🇳'},
  {code:'as',name:'Assamese',nativeName:'অসমীয়া',flag:'🇮🇳'},
  {code:'ur',name:'Urdu',nativeName:'اردو',flag:'🇵🇰'},
  {code:'kok',name:'Konkani',nativeName:'कोंकणी',flag:'🇮🇳'},
  {code:'mni',name:'Manipuri',nativeName:'মৈতৈলোন্',flag:'🇮🇳'},
];

const RAG_KB: RAGDocument[] = [
  {id:'R1',title:'BESS Dispatch Protocol',source:'CEA BESS Guidelines 2023',relevance:0.94,excerpt:'BESS units must maintain SOC between 20-90% for grid support. Maximum ramp rate: 10 MW/min.',language:'en'},
  {id:'R2',title:'Duck Curve Management',source:'GridFlex AI Simulation Engine',relevance:0.91,excerpt:'Solar over-generation between 11:00-14:00 requires 45 MW BESS absorption. Ramp rate: 8 MW/min.',language:'en'},
  {id:'R3',title:'P2P Trading Rules',source:'CERC Open Access Regulations',relevance:0.87,excerpt:'P2P energy trades settle in 15-min blocks at ₹4.50/kWh average. Prosumer margin: ₹1.20/kWh.',language:'en'},
  {id:'R4',title:'DSM Frequency Response',source:'CERC DSM Regulations 2023',relevance:0.89,excerpt:'Frequency deviation >0.2 Hz triggers automatic DR. Penalty: ₹14.6/kWh for over-injection.',language:'en'},
  {id:'R5',title:'Solar Forecast Accuracy',source:'NASA POWER + ISRO MOSDAC',relevance:0.82,excerpt:'Day-ahead GHI forecast accuracy: MAE 48 W/m², RMSE 72 W/m². Optical flow improves by 18%.',language:'en'},
];

// ─── Mock RAG Responses ───────────────────────────────────────────────────────
const MOCK_RESPONSES: Record<string, {text:string,docs:string[],confidence:number}> = {
  en: {
    text: "Based on real-time telemetry, the grid is currently operating at **94.2% stability**. BESS SOC is at 78% (23.4 MWh), primed for evening peak dispatch. The duck curve gap at 18:30 IST is forecast at **42.8 MW** — BESS ramp-up initiated. P2P trading volume today: 1,247 kWh across 34 prosumers.\n\n**Recommended Action:** Activate BESS discharge at 17:45 IST to pre-empt peak demand. DR pool has 12.5 MW available at ₹8.2/kWh.",
    docs:['R1','R4'],confidence:96
  },
  hi: {
    text: "वर्तमान ग्रिड स्थिरता **94.2%** है। BESS SOC 78% (23.4 MWh) पर है, शाम की पीक के लिए तैयार। 18:30 IST पर डक कर्व गैप **42.8 MW** अनुमानित है।\n\n**अनुशंसित क्रिया:** 17:45 IST पर BESS डिस्चार्ज सक्रिय करें। DR पूल में ₹8.2/kWh पर 12.5 MW उपलब्ध है।",
    docs:['R1','R4'],confidence:94
  },
  mr: {
    text: "सध्याची ग्रिड स्थिरता **94.2%** आहे. BESS SOC 78% (23.4 MWh) आहे. 18:30 IST रोजी डक कर्व्ह गॅप **42.8 MW** अपेक्षित आहे.\n\n**शिफारस केलेली क्रिया:** 17:45 IST वाजता BESS डिस्चार्ज सुरू करा.",
    docs:['R1'],confidence:91
  },
  gu: {
    text: "વર્તમાન ગ્રિડ સ્થિરતા **94.2%** છે. BESS SOC 78% (23.4 MWh) છે. 18:30 IST ડક કર્વ ગેપ **42.8 MW** અનુમાનિત છે.\n\n**ભલામણ:** 17:45 IST એ BESS ડિસ્ચાર્જ સક્રિય કરો.",
    docs:['R1','R4'],confidence:92
  },
  ta: {
    text: "தற்போதைய கட்டம் நிலைத்தன்மை **94.2%** ஆகும். BESS SOC 78% (23.4 MWh). 18:30 IST யில் டக் கர்வ் இடைவெளி **42.8 MW** என்று கணிக்கப்படுகிறது.\n\n**பரிந்துரை:** 17:45 IST யில் BESS வெளியேற்றத்தை செயல்படுத்துங்கள்.",
    docs:['R1'],confidence:90
  },
};

function getResponse(lang: string, userMsg: string): {text:string,docs:RAGDocument[],confidence:number} {
  const resp = MOCK_RESPONSES[lang] ?? MOCK_RESPONSES.en;
  const docs = resp.docs.map(id=>RAG_KB.find(d=>d.id===id)!).filter(Boolean);
  return {text:resp.text, docs, confidence:resp.confidence};
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function IncidentCopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id:'sys-1', role:'system',
    content:'GridFlex AI Incident Co-pilot initialised. 15-language RAG engine active. Speak or type in your language.',
    language:'en', timestamp: new Date().toLocaleTimeString('en-IN'),
  }]);
  const [input, setInput] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[0]);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showKB, setShowKB] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(()=>{
    chatBottomRef.current?.scrollIntoView({behavior:'smooth'});
  },[messages]);

  const sendMessage = useCallback(async(text:string)=>{
    if(!text.trim()) return;
    const userMsg: ChatMessage = {
      id:`u-${Date.now()}`, role:'user', content:text,
      language:selectedLang.code, timestamp:new Date().toLocaleTimeString('en-IN')
    };
    setMessages(prev=>[...prev,userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate RAG latency
    await new Promise(r=>setTimeout(r,1200+Math.random()*800));
    const resp = getResponse(selectedLang.code, text);
    const assistantMsg: ChatMessage = {
      id:`a-${Date.now()}`, role:'assistant',
      content:resp.text, language:selectedLang.code,
      timestamp:new Date().toLocaleTimeString('en-IN'),
      ragDocs:resp.docs, confidence:resp.confidence
    };
    setMessages(prev=>[...prev,assistantMsg]);
    setIsTyping(false);
  },[selectedLang]);

  const toggleVoice = useCallback(()=>{
    if(typeof window==='undefined') return;
    if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){
      alert('Speech recognition not supported in this browser. Use Chrome for voice input.');
      return;
    }
    if(isListening){
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang.code===('hi')?'hi-IN':selectedLang.code===('mr')?'mr-IN':selectedLang.code===('gu')?'gu-IN':'en-IN';
    recognition.interimResults = false;
    recognition.onresult = (e:any)=>{
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onend = ()=>setIsListening(false);
    recognition.onerror = ()=>setIsListening(false);
    recognition.start();
    recognitionRef.current=recognition;
    setIsListening(true);
  },[isListening,selectedLang]);

  // Render markdown-like bold
  const renderContent = (text:string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((p,i)=>i%2===1?<strong key={i} style={{color:'var(--cyan-primary)'}}>{p}</strong>:<span key={i}>{p}</span>);
  };

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-primary)',padding:'24px',color:'var(--text-primary)',display:'flex',flexDirection:'column',gap:20}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
            <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,rgba(16,185,129,0.3),rgba(52,211,153,0.15))',border:'1px solid rgba(16,185,129,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <MessageSquare size={22} color="#10B981"/>
            </div>
            <div>
              <h1 style={{fontSize:'1.7rem',fontWeight:800,margin:0,background:'linear-gradient(135deg,#10B981,#34d399)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                Incident Co-pilot
              </h1>
              <p style={{fontSize:'0.82rem',color:'var(--text-secondary)',margin:0}}>
                Multilingual RAG + Voice Copilot — 15 Indian Languages Supported
              </p>
            </div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <ProvenanceBadge classification="real" sourceName="Grid-India SOP Corpus" mode="live"/>
            <ProvenanceBadge classification="forecast" sourceName="GridFlex RAG Engine v2" mode="cached"/>
            <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:'0.72rem',padding:'3px 10px',borderRadius:9999,background:'rgba(16,185,129,0.12)',border:'1px solid rgba(16,185,129,0.3)',color:'#10B981'}}>
              <Languages size={10}/> 15 LANGUAGES
            </span>
          </div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'flex-start',flexWrap:'wrap'}}>
          {/* Language Picker */}
          <div style={{position:'relative'}}>
            <button onClick={()=>setShowLangPicker(p=>!p)}
              style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:8,background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',color:'#10B981',cursor:'pointer',fontSize:'0.82rem',fontWeight:600}}>
              <span style={{fontSize:'1rem'}}>{selectedLang.flag}</span> {selectedLang.nativeName} <ChevronRight size={12} style={{transform:showLangPicker?'rotate(90deg)':'none',transition:'transform 0.2s'}}/>
            </button>
            {showLangPicker&&(
              <div style={{position:'absolute',top:'calc(100% + 6px)',right:0,zIndex:100,width:240,background:'var(--surface,#111832)',border:'1px solid var(--border,#1F2A4A)',borderRadius:10,boxShadow:'0 10px 25px rgba(0,0,0,0.5)',overflow:'hidden'}}>
                <div style={{maxHeight:280,overflowY:'auto'}}>
                  {LANGUAGES.map(lang=>(
                    <button key={lang.code}
                      onClick={()=>{setSelectedLang(lang);setShowLangPicker(false);}}
                      style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 14px',background:selectedLang.code===lang.code?'rgba(16,185,129,0.12)':'transparent',border:'none',color:'var(--text-primary)',cursor:'pointer',fontSize:'0.82rem',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                      <span style={{fontSize:'1rem'}}>{lang.flag}</span>
                      <span style={{fontWeight:selectedLang.code===lang.code?700:400}}>{lang.nativeName}</span>
                      <span style={{fontSize:'0.7rem',color:'var(--text-tertiary)',marginLeft:'auto'}}>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={()=>setShowKB(p=>!p)}
            style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:8,background:showKB?'rgba(139,92,246,0.15)':'rgba(255,255,255,0.06)',border:`1px solid ${showKB?'rgba(139,92,246,0.4)':'rgba(255,255,255,0.1)'}`,color:showKB?'#a78bfa':'var(--text-secondary)',cursor:'pointer',fontSize:'0.82rem'}}>
            <BookOpen size={14}/> Knowledge Base
          </button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:showKB?'1fr 320px':'1fr',gap:20,flex:1}}>
        {/* Chat Area */}
        <div style={{display:'flex',flexDirection:'column',background:'var(--bg-card)',border:'1px solid var(--border-medium)',borderRadius:16,overflow:'hidden',minHeight:500}}>
          {/* Chat Header */}
          <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.05)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:'0.82rem',fontWeight:700,color:'#10B981',display:'flex',alignItems:'center',gap:6}}>
              <Activity size={14}/> GRID CO-PILOT — {selectedLang.nativeName.toUpperCase()}
            </span>
            <div style={{display:'flex',gap:6,fontSize:'0.7rem',color:'var(--text-tertiary)',alignItems:'center'}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:'#10B981',boxShadow:'0 0 6px #10B981',display:'inline-block'}}/>
              RAG Engine Active · {RAG_KB.length} docs indexed
            </div>
          </div>

          {/* Messages */}
          <div style={{flex:1,overflowY:'auto',padding:'16px',display:'flex',flexDirection:'column',gap:14}}>
            {messages.map(msg=>(
              <div key={msg.id} style={{display:'flex',flexDirection:'column',alignItems:msg.role==='user'?'flex-end':'flex-start',gap:6}}>
                <div style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.68rem',color:'var(--text-muted)'}}>
                  {msg.role==='assistant'&&<span style={{color:'#10B981',fontWeight:600}}>GridFlex Co-pilot</span>}
                  {msg.role==='user'&&<span style={{color:'#06B6D4',fontWeight:600}}>Operator</span>}
                  {msg.role==='system'&&<span style={{color:'#8B5CF6',fontWeight:600}}>System</span>}
                  <span>{msg.timestamp}</span>
                  {msg.confidence&&<span style={{color:'#10B981'}}>· Conf: {msg.confidence}%</span>}
                </div>
                <div style={{
                  maxWidth:'80%',padding:'10px 14px',borderRadius:msg.role==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px',
                  fontSize:'0.84rem',lineHeight:1.55,
                  background:msg.role==='user'?'rgba(6,182,212,0.15)':msg.role==='system'?'rgba(139,92,246,0.12)':'rgba(255,255,255,0.05)',
                  border:`1px solid ${msg.role==='user'?'rgba(6,182,212,0.3)':msg.role==='system'?'rgba(139,92,246,0.25)':'rgba(255,255,255,0.08)'}`,
                  color:'var(--text-primary)',whiteSpace:'pre-wrap'
                }}>
                  {renderContent(msg.content)}
                </div>
                {/* RAG Sources */}
                {msg.ragDocs&&msg.ragDocs.length>0&&(
                  <div style={{maxWidth:'80%',display:'flex',flexDirection:'column',gap:6}}>
                    <div style={{fontSize:'0.68rem',color:'var(--text-muted)',display:'flex',alignItems:'center',gap:4}}><Search size={10}/> Sources retrieved:</div>
                    {msg.ragDocs.map(doc=>(
                      <div key={doc.id} style={{padding:'7px 10px',borderRadius:8,background:'rgba(139,92,246,0.08)',border:'1px solid rgba(139,92,246,0.2)',fontSize:'0.72rem'}}>
                        <div style={{fontWeight:600,color:'#a78bfa',marginBottom:2}}>{doc.title}</div>
                        <div style={{color:'var(--text-tertiary)',marginBottom:2}}>{doc.source}</div>
                        <div style={{color:'var(--text-secondary)',fontStyle:'italic'}}>"{doc.excerpt}"</div>
                        <div style={{marginTop:4,color:'#10B981'}}>Relevance: {Math.round(doc.relevance*100)}%</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping&&(
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{display:'flex',gap:3,padding:'10px 14px',background:'rgba(255,255,255,0.04)',borderRadius:'14px 14px 14px 4px',border:'1px solid rgba(255,255,255,0.07)'}}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{width:6,height:6,borderRadius:'50%',background:'#10B981',animation:`bounce 1.2s ${i*0.2}s infinite`}}/>
                  ))}
                </div>
                <span style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>Co-pilot searching knowledge base...</span>
              </div>
            )}
            <div ref={chatBottomRef}/>
          </div>

          {/* Input Bar */}
          <div style={{padding:'12px 16px',borderTop:'1px solid rgba(255,255,255,0.05)',display:'flex',gap:8,alignItems:'flex-end'}}>
            <button onClick={toggleVoice}
              title={isListening?'Stop recording':'Start voice input'}
              style={{width:40,height:40,borderRadius:10,background:isListening?'rgba(239,68,68,0.2)':'rgba(16,185,129,0.12)',border:`1px solid ${isListening?'rgba(239,68,68,0.5)':'rgba(16,185,129,0.3)'}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
              {isListening?<MicOff size={16} color="#ef4444" style={{animation:'pulse 1s infinite'}}/>:<Mic size={16} color="#10B981"/>}
            </button>
            <textarea value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage(input);}}}
              placeholder={`Ask in ${selectedLang.nativeName}… (Enter to send, Shift+Enter for newline)`}
              rows={2}
              style={{flex:1,resize:'none',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'10px 12px',color:'var(--text-primary)',fontSize:'0.84rem',outline:'none',fontFamily:'inherit'}}/>
            <button onClick={()=>sendMessage(input)} disabled={!input.trim()||isTyping}
              style={{width:40,height:40,borderRadius:10,background:'rgba(16,185,129,0.2)',border:'1px solid rgba(16,185,129,0.4)',display:'flex',alignItems:'center',justifyContent:'center',cursor:input.trim()&&!isTyping?'pointer':'not-allowed',opacity:input.trim()&&!isTyping?1:0.5,flexShrink:0}}>
              <Send size={15} color="#10B981"/>
            </button>
          </div>

          {/* Quick Prompts */}
          <div style={{padding:'0 16px 12px',display:'flex',gap:6,flexWrap:'wrap'}}>
            {['Grid status summary','BESS dispatch now','Active fault report','P2P trade overview'].map(q=>(
              <button key={q} onClick={()=>sendMessage(q)}
                style={{padding:'4px 10px',borderRadius:9999,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',color:'var(--text-tertiary)',cursor:'pointer',fontSize:'0.72rem'}}>
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Knowledge Base Panel */}
        {showKB&&(
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:16,overflow:'hidden',display:'flex',flexDirection:'column'}}>
            <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.05)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:'0.82rem',fontWeight:700,color:'#8B5CF6',display:'flex',alignItems:'center',gap:6}}><BookOpen size={13}/> RAG Knowledge Base</span>
              <span style={{fontSize:'0.7rem',color:'var(--text-tertiary)'}}>{RAG_KB.length} documents</span>
            </div>
            <div style={{flex:1,overflowY:'auto',padding:14,display:'flex',flexDirection:'column',gap:10}}>
              {RAG_KB.map(doc=>(
                <div key={doc.id} style={{padding:'11px 13px',borderRadius:10,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
                  <div style={{fontSize:'0.82rem',fontWeight:600,color:'#a78bfa',marginBottom:4}}>{doc.title}</div>
                  <div style={{fontSize:'0.7rem',color:'var(--text-tertiary)',marginBottom:6}}>{doc.source}</div>
                  <div style={{fontSize:'0.76rem',color:'var(--text-secondary)',fontStyle:'italic',marginBottom:6}}>"{doc.excerpt}"</div>
                  <div style={{height:3,background:'rgba(139,92,246,0.15)',borderRadius:2,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${doc.relevance*100}%`,background:'linear-gradient(90deg,#8B5CF6,#a78bfa)',borderRadius:2}}/>
                  </div>
                  <div style={{fontSize:'0.68rem',color:'#8B5CF6',marginTop:3}}>Relevance: {Math.round(doc.relevance*100)}%</div>
                </div>
              ))}
            </div>
            <div style={{padding:'10px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',fontSize:'0.72rem',color:'var(--text-tertiary)'}}>
              <ProvenanceBadge classification="real" sourceName="Grid-India + CEA + CERC" mode="cached" compact/>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        {[
          {label:'RAG Engine',status:'Online',color:'#10B981'},
          {label:'Voice Input',status:isListening?'Recording...':'Ready',color:isListening?'#DC2626':'var(--text-tertiary)'},
          {label:'Language',status:selectedLang.name,color:'#06B6D4'},
          {label:'Knowledge Docs',status:`${RAG_KB.length} indexed`,color:'#8B5CF6'},
          {label:'Languages',status:'15 supported',color:'#F59E0B'},
        ].map(s=>(
          <div key={s.label} style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',background:'rgba(255,255,255,0.04)',borderRadius:8,border:'1px solid rgba(255,255,255,0.07)',fontSize:'0.78rem'}}>
            <span style={{color:'var(--text-tertiary)'}}>{s.label}:</span>
            <span style={{color:s.color,fontWeight:600}}>{s.status}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-4px)}
        }
        @keyframes spin {
          from{transform:rotate(0deg)}
          to{transform:rotate(360deg)}
        }
        @keyframes pulse {
          0%,100%{opacity:1}
          50%{opacity:0.5}
        }
      `}</style>
    </div>
  );
}
