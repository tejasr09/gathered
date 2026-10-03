import { type FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowRight, Bot, CalendarDays, Eye, EyeOff, Send, Sparkles, X } from 'lucide-react'
import type { EventItem, Registration } from './data'

type Message = { id: number; role: 'assistant' | 'user'; text: string; eventIds?: string[] }
type AssistantContext = { page: string; event: EventItem | null; search: string; category: string }
const day = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
const idFor = () => Date.now() + Math.random()

function buildAnswer(query: string, context: AssistantContext, events: EventItem[], registrations: Registration[]) {
  const text = query.toLowerCase()
  const event = events.find((item) => text.includes(item.name.toLowerCase()) || (item.category.length > 4 && text.includes(item.category.toLowerCase())))
  const eventStatsRequested = /rating|review|feedback|attendance|check.?in|population|past|previous|stats|report/.test(text)
  if (eventStatsRequested) {
    const past = events.filter((item) => new Date(`${item.date}T23:59:59`).getTime() < Date.now()).sort((a, b) => b.date.localeCompare(a.date))
    const target = event || (context.event && new Date(`${context.event.date}T23:59:59`).getTime() < Date.now() ? context.event : null) || past[0]
    if (!target) return { text: 'I couldn’t find a past event in the current event records yet. Once an event date has passed, its ticket, check-in and guest-rating totals will appear here.' }
    const rows = registrations.filter((row) => row.eventId === target.id && row.status === 'Confirmed')
    const tickets = rows.reduce((sum, row) => sum + (row.quantity || 1), 0)
    const checked = rows.filter((row) => row.checkedIn).reduce((sum, row) => sum + (row.quantity || 1), 0)
    const ratings = rows.filter((row) => row.rating).flatMap((row) => Array.from({ length: row.quantity || 1 }, () => row.rating!))
    const average = ratings.length ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1) : 'No ratings yet'
    return { text: `${target.name}\n${tickets} confirmed tickets · ${rows.some((row) => row.checkedIn !== undefined) ? `${checked} checked in` : 'check-ins not recorded yet'} · ${average}${ratings.length ? ` from ${ratings.length} ratings` : ''}.` }
  }
  if (context.event && /this|here|current|page|where|when|capacity|details|ticket|book|register/.test(text)) {
    const target = context.event
    if (/ticket|book|register|seat|pass/.test(text)) return { text: `${target.name}: choose Standard or VIP, then confirm your name, email and phone. This demo creates a printable confirmation and does not take payment. ${target.capacity} total places; event details show current availability.`, eventIds: [target.id] }
    return { text: `${target.name}\n${target.category} · ${day(target.date)} at ${target.time}\n${target.venue}, ${target.city}\nCapacity: ${target.capacity} · Status: ${target.status}`, eventIds: [target.id] }
  }
  if (/ticket|booking|register|seat|pass/.test(text)) return event ? { text: `${event.name} has a simulated ticket booking flow. Open its details to see capacity and continue; no payment is taken.`, eventIds: [event.id] } : { text: 'Open an event to see its ticket choices and remaining capacity. The booking simulation creates a printable demo pass and does not take payment.' }
  if (/venue|place|space|location/.test(text)) return { text: 'You can browse venue options in the Venues section. Each venue page now includes an Open venue in Maps action. For an event venue, open its details and choose View venue.' }
  if (/service|cater|photo|music|flower|planner/.test(text)) return { text: 'Browse food and drink, photo and film, music and sound, flowers and styling, planning support, and guest experiences in Services.' }
  if (/plan|checklist|start|organis/.test(text)) return { text: 'A useful order: choose the event type and date, decide how many people to invite, pick a venue, then add services. Organizers can create and edit events from the dashboard.' }
  if (/event|find|near|upcoming|calendar|happening|show|list/.test(text)) {
    const matching = events.filter((item) => (context.category === 'All events' || item.category === context.category) && `${item.name} ${item.category} ${item.city} ${item.venue}`.toLowerCase().includes(context.search.toLowerCase()))
    const choices = matching.slice(0, 4)
    return choices.length ? { text: `Here ${choices.length === 1 ? 'is an event' : 'are a few events'} you can explore:`, eventIds: choices.map((item) => item.id) } : { text: 'No events match the current search and category. Try clearing the filters or searching a different event type.' }
  }
  return { text: 'I can help with event details, ticket booking, venues, services, planning, or past-event attendance and ratings. Try asking one of those, or use a prompt below.' }
}

export default function AssistantPanel({ context, events, registrations, onOpenEvent }: { context: AssistantContext; events: EventItem[]; registrations: Registration[]; onOpenEvent: (eventId: string) => void }) {
  const [open, setOpen] = useState(false)
  const [pageAccessKey, setPageAccessKey] = useState('')
  const [draft, setDraft] = useState('')
  const [pendingQuery, setPendingQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([{ id: 1, role: 'assistant', text: 'Hi, I’m Gathered Copilot. I can help you discover events and make sense of your plans.' }])
  const messagesEnd = useRef<HTMLDivElement>(null)
  const contextKey = `${context.page}:${context.event?.id || (context.category !== 'All events' ? context.category : context.search || 'general')}`
  const pageAccess = pageAccessKey === contextKey
  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages, pendingQuery])
  const answerQuery = (query: string, allowed = pageAccess) => {
    const needsPage = /\b(this|here|current|page|previous|past|last event|these|that event|ticket|booking|register|registration|rating|attendance|population|stats|report|my event|my events)\b/i.test(query)
    if (needsPage && !allowed) {
      setPendingQuery(query)
      setMessages((current) => [...current, { id: idFor(), role: 'assistant', text: 'I need your permission to use this page’s event or guest-summary data to answer that. The query stays in this browser.' }])
      return
    }
    const view = allowed ? context : { page: 'Home', event: null, search: '', category: 'All events' }
    const result = buildAnswer(query, view, events, allowed ? registrations : [])
    setMessages((current) => [...current, { id: idFor(), role: 'assistant', ...result }])
  }
  const send = (value = draft) => { const query = value.trim(); if (!query) return; setMessages((current) => [...current, { id: idFor(), role: 'user', text: query }]); setDraft(''); answerQuery(query) }
  const allow = () => { const query = pendingQuery; setPageAccessKey(contextKey); setPendingQuery(''); if (query) answerQuery(query, true) }
  const submit = (event: FormEvent) => { event.preventDefault(); send() }
  const prompts = ['Find an event', 'How do tickets work?', 'Past-event ratings']
  return <div className="copilot-root">
    {open && <section className="copilot-panel" aria-label="Gathered Copilot chat">
      <header className="copilot-header"><div className="copilot-header-title"><span className="copilot-avatar"><Bot size={18} /></span><div><strong>Gathered Copilot</strong><small>Local assistant · no external AI calls</small></div></div><button className="copilot-icon-button" onClick={() => setOpen(false)} aria-label="Close copilot"><X size={18} /></button></header>
      <div className="copilot-context"><span>{pageAccess ? <Eye size={14} /> : <EyeOff size={14} />}</span><div><strong>{pageAccess ? `Page context on · ${context.page}` : 'Page context off'}</strong><small>{pageAccess ? context.event?.name || 'Scoped to this page' : 'Permission is requested only when needed.'}</small></div><button onClick={() => { setPageAccessKey(pageAccess ? '' : contextKey); setPendingQuery('') }}>{pageAccess ? 'Turn off' : 'Allow'}</button></div>
      <div className="copilot-messages" aria-live="polite">{messages.map((message) => <div key={message.id} className={`copilot-message ${message.role}`}><span className="message-avatar">{message.role === 'assistant' ? <Sparkles size={13} /> : 'You'}</span><div className="message-content"><p>{message.text}</p>{message.eventIds?.map((id) => { const item = events.find((candidate) => candidate.id === id); return item ? <button className="copilot-action" key={id} onClick={() => onOpenEvent(id)}><span><strong>{item.name}</strong><small>{item.category} · {day(item.date)} · {item.venue}</small></span><ArrowRight size={15} /></button> : null })}</div></div>)}{pendingQuery && <div className="permission-request"><strong>Use this page for your answer?</strong><p>“{pendingQuery}” may use event details or attendee summaries visible to this account.</p><div><button onClick={allow}>Allow and answer</button><button onClick={() => setPendingQuery('')}>Not now</button></div></div>}{messages.length === 1 && <div className="copilot-prompts">{prompts.map((prompt) => <button key={prompt} onClick={() => send(prompt)}>{prompt}</button>)}</div>}<div ref={messagesEnd} /></div>
      <div className="copilot-footnote"><CalendarDays size={12} /> Answers use app data in this browser.</div><form className="copilot-compose" onSubmit={submit}><label htmlFor="copilot-input" className="sr-only">Ask Gathered Copilot</label><input id="copilot-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about events or planning…" /><button type="submit" aria-label="Send message" disabled={!draft.trim()}><Send size={16} /></button></form>
    </section>}
    <button className={`copilot-launcher ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close Gathered Copilot' : 'Ask Gathered Copilot'}>{open ? <X size={20} /> : <><Sparkles size={18} /><span>Ask Gathered</span></>}</button>
  </div>
}
