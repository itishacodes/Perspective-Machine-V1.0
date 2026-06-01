'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Compass, ListChecks, Scale } from 'lucide-react'

const SECTIONS = [
  {
    icon: Compass,
    title: 'PURPOSE',
    body: 'The Perspective Machine pressure-tests any idea, decision, or hot take through eight distinct expert minds and four synthesis engines. Instead of a single flat answer, you get a multi-lens reading — Consensus, Blind Spots, Conflicts and an Evolution path — so you can see what you are missing before you commit.',
  },
  {
    icon: ListChecks,
    title: 'USAGE GUIDELINES',
    body: '1. Type a topic into the central YOUR INPUT card.\n2. Spin the dial to a mind and press CONNECT for that lens.\n3. Fire any synthesis engine on the right to reason across all eight minds.\n4. Revisit past runs via OLD EXPLORATIONS — grouped by prompt, expandable per perspective.\nTreat outputs as provocations for your own thinking, not verdicts.',
  },
  {
    icon: Scale,
    title: 'LEGAL DISCLAIMERS',
    body: 'Responses are AI-generated (powered by Groq/Llama 3) and may be inaccurate, incomplete, or biased. Nothing here constitutes financial, legal, medical, or professional advice. Do not submit confidential or personal data. You are responsible for how you use the output. Provided “as is” without warranty of any kind.',
  },
]

export default function HelpOverlay({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: '#2B3A2A55' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[460px] overflow-y-auto scroll-thin"
            style={{ background: '#E6EFDD', borderLeft: '2px solid #2B3A2A' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 110, damping: 20 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b pm-line sticky top-0" style={{ background: '#E6EFDD' }}>
              <h2 className="font-mono-c font-bold tracking-[0.14em]">HELP &amp; LEGAL</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full border pm-line flex items-center justify-center hover:bg-[#F1E84A] transition-colors" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {SECTIONS.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.title} className="pm-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-8 rounded-full border pm-line flex items-center justify-center" style={{ background: '#F1E84A' }}>
                        <Icon size={16} />
                      </span>
                      <h3 className="font-mono-c text-sm tracking-[0.1em] font-bold">{s.title}</h3>
                    </div>
                    <p className="font-serif-c text-[13px] leading-relaxed opacity-80 whitespace-pre-line">{s.body}</p>
                  </div>
                )
              })}
              <p className="font-mono-c text-[10px] opacity-50 text-center pt-2">Perspective Machine · V.1.0 · Llama 3 (via Groq) live</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
