'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'

// ─── Animation Variants ───────────────────────────────────────────────────────
const va = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  },
  slideLeft: {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  },
  slideRight: {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  },
  stagger: {
    visible: { transition: { staggerChildren: 0.12 } }
  },
  card: {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  }
}

// ─── Particle System ──────────────────────────────────────────────────────────
function Particles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      gold: Math.random() > 0.7
    }))
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.gold ? `rgba(212,168,83,${p.alpha})` : `rgba(255,255,255,${p.alpha * 0.4})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = '', label }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  useEffect(() => {
    if (!inView) return
    let start = 0, duration = 2000
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])
  return (
    <motion.div ref={ref} variants={va.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="text-center">
      <div className="text-5xl md:text-6xl font-black font-display text-gold-gradient">{count}{suffix}</div>
      <div className="mt-2 text-sm md:text-base uppercase tracking-widest text-white/40 font-medium">{label}</div>
    </motion.div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  useEffect(() => {
    const h = () => {
      setScrolled(window.scrollY > 50)
      const sections = ['home','about','services','colleges','testimonials','contact']
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Colleges', id: 'colleges' },
    { label: 'Reviews', id: 'testimonials' },
    { label: 'Contact', id: 'contact' },
  ]
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-navy-900/95 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-gold-500/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            <motion.a href="#home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30 group-hover:shadow-gold-500/50 transition-all group-hover:scale-105">
                <span className="text-navy-900 font-black text-xl font-display">P</span>
              </div>
              <div>
                <span className="font-bold text-lg text-white font-display tracking-wide">Plan B</span>
                <span className="block text-[10px] tracking-[0.25em] uppercase text-gold-500 font-semibold">Consultants</span>
              </div>
            </motion.a>
            <div className="hidden lg:flex items-center gap-1">
              {links.map(({ label, id }) => (
                <a key={id} href={`#${id}`}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${active === id ? 'text-gold-400' : 'text-white/60 hover:text-white'}`}>
                  {label}
                  {active === id && <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-gold-500/10 rounded-lg border border-gold-500/20" />}
                </a>
              ))}
              <a href="#contact" className="ml-4 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 hover:shadow-xl hover:shadow-gold-500/30 transition-all hover:scale-105">
                Get Started →
              </a>
            </div>
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden bg-navy-900/98 backdrop-blur-xl border-t border-white/5">
              <div className="px-4 py-4 space-y-1">
                {links.map(({ label, id }) => (
                  <a key={id} href={`#${id}`} onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all font-medium">
                    {label}
                  </a>
                ))}
                <a href="#contact" onClick={() => setOpen(false)} className="block mx-4 mt-2 px-4 py-3 rounded-xl text-center font-bold bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900">
                  Get Started →
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const [typed, setTyped] = useState('')
  const phrases = ['Top Colleges', 'Dream Careers', 'Your Future']
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIdx]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typed.length < current.length) setTyped(current.slice(0, typed.length + 1))
        else setTimeout(() => setIsDeleting(true), 2000)
      } else {
        if (typed.length > 0) setTyped(typed.slice(0, -1))
        else { setIsDeleting(false); setPhraseIdx((phraseIdx + 1) % phrases.length) }
      }
    }, isDeleting ? 60 : 100)
    return () => clearTimeout(timeout)
  }, [typed, isDeleting, phraseIdx])

  return (
    <section id="home" ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <Particles />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
      <div className="absolute inset-0 grid-pattern" />
      {/* Floating decorative orbs */}
      <motion.div animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-20 right-[10%] w-72 h-72 rounded-full bg-gold-500/5 blur-3xl" />
      <motion.div animate={{ y: [0, 30, 0], rotate: [360, 180, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
      {/* Geometric accents */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[15%] right-[20%] w-32 h-32 border border-gold-500/10 rounded-full" />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[25%] left-[15%] w-20 h-20 border border-gold-500/10 rotate-45" />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-0">
        <motion.div variants={va.stagger} initial="hidden" animate="visible" className="max-w-4xl">
          {/* Badge */}
          <motion.div variants={va.fadeUp} className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold-500/30 bg-gold-500/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-sm font-semibold text-gold-400 tracking-wide">Trusted by 2,500+ Students</span>
            <span className="text-gold-500/50">|</span>
            <span className="text-sm text-gold-500/70">4 States • 50+ Colleges</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={va.fadeUp} className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[0.95] mb-6">
            <span className="text-white">Your</span>
            <br />
            <span className="text-gold-gradient font-display">Plan B</span>
            <span className="text-white"> to a</span>
            <br />
            <span className="text-white">Brighter </span>
            <span className="text-gold-gradient font-display">
              {typed}<span className="animate-pulse">|</span>
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p variants={va.fadeUp} className="text-lg md:text-2xl text-white/50 max-w-2xl mb-10 leading-relaxed">
            Expert guidance for admissions in top colleges across Karnataka, Tamil Nadu, Kerala & Andhra Pradesh. We turn academic potential into real opportunities.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={va.fadeUp} className="flex flex-col sm:flex-row gap-4">
            <a href="#contact" className="group relative px-8 py-4 rounded-2xl text-lg font-bold overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2 text-navy-900">
                Free Consultation
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </a>
            <a href="#about" className="px-8 py-4 rounded-2xl text-lg font-semibold border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/40 transition-all text-center">
              Explore Services
            </a>
          </motion.div>

          {/* Quick stats */}
          <motion.div variants={va.fadeUp} className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-white/10">
            {[['2,500+', 'Students Placed'], ['50+', 'Partner Colleges'], ['4', 'States Covered']].map(([([n,l]) => <div key={l}><div className="text-3xl md:text-4xl font-black text-gold-400">{n}</div><div className="text-xs md:text-sm text-white/40 mt-1 uppercase tracking-wider">{l}</div></div>)}
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-gold-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── About ─────────────────────────────────────────────────────────────────────
function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const cards = [
    { num: '01', title: 'Vision', desc: 'Dedicated to growing and sustaining stipulations that allow all students to experience schooling that is intellectually, socially, and personally transformative.' },
    { num: '02', title: 'Mission', desc: 'Our mission is to provide the best future for our students through admission training in the most reputed establishments offering education across all courses.' },
    { num: '03', title: 'Goal', desc: 'To provide better education for our students and to create great academicians and socially well-being people who contribute meaningfully to society.' },
  ]
  return (
    <section id="about" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800" />
      <div className="absolute inset-0 grid-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={va.stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
          className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Visual */}
          <motion.div variants={va.slideLeft} className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-navy-700 to-navy-900 border border-white/5">
              {/* Decorative college cap icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-center">
                  <div className="text-[120px] mb-4">🎓</div>
                  <div className="text-3xl font-black text-white font-display">Excellence<br />in Education</div>
                  <div className="mt-4 text-white/40 text-lg">Building bridges between dreams & universities</div>
                </motion.div>
              </div>
              {/* Floating badge */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 -right-4 w-36 h-36 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-2xl shadow-gold-500/30 glow-gold">
                <div className="text-center">
                  <div className="text-3xl font-black text-navy-900">15+</div>
                  <div className="text-[10px] font-bold text-navy-900/70 uppercase tracking-wider">Years<br/>Experience</div>
                </div>
              </motion.div>
              {/* Border glow line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div variants={va.slideRight} className="order-1 lg:order-2">
            <span className="text-sm font-bold tracking-[0.3em] uppercase text-gold-500">About Us</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-6 font-display leading-tight">
              Guiding Futures<br /><span className="text-gold-gradient">Since Day One</span>
            </h2>
            <p className="text-base md:text-lg text-white/50 leading-relaxed mb-5">
              Plan B Educational Consultancy was set up with a goal of facilitating wonderful educational picks for students. With awesome credentials, our company guides students to attain notable academic heights, helping them find admissions in the best colleges and universities in the country.
            </p>
            <p className="text-base md:text-lg text-white/50 leading-relaxed mb-10">
              Today, we have connections with a wide range of institutes, colleges, and universities from Karnataka, Tamil Nadu, Andhra Pradesh, and Kerala — giving students unmatched choice and opportunity.
            </p>
            {/* Vision/Mission/Goal cards */}
            <div className="space-y-4">
              {cards.map(({ num, title, desc }, i) => (
                <motion.div key={num} variants={va.card} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-gold-500/20 hover:bg-gold-500/5 transition-all duration-300 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 border border-gold-500/20 flex items-center justify-center text-gold-400 font-black text-lg group-hover:scale-110 transition-transform">{num}</div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Services ──────────────────────────────────────────────────────────────────
function Services() {
  const services = [
    { icon: '🏫', title: 'College Admissions', desc: 'End-to-end guidance from college selection to seat booking. We know which institutions are the right fit for each student.', color: 'from-amber-500/20 to-orange-500/10', border: 'hover:border-amber-500/30' },
    { icon: '📋', title: 'Application Support', desc: 'Crafting standout applications — SOPs, essays, and documentation that get noticed by admission committees.', color: 'from-blue-500/20 to-cyan-500/10', border: 'hover:border-blue-500/30' },
    { icon: '🎯', title: 'Career Guidance', desc: 'Aptitude assessments and personalized counseling to match students with courses and careers aligned with their strengths.', color: 'from-purple-500/20 to-pink-500/10', border: 'hover:border-purple-500/30' },
    { icon: '📊', title: 'Entrance Exam Prep', desc: 'Tie-ups with top coaching centers for NEET, JEE, KCET, COMED-K, and other entrance examinations.', color: 'from-green-500/20 to-emerald-500/10', border: 'hover:border-green-500/30' },
    { icon: '💰', title: 'Scholarship Assistance', desc: 'Helping students identify and apply for merit-based and need-based scholarships to reduce financial burden.', color: 'from-yellow-500/20 to-amber-500/10', border: 'hover:border-yellow-500/30' },
    { icon: '🌍', title: 'NRI / International', desc: 'Guidance for students aspiring to study abroad or seeking NRI quota admissions in top Indian institutions.', color: 'from-red-500/20 to-pink-500/10', border: 'hover:border-red-500/30' },
  ]
  return (
    <section id="services" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-navy-800/50" />
      <div className="absolute inset-0 grid-pattern" />
      {/* Floating orbs */}
      <motion.div animate={{ y: [0, 30, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 left-[20%] w-64 h-64 rounded-full bg-gold-500/5 blur-3xl" />
      <motion.div animate={{ y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute bottom-0 right-[10%] w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={va.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16">
          <motion.span variants={va.fadeUp} className="text-sm font-bold tracking-[0.3em] uppercase text-gold-500">What We Offer</motion.span>
          <motion.h2 variants={va.fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-5 font-display">
            Our <span className="text-gold-gradient">Services</span>
          </motion.h2>
          <motion.p variants={va.fadeUp} className="text-base md:text-lg text-white/40">
            Everything you need in one place — from admission guidance to career planning, we handle the entire student journey so you can focus on what matters: studying.
          </motion.p>
        </motion.div>

        <motion.div variants={va.stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon, title, desc, color, border }, i) => (
            <motion.div key={title} variants={va.card}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`relative p-8 rounded-3xl bg-gradient-to-br ${color} border border-white/5 ${border} transition-all duration-300 group cursor-pointer overflow-hidden`}>
              {/* Top accent */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color.replace('/20', '').replace('/10', '').split(' ')[0]}-400/50`} />
              <div className="text-5xl mb-5 group-hover:scale-125 transition-transform duration-300">{icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <span>→</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── College Partners ──────────────────────────────────────────────────────────
function CollegePartners() {
  const colleges = [
    { name: 'RV College of Engineering', location: 'Bangalore, Karnataka', type: 'Engineering', seats: '500+' },
    { name: 'Christ University', location: 'Bangalore, Karnataka', type: 'Multidisciplinary', seats: '1000+' },
    { name: 'VIT University', location: 'Vellore, Tamil Nadu', type: 'Engineering', seats: '2000+' },
    { name: 'Amrita Vishwa Vidyapeetham', location: 'Coimbatore, Tamil Nadu', type: 'Deemed University', seats: '1500+' },
    { name: 'NIT Surathkal', location: 'Mangalore, Karnataka', type: 'NIT', seats: '400+' },
    { name: 'Manipal Academy', location: 'Manipal, Karnataka', type: 'Deemed University', seats: '1000+' },
    { name: 'SRM Institute', location: 'Chennai, Tamil Nadu', type: 'Deemed University', seats: '2000+' },
    { name: 'IIT Hyderabad', location: 'Hyderabad, Telangana', type: 'IIT', seats: '300+' },
  ]
  return (
    <section id="colleges" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800" />
      <div className="absolute inset-0 grid-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={va.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16">
          <span variants={va.fadeUp} className="text-sm font-bold tracking-[0.3em] uppercase text-gold-500">Our Network</span>
          <h2 variants={va.fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-5 font-display">
            Partner <span className="text-gold-gradient">Colleges</span>
          </h2>
          <p variants={va.fadeUp} className="text-base md:text-lg text-white/40">
            Strong partnerships with top institutions giving students the widest choice and best outcomes.
          </p>
        </motion.div>

        <motion.div variants={va.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {colleges.map(({ name, location, type, seats }, i) => (
            <motion.div key={name} variants={va.card} whileHover={{ y: -5, scale: 1.02 }}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-gold-500/20 hover:bg-gold-500/5 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xl">🏛️</div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500/10 text-gold-400 border border-gold-500/20">{type}</span>
              </div>
              <h3 className="font-bold text-white mb-1 group-hover:text-gold-400 transition-colors">{name}</h3>
              <div className="flex items-center gap-2 text-white/30 text-xs mb-3">📍 {location}</div>
              <div className="text-xs text-gold-500 font-semibold">🎫 {seats} Seats Available</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={va.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mt-12 text-center">
          <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 hover:shadow-xl hover:shadow-gold-500/30 transition-all hover:scale-105">
            View All Partner Colleges →
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Stats Counter Band ───────────────────────────────────────────────────────
function StatsBand() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/></g></g></svg>')" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[['2,500+','Students Guided'],['50+','Partner Colleges'],['15+','Years Experience'],['98%','Success Rate']].map(([n,l]) => (
            <div key={l} className="text-center">
              <div className="text-3xl md:text-5xl font-black text-navy-900">{n}</div>
              <div className="text-navy-900/60 text-sm font-semibold mt-1 uppercase tracking-wider">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ────────────────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    { name: 'Arjun Kumar', college: 'RV College of Engineering', quote: 'Plan B made my dream of getting into a top engineering college a reality. Their guidance on KCET counselling was invaluable.', stars: 5, course: 'Computer Science', year: '2024 Batch' },
    { name: 'Priya Sharma', college: 'Christ University', quote: 'The team helped me through every step — from application to seat confirmation. Could not have done it without them!', stars: 5, course: 'BBA', year: '2024 Batch' },
    { name: 'Rahul Menon', college: 'VIT University', quote: 'I was confused about which college to choose. Plan B Counselors gave me a clear roadmap and I landed in VIT easily.', stars: 5, course: 'Biotechnology', year: '2023 Batch' },
    { name: 'Sneha Reddy', college: 'NIT Surathkal', quote: 'Their scholarship assistance helped me get a 75% fee waiver. Best decision I made was reaching out to Plan B Consultancy.', stars: 5, course: 'Electrical Engineering', year: '2024 Batch' },
    { name: 'Vikram Iyer', college: 'Manipal Academy', quote: 'From aptitude tests to final seat booking — the entire journey was smooth and stress-free. Highly recommend!', stars: 5, course: 'MBBS', year: '2023 Batch' },
    { name: 'Ananya Krishnan', college: 'Amrita Vishwa Vidyapeetham', quote: 'The NRI quota guidance was spot on. My sister also got admission through Plan B last year. We trust them completely.', stars: 5, course: 'Pharmacy', year: '2024 Batch' },
  ]
  return (
    <section id="testimonials" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-navy-800/50" />
      <div className="absolute inset-0 grid-pattern" />
      <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-10 right-[5%] w-64 h-64 rounded-full bg-gold-500/5 blur-3xl" />
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute bottom-10 left-[5%] w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={va.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16">
          <span variants={va.fadeUp} className="text-sm font-bold tracking-[0.3em] uppercase text-gold-500">Success Stories</span>
          <h2 variants={va.fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-5 font-display">
            Student <span className="text-gold-gradient">Testimonials</span>
          </h2>
          <p variants={va.fadeUp} className="text-base md:text-lg text-white/40">
            Real stories from real students who made it to their dream colleges with our help.
          </p>
        </motion.div>

        <motion.div variants={va.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(({ name, college, quote, stars, course, year }, i) => (
            <motion.div key={name} variants={va.card} whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-gold-500/20 transition-all duration-300 group">
              <div className="flex items-center gap-1 mb-4">{Array.from({length: stars}).map((_,j) => <span key={j} className="text-gold-400 text-lg">★</span>)}</div>
              <p className="text-white/50 text-sm leading-relaxed mb-6 italic">"{quote}"</p>
              <div className="border-t border-white/5 pt-4">
                <div className="font-bold text-white">{name}</div>
                <div className="text-xs text-gold-500 mt-0.5">{course} • {year}</div>
                <div className="text-xs text-white/30 mt-1">→ {college}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Process ───────────────────────────────────────────────────────────────────
function Process() {
  const steps = [
    { num: '01', icon: '📞', title: 'Free Consultation', desc: 'Book a free session. We understand your academic goals, scores, and preferences.' },
    { num: '02', icon: '🎯', title: 'Personalized Roadmap', desc: 'We create a custom admission plan based on your profile, rank, and dream colleges.' },
    { num: '03', icon: '📋', title: 'Application Support', desc: 'SOPs, essays, and documentation — we polish every element of your application.' },
    { num: '04', icon: '🎉', title: 'Admission Confirmed', desc: 'From counselling to seat booking — we stay with you until you step into your college.' },
  ]
  return (
    <section className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800" />
      <div className="absolute inset-0 grid-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={va.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16">
          <span variants={va.fadeUp} className="text-sm font-bold tracking-[0.3em] uppercase text-gold-500">How It Works</span>
          <h2 variants={va.fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-5 font-display">
            Your Journey with <span className="text-gold-gradient">Plan B</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent hidden lg:block" />
          <motion.div variants={va.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ num, icon, title, desc }, i) => (
              <motion.div key={num} variants={va.card} className="relative text-center">
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 border border-gold-500/30 flex items-center justify-center text-4xl mx-auto mb-5 glow-gold">
                  {icon}
                </div>
                <div className="text-xs font-bold tracking-widest text-gold-500/50 mb-2">{num}</div>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', course: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleSubmit = (e) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setSubmitted(true) }, 1500) }
  const courses = ['Engineering', 'Medical', 'Arts & Commerce', 'Management', 'Nursing', 'Pharmacy', 'Law', 'Other']
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  return (
    <section id="contact" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-navy-800/50" />
      <div className="absolute inset-0 grid-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={va.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <motion.div variants={va.slideLeft}>
            <span className="text-sm font-bold tracking-[0.3em] uppercase text-gold-500">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-6 font-display leading-tight">
              Let Us Build Your<br /><span className="text-gold-gradient">Future Together</span>
            </h2>
            <p className="text-base md:text-lg text-white/40 mb-10 leading-relaxed">
              Ready to take the first step? Fill out the form and we will get back to you within 24 hours with a personalized admission roadmap.
            </p>
            <div className="space-y-6">
              {[
                { icon: '📍', label: 'Address', value: 'Plan B Educational Consultants, South India' },
                { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
                { icon: '✉️', label: 'Email', value: 'info@planbconsultants.in' },
                { icon: '🕐', label: 'Hours', value: 'Mon – Sat: 9:00 AM – 7:00 PM' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-xl group-hover:bg-gold-500/20 transition-colors">{icon}</div>
                  <div><span className="text-xs font-semibold text-white/30 uppercase tracking-wider">{label}</span><div className="text-white/70 font-medium">{value}</div></div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div variants={va.slideRight}>
            <div className="rounded-3xl bg-white/[0.03] border border-white/5 p-8 md:p-10 backdrop-blur-sm">
              {submitted ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16">
                  <div className="text-7xl mb-6">🎉</div>
                  <h3 className="text-3xl font-black text-white mb-3 font-display">Thank You!</h3>
                  <p className="text-white/40 text-lg">We have received your enquiry. Our team will contact you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Full Name</label>
                      <input required name="name" value={form.name} onChange={handleChange} placeholder="Arjun Sharma" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50 focus:bg-gold-500/5 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Phone</label>
                      <input required name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50 focus:bg-gold-500/5 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Email</label>
                    <input required name="email" type="email" value={form.email} onChange={handleChange} placeholder="arjun@example.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50 focus:bg-gold-500/5 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Interested Course</label>
                    <select name="course" value={form.course} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 focus:outline-none focus:border-gold-500/50 focus:bg-gold-500/5 transition-all">
                      <option value="" className="bg-navy-800">Select a course</option>
                      {courses.map(c => <option key={c} value={c} className="bg-navy-800">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows="3" placeholder="Tell us about your academic goals..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50 focus:bg-gold-500/5 transition-all resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 hover:shadow-xl hover:shadow-gold-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? (
                      <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending...</>
                    ) : 'Submit Enquiry →'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer
function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/5 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <span className="text-navy-900 font-black text-lg font-display">P</span>
              </div>
              <div>
                <span className="font-bold text-white font-display">Plan B</span>
                <span className="block text-[10px] tracking-widest uppercase text-gold-500">Consultants</span>
              </div>
            </div>
            <p className="text-white/30 text-sm leading-relaxed">Expert admission guidance for top colleges across Karnataka, Tamil Nadu, Kerala & Andhra Pradesh.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <div className="space-y-2">
              {['About Us','Services','Partner Colleges','Testimonials','Contact'].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(' ','-')}`} className="block text-white/30 text-sm hover:text-gold-400 transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <div className="space-y-2">
              {['College Admissions','Application Support','Career Guidance','Entrance Exam Prep','Scholarship Help'].map(l => (
                <a key={l} href="#services" className="block text-white/30 text-sm hover:text-gold-400 transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <div className="space-y-2 text-white/30 text-sm">
              <div>📍 South India</div>
              <div>📞 +91 98765 43210</div>
              <div>✉️ info@planbconsultants.in</div>
              <div>🕐 Mon–Sat: 9AM–7PM</div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-sm">© 2026 Plan B Educational Consultants. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Privacy','Terms'].map(l => (
              <a key={l} href="#" className="text-white/20 text-sm hover:text-white/40 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <CollegePartners />
      <StatsBand />
      <Testimonials />
      <Process />
      <Contact />
      <Footer />
    </main>
  )
}
