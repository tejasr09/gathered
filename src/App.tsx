import { FormEvent, ReactNode, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, CircleHelp, Compass, Filter, Heart, MapPin, Menu, Plus, Search, SlidersHorizontal, Sparkles, Users, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { categories, initialEvents, initialRegistrations, readStored, serviceItems, venueItems, type EventItem, type Registration } from './data'

gsap.registerPlugin(ScrollTrigger)
const PlanningCase = lazy(() => import('./PlanningCase'))

type Screen = 'home' | 'auth' | 'event' | 'registration' | 'service' | 'venue' | 'dashboard' | 'editor' | 'participants'
type Destination = { screen: Screen; id?: string }
type Profile = { name: string; email: string; organizer: boolean }

const photo = (id: string, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`
const prettyDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function Header({ screen, setScreen, openAuth, openDestination, signedIn, isOrganizer }: { screen: Screen; setScreen: (screen: Screen) => void; openAuth: (to?: Destination) => void; openDestination: (to: Destination) => void; signedIn: boolean; isOrganizer: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const go = (id: string) => {
    setMenuOpen(false)
    if (screen !== 'home') setScreen('home')
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 40)
  }
  const account = () => {
    setMenuOpen(false)
    if (signedIn && isOrganizer) setScreen('dashboard')
    else openAuth()
  }

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" onClick={(event) => { event.preventDefault(); setScreen('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} aria-label="Gathered home">
        <span className="wordmark-symbol">g.</span><span>gathered<span className="wordmark-dot">.</span></span>
      </a>
      <button className="mobile-menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav className={menuOpen ? 'main-nav nav-open' : 'main-nav'} aria-label="Main navigation">
        <a href="#about" onClick={(e) => { e.preventDefault(); go('about') }}>About</a>
        <a href="#services" onClick={(e) => { e.preventDefault(); go('services') }}>Services</a>
        <a href="#nearby" onClick={(e) => { e.preventDefault(); go('nearby') }}>Events near you</a>
        <a href="#venues" onClick={(e) => { e.preventDefault(); go('venues') }}>Venues</a>
        <a href="#event-list" onClick={(e) => { e.preventDefault(); go('event-list') }}>Event list</a>
        <button className="nav-create" onClick={() => { setMenuOpen(false); openDestination({ screen: 'editor' }) }}>Create an event <ArrowUpRight size={14} /></button>
        <button className="nav-login" onClick={account}>{signedIn ? (isOrganizer ? 'My dashboard' : 'My account') : 'Log in / Sign up'} <ArrowRight size={14} /></button>
      </nav>
    </header>
  )
}

function HeroCaseScene() {
  const anchor = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const handleReady = useCallback(() => setReady(true), [])
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const target = anchor.current
    if (!target || !('IntersectionObserver' in window)) { setShouldLoad(true); return }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setShouldLoad(true); observer.disconnect() } }, { rootMargin: '220px' })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])
  return <div ref={anchor} className={`case-load-anchor ${ready ? 'case-ready' : ''}`}>
    {!ready && <div className="case-fallback" aria-hidden="true"><span className="fallback-lid" /><span className="fallback-band" /><span className="fallback-card fallback-card-one" /><span className="fallback-card fallback-card-two" /><span className="fallback-lock" /><span className="fallback-shadow" /></div>}
    {shouldLoad && !reducedMotion && <Suspense fallback={null}><PlanningCase onReady={handleReady} /></Suspense>}
  </div>
}

function SectionHead({ eyebrow, title, copy, action, onAction }: { eyebrow: string; title: ReactNode; copy?: string; action?: string; onAction?: () => void }) {
  return <div className="section-head"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p className="section-copy">{copy}</p>}</div>{action && <button className="text-link" onClick={onAction}>{action}<ArrowRight size={15} /></button>}</div>
}

function EventCard({ event, onOpen, compact = false }: { event: EventItem; onOpen: () => void; compact?: boolean }) {
  return (
    <article className={compact ? 'event-card compact' : 'event-card'}>
      <button className="event-photo" onClick={onOpen} aria-label={`Explore details for ${event.name}`} style={{ backgroundImage: `url(${photo(event.image, 750)})` }}>
        <span className="event-category-pill">{event.category}</span><span className="event-image-arrow"><ArrowUpRight size={18} /></span>
      </button>
      <div className="event-card-body">
        <div className="event-date-line"><CalendarDays size={14} /> {prettyDate(event.date)} <span>·</span> {event.time}</div>
        <button className="event-title" onClick={onOpen}>{event.name}</button>
        <p className="event-venue-line"><MapPin size={14} /> {event.venue} <span>· {event.city.split(',')[0]}</span></p>
        <div className="event-card-bottom"><span className={`status-dot status-${event.status.toLowerCase().replace(' ', '-')}`}>{event.status}</span><span className="event-price">{event.price}</span></div>
      </div>
    </article>
  )
}

function VenueCard({ item, onOpen, index }: { item: typeof venueItems[number]; onOpen: () => void; index: number }) {
  return <article className={`venue-card venue-card-${index}`}>
    <button className="venue-photo" onClick={onOpen} style={{ backgroundImage: `url(${photo(item.image, 850)})` }} aria-label={`Explore ${item.title}`}><span className="venue-rating">★ {item.rating}</span><span className="event-image-arrow"><ArrowUpRight size={18} /></span></button>
    <div className="venue-card-copy"><div><span className="eyebrow">{item.style}</span><h3>{item.title}</h3><p><MapPin size={13} /> {item.location}</p></div><span className="capacity">{item.capacity}</span></div>
  </article>
}

function Home({ events, chosenCategory, setChosenCategory, openDestination, setScreen, setSelectedEvent, query, setQuery, location, setLocation, locate, locationNote }: {
  events: EventItem[]; chosenCategory: string; setChosenCategory: (category: string) => void; openDestination: (to: Destination) => void; setScreen: (screen: Screen) => void; setSelectedEvent: (eventId: string) => void; query: string; setQuery: (query: string) => void; location: string; setLocation: (location: string) => void; locate: () => void; locationNote: string;
}) {
  const visibleEvents = useMemo(() => events.filter((item) => (chosenCategory === 'All events' || item.category === chosenCategory) && `${item.name} ${item.category} ${item.venue} ${item.city}`.toLowerCase().includes(query.toLowerCase())), [events, chosenCategory, query])
  const nearbyEvents = visibleEvents.filter((event) => `${event.city} ${event.venue}`.toLowerCase().includes(location.toLowerCase())).slice(0, 3)
  const categoriesToShow = categories
  const openEvent = (id: string) => { setSelectedEvent(id); openDestination({ screen: 'event', id }) }
  const openService = (id: string) => openDestination({ screen: 'service', id })
  const openVenue = (id: string) => openDestination({ screen: 'venue', id })

  return <main className={`home-page theme-${chosenCategory.toLowerCase().replaceAll(' ', '-')}`}>
    <section className="hero-section scroll-tone" id="home" data-tone="linen">
      <div className="hero-grain" />
      <div className="hero-kicker"><span className="kicker-line" /> GOOD THINGS HAPPEN TOGETHER <span className="kicker-line" /></div>
      <div className="hero-title-wrap"><p className="hero-overline">YOUR PEOPLE. YOUR PLACE. YOUR PLAN.</p><h1>Gather well.<br /><em>Live fully.</em></h1><p className="hero-intro">From the first “what if?” to the last song, bring every part of a good gathering together.</p></div>
      <div className="hero-stage">
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <div className="hero-center-wash" />
        <HeroCaseScene />
        <div className="hero-note note-tl"><span className="note-number">01 / FIND</span><h3>Discover a<br />reason to gather.</h3><p>Good things happening near you, and ideas for your own day.</p></div>
        <div className="hero-note note-tr"><span className="note-number">02 / PLACE</span><h3>Find a place<br />that feels right.</h3><p>Explore thoughtful spaces, from garden dinners to big days.</p></div>
        <div className="hero-note note-bl"><span className="note-number">03 / MAKE</span><h3>Meet your<br />kind of people.</h3><p>Find the local makers and services who bring it all to life.</p></div>
        <div className="hero-note note-br"><span className="note-number">04 / BRING</span><h3>Keep the details<br />in good hands.</h3><p>Invites, registrations and every little detail, together.</p></div>
        <span className="hero-stamp">A LITTLE LESS PLANNING<br />A LOT MORE LIVING</span>
      </div>
      <div className="hero-actions"><button className="button button-dark" onClick={() => document.getElementById('event-list')?.scrollIntoView({ behavior: 'smooth' })}>Find your next gathering <ArrowDownRight size={16} /></button><button className="button button-outline" onClick={() => openDestination({ screen: 'editor' })}>I’m planning an event <ArrowUpRight size={16} /></button></div>
      <button className="scroll-cue" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /></button>
    </section>

    <section className="intro-section scroll-tone" id="about" data-tone="ink">
      <div className="intro-aside"><span className="eyebrow">A PLACE TO BEGIN</span><span className="intro-mark">✳</span><span className="mono-small">PLANS ARE BETTER<br />WHEN THEY'RE SHARED.</span></div>
      <div className="intro-main"><p className="eyebrow">MEET GATHERED</p><h2>For the days that<br />become <em>the stories.</em></h2><p className="intro-paragraph">A birthday, a new beginning, a Tuesday that deserves a toast. Find inspiring events, lovely places and local people who make getting together feel easy.</p><div className="intro-benefits"><div><span>01</span><p>Find a gathering<br />or start your own.</p></div><div><span>02</span><p>Make a plan<br />that feels like you.</p></div><div><span>03</span><p>Be there for<br />the good bit.</p></div></div><button className="text-link light-link" onClick={() => document.getElementById('event-list')?.scrollIntoView({ behavior: 'smooth' })}>See what’s happening <ArrowRight size={15} /></button></div>
      <div className="intro-photo" style={{ backgroundImage: `url(${photo('photo-1511988617509-a57c8a288659', 1200)})` }}><span className="photo-caption">The best plans leave room for a little more.</span></div>
      <div className="intro-scribble" aria-hidden="true">made<br />for<br /><em>together</em></div>
    </section>

    <section className="category-section scroll-tone" id="event-types" data-tone="color">
      <div className="category-top"><div><p className="eyebrow">START WITH A FEELING</p><h2>Every reason<br />is a <em>good one.</em></h2></div><p className="category-explainer">A small dinner, the biggest day, or a “just because” kind of weekend. Pick a starting point and make it your own.</p><div className="category-doodle" aria-hidden="true">✳</div></div>
      <div className="category-grid">{categoriesToShow.map((category, index) => <button key={category.name} className={`category-tile tint-${category.tint} ${chosenCategory === category.name ? 'category-selected' : ''}`} onClick={() => { setChosenCategory(chosenCategory === category.name ? 'All events' : category.name); document.getElementById('event-list')?.scrollIntoView({ behavior: 'smooth' }) }}><span className="category-photo" style={{ backgroundImage: `url(${photo(category.image, 550)})` }} aria-hidden="true" /><span className="category-icon">{category.icon}</span><span className="category-index">{String(index + 1).padStart(2, '0')}</span><h3>{category.name}</h3><p>{category.note}</p><span className="category-arrow"><ArrowUpRight size={16} /></span></button>)}</div>
      <div className="category-footnote"><span>DON'T SEE YOUR REASON?</span><button onClick={() => setChosenCategory('All events')}>There’s room for every kind of gathering <ArrowRight size={14} /></button></div>
    </section>

    <section className="services-section scroll-tone" id="services" data-tone="paper">
      <SectionHead eyebrow="THE RIGHT PEOPLE MAKE IT" title={<>A little help with<br /><em>the good stuff.</em></>} copy="Browse the people and services that take an idea from “maybe” to “remember when…”." action="Explore services" onAction={() => openService('Food & drink')} />
      <div className="services-grid">{serviceItems.map((item, index) => <button className="service-tile" key={item.title} onClick={() => openService(item.title)}><span className="service-number">0{index + 1}</span><span className="service-icon">{item.icon}</span><h3>{item.title}</h3><p>{item.detail}</p><span className="service-arrow"><ArrowUpRight size={16} /></span></button>)}</div>
      <div className="service-bottom"><span className="service-bottom-icon"><Sparkles size={16} /></span><p>Local talent. Thoughtful details. A plan that feels like yours.</p><button className="button button-dark" onClick={() => openService('All services')}>See all services <ArrowRight size={15} /></button></div>
    </section>

    <section className="nearby-section scroll-tone" id="nearby" data-tone="sage">
      <div className="nearby-heading"><div><p className="eyebrow">YOUR NEIGHBOURHOOD, A LITTLE LIVELIER</p><h2>Good things,<br /><em>close by.</em></h2><p className="nearby-copy">A hand-picked preview of what’s happening around Bengaluru. Tell us a neighbourhood or find your location.</p></div><div className="nearby-compass"><Compass size={60} strokeWidth={1} /><span>12.9° N</span></div></div>
      <div className="location-search"><label htmlFor="location-input"><MapPin size={17} /><span className="sr-only">Search a city or neighbourhood</span><input id="location-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or neighbourhood" /></label><button className="button button-dark" onClick={locate}>Use my location <Compass size={14} /></button><span className="location-note" aria-live="polite">{locationNote}</span></div>
      <div className="nearby-events">{nearbyEvents.length ? nearbyEvents.map((event) => <EventCard key={event.id} event={event} onOpen={() => openEvent(event.id)} compact />) : <div className="nearby-empty"><MapPin size={18} /><p>No previews found for “{location}”. Try Bengaluru or a neighbourhood name.</p></div>}</div>
      <button className="text-link nearby-more" onClick={() => document.getElementById('event-list')?.scrollIntoView({ behavior: 'smooth' })}>See all nearby events <ArrowRight size={15} /></button>
    </section>

    <section className="venues-section scroll-tone" id="venues" data-tone="rose">
      <SectionHead eyebrow="A SETTING THAT SAYS IT ALL" title={<>Find your place<br />in the <em>picture.</em></>} copy="From a courtyard for twenty to a room made for a dance floor. Start with a space and see what takes shape." action="See venue options" onAction={() => openVenue(venueItems[0].title)} />
      <div className="venues-grid">{venueItems.map((item, index) => <VenueCard key={item.title} item={item} index={index} onOpen={() => openVenue(item.title)} />)}</div>
      <div className="venue-foot"><span>SPACES WITH A LITTLE SOMETHING</span><span className="venue-foot-line" /><button onClick={() => openVenue('All venues')}>Browse all places <ArrowUpRight size={15} /></button></div>
    </section>

    <section className="event-list-section scroll-tone" id="event-list" data-tone="ink">
      <div className="event-list-intro"><div><p className="eyebrow">PUT A DATE ON IT</p><h2>On the <em>calendar.</em></h2><p>Good plans are happening. Find one that feels like your kind of day.</p></div><div className="event-list-count"><strong>{visibleEvents.length.toString().padStart(2, '0')}</strong><span>GATHERINGS<br />TO EXPLORE</span></div></div>
      <div className="event-tools"><label className="event-search"><Search size={16} /><span className="sr-only">Search events</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try ‘birthday’, a place, or a date" /></label><label className="category-select-wrap"><Filter size={14} /><span className="sr-only">Filter by event type</span><select value={chosenCategory} onChange={(e) => setChosenCategory(e.target.value)}><option>All events</option>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select><ChevronDown size={14} /></label><button className="clear-filters" onClick={() => { setChosenCategory('All events'); setQuery('') }}>Clear filters</button></div>
      <div className="event-list-grid">{visibleEvents.slice(0, 3).map((event) => <EventCard key={event.id} event={event} onOpen={() => openEvent(event.id)} />)}</div>
      {visibleEvents.length === 0 && <div className="no-results"><Search size={20} /><h3>No gatherings found just yet.</h3><p>Try another word or clear the filters.</p><button className="text-link" onClick={() => { setChosenCategory('All events'); setQuery('') }}>Clear search <ArrowRight size={15} /></button></div>}
      <div className="event-list-bottom"><span>THE LIST CHANGES AS THE CITY DOES.</span><button className="button button-light" onClick={() => setScreen('home')}>Keep exploring <ArrowUpRight size={15} /></button></div>
    </section>

    <section className="organizer-section scroll-tone" id="organize" data-tone="peach">
      <div className="organizer-art"><div className="organizer-paper paper-one"><span>the little things</span><span className="paper-line" /><span>food ✓ &nbsp; music ✓</span></div><div className="organizer-paper paper-two"><span>good people</span><span className="paper-hearts">♡ &nbsp; ✳ &nbsp; ♡</span><span className="paper-line" /></div><span className="organizer-flower">✽</span></div>
      <div className="organizer-copy"><p className="eyebrow">FOR THE ONE MAKING IT HAPPEN</p><h2>Less list-making.<br /><em>More looking forward.</em></h2><p>Bring your event, your guests and all the moving pieces into one calm place. Create an event in minutes, then keep an eye on the bits that matter.</p><div className="organizer-points"><span><Check size={15} /> One clear home for every detail</span><span><Check size={15} /> A live list of who’s coming</span><span><Check size={15} /> Your plan, easy to change</span></div><button className="button button-dark" onClick={() => openDestination({ screen: 'editor' })}>Create an event <ArrowUpRight size={15} /></button><span className="organizer-subnote">Your first event starts with a name and a date.</span></div>
    </section>

    <section className="closing-section scroll-tone" data-tone="paper"><div className="closing-star">✳</div><p className="eyebrow">THERE'S ALWAYS A REASON</p><h2>Make room<br />for <em>together.</em></h2><button className="button button-dark" onClick={() => document.getElementById('event-list')?.scrollIntoView({ behavior: 'smooth' })}>Find something to celebrate <ArrowUpRight size={15} /></button><span className="closing-note">BE THERE FOR THE GOOD BIT.</span></section>
    <Footer />
  </main>
}

function Footer() {
  return <footer className="site-footer"><a className="wordmark footer-wordmark" href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><span className="wordmark-symbol">g.</span><span>gathered<span className="wordmark-dot">.</span></span></a><p>Find your people. Make a little magic.</p><div className="footer-links"><a href="#about">About</a><a href="#services">Services</a><a href="#venues">Venues</a><a href="#event-list">Events</a></div><span className="footer-copyright">© GATHERED 2026 · MADE FOR THE MOMENTS</span></footer>
}

function AuthScreen({ destination, onBack, onComplete }: { destination: Destination | null; onBack: () => void; onComplete: (profile: Profile) => void }) {
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [organizer, setOrganizer] = useState(destination?.screen === 'editor' || destination?.screen === 'dashboard' || destination?.screen === 'participants')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!email.includes('@') || password.length < 6 || (mode === 'signup' && name.trim().length < 2)) { setError(mode === 'signup' ? 'Add your name, a valid email and a password of at least 6 characters.' : 'Enter a valid email and a password of at least 6 characters.'); return }
    onComplete({ name: name.trim() || email.split('@')[0], email, organizer })
  }
  return <main className="auth-page">
    <div className="auth-visual"><button className="auth-back" onClick={onBack}><ArrowLeft size={16} /> Back to exploring</button><a className="wordmark auth-wordmark" href="#home" onClick={(e) => { e.preventDefault(); onBack() }}><span className="wordmark-symbol">g.</span><span>gathered<span className="wordmark-dot">.</span></span></a><div className="auth-visual-copy"><span className="eyebrow">A GOOD THING STARTS HERE</span><h1>Come on in.<br /><em>It’s better together.</em></h1><p>Your next good day is a few details away.</p></div><div className="auth-collage"><div className="auth-collage-photo" style={{ backgroundImage: `url(${photo('photo-1511988617509-a57c8a288659', 850)})` }} /><span>GOOD PEOPLE<br />GOOD PLANS</span><i>✳</i></div><span className="auth-visual-footer">GATHER THE GOOD STUFF.</span></div>
    <div className="auth-form-side"><div className="auth-form-box"><div className="auth-mobile-brand"><span className="wordmark-symbol">g.</span> gathered.</div><p className="eyebrow">{mode === 'signup' ? 'A LITTLE SPACE FOR BIG DAYS' : 'GOOD TO SEE YOU AGAIN'}</p><h2>{mode === 'signup' ? 'Let’s make it a date.' : 'Welcome back.'}</h2><p className="auth-description">{destination?.screen === 'event' ? 'Create a free profile to see all the details for this gathering.' : destination?.screen === 'registration' ? 'One quick step, then you can save your place.' : destination?.screen === 'editor' ? 'Create an organizer profile to start planning your event.' : 'Save the things you love and keep every good plan close.'}</p>
      <div className="auth-switch"><button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError('') }}>Sign up</button><button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError('') }}>Log in</button></div>
      <form className="auth-form" onSubmit={submit}>{mode === 'signup' && <label>Your name<input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="How should we call you?" required minLength={2} /></label>}<label>Email address<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></label><label>Password<input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} required /></label>
        <label className="organizer-toggle"><input type="checkbox" checked={organizer} onChange={(e) => setOrganizer(e.target.checked)} /><span className="toggle-ui" /><span><strong>I’m here to organize</strong><small>Open the event tools after signing in.</small></span></label>
        {error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark auth-submit" type="submit">{mode === 'signup' ? 'Create my account' : 'Log in'} <ArrowRight size={16} /></button>
      </form><p className="auth-terms">By continuing, you agree to keep it kind and keep people’s details private.</p><p className="demo-note"><CircleHelp size={14} /> Demo flow: profiles are saved only in this browser session.</p></div></div>
  </main>
}

function EventDetails({ event, registrations, onBack, onRegister }: { event: EventItem; registrations: Registration[]; onBack: () => void; onRegister: () => void }) {
  const attending = registrations.filter((item) => item.eventId === event.id && item.status === 'Confirmed').length
  const [saved, setSaved] = useState(false)
  const placesLeft = Math.max(0, event.capacity - attending)
  const full = event.status === 'Full' || placesLeft === 0
  return <main className="detail-page"><div className="detail-toolbar"><button className="back-link" onClick={onBack}><ArrowLeft size={15} /> Back to all gatherings</button><button className="icon-button" aria-label={saved ? 'Remove saved event' : 'Save event'} aria-pressed={saved} onClick={() => setSaved(!saved)}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button></div><div className="detail-hero"><img src={photo(event.image, 1600)} alt="" /><div className="detail-image-caption"><span>{event.category}</span><span>GATHERED PICK · {event.city.toUpperCase()}</span></div></div><div className="detail-content"><div className="detail-main"><p className="eyebrow">A GOOD DAY OUT IS CALLING</p><h1>{event.name}</h1><p className="detail-description">{event.description}</p><div className="detail-info-grid"><div><CalendarDays size={18} /><span>WHEN</span><strong>{prettyDate(event.date)}</strong><small>{event.time}</small></div><div><MapPin size={18} /><span>WHERE</span><strong>{event.venue}</strong><small>{event.city}</small></div><div><Users size={18} /><span>ROOM FOR</span><strong>{event.capacity} people</strong><small>{placesLeft} places left</small></div><div><Sparkles size={18} /><span>GOOD TO KNOW</span><strong>{full ? 'Full' : event.status}</strong><small>Hosted by {event.organizer}</small></div></div><div className="detail-about"><h2>A little more about it</h2><p>{event.description} Expect a warm welcome, thoughtful details and a little space to make the day your own. Come as you are; everything else is taken care of.</p></div></div><aside className="register-card"><span className="eyebrow">SAVE YOUR PLACE</span><h3>{event.price}</h3><p>One quick registration and this date is yours.</p><button className="button button-dark" onClick={onRegister} disabled={full}>{full ? 'This event is full' : 'Register for this event'}{!full && <ArrowRight size={15} />}</button><div className="register-seats"><span className="seat-progress"><i style={{ width: `${Math.min(attending / event.capacity * 100, 100)}%` }} /></span><span>{attending} of {event.capacity} places filled</span></div><small><Check size={13} /> Clear details before you commit.</small></aside></div><div className="detail-host"><div className="host-avatar">{event.organizer.slice(0, 1)}</div><div><span className="eyebrow">YOUR HOST</span><strong>{event.organizer}</strong><p>Making room for a good day.</p></div><button className="text-link" onClick={onRegister} disabled={full}>Ask about this event <ArrowRight size={14} /></button></div></main>
}

function RegistrationForm({ event, onBack, onSubmit }: { event: EventItem; onBack: () => void; onSubmit: (registration: Omit<Registration, 'id' | 'registrationDate' | 'status'>) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const submit = (e: FormEvent) => { e.preventDefault(); if (!name.trim() || !email.includes('@') || phone.trim().length < 7) { setError('Please complete all three fields with a valid email and phone number.'); return }; onSubmit({ eventId: event.id, name: name.trim(), email, phone }); setDone(true) }
  return <main className="registration-page"><button className="back-link" onClick={onBack}><ArrowLeft size={15} /> Back to event details</button><div className="registration-layout"><div className="registration-intro"><p className="eyebrow">ONE SMALL STEP TO A GOOD DAY</p><h1>Save your<br /><em>place.</em></h1><p>We’ll send the useful details to your inbox. Your information stays with the event host.</p><div className="registration-event-card"><img src={photo(event.image, 500)} alt="" /><div><span>{event.category}</span><strong>{event.name}</strong><small><CalendarDays size={13} /> {prettyDate(event.date)} · {event.time}</small><small><MapPin size={13} /> {event.venue}, {event.city}</small></div></div><div className="registration-note"><span>✳</span><p>A kind note: only share details you’re happy for the host to use for this event.</p></div></div><div className="registration-form-card">{done ? <div className="registration-success"><span className="success-icon"><Check size={24} /></span><p className="eyebrow">YOU’RE ON THE LIST</p><h2>It’s a date.</h2><p>Your place at <strong>{event.name}</strong> is confirmed. We’ve saved your registration in this demo.</p><button className="button button-dark" onClick={onBack}>Back to the event <ArrowRight size={15} /></button></div> : <><p className="eyebrow">YOUR DETAILS</p><h2>Who’s coming?</h2><p className="form-intro">All fields are required so your host can get in touch if plans change.</p><form onSubmit={submit} className="stack-form"><label>Full name<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" required /></label><label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" required /></label><label>Phone number<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="+91 98765 43210" required /></label>{error && <p role="alert" className="form-error">{error}</p>}<button className="button button-dark" type="submit">Register for this event <ArrowRight size={15} /></button><small className="form-privacy">By registering, you’ll appear on this event’s participant list.</small></form></>}</div></div></main>
}

function ContentDetail({ type, name, onBack, onExplore, onSelectOption }: { type: 'service' | 'venue'; name: string; onBack: () => void; onExplore: () => void; onSelectOption: (name: string) => void }) {
  const isService = type === 'service'
  const service = serviceItems.find((item) => item.title === name) || serviceItems[0]
  const venue = venueItems.find((item) => item.title === name) || venueItems[0]
  const options = isService ? serviceItems.map((item) => ({ name: item.title, detail: item.detail })) : venueItems.map((item) => ({ name: item.title, detail: `${item.style} · ${item.location} · ${item.capacity}` }))
  return <main className="content-detail-page"><button className="back-link" onClick={onBack}><ArrowLeft size={15} /> Back to exploring</button><div className="content-detail-grid"><div className={`content-detail-image ${isService ? 'service-detail-image' : ''}`} style={{ backgroundImage: `url(${photo(isService ? 'photo-1511795409834-ef04bbd61622' : venue.image, 1400)})` }}><span>{isService ? service.type : venue.style}</span></div><div className="content-detail-copy"><p className="eyebrow">{isService ? 'THE PEOPLE BEHIND THE MOMENTS' : 'A PLACE TO MAKE A MEMORY'}</p><h1>{isService ? name : venue.title}</h1><p>{isService ? service.detail : `${venue.style} with space for ${venue.capacity.toLowerCase()}. Find a setting that makes your gathering feel like itself.`} Gathered helps you discover thoughtful local options, compare what fits and reach out when you’re ready.</p><div className="content-detail-facts"><span><MapPin size={16} /> {isService ? 'Available around Bengaluru' : venue.location}</span><span><Users size={16} /> {isService ? 'Local, independent partners' : venue.capacity}</span><span><Check size={16} /> Curated for good gatherings</span></div><button className="button button-dark" onClick={onExplore}>{isService ? 'See service options' : 'See venue options'} <ArrowRight size={15} /></button><small className="protected-note">Your profile keeps your shortlist and enquiries in one place.</small></div></div><section className="detail-options"><p className="eyebrow">A FEW GOOD OPTIONS</p><h2>{isService ? 'Find your people.' : 'Find your place.'}</h2><div>{options.map((option) => <button key={option.name} onClick={() => onSelectOption(option.name)}><strong>{option.name}</strong><span>{option.detail}</span><ArrowUpRight size={15} /></button>)}</div></section></main>
}

function Dashboard({ events, registrations, profile, onCreate, onEdit, onParticipants, onOpenEvent }: { events: EventItem[]; registrations: Registration[]; profile: Profile | null; onCreate: () => void; onEdit: (id: string) => void; onParticipants: (id: string) => void; onOpenEvent: (id: string) => void }) {
  const mine = events.filter((event) => event.organizer === profile?.name || event.organizer === 'You')
  const myRegs = registrations.filter((item) => mine.some((event) => event.id === item.eventId))
  const confirmed = myRegs.filter((item) => item.status === 'Confirmed').length
  return <main className="dashboard-page"><div className="dashboard-topline"><div><p className="eyebrow">YOUR GATHERED DESK</p><h1>A little overview,<br /><em>a lot to look forward to.</em></h1></div><button className="button button-dark" onClick={onCreate}><Plus size={16} /> Create an event</button></div><div className="dashboard-welcome"><div className="dashboard-avatar">{profile?.name.slice(0, 1).toUpperCase() || 'G'}</div><div><span className="eyebrow">HELLO, {profile?.name.toUpperCase() || 'ORGANIZER'}</span><p>Here’s what’s happening with your events.</p></div><button className="dashboard-help"><CircleHelp size={15} /> Need a hand?</button></div><div className="dashboard-metrics"><div><span>YOUR EVENTS</span><strong>{mine.length.toString().padStart(2, '0')}</strong><small>across all statuses</small></div><div><span>CONFIRMED GUESTS</span><strong>{confirmed.toString().padStart(2, '0')}</strong><small>looking forward to it</small></div><div><span>UPCOMING</span><strong>{mine.filter((event) => new Date(event.date) >= new Date()).length.toString().padStart(2, '0')}</strong><small>gatherings on the way</small></div></div><div className="dashboard-events-head"><div><p className="eyebrow">YOUR EVENT LIST</p><h2>All the good things.</h2></div><button className="text-link" onClick={onCreate}>Add an event <Plus size={14} /></button></div>{mine.length ? <div className="dashboard-table-wrap"><table className="dashboard-table"><thead><tr><th>EVENT</th><th>DATE & PLACE</th><th>STATUS</th><th>GUESTS</th><th>ACTIONS</th></tr></thead><tbody>{mine.map((event) => { const attendees = registrations.filter((reg) => reg.eventId === event.id && reg.status === 'Confirmed').length; return <tr key={event.id}><td><button className="table-event-name" onClick={() => onOpenEvent(event.id)}><strong>{event.name}</strong><small>{event.category}</small></button></td><td>{prettyDate(event.date)}<small>{event.venue}</small></td><td><span className={`dashboard-status ${event.status === 'Open' ? 'is-open' : ''}`}>{event.status}</span></td><td>{attendees} / {event.capacity}</td><td><div className="table-actions"><button onClick={() => onEdit(event.id)}>Edit</button><button onClick={() => onParticipants(event.id)}>Guest list</button></div></td></tr> })}</tbody></table></div> : <div className="dashboard-empty"><span>✳</span><h3>Your next gathering starts here.</h3><p>Add the name, a date and a place. You can fill in the rest when you’re ready.</p><button className="button button-dark" onClick={onCreate}>Create your first event <ArrowRight size={15} /></button></div>}<div className="dashboard-tip"><span>✧</span><div><strong>A small tip, from us</strong><p>Add a venue and capacity to help guests know if your event is the right fit.</p></div></div></main>
}

function EventEditor({ event, onCancel, onSave }: { event: EventItem | null; onCancel: () => void; onSave: (event: Omit<EventItem, 'id'> & { id?: string }) => void }) {
  const [name, setName] = useState(event?.name || '')
  const [description, setDescription] = useState(event?.description || '')
  const [date, setDate] = useState(event?.date || '')
  const [time, setTime] = useState(event?.time || '')
  const [venue, setVenue] = useState(event?.venue || '')
  const [city, setCity] = useState(event?.city || 'Bengaluru')
  const [category, setCategory] = useState(event?.category || 'Get-together')
  const [capacity, setCapacity] = useState(event?.capacity.toString() || '40')
  const [status, setStatus] = useState<EventItem['status']>(event?.status || 'Open')
  const [price, setPrice] = useState(event?.price || 'Free')
  const [error, setError] = useState('')
  const submit = (e: FormEvent) => { e.preventDefault(); if (!name.trim() || !description.trim() || !date || !time || !venue.trim() || Number(capacity) < 1) { setError('Please complete the event name, description, date, time, venue and a positive capacity.'); return }; onSave({ id: event?.id, name: name.trim(), description: description.trim(), date, time, venue: venue.trim(), city: city.trim(), category, capacity: Number(capacity), status, image: event?.image || 'photo-1511795409834-ef04bbd61622', tone: event?.tone || 'bloom', price, organizer: event?.organizer || 'You' }) }
  return <main className="editor-page"><button className="back-link" onClick={onCancel}><ArrowLeft size={15} /> Back to your dashboard</button><div className="editor-header"><p className="eyebrow">MAKE A LITTLE ROOM FOR SOMETHING GOOD</p><h1>{event ? 'A few little updates.' : 'Start with a good idea.'}</h1><p>A name, a date and a place are plenty to begin.</p></div><form className="editor-form" onSubmit={submit}><div className="editor-form-head"><div><p className="eyebrow">EVENT DETAILS</p><h2>{event ? 'Edit your event' : 'Create an event'}</h2></div><span className="editor-private"><Check size={14} /> {event ? 'Changes save to this browser' : 'You can edit these later'}</span></div><div className="editor-form-grid"><label className="wide-label">Event name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="A name people will remember" required /></label><label className="wide-label">A short description<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="What makes this gathering special?" required /></label><label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label><label>Time<input value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 6:30 PM" required /></label><label>Venue<input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Place or address" required /></label><label>City / neighbourhood<input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bengaluru" /></label><label>Event type<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label>Guest capacity<input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} required /></label><label>Registration / price<input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Free or ₹ amount" /></label><label>Visibility<select value={status} onChange={(e) => setStatus(e.target.value as EventItem['status'])}><option>Open</option><option>Filling fast</option><option>Full</option><option>Draft</option></select></label></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="editor-actions"><button type="button" className="button button-outline" onClick={onCancel}>Cancel</button><button type="submit" className="button button-dark">{event ? 'Save event changes' : 'Create my event'} <ArrowRight size={15} /></button></div></form></main>
}

function Participants({ event, registrations, onBack, onStatus }: { event: EventItem; registrations: Registration[]; onBack: () => void; onStatus: (registrationId: string, status: Registration['status']) => void }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All statuses')
  const rows = registrations.filter((row) => row.eventId === event.id && (filter === 'All statuses' || row.status === filter) && `${row.name} ${row.email} ${row.phone}`.toLowerCase().includes(query.toLowerCase()))
  return <main className="participants-page"><button className="back-link" onClick={onBack}><ArrowLeft size={15} /> Back to dashboard</button><div className="participants-head"><div><p className="eyebrow">THE PEOPLE MAKING IT A DAY</p><h1>Your guest <em>list.</em></h1><p>{event.name} · {prettyDate(event.date)} · {event.venue}</p></div><div className="participants-count"><strong>{registrations.filter((row) => row.eventId === event.id && row.status === 'Confirmed').length.toString().padStart(2, '0')}</strong><span>CONFIRMED<br />GUESTS</span></div></div><div className="participants-toolbar"><label className="event-search"><Search size={16} /><span className="sr-only">Search participants</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or phone" /></label><label className="category-select-wrap"><SlidersHorizontal size={14} /><span className="sr-only">Filter participant status</span><select value={filter} onChange={(e) => setFilter(e.target.value)}><option>All statuses</option><option>Confirmed</option><option>Waitlist</option><option>Cancelled</option></select><ChevronDown size={14} /></label><button className="participant-export" onClick={() => { const csv = ['Name,Email,Phone,Registration date,Status', ...rows.map((row) => [row.name, row.email, row.phone, row.registrationDate, row.status].map((value) => `"${value.replaceAll('"', '""')}"`).join(','))].join('\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = `${event.name.toLowerCase().replaceAll(' ', '-')}-guests.csv`; link.click(); URL.revokeObjectURL(link.href) }}>Export guest list <ArrowDownRight size={14} /></button></div><div className="participants-table-wrap"><table className="participants-table"><thead><tr><th>NAME</th><th>EMAIL</th><th>PHONE</th><th>REGISTERED</th><th>STATUS</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.name}</strong></td><td>{row.email}</td><td>{row.phone}</td><td>{prettyDate(row.registrationDate)}</td><td><select aria-label={`Update ${row.name} status`} value={row.status} onChange={(e) => onStatus(row.id, e.target.value as Registration['status'])}><option>Confirmed</option><option>Waitlist</option><option>Cancelled</option></select></td></tr>)}</tbody></table>{rows.length === 0 && <div className="no-results"><Users size={20} /><h3>No people in this view.</h3><p>Try another name or status.</p></div>}</div><p className="participant-privacy"><Check size={14} /> Guest details belong to this event. Keep them private and share only with the people helping you host.</p></main>
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [destination, setDestination] = useState<Destination | null>(null)
  const [profile, setProfile] = useState<Profile | null>(() => readStored<Profile | null>('gathered-profile', null))
  const [events, setEvents] = useState<EventItem[]>(() => readStored('gathered-events', initialEvents))
  const [registrations, setRegistrations] = useState<Registration[]>(() => readStored('gathered-registrations', initialRegistrations))
  const [selectedEvent, setSelectedEvent] = useState(initialEvents[0].id)
  const [selectedContent, setSelectedContent] = useState('')
  const [editEventId, setEditEventId] = useState<string | null>(null)
  const [chosenCategory, setChosenCategory] = useState('All events')
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('Bengaluru')
  const [locationNote, setLocationNote] = useState('')

  useEffect(() => { localStorage.setItem('gathered-events', JSON.stringify(events)) }, [events])
  useEffect(() => { localStorage.setItem('gathered-registrations', JSON.stringify(registrations)) }, [registrations])
  useEffect(() => { if (profile) localStorage.setItem('gathered-profile', JSON.stringify(profile)); else localStorage.removeItem('gathered-profile') }, [profile])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = reduce ? null : new Lenis({ autoRaf: false, smoothWheel: true, duration: 1.15 })
    const raf = (time: number) => lenis?.raf(time * 1000)
    if (lenis) gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    if (lenis) lenis.on('scroll', () => ScrollTrigger.update())
    ScrollTrigger.refresh()
    const sections = gsap.utils.toArray<HTMLElement>('.scroll-tone')
    sections.forEach((section) => ScrollTrigger.create({ trigger: section, start: 'top 72%', end: 'bottom 28%', onEnter: () => document.documentElement.dataset.scrollTone = section.dataset.tone || '', onEnterBack: () => document.documentElement.dataset.scrollTone = section.dataset.tone || '' }))
    const reveals = gsap.utils.toArray<HTMLElement>('.section-head, .category-tile, .service-tile, .event-card, .venue-card')
    if (!reduce) reveals.forEach((item) => { gsap.fromTo(item, { opacity: 0.68, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: item, start: 'top 92%', once: true } }) })
    let previous = window.scrollY
    let rotation = 0
    const handleScroll = () => {
      const current = window.scrollY
      rotation += (current - previous) * 0.006
      previous = current
      document.documentElement.style.setProperty('--case-rotation', `${rotation}`)
      document.documentElement.style.setProperty('--page-progress', `${Math.min(current / (document.documentElement.scrollHeight - innerHeight || 1), 1)}`)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => { window.removeEventListener('scroll', handleScroll); if (lenis) { gsap.ticker.remove(raf); lenis.destroy() }; ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); gsap.globalTimeline.clear() }
  }, [screen])

  const navigate = (to: Destination) => { setScreen(to.screen); if (to.id && ['event', 'registration', 'participants'].includes(to.screen)) setSelectedEvent(to.id); if (to.id && (to.screen === 'service' || to.screen === 'venue')) setSelectedContent(to.id); if (to.screen === 'editor') setEditEventId(to.id ?? null) }
  const openDestination = (to: Destination) => { const organizerFlow = ['editor', 'dashboard', 'participants'].includes(to.screen); if (!profile || (organizerFlow && !profile.organizer)) { setDestination(to); setScreen('auth') } else navigate(to) }
  const openAuth = (to?: Destination) => { setDestination(to ?? null); setScreen('auth') }
  const completeAuth = (nextProfile: Profile) => { setProfile(nextProfile); if (destination) { navigate(destination); setDestination(null) } else setScreen(nextProfile.organizer ? 'dashboard' : 'home') }
  const event = events.find((item) => item.id === selectedEvent) || events[0]
  const editedEvent = editEventId ? events.find((item) => item.id === editEventId) || null : null
  const eventForEditor = screen === 'editor' ? editedEvent : null
  const goHome = () => { setScreen('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const locate = () => { if (!navigator.geolocation) { setLocationNote('Location isn’t available here. Search a neighbourhood instead.'); return }; setLocationNote('Finding your neighbourhood…'); navigator.geolocation.getCurrentPosition((position) => { const { latitude, longitude } = position.coords; if (latitude >= 12 && latitude <= 13.5 && longitude >= 77 && longitude <= 78) { setLocation('Bengaluru'); setLocationNote('Using your current location for Bengaluru event previews.') } else { setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`); setLocationNote('Location found. Our sample event listings are currently for Bengaluru; search that city to browse them.') } }, () => setLocationNote('We couldn’t access your location. Type a neighbourhood above instead.'), { enableHighAccuracy: false, timeout: 8000 }) }
  const saveEvent = (record: Omit<EventItem, 'id'> & { id?: string }) => { if (record.id) setEvents((current) => current.map((item) => item.id === record.id ? { ...record, id: record.id } as EventItem : item)); else { const newEvent = { ...record, organizer: profile?.name || 'You', id: `e-${Date.now()}` } as EventItem; setEvents((current) => [newEvent, ...current]); setSelectedEvent(newEvent.id) }; setEditEventId(null); setScreen('dashboard') }
  const saveRegistration = (fields: Omit<Registration, 'id' | 'registrationDate' | 'status'>) => setRegistrations((current) => [{ ...fields, id: `r-${Date.now()}`, registrationDate: new Date().toISOString().slice(0, 10), status: 'Confirmed' }, ...current])
  const updateRegistration = (registrationId: string, status: Registration['status']) => setRegistrations((current) => current.map((item) => item.id === registrationId ? { ...item, status } : item))
  const header = <Header screen={screen} setScreen={setScreen} openAuth={openAuth} openDestination={openDestination} signedIn={!!profile} isOrganizer={!!profile?.organizer} />

  return <div className="app-shell">
    {screen === 'home' && <>{header}<Home events={events} chosenCategory={chosenCategory} setChosenCategory={setChosenCategory} openDestination={openDestination} setScreen={setScreen} setSelectedEvent={setSelectedEvent} query={query} setQuery={setQuery} location={location} setLocation={setLocation} locate={locate} locationNote={locationNote} /></>}
    {screen === 'auth' && <AuthScreen destination={destination} onBack={goHome} onComplete={completeAuth} />}
    {screen === 'event' && <>{header}<EventDetails event={event} registrations={registrations} onBack={goHome} onRegister={() => openDestination({ screen: 'registration', id: event.id })} /></>}
    {screen === 'registration' && <>{header}<RegistrationForm event={event} onBack={() => setScreen('event')} onSubmit={saveRegistration} /></>}
    {(screen === 'service' || screen === 'venue') && <>{header}<ContentDetail type={screen} name={selectedContent} onBack={goHome} onExplore={() => setSelectedContent(screen === 'service' ? 'All services' : 'All venues')} onSelectOption={setSelectedContent} /></>}
    {screen === 'dashboard' && <>{header}<Dashboard events={events} registrations={registrations} profile={profile} onCreate={() => { setEditEventId(null); setScreen('editor') }} onEdit={(id) => { setEditEventId(id); setScreen('editor') }} onParticipants={(id) => { setSelectedEvent(id); setScreen('participants') }} onOpenEvent={(id) => { setSelectedEvent(id); setScreen('event') }} /></>}
    {screen === 'editor' && <>{header}<EventEditor key={editEventId || 'new'} event={eventForEditor} onCancel={() => setScreen('dashboard')} onSave={saveEvent} /></>}
    {screen === 'participants' && <>{header}<Participants event={event} registrations={registrations} onBack={() => setScreen('dashboard')} onStatus={updateRegistration} /></>}
  </div>
}
