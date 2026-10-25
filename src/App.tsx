import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, MoveDown, Sparkles } from 'lucide-react'

const heroPortrait = 'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png'
const cornerArt = {
  moon: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
  object: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
  lego: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
  group: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
}

const marqueeImages = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
]

const projectImages = [
  [
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
  ],
  [
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
  ],
  [
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
  ],
]

const services = [
  ['01', '3D Modeling', 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.'],
  ['02', 'Rendering', 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.'],
  ['03', 'Motion Design', 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.'],
  ['04', 'Branding', 'Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence.'],
  ['05', 'Web Design', 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.'],
]

const projects = [
  { number: '01', name: 'Nextlevel Studio', type: 'Client', blurb: 'A sharp digital world for a studio pushing ideas past the expected.', images: projectImages[0] },
  { number: '02', name: 'Aura Brand Identity', type: 'Personal', blurb: 'A tactile identity study built from light, texture, and electric color.', images: projectImages[1] },
  { number: '03', name: 'Solaris Digital', type: 'Client', blurb: 'A warm, forward-looking interface for a new generation of digital products.', images: projectImages[2] },
]

type FadeInProps = { children: ReactNode; delay?: number; duration?: number; x?: number; y?: number; className?: string }

function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, className = '' }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Magnet({ children }: { children: ReactNode }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left - rect.width / 2) / 3
    const y = (event.clientY - rect.top - rect.height / 2) / 3
    setOffset({ x, y })
  }
  return (
    <div
      onPointerMove={handleMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      className="will-change-transform"
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`, transition: offset.x ? 'transform 0.3s ease-out' : 'transform 0.6s ease-in-out' }}
    >
      {children}
    </div>
  )
}

function ContactButton({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`contact-pill ${compact ? 'contact-pill--compact' : ''}`} href="#contact">
      <span>Contact Me</span>
      <ArrowUpRight size={compact ? 15 : 18} strokeWidth={1.8} />
    </a>
  )
}

function LiveProjectButton() {
  return (
    <a className="live-pill" href="#contact" aria-label="Discuss a live project">
      Live Project <ArrowUpRight size={16} />
    </a>
  )
}

function AnimatedChar({ char, index, total, progress }: { char: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = Math.max(0, index / total - 0.12)
  const end = Math.min(1, index / total + 0.22)
  const opacity = useTransform(progress, [start, end], [0.2, 1])
  return <motion.span style={{ opacity }}>{char === ' ' ? '\u00a0' : char}</motion.span>
}

function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  return (
    <p ref={ref} className="animated-copy" aria-label={text}>
      {text.split('').map((char, index) => <AnimatedChar key={`${char}-${index}`} char={char} index={index} total={text.length} progress={scrollYProgress} />)}
    </p>
  )
}

function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const sectionTop = sectionRef.current?.getBoundingClientRect().top ?? 0
        setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update) }
  }, [])
  const rows = useMemo(() => [marqueeImages.slice(0, 11), marqueeImages.slice(11)], [])
  return (
    <section ref={sectionRef} className="marquee-section" aria-label="Selected motion work">
      <div className="marquee-intro">
        <span>Selected motion / 2020 — 2026</span>
        <span className="marquee-scroll"><MoveDown size={15} /> Scroll to explore</span>
      </div>
      <div className="marquee-window">
        <div className="marquee-row" style={{ transform: `translate3d(${offset - 200}px, 0, 0)` }}>
          {[...rows[0], ...rows[0], ...rows[0]].map((src, index) => <img key={`top-${src}-${index}`} src={src} alt="Abstract motion design project preview" loading="lazy" />)}
        </div>
        <div className="marquee-row" style={{ transform: `translate3d(${-offset + 200}px, 0, 0)` }}>
          {[...rows[1], ...rows[1], ...rows[1]].map((src, index) => <img key={`bottom-${src}-${index}`} src={src} alt="Abstract motion design project preview" loading="lazy" />)}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'start start'] })
  const targetScale = 1 - (projects.length - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])
  return (
    <div className="project-card-wrap" style={{ top: `${index * 28}px` }}>
      <motion.article ref={cardRef} className="project-card" style={{ scale }}>
        <div className="project-card-top">
          <span className="project-number">{project.number}</span>
          <div className="project-meta">
            <span className="eyebrow">{project.type} / 3D world</span>
            <h3>{project.name}</h3>
            <p>{project.blurb}</p>
          </div>
          <LiveProjectButton />
        </div>
        <div className="project-gallery">
          <div className="project-gallery-left">
            <img src={project.images[0]} alt={`${project.name} project detail one`} loading="lazy" />
            <img src={project.images[1]} alt={`${project.name} project detail two`} loading="lazy" />
          </div>
          <img className="project-gallery-tall" src={project.images[2]} alt={`${project.name} project hero detail`} loading="lazy" />
        </div>
      </motion.article>
    </div>
  )
}

function HeroSection() {
  return (
    <section id="top" className="hero-section">
      <nav className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#top">J<span>•</span></a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#services">Price</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
        <span className="nav-index">01 / 05</span>
      </nav>
      <div className="hero-title-wrap">
        <FadeIn y={40} delay={0.15}>
          <h1 className="hero-heading">Hi, i&apos;m jack</h1>
        </FadeIn>
      </div>
      <FadeIn delay={0.35} y={20} className="hero-footer">
        <p>a 3d creator driven by crafting striking and unforgettable projects</p>
        <span className="hero-scroll-cue"><MoveDown size={16} /> Scroll down</span>
        <ContactButton />
      </FadeIn>
      <FadeIn delay={0.6} y={30} className="hero-portrait">
        <Magnet><img src={heroPortrait} alt="Jack, 3D creator portrait" /></Magnet>
      </FadeIn>
      <div className="hero-orbit orbit-one" />
      <div className="hero-orbit orbit-two" />
    </section>
  )
}

function AboutSection() {
  const copy = "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
  return (
    <section id="about" className="about-section">
      <FadeIn className="corner-art corner-art-moon" x={-80} delay={0.1} duration={0.9}><img src={cornerArt.moon} alt="3D moon object" loading="lazy" /></FadeIn>
      <FadeIn className="corner-art corner-art-object" x={-80} delay={0.25} duration={0.9}><img src={cornerArt.object} alt="Abstract 3D object" loading="lazy" /></FadeIn>
      <FadeIn className="corner-art corner-art-lego" x={80} delay={0.15} duration={0.9}><img src={cornerArt.lego} alt="3D lego icon" loading="lazy" /></FadeIn>
      <FadeIn className="corner-art corner-art-group" x={80} delay={0.3} duration={0.9}><img src={cornerArt.group} alt="Abstract 3D group" loading="lazy" /></FadeIn>
      <div className="about-content">
        <FadeIn y={40}><p className="section-kicker">A little context / 02</p><h2 className="hero-heading section-heading">About me</h2></FadeIn>
        <AnimatedText text={copy} />
        <FadeIn delay={0.25} className="about-cta" y={20}><ContactButton /></FadeIn>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="services" className="services-section">
      <FadeIn y={40} className="services-heading-row"><p className="section-kicker dark-kicker">What I do / 03</p><h2>Services</h2><span className="services-mark"><Sparkles size={18} /> built for bold ideas</span></FadeIn>
      <div className="services-list">
        {services.map(([number, name, description], index) => (
          <FadeIn key={number} delay={index * 0.1} y={20} className="service-item">
            <span className="service-number">{number}</span>
            <div><h3>{name}</h3><p>{description}</p></div>
            <ArrowDownRight className="service-arrow" size={30} strokeWidth={1.2} />
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

function ProjectsSection() {
  return (
    <section id="projects" className="projects-section">
      <div className="projects-heading-row"><div><p className="section-kicker">Selected work / 04</p><h2 className="hero-heading section-heading">Project</h2></div><p className="projects-note">Scroll through a few worlds shaped from light, material, and movement.</p></div>
      <div className="projects-stack">{projects.map((project, index) => <ProjectCard key={project.number} project={project} index={index} />)}</div>
      <footer id="contact" className="site-footer">
        <div><p className="section-kicker">Open for the next good idea / 05</p><h2 className="hero-heading footer-heading">Let&apos;s make<br /><span>something <i>real.</i></span></h2></div>
        <div className="footer-actions"><ContactButton compact /><a className="footer-mail" href="mailto:hello@jack3d.studio">hello@jack3d.studio <ArrowUpRight size={15} /></a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Jack — 3D Creator</span><a href="#top">Back to top <ArrowUpRight size={14} /></a></div>
      </footer>
    </section>
  )
}

export default function App() {
  return <main className="site-shell"><HeroSection /><MarqueeSection /><AboutSection /><ServicesSection /><ProjectsSection /></main>
}
