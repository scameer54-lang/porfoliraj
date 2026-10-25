import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, type MotionValue, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Check, ExternalLink, Instagram, Mail, MapPin, MoveDown, Sparkles } from 'lucide-react'

type Project = {
  id: number
  title: string
  type: string
  category: string
  description: string
  url?: string
  accent: string
  live?: boolean
}

const publicProjects: Project[] = [
  { id: 1, title: 'Wonder Events', type: 'Live website', category: 'Events / booking', description: 'A conversion-first event experience built to make discovery and booking feel effortless.', url: 'https://wondereventstirupati.com/?utm_source=chatgpt.com', accent: 'linear-gradient(135deg,#f4b35d,#e66b4e 48%,#9e3f8c)', live: true },
  { id: 2, title: 'Event Bid', type: 'Live website', category: 'Events / marketplace', description: 'A bold marketplace concept for discovering event services and making the next move.', url: 'https://eventbid-bj6lsq.v2.appdeploy.ai/?utm_source=chatgpt.com', accent: 'linear-gradient(135deg,#0e365b,#087d8b 48%,#91d8b4)', live: true },
  { id: 3, title: 'Eye Trend', type: 'Live website', category: 'Optical / commerce', description: 'A clean optical storefront that puts clarity, trust, and product discovery first.', url: 'https://eye-trend-optical-rvj8n0.v2.appdeploy.ai/?utm_source=chatgpt.com', accent: 'linear-gradient(135deg,#d8f3f0,#73b4d4 48%,#3850a3)', live: true },
  { id: 4, title: 'Arhuu Outfit', type: 'Live website', category: 'Fashion / e-commerce', description: 'A fashion commerce direction for a brand that wants every scroll to feel editorial.', url: 'https://www.arhuuoutfit.com/', accent: 'linear-gradient(135deg,#f8d6c0,#d07775 48%,#673858)', live: true },
  { id: 5, title: "Dharma's Dental", type: 'Live website', category: 'Dental / healthcare', description: 'A friendly healthcare presence designed to make the first appointment feel simple.', url: 'https://dharmasdental.com/', accent: 'linear-gradient(135deg,#d8f7ed,#74c9b4 48%,#315a70)', live: true },
  { id: 6, title: 'SLVR Dental & Cosmetic Care', type: 'Live website', category: 'Dental / cosmetic care', description: 'A premium care experience for a clinic balancing trust, clarity, and confident conversion.', url: 'https://slvrdentalandcosmeticcare.in/', accent: 'linear-gradient(135deg,#f7e8cc,#d6a56f 48%,#745477)', live: true },
]

const privateBuildNames = ['Campus Connect', 'Clinic Flow', 'Meta Reach Lab', 'Student Hub', 'Local Commerce', 'Launchpad Ads', 'Event Ops', 'Vision Store', 'Creator Toolkit', 'Study Sprint', 'Service Finder', 'Brand Drop', 'Travel Grid', 'Gym Track', 'Food Order', 'Portfolio Kit', 'Lead Engine', 'Booking Stack', 'Campus Market']
const privateProjects: Project[] = privateBuildNames.map((title, index) => ({
  id: index + 7,
  title,
  type: 'Private build',
  category: index % 3 === 0 ? 'App / product' : index % 3 === 1 ? 'Website / brand' : 'Growth / marketing',
  description: 'Private work not listed publicly. Details and walkthrough available on request.',
  accent: `linear-gradient(135deg, hsl(${(index * 29 + 195) % 360} 76% 68%), hsl(${(index * 29 + 245) % 360} 72% 45%) 56%, hsl(${(index * 29 + 285) % 360} 70% 28%))`,
}))

const projects = [...publicProjects, ...privateProjects]
const services = [
  ['01', 'Websites', 'High-converting websites with clean structure, strong visual identity, and responsive detail.'],
  ['02', 'Apps', 'Useful digital products shaped around real people, simple flows, and clear next actions.'],
  ['03', 'Meta Ads', 'Creative campaigns, landing pages, and testing systems designed to turn attention into reach.'],
  ['04', 'Reach marketing', 'Reach-focused thinking for brands that need more than a pretty page.'],
  ['05', 'Automations', 'Small systems that remove repeated work — follow-ups, forms, leads, and handoffs that keep moving.'],
  ['06', 'Brand systems', 'A practical visual direction so your website, ads, and content feel like the same brand.'],
  ['07', 'SEO + analytics', 'Search-ready structure and useful measurement so good work has a better chance to be found.'],
]

const whyUs = [
  ['A typical handoff', 'A template, a launch link, and a goodbye.', 'A working system with the next useful step already considered.'],
  ['Website only', 'A page that stops at “live”.', 'Website + content flow + automation-ready foundations.'],
  ['Marketing', 'Boosts without a clear learning loop.', 'Creative, landing page, and reach thinking connected together.'],
  ['Support', 'One-size process for every project.', 'Direct, clear, student-builder energy with honest scope.'],
]

function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: .65, delay, ease: [0.22, 1, .36, 1] }}>{children}</motion.div>
}

function LiquidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const touchLayerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (finePointer) document.documentElement.classList.add('has-liquid-cursor')
    let x = -100, y = -100, trailX = -100, trailY = -100, frame = 0
    const move = (event: MouseEvent) => { x = event.clientX; y = event.clientY }
    const press = (event: globalThis.PointerEvent) => {
      if (event.pointerType === 'mouse' || !touchLayerRef.current) return
      const ripple = document.createElement('span')
      ripple.className = 'liquid-touch'
      ripple.style.left = `${event.clientX}px`
      ripple.style.top = `${event.clientY}px`
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
      touchLayerRef.current.appendChild(ripple)
    }
    const animate = () => {
      trailX += (x - trailX) * .14
      trailY += (y - trailY) * .14
      if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${x}px,${y}px,0)`
      if (trailRef.current) trailRef.current.style.transform = `translate3d(${trailX}px,${trailY}px,0)`
      frame = requestAnimationFrame(animate)
    }
    if (finePointer) { window.addEventListener('mousemove', move, { passive: true }); frame = requestAnimationFrame(animate) }
    window.addEventListener('pointerdown', press, { passive: true })
    return () => { if (finePointer) window.removeEventListener('mousemove', move); window.removeEventListener('pointerdown', press); cancelAnimationFrame(frame); document.documentElement.classList.remove('has-liquid-cursor') }
  }, [])
  return <><div ref={touchLayerRef} className="liquid-touch-layer" aria-hidden="true" /><div ref={trailRef} className="liquid-cursor liquid-cursor-trail" aria-hidden="true" /><div ref={cursorRef} className="liquid-cursor" aria-hidden="true" /></>
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<{ type: 'idle' | 'sending' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' })
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setStatus({ type: 'sending', message: 'Sending…' })
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Please try again.')
      setForm({ name: '', email: '', message: '' }); setStatus({ type: 'success', message: 'Received — Raj will be in touch.' })
    } catch (error) { setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Something went wrong.' }) }
  }
  return <form className="raj-form" onSubmit={submit}>
    <div className="raj-form-grid"><label>Name<input required minLength={2} maxLength={80} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" autoComplete="name" /></label><label>Email<input required type="email" maxLength={254} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" autoComplete="email" /></label></div>
    <label>Project / goal<textarea required minLength={10} maxLength={4000} rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="What are you building?" /></label>
    <div className="raj-form-bottom"><button className="raj-submit" disabled={status.type === 'sending'}>{status.type === 'sending' ? 'Sending' : 'Start a conversation'} <ArrowUpRight size={16} /></button>{status.message && <span className={`raj-form-status ${status.type}`}>{status.message}</span>}</div>
  </form>
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <motion.article className={`raj-project-card ${project.live ? 'raj-project-card--live' : ''}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .55, delay: Math.min(index % 3, 2) * .06 }}>
    <div className="raj-project-art" style={{ background: project.accent }}><span>{String(project.id).padStart(2, '0')}</span><Sparkles size={19} /></div>
    <div className="raj-project-info"><div><p className="raj-project-type">{project.type} / {project.category}</p><h3>{project.title}</h3></div>{project.live ? <a href={project.url} target="_blank" rel="noreferrer" className="raj-card-link" aria-label={`Open ${project.title}`}><ExternalLink size={17} /></a> : <span className="raj-private-pill">On request</span>}</div>
    <p className="raj-project-description">{project.description}</p>
  </motion.article>
}

function AnimatedStat({ value, label }: { value: string; label: string }) { return <div className="raj-stat"><strong>{value}</strong><span>{label}</span></div> }

function RajHero() {
  return <section className="raj-hero" id="top">
    <nav className="raj-nav"><a className="raj-logo" href="#top">R<span>•</span></a><div className="raj-nav-links"><a href="#work">Work</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a></div><a className="raj-nav-social" href="https://instagram.com/udith_29" target="_blank" rel="noreferrer"><Instagram size={15} /> @udith_29</a></nav>
    <div className="raj-hero-grid"><div className="raj-hero-copy"><p className="raj-eyebrow"><span className="raj-live-dot" /> Independent digital builder / 2026</p><h1>Build<br /><em>bold.</em><br />Stay <span>real.</span></h1><p className="raj-hero-lede">I&apos;m Raj — a 4th year student building websites, apps, and growth systems for people with something worth putting online.</p><div className="raj-hero-actions"><a className="raj-primary" href="#work">Explore 25 projects <ArrowDownRight size={18} /></a><a className="raj-ghost-link" href="#contact">Start a project <ArrowUpRight size={16} /></a></div></div><div className="raj-hero-visual"><div className="raj-visual-orbit raj-visual-orbit-a" /><div className="raj-visual-orbit raj-visual-orbit-b" /><div className="raj-visual-core"><span>RAJ</span><small>APP / WEB / GROWTH</small></div><p className="raj-visual-note">Made in Tirupati<br />built for anywhere.</p><div className="raj-visual-index">01<br /><span>04</span></div></div></div>
    <div className="raj-hero-bottom"><span>Scroll to enter <MoveDown size={16} /></span><div className="raj-hero-rule" /><span>Design / build / reach</span></div>
  </section>
}

function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start .85', 'end .3'] })
  const x = useTransform(scrollYProgress, [0, 1], [50, 0])
  return <section ref={ref} id="about" className="raj-about"><div className="raj-section-marker">02 / About Raj</div><motion.div className="raj-about-panel" style={{ x }}><p className="raj-eyebrow">The short version</p><h2>Student mind.<br /><em>Builder energy.</em></h2><p className="raj-about-copy">I&apos;m a 4th year student interested in app and website building, Meta Ads, and reach marketing. I like the space between a strong idea and the moment it actually works — the page, the product, the campaign, and the details people remember.</p><div className="raj-stats"><AnimatedStat value="25" label="projects in the book" /><AnimatedStat value="06" label="live public builds" /><AnimatedStat value="04" label="years learning + shipping" /></div></motion.div><div className="raj-about-aside"><span>Currently open for</span><strong>Websites<br />Apps<br />Growth</strong><a href="https://instagram.com/udith_29" target="_blank" rel="noreferrer">Follow the process <ArrowUpRight size={15} /></a></div></section>
}

function ServicesSection() {
  return <section id="services" className="raj-services"><div className="raj-section-header"><div><p className="raj-eyebrow raj-eyebrow-dark">03 / What I do</p><h2>Useful<br /><em>by design.</em></h2></div><p>Not just screens. I build the thinking around them — from first click to first customer.</p></div><div className="raj-service-list">{services.map(([number, title, description]) => <div className="raj-service-row" key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p><ArrowUpRight className="raj-service-arrow" size={22} /></div>)}</div><div className="raj-comparison"><div className="raj-comparison-heading"><p className="raj-eyebrow raj-eyebrow-dark">Why Raj / the difference</p><h3>More than<br /><em>a pretty launch.</em></h3></div><div className="raj-comparison-table"><div className="raj-comparison-table-head"><span>What matters</span><span>Typical handoff</span><span>Raj&apos;s approach</span></div>{whyUs.map(([matter, typical, raj]) => <div className="raj-comparison-row" key={matter}><strong>{matter}</strong><span>{typical}</span><span>{raj} <Check size={15} /></span></div>)}</div></div></section>
}

function WorkSection() {
  const [filter, setFilter] = useState<'all' | 'live' | 'private'>('all')
  const visibleProjects = useMemo(() => filter === 'all' ? projects : filter === 'live' ? publicProjects : privateProjects, [filter])
  return <section id="work" className="raj-work"><div className="raj-section-header raj-work-header"><div><p className="raj-eyebrow">04 / Selected work</p><h2>25 ways<br /><em>to build.</em></h2></div><div className="raj-work-side"><p>Six are live. Nineteen are private builds not listed on the Play Store — shared here as a record of range, not noise.</p><div className="raj-filters">{(['all', 'live', 'private'] as const).map(option => <button key={option} className={filter === option ? 'is-active' : ''} onClick={() => setFilter(option)}>{option === 'all' ? 'All 25' : option === 'live' ? 'Live 06' : 'Private 19'}</button>)}</div></div></div><div className="raj-live-showcase"><div className="raj-live-showcase-label"><span>Live now</span><small>Swipe / drag to explore</small></div><div className="raj-live-showcase-track">{publicProjects.map(project => <a key={project.id} className="raj-live-showcase-card" href={project.url} target="_blank" rel="noreferrer"><span style={{ background: project.accent }} /><div><small>{String(project.id).padStart(2, '0')} / {project.category}</small><strong>{project.title}</strong></div><ExternalLink size={16} /></a>)}</div></div><div className="raj-project-grid">{visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div></section>
}

function RajFooter() {
  return <footer id="contact" className="raj-footer"><div className="raj-footer-top"><div><p className="raj-eyebrow">05 / Let&apos;s make something</p><h2>Have an idea?<br /><em>Let&apos;s build it.</em></h2><div className="raj-footer-links"><a href="https://instagram.com/udith_29" target="_blank" rel="noreferrer"><Instagram size={17} /> @udith_29</a><a href="mailto:hello@rajbuilds.in"><Mail size={17} /> hello@rajbuilds.in</a><span><MapPin size={17} /> Tirupati, India</span></div></div><ContactForm /></div><div className="raj-footer-bottom"><span>© {new Date().getFullYear()} Raj / digital builder</span><a href="#top">Back to top <ArrowUpRight size={14} /></a></div></footer>
}

function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  useEffect(() => { const timer = window.setTimeout(() => setVisible(false), 850); return () => window.clearTimeout(timer) }, [])
  return <AnimatePresence>{visible && <motion.div className="raj-loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .45 }}><div className="raj-loader-ring"><span>R</span></div><p>Raj / building something useful</p><div className="raj-loader-bar" /></motion.div>}</AnimatePresence>
}

export default function App() {
  return <><LiquidCursor /><LoadingScreen /><main className="raj-shell"><RajHero /><AboutSection /><ServicesSection /><WorkSection /><RajFooter /></main></>
}
