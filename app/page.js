'use client'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { User, HelpCircle, Keyboard, Cog, Settings, History, FilePlus2, ChevronRight, ChevronDown } from 'lucide-react'
import DialMachine from '@/components/DialMachine'
import TerminalSidebar from '@/components/TerminalSidebar'
import AuthControls from '@/components/AuthControls'
import HelpOverlay from '@/components/HelpOverlay'
import { PERSPECTIVES, ENGINES, getPerspective, getEngine } from '@/lib/perspectives'

const CLERK_ENABLED = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

const EXAMPLES = [
  'How does AI impact designer roles?',
  'Banning smartphones in all schools',
  'A premium AI tutor for medical students',
]

export default function App() {
  const [sessionId, setSessionId] = useState(null)
  const [topic, setTopic] = useState('How does AI impact designer roles?')
  const [activeIndex, setActiveIndex] = useState(2)
  const [result, setResult] = useState(null)
  const [header, setHeader] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [expandedTopic, setExpandedTopic] = useState(null)
  const [showHelp, setShowHelp] = useState(false)

  const [dialSize, setDialSize] = useState(560)
  const centerRef = useRef(null)
  const active = PERSPECTIVES[activeIndex]

  // FORCE RESET LOGIC: Refresh hote hi sab kuch saaf
  useEffect(() => {
    // 1. Browser ke saare storage ko force-clear karo
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }

    // 2. Naya session generate karo
    const freshSid = uuidv4();
    setSessionId(freshSid);
    setHistory([]);
  }, [])

  useEffect(() => {
    const el = centerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width
      setDialSize(Math.max(320, Math.min(600, w - 8)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const loadHistory = useCallback(async (sid) => {
    if (!sid) return;
    try {
      const r = await fetch(`/api/explorations?sessionId=${sid}`)
      const d = await r.json()
      // Agar backend se purana data aa raha hai toh yahan filter lagao
      if (Array.isArray(d)) setHistory(d)
    } catch (e) { /* ignore */ }
  }, [])

  useEffect(() => { if (sessionId) loadHistory(sessionId) }, [sessionId, loadHistory])

  async function analyze(payload, hdr) {
    if (!topic.trim()) { setError('Type a topic first.'); return }
    setLoading(true); setError(null); setHeader(hdr); setResult(null);

    try {
      const r = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, topic, sessionId }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Analysis failed');
      
      setResult(d.result); 
      loadHistory(sessionId); 
    } catch (e) {
      setError(e.message || 'Network error — try again');
    } finally {
      setLoading(false); 
    }
  }

  const runPersona = () => analyze({ mode: 'persona', perspective: active.id }, { label: active.label })
  const runEngine = (e) => analyze({ mode: 'engine', engine: e.id }, { label: e.label })

  const newExploration = () => { setTopic(''); setResult(null); setError(null); setHeader(null) }

  const openHistory = (h) => {
    setResult(h.result); setTopic(h.topic); setHeader({ label: h.label })
    if (h.mode === 'persona') {
      const idx = PERSPECTIVES.findIndex(p => p.id === h.perspective)
      if (idx >= 0) setActiveIndex(idx)
    }
  }

  const cardW = Math.round(dialSize * 0.5)

  const grouped = useMemo(() => {
    const m = new Map()
    for (const h of history) {
      if (!m.has(h.topic)) m.set(h.topic, [])
      m.get(h.topic).push(h)
    }
    return Array.from(m.entries())
  }, [history])

  return (
    <div className="min-h-screen w-full" style={{ color: '#2B3A2A' }}>
      <header className="px-6 py-4 flex items-center justify-between border-b pm-line">
        <h1 className="font-mono-c font-bold tracking-[0.12em] text-lg">PERSPECTIVE MACHINE <span className="opacity-50">| V.1.0</span></h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-mono-c text-[10px] uppercase tracking-widest opacity-60">Live</span>
          </div>
          {CLERK_ENABLED ? <AuthControls /> : <span className="w-8 h-8 rounded-full border pm-line flex items-center justify-center"><User size={16} /></span>}
          <button onClick={() => setShowHelp(true)} className="w-8 h-8 rounded-full border pm-line flex items-center justify-center hover:bg-[#F1E84A] transition-colors"><HelpCircle size={16} /></button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[300px_1fr_310px] gap-5 p-5 max-w-[1500px] mx-auto">
        <aside className="order-2 lg:order-1">
          <div className="pm-panel p-5 flex flex-col min-h-[560px]">
            <Section title="HOW TO USE" body="Type an idea below, spin the dial to a mind, then press CONNECT to run that perspective." />
            <Section title="ABOUT SYSTEM" body="Eight expert lenses + four synthesis engines reason over your input in real time." />
            <Section title="SYSTEM EXPLANATION" body="A physical-feeling reasoning machine: every node is a distinct point of view on the same question." />

            <div className="mt-auto pt-5 space-y-2">
              <button onClick={newExploration} className="w-full pm-card py-2.5 font-mono-c text-[11px] tracking-wide flex items-center justify-center gap-2 hover:bg-[#F1E84A] transition-colors"><FilePlus2 size={14} /> NEW EXPLORATION</button>
              <button onClick={() => setShowHistory(v => !v)} className="w-full pm-card py-2.5 font-mono-c text-[11px] tracking-wide flex items-center justify-center gap-2 hover:bg-[#F1E84A] transition-colors"><History size={14} /> OLD EXPLORATIONS</button>

              {showHistory && (
                <div className="space-y-1.5 max-h-[240px] overflow-y-auto scroll-thin pt-1">
                  {grouped.length === 0 && <p className="font-mono-c text-[10px] opacity-50 text-center py-2">No runs yet.</p>}
                  {grouped.map(([t, items]) => {
                    const openT = expandedTopic === t
                    return (
                      <div key={t} className="pm-card overflow-hidden">
                        <button onClick={() => setExpandedTopic(openT ? null : t)} className="w-full text-left px-2 py-1.5 flex items-center gap-1.5 hover:bg-[#EFF6E6] transition-colors">
                          {openT ? <ChevronDown size={13} className="shrink-0" /> : <ChevronRight size={13} className="shrink-0" />}
                          <span className="font-serif-c text-[12px] truncate flex-1">{t}</span>
                          <span className="font-mono-c text-[9px] opacity-50">{items.length}</span>
                        </button>
                        {openT && (
                          <div className="border-t pm-line px-2 py-1.5 space-y-1">
                            {items.map((h) => {
                              const colorMap = { 'Investor': '#FF6B6B', 'Consensus': '#F1E84A', 'Blind Spot': '#FF6B6B', 'Recruiter': '#9B59B6', 'Startup Founder': '#E67E22', 'Designer': '#27AE60', 'Conflict': '#4ECDC4' };
                              const color = colorMap[h.label] || (h.mode === 'engine' ? getEngine(h.engine)?.color : getPerspective(h.perspective)?.color) || '#2B3A2A';
                              return (
                                <button key={h.id} onClick={() => openHistory(h)} className="w-full text-left flex items-center gap-2 px-1 py-1 rounded hover:bg-[#F1E84A] transition-colors">
                                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                  <span className="font-mono-c text-[10px] font-bold">{h.label}</span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </aside>

        <section className="order-1 lg:order-2 flex flex-col items-center" ref={centerRef}>
           <div className="flex justify-center w-full overflow-hidden">
             <DialMachine perspectives={PERSPECTIVES} activeIndex={activeIndex} onSelect={setActiveIndex} size={dialSize}>
               <div className="relative" style={{ width: cardW }}>
                 <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-2xl" style={{ border: '1.5px solid #2B3A2A', background: '#E9F1E0' }} />
                 <div className="relative pm-card p-4">
                   <div className="flex items-center justify-between mb-2">
                     <span className="font-mono-c text-[10px] tracking-[0.15em] opacity-70">YOUR INPUT</span>
                     <Keyboard size={16} className="opacity-70" />
                   </div>
                   <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="How does AI impact designer roles?" rows={3} className="w-full bg-transparent font-serif-c text-xl leading-snug resize-none focus:outline-none placeholder:opacity-40" style={{ color: '#2B3A2A' }} />
                   <div className="flex items-center justify-between mt-2">
                     <button onClick={runPersona} disabled={loading} className="font-mono-c text-[11px] tracking-wide px-5 py-2 rounded-lg border disabled:opacity-50 transition-transform hover:-translate-y-0.5" style={{ background: '#CBA9F0', borderColor: '#2B3A2A' }}>{loading ? 'CONNECTING\u2026' : 'CONNECT'}</button>
                     <div className="flex items-center gap-0.5 opacity-50"><Cog size={22} className="gear-spin" /><Settings size={16} className="gear-spin-rev" /></div>
                   </div>
                 </div>
               </div>
             </DialMachine>
           </div>
           <p className="font-mono-c text-[11px] tracking-wide mt-1 text-center">selected lens: <span className="font-bold">{active.label}</span> &mdash; <span className="opacity-70">{active.blurb}</span></p>
           <div className="flex flex-wrap gap-2 justify-center mt-3">
             {EXAMPLES.map((ex, i) => (<button key={i} onClick={() => setTopic(ex)} className="font-mono-c text-[10px] pm-card px-2.5 py-1 hover:bg-[#F1E84A] transition-colors">{ex}</button>))}
           </div>
        </section>

        <aside className="order-3 lg:order-3 lg:h-[calc(100vh-110px)] lg:sticky lg:top-5 min-h-[480px]">
          <TerminalSidebar result={result} loading={loading} error={error} header={header} engines={ENGINES} onEngine={runEngine} />
        </aside>
      </main>
      <HelpOverlay open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  )
}

function Section({ title, body }) {
  return (
    <div className="mb-5">
      <h3 className="font-mono-c text-sm tracking-[0.1em] mb-1">{title}</h3>
      <div className="border-t pm-line mb-2" />
      <p className="font-serif-c text-[13px] leading-relaxed opacity-80">{body}</p>
    </div>
  )
}

const deleteExploration = async (e, topicToDelete) => {
  e.stopPropagation(); // Parent button click na ho
  try {
    await fetch(`/api/explorations?topic=${encodeURIComponent(topicToDelete)}`, {
      method: 'DELETE',
    });
    // History update karo
    setHistory(history.filter(h => h.topic !== topicToDelete));
  } catch (e) {
    console.error("Delete failed", e);
  }
};