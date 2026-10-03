import { FormEvent, useMemo, useState } from 'react'
import { ArrowRight, Bot, CalendarDays, Check, ChevronDown, Eye, EyeOff, Send, Sparkles, X } from 'lucide-react'
import type { EventItem, PastEventStat } from './data'

type Message = { id: number; role: 'assistant' | 'user'; text: string; eventId?: string }
type AssistantContext = { page: string; event: EventItem | null; search: string; category: string }

function buildAnswer(query: string, context: AssistantContext, events: EventItem[], reports: PastEventStat[]) {
  const lower = query.toLowerCase()
  const eventMatch = events.find((event) => lower.includes(event.name.toLowerCase()) || lower.includes(event.category.toLowerCase()))
  if (/rating|review|feedback|attendance|check.?in|population|past event|previous|stats|report|returning guest/.test(lower)) {
    const report = reports[0]
    if (!report) return { text: 'There are no past-event reports in this demo yet.' }
    const rate = Math.round(report.checkedIn / Math.max(report.registrations, 1) * 100)
    return { text: `The latest sample report is “${report.eventName}”: ${report.registrations} registrations, ${report.checkedIn} check-ins (${rate}% attendance), and a ${report.averageRating.toFixed(1)}/5 average from ${report.ratingCount} ratings. The organizer dashboard has a selector for the other past-event reports too.` }
  }
  if (eventMatch && /tell|details|show|open|what/.test(lower)) return { text: `“${eventMatch.name}” is a ${eventMatch.category} at ${eventMatch.venue} on ${new Date(`${eventMatch.date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}. Capacity is ${eventMatch.capacity}, and the current status is ${eventMatch.status}.`, eventId: eventMatch.id }
  if (/ticket|booking|register|registration|seat|pass/.test(lower)) {
    const current = context.event || eventMatch
    return current
      ? { text: `For “${current.name}”, choose Standard or VIP, select up to four seats (while capacity remains), and submit your name, email and phone. The demo confirms the booking and creates a printable e-ticket. It does not process payment.`, eventId: current.id }
      : { text: 'Open an event to see its available seats and ticket options. This demo booking flow confirms locally, creates a printable e-ticket and does not process payment.' }
  }
  if (/venue|place|space/.test(lower)) return { text: 'The venue previews include The Glasshouse, Palm & Pine Courtyard and Studio 06. Open a venue card to compare its style, neighbourhood and capacity.' }
  if (/service|cater|photo|music|flower|planner/.test(lower)) return { text: 'You can browse food and drink, photo and film, music and sound, flowers and styling, planning support, and guest experiences in the Services section.' }
  if (/find|near|upcoming|event|calendar|happening/.test(lower)) {
    const choices = events.slice(0, 3)
    return { text: choices.length ? `A few upcoming ideas: ${choices.map((event) => `${event.name} (${event.category}, ${new Date(`${event.date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`).join('; ')}. Open one for the full details.` : 'Try the Event List and search by event type, venue or neighbourhood.' }
  }
  if (/plan|checklist|start|organis/.test(lower)) return { text: 'A gentle place to start: pick the kind of gathering, choose a date and capacity, then find a venue. Add services when the shape of the day feels right. You can create an event from the organizer section.' }
  if (context.event) return { text: `You’re looking at “${context.event.name}” on the ${context.page} page. It’s a ${context.event.category} at ${context.event.venue} on ${new Date(`${context.event.date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}. Ask me about tickets, capacity or the event details.` }
  if (context.search || context.category !== 'All events') return { text: `This page is currently showing ${context.category === 'All events' ? 'all event types' : context.category}${context.search ? ` matching “${context.search}”` : ''}. Clear the filters or change your search to see more.` }
  return { text: 'I can help you find an event, compare services and venues, think through a plan, or understand ticket and organizer tools. What are you working on?' }
}

export default function AssistantPanel({ context, events, reports, onOpenEvent }: { context: AssistantContext; events: EventItem[]; reports: PastEventStat[]; onOpenEvent: (eventId: string) => void }) {
  const [open, setOpen] = useState(false)
  const [pageAccessKey, setPageAccessKey] = useState('')
  const [draft, setDraft] = useState('')
  const [pendingQuery, setPendingQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([{ id: 1, role: 'assistant', text: 'Hi, I’m Gathered Copilot. I can help you find a good plan or explain how things work.' }])
  const currentEvent = useMemo(() => context.event, [context.event])
  const contextKey = `${context.page}:${context.event?.id || (context.category !== 'All events' ? context.category : context.search || 'general')}`
  const pageAccess = pageAccessKey === contextKey

  const answerQuery = (query: string, permitted = pageAccess) => {
    const eventIntent = /\b(this|here|current|page|previous|past|last event|these|that event|ticket|booking|register|registration|rating|attendance|population|stats|report)\b/i.test(query)
    if (eventIntent && !permitted) {
      setPendingQuery(query)
      setMessages((current) => [...current, { id: Date.now(), role: 'assistant', text: 'To answer that, I need permission to read this page’s event details and aggregate demo stats. I only use the visible app context in this browser; I won’t send your question or page data to a server.' }])
      return
    }
    const view = permitted ? context : { page: 'Home', event: null, search: '', category: 'All events' }
    const result = buildAnswer(query, view, events, permitted ? reports : [])
    setMessages((current) => [...current, { id: Date.now(), role: 'assistant', text: result.text, eventId: result.eventId }])
  }

  const send = (value = draft) => {
    const query = value.trim()
    if (!query) return
    setMessages((current) => [...current, { id: Date.now(), role: 'user', text: query }])
    setDraft('')
    answerQuery(query)
  }

  const approveContext = () => {
    setPageAccessKey(contextKey)
    const query = pendingQuery
    setPendingQuery('')
    if (query) answerQuery(query, true)
    else setMessages((current) => [...current, { id: Date.now(), role: 'assistant', text: `Page context is on for this session. I can now tailor answers to ${context.page}${currentEvent ? ` and “${currentEvent.name}”` : ''}.` }])
  }

  const onSubmit = (event: FormEvent) => { event.preventDefault(); send() }
  const prompts = ['Find an upcoming event', 'How do tickets work?', 'Show past event ratings']

  return <div className="copilot-root">
    {open && <section className="copilot-panel" aria-label="Gathered Copilot chat">
      <header className="copilot-header"><div className="copilot-avatar"><Bot size={19} /></div><div><strong>Gathered Copilot</strong><span><i /> Local demo assistant</span></div><button className="copilot-close" onClick={() => setOpen(false)} aria-label="Close copilot"><X size={18} /></button></header>
      <div className="copilot-context"><div className="copilot-context-icon">{pageAccess ? <Eye size={15} /> : <EyeOff size={15} />}</div><div><strong>{pageAccess ? 'Page context allowed' : 'Page context is off'}</strong><span>{pageAccess ? `Reading ${context.page}${currentEvent ? ` · ${currentEvent.name}` : ''}` : 'Allow it when a question needs page details.'}</span></div><button onClick={() => { setPageAccessKey(pageAccess ? '' : contextKey); setPendingQuery('') }} aria-label={pageAccess ? 'Turn off page context' : 'Allow page context'}>{pageAccess ? <Check size={16} /> : <ChevronDown size={16} />}</button></div>
      {!pageAccess && <button className="copilot-permission" onClick={approveContext}><Eye size={14} /> Allow this page’s context <span>Only in this browser</span></button>}
      <div className="copilot-messages" aria-live="polite">{messages.map((message) => <div key={message.id} className={`copilot-message ${message.role}`}><div className="message-avatar">{message.role === 'assistant' ? <Sparkles size={13} /> : 'Y'}</div><div className="message-content"><p>{message.text}</p>{message.eventId && <button className="copilot-action" onClick={() => onOpenEvent(message.eventId!)}>Open event details <ArrowRight size={13} /></button>}</div></div>)}{pendingQuery && <div className="permission-request"><strong>Allow page access for this answer?</strong><p>The request “{pendingQuery}” will be answered using current event and aggregate report details.</p><div><button onClick={approveContext}>Allow and answer</button><button onClick={() => setPendingQuery('')}>Not now</button></div></div>}{messages.length === 1 && <div className="copilot-prompts">{prompts.map((prompt) => <button key={prompt} onClick={() => send(prompt)}>{prompt} <ArrowRight size={12} /></button>)}</div>}</div>
      <div className="copilot-footnote"><CalendarDays size={12} /> Page details stay in this browser in this demo.</div>
      <form className="copilot-compose" onSubmit={onSubmit}><label htmlFor="copilot-input" className="sr-only">Ask Gathered Copilot</label><input id="copilot-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about events or planning…" /><button type="submit" aria-label="Send message" disabled={!draft.trim()}><Send size={16} /></button></form>
    </section>}
    <button className={`copilot-launcher ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close Gathered Copilot' : 'Ask Gathered Copilot'}>{open ? <X size={20} /> : <><Sparkles size={18} /><span>Ask Gathered</span></>}</button>
  </div>
}
