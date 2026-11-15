import { useEffect, useMemo, useRef, useState } from 'react'
import { projects } from './projects.js'
import { BRAND, CONTACT, PROOF, DIVISIONS, SERVICES, RESULTS, INDUSTRIES, PROCESS, MODELS, FAQ, TECH } from './data.js'

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const hue = (s) => [...s].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) % 360
const spot = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px'); e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px') }
const mail = (subject, body = '') => `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}${body ? '&body=' + encodeURIComponent(body) : ''}`

function Logo({ src, name, size = 26 }) {
  const [bad, setBad] = useState(!src)
  if (bad) return <i className="mono" style={{ width: size, height: size, background: `hsl(${hue(name)},55%,38%)`, fontSize: size * 0.4 }} aria-hidden="true">{name.replace(/[^A-Za-z]/g, '').slice(0, 2)}</i>
  return <img className="lg" style={{ width: size, height: size }} src={src} alt="" loading="lazy" onError={() => setBad(true)} />
}

function Count({ n, s }) {
  const [v, setV] = useState(reduced() ? n : 0)
  const ref = useRef(null)
  useEffect(() => {
    if (reduced()) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect(); const t0 = performance.now()
      const f = (t) => { const p = Math.min(1, (t - t0) / 1200); setV(Math.round(n * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(f) }
      requestAnimationFrame(f)
    }, { threshold: 0.6 })
    io.observe(ref.current); return () => io.disconnect()
  }, [n])
  return <b ref={ref}>{v}{s}</b>
}

function Header({ theme, setTheme }) {
  const [open, setOpen] = useState(false)
  const nav = [['divisions', 'Divisions'], ['services', 'Services'], ['work', 'Work'], ['process', 'Process'], ['faq', 'FAQ']]
  return (
    <header className="hdr"><div className="w nav">
      <a className="brand" href="#top"><span className="lm">B</span>{BRAND.short}</a>
      <nav className={open ? 'open' : ''} aria-label="Primary">{nav.map(([id, l]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{l}</a>)}</nav>
      <div className="nr">
        <button className="ic" aria-label="Toggle light and dark theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☀' : '☾'}</button>
        <a className="btn sm" href="#contact">Start a project</a>
        <button className="ic burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
      </div>
    </div></header>
  )
}

function Hero() {
  const ref = useRef(null)
  const move = (e) => {
    if (reduced() || !ref.current) return
    const r = ref.current.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.setProperty('--rx', x * 14 + 'px'); ref.current.style.setProperty('--ry', y * 10 + 'px')
  }
  return (
    <div className="hero" id="top">
      <div className="rise">
        <p className="kick">{BRAND.group} · Software, AI, talent and training</p>
        <h1>Build the product. <span>Hire the people.</span> Grow the skills.</h1>
        <p className="lead">{BRAND.short} brings engineering, hiring and training under one roof. Our technology arm, {BRAND.tech}, builds web, mobile, cloud and AI products, led by a hands-on engineer with 9+ years of production experience.</p>
        <div className="cta"><a className="btn" href="#contact">Start a project</a><a className="btn o" href={CONTACT.calendly} target="_blank" rel="noopener noreferrer">Book a free 30-minute call</a></div>
        <ul className="pts"><li>NDA available</li><li>Reply within one business day</li><li>Direct access to your lead engineer</li></ul>
      </div>
      <div className="stack rise d2" ref={ref} onPointerMove={move} aria-hidden="true">
        <img className="s3" src="./projects/observability-sre.jpg" alt="" /><img className="s2" src="./projects/partner-directory.jpg" alt="" /><img className="s1" src="./projects/billing-automation.jpg" alt="" />
      </div>
    </div>
  )
}

function Divisions() {
  return (
    <section id="divisions"><h2>One group, four ways we help</h2><p className="sub">Pick the part you need, or combine them. A single conversation can cover your product, your team and their skills.</p>
      <div className="dv">{DIVISIONS.map((d) => (
        <article key={d.k} className={'spot dcard ' + d.k} onPointerMove={spot}>
          <span className="pill">{d.tag}</span><h3>{d.name}</h3><p>{d.d}</p>
          <a className="lnk" href={mail(`${d.name}: enquiry`, `Hi, I'd like to know more about ${d.name}.\n\nAbout me/my company:\n`)}>{d.go} →</a>
        </article>))}</div></section>
  )
}

function Services() {
  return (
    <section id="services"><h2>What {BRAND.tech} builds</h2><p className="sub">Seven services, each backed by shipped work. Problems we solve, and where we have done it before.</p>
      <div className="sv">{SERVICES.map((s) => (
        <article key={s.h} className="spot scard" onPointerMove={spot}><h3>{s.h}</h3><p>{s.d}</p>
          <ul>{s.f.map((x) => <li key={x}>{x}</li>)}</ul><div className="pf">Proof: {s.p}</div></article>))}</div></section>
  )
}

function Modal({ p, onClose }) {
  const ref = useRef(null)
  useEffect(() => { const d = ref.current; if (p && d && !d.open) d.showModal() }, [p])
  const cs = p?.cs, res = p ? RESULTS[p.id] : null
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => { if (e.target === ref.current) ref.current.close() }}>
      {p && (<><button className="x" aria-label="Close" onClick={() => ref.current.close()}>✕</button>
        <img src={'./' + p.i} alt={`${p.t} preview`} />
        <div className="mb"><div className="chips mt">{p.pl.map((x) => <span key={x}>{x}</span>)}{cs && <span>{cs.industry}</span>}</div>
          <h3>{p.t}</h3>
          <p>{cs ? cs.overview : p.d}</p>
          {cs && <><h4>The challenge</h4><p>{cs.challenge}</p><h4>What we built</h4><p>{cs.solution}</p>
            {cs.features?.length > 0 && <ul>{cs.features.map((f) => <li key={f}>{f}</li>)}</ul>}</>}
          {res && <><h4>Results</h4><ul className="rs">{res.map((r) => <li key={r}>{r}</li>)}</ul></>}
          <div className="chips mt">{p.g.map((x) => <span key={x}>{x}</span>)}</div>
          <div className="cta"><a className="btn" href={mail(`Project like ${p.t}`, `Hi, I saw your work on ${p.t} and have a similar project.\n\n`)}>Discuss a similar project</a>
            {p.l && <a className="btn o" href={p.l} target="_blank" rel="noopener noreferrer">Visit live</a>}</div></div></>)}
    </dialog>
  )
}

function Work() {
  const [cat, setCat] = useState('All'); const [sel, setSel] = useState(null)
  const isAI = (p) => p.g.some((x) => /OpenAI|RAG|LLM|Vector|pgvector|Qdrant/i.test(x)) || /OpenAI|RAG pipelines|LLM/.test(p.d)
  const list = useMemo(() => projects.filter((p) => cat === 'All' || (cat === 'AI' ? isAI(p) : p.pl.includes(cat))).sort((a, b) => (b.cs ? 1 : 0) + (b.f ? 1 : 0) - (a.cs ? 1 : 0) - (a.f ? 1 : 0)), [cat])
  return (
    <section id="work"><h2>Work we have shipped</h2><p className="sub">Real products across {INDUSTRIES.length} industries. Open any project for the story behind it.</p>
      <div className="tools">{[['All', 'All work'], ['Web', 'Web'], ['Mobile', 'Mobile'], ['AI', 'AI-powered']].map(([k, l]) => <button key={k} className="f" aria-pressed={cat === k} onClick={() => setCat(k)}>{l}</button>)}<span className="pc" aria-live="polite">{list.length} projects</span></div>
      <div className="grid">{list.map((p) => (
        <button key={p.id} className="spot card" onPointerMove={spot} onClick={() => setSel(p)}>
          <div className="im"><img loading="lazy" src={'./' + p.i} alt={`${p.t} preview`} /><span className="k">{p.pl.join(' · ')}</span>{p.cs && <span className="k g">Case study</span>}</div>
          <div className="bd"><h3>{p.t}</h3><p>{p.d}</p>{RESULTS[p.id] && <div className="res">{RESULTS[p.id][0]}</div>}</div></button>))}</div>
      <div className="ind">{INDUSTRIES.map((i) => <span key={i}>{i}</span>)}</div>
      <Modal p={sel} onClose={() => setSel(null)} />
    </section>
  )
}

function Process() {
  return (
    <section id="process"><h2>How a project runs</h2><p className="sub">A simple, transparent process, so you always know what is happening and what comes next.</p>
      <ol className="pr">{PROCESS.map(([h, d], i) => <li key={h}><b>{i + 1}</b><div><h3>{h}</h3><p>{d}</p></div></li>)}</ol>
      <h3 className="sh">Ways to work with us</h3>
      <div className="ab">{MODELS.map(([h, d]) => <div key={h}><h3>{h}</h3><p>{d}</p></div>)}</div></section>
  )
}

function Tech() {
  const all = [...new Map(Object.values(TECH).flat().filter((x) => x.i).map((x) => [x.n, x])).values()]
  return (
    <section id="stack"><h2>Technologies we work with</h2><p className="sub">Chosen for reliability in production rather than novelty.</p>
      <div className="mq" aria-hidden="true"><div className="mt2">{[...all, ...all].map((x, i) => <span key={i}><Logo src={x.i} name={x.n} size={34} /></span>)}</div></div>
      <div className="sk">{Object.entries(TECH).map(([k, v]) => <div key={k}><h3>{k}</h3><div className="bg">{v.map((x) => <span key={x.n}><Logo src={x.i} name={x.n} size={22} />{x.n}</span>)}</div></div>)}</div></section>
  )
}

function Founder() {
  return (
    <section id="about"><div className="fd">
      <img src="./office.jpg" alt="Manju Reddy, founder and lead engineer" loading="lazy" />
      <div><h2>Led by an engineer who still builds</h2>
        <p className="sub nm">Manju Reddy leads {BRAND.group}. With 9+ years across web, mobile, cloud and AI, Manju has shipped products for 100K+ users, architected a backend for 20K+ concurrent users, and mentored engineers on enterprise teams. You work directly with the person making the technical decisions.</p>
        <div className="cta"><a className="btn o" href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a><a className="btn o" href={CONTACT.github} target="_blank" rel="noopener noreferrer">GitHub</a></div></div>
    </div></section>
  )
}

function Faq() {
  return <section id="faq"><h2>Questions we hear often</h2><div className="faq">{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
}

function Contact() {
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget))
    const body = `Name: ${f.name}\nEmail: ${f.email}\nCompany: ${f.company || '-'}\nInterested in: ${f.type}\nBudget: ${f.budget || 'Not sure yet'}\n\n${f.message}`
    window.location.href = mail(`${f.type}: enquiry from ${f.name}`, body); setSent(true)
  }
  return (
    <section id="contact"><div className="ct">
      <div><h2>Tell us what you need</h2><p className="sub">Share a few details and we will reply within one business day. Prefer to talk? Book a free call.</p>
        <ul className="cl"><li><a href={CONTACT.calendly} target="_blank" rel="noopener noreferrer">Book a free 30-minute call</a></li><li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li><li><a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">Message on WhatsApp</a></li><li><a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneLabel}</a></li></ul></div>
      <form onSubmit={submit}>
        <div className="r2"><label>Your name<input name="name" required autoComplete="name" /></label><label>Email<input name="email" type="email" required autoComplete="email" /></label></div>
        <div className="r2"><label>Company<input name="company" autoComplete="organization" /></label>
          <label>I’m interested in<select name="type" required defaultValue=""><option value="" disabled>Select one</option><option>Web application</option><option>Mobile application</option><option>AI or LLM solution</option><option>Enterprise software</option><option>Cloud and DevOps</option><option>Technical consulting</option><option>Hiring talent</option><option>Technical training</option><option>Something else</option></select></label></div>
        <label>Budget range (optional)<select name="budget" defaultValue=""><option value="">Not sure yet</option><option>Under $5k</option><option>$5k to $15k</option><option>$15k to $50k</option><option>$50k+</option></select></label>
        <label>Project details<textarea name="message" rows="5" required placeholder="What are you building, and what does success look like?" /></label>
        <button className="btn" type="submit">Send enquiry</button>
        <p className="note" role="status">{sent ? `Your email app should open with the message ready to send. If it did not, write to ${CONTACT.email}.` : 'This opens your email app with your details filled in, so your message goes straight to our inbox.'}</p>
      </form></div></section>
  )
}

export default function App() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('bsm-theme') } catch { return null } })
  const cur = theme || 'dark'
  useEffect(() => { document.documentElement.dataset.theme = cur; try { if (theme) localStorage.setItem('bsm-theme', theme) } catch { /* ignore */ } }, [cur, theme])
  return (
    <>
      <Header theme={cur} setTheme={setTheme} />
      <main className="w">
        <Hero />
        <div className="stats">{PROOF.map((s) => <div key={s.l}><Count n={s.n} s={s.s} /><span>{s.l}</span></div>)}</div>
        <Divisions /><Services /><Work /><Process /><Tech /><Founder /><Faq /><Contact />
      </main>
      <footer className="w ft"><div><b>{BRAND.group}</b><p>{DIVISIONS.map((d) => d.name).slice(0, 4).join(' · ')}</p></div><div className="fr"><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneLabel}</a><span>© {new Date().getFullYear()} {BRAND.group}</span></div></footer>
    </>
  )
}
