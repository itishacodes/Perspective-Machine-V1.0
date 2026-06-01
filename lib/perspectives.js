import {
  GraduationCap, TrendingUp, PenTool, Megaphone, Rocket, Cpu, Users, Heart,
  Handshake, EyeOff, Swords, GitBranch
} from 'lucide-react'

// 8 personas — uniform yellow nodes in the retro machine aesthetic.
// `node` is the short label shown inside the dial ellipse.
export const PERSPECTIVES = [
  { id: 'professor', label: 'Professor',       node: 'Professor',       short: 'Professor', tag: 'Academic Rigor', color: '#4F7CFF', icon: GraduationCap, blurb: 'Theory, evidence & first principles' },
  { id: 'investor',  label: 'Investor',        node: 'Investor',        short: 'Investor',  tag: 'Capital & Risk', color: '#2DD4A7', icon: TrendingUp,    blurb: 'Returns, moats & market size' },
  { id: 'designer',  label: 'Designer',        node: 'Designer',        short: 'Designer',  tag: 'Craft & Empathy', color: '#FF9EC4', icon: PenTool,      blurb: 'Aesthetics, flow & delight' },
  { id: 'marketer',  label: 'Marketer',        node: 'Marketer',        short: 'Marketer',  tag: 'Story & Reach', color: '#FF8A3D', icon: Megaphone,    blurb: 'Positioning, hooks & growth' },
  { id: 'founder',   label: 'Startup Founder', node: 'Startup Founder', short: 'Founder',   tag: 'Speed & Grit', color: '#FFD23F', icon: Rocket,       blurb: 'Velocity, wedge & vision' },
  { id: 'engineer',  label: 'Engineer',        node: 'Engineer',        short: 'Engineer',  tag: 'Systems & Scale', color: '#36D6E7', icon: Cpu,          blurb: 'Architecture, tradeoffs & feasibility' },
  { id: 'recruiter', label: 'Recruiter',       node: 'Recruiter',       short: 'Recruiter', tag: 'Talent & Fit', color: '#B57EDC', icon: Users,        blurb: 'People, culture & signal' },
  { id: 'user',      label: 'The User',        node: 'User',            short: 'User',      tag: 'Real World', color: '#FF6B6B', icon: Heart,        blurb: 'Needs, friction & trust' },
]

export const ENGINES = [
  { id: 'consensus', label: 'Consensus',  action: 'RUN CONSENSUS ENGINE',       icon: Handshake, color: '#2DD4A7', desc: 'Where all minds agree' },
  { id: 'blindspot', label: 'Blind Spot', action: 'DETECT BLIND SPOTS',         icon: EyeOff,    color: '#FF8A3D', desc: 'What everyone is missing' },
  { id: 'conflict',  label: 'Conflict',   action: 'DETECT PERSPECTIVE CONFLICTS', icon: Swords,  color: '#FF6B6B', desc: 'Where the minds clash' },
  { id: 'evolution', label: 'Evolution',  action: 'TRACE EVOLUTION PATH',       icon: GitBranch, color: '#4F7CFF', desc: 'How the idea should evolve' },
]

export const getPerspective = (id) => PERSPECTIVES.find(p => p.id === id)
export const getEngine = (id) => ENGINES.find(e => e.id === id)
