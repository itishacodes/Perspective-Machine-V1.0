'use client'

import { useState } from 'react'
import { ToggleLeft, ToggleRight, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Define your color map here
const perspectiveColors = {
  'Run Consensus Engine': 'bg-[#F1E84A]',     // Yellow
  'Detect Blind Spots': 'bg-[#FF6B6B]',      // Red
  'Detect Perspective Conflicts': 'bg-[#4ECDC4]', // Teal
  'Trace Evolution Path': 'bg-[#9B59B6]',    // Purple
};

function ScoreMeter({ score = 0, label = 'Confidence' }) {
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div className="mt-3 p-2 border-t pm-line">
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono-c text-[10px] uppercase tracking-wider opacity-70">{label}</span>
        <span className="font-mono-c font-bold text-xs">{pct}/100</span>
      </div>
      <div className="h-2 w-full pm-line border" style={{ background: '#E6EFDD' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: pct + '%' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full" style={{ background: '#F1E84A' }} 
        />
      </div>
    </div>
  )
}

export default function TerminalSidebar({ result, loading, error, header, engines = [], onEngine, explorations = [] }) {
  const [compare, setCompare] = useState(false)

  return (
    <div className="pm-panel h-full flex flex-col overflow-hidden font-sans">
      <h2 className="font-mono-c text-center font-bold tracking-[0.15em] text-sm py-3 border-b pm-line">SYSTEM OUTPUT</h2>
      
      <div className="flex-1 overflow-y-auto scroll-thin p-4 flex flex-col gap-4">
        
        {/* Output Area */}
        <div className="pm-card p-3 min-h-[160px] flex flex-col justify-center items-center flex-none">
          {loading && <div className="font-mono-c text-xs animate-pulse opacity-70">booting cognitive ensemble…</div>}
          {error && <p className="text-red-600 font-mono-c text-xs">ERROR: {error}</p>}
          
          {!loading && !result && !error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2 opacity-40">
              <p className="font-serif-c text-sm mb-2">Awaiting input stream…</p>
            </motion.div>
          )}
          
          <AnimatePresence mode="wait">
            {result && (
              <motion.div key={result.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full">
                <p className="font-mono-c text-[13px] font-bold tracking-widest uppercase mb-2">Answer ({header?.label})</p>
                <div className="border-t pm-line mb-4" />
                <p className="font-serif-c text-base mb-6 leading-snug">{result.headline}</p>
                
                <div className="space-y-6"> 
                  {result.sections?.map((s, i) => (
                    <motion.div key={i} className="border-l-2 border-[#F1E84A] pl-4">
                      <p className="font-mono-c text-[10px] font-bold tracking-widest uppercase text-[#2B3A2A] opacity-60 mb-1.5">{s.tag}</p>
                      <p className="font-serif-c text-sm leading-relaxed text-[#2B3A2A]">{s.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Engine Section with Colored Dots */}
        <div className="space-y-1 pb-4">
          {engines.map((e) => (
            <button 
              key={e.id} 
              onClick={() => onEngine(e)} 
              className="w-full pm-card p-3 text-[11px] font-mono-c tracking-widest uppercase flex items-center gap-3 hover:bg-[#F1E84A] border-b border-[#2B3A2A]"
            >
              
              <Lock size={12} className="opacity-70" /> 
              {e.action || e.label}
              
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}