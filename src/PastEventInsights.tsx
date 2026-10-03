import { CalendarDays, Star } from 'lucide-react'
import type { EventItem, Registration } from './data'

export default function PastEventInsights({ events, registrations }: { events: EventItem[]; registrations: Registration[] }) {
  const past = events.filter((event) => new Date(`${event.date}T23:59:59`).getTime() < Date.now() && event.status !== 'Draft')
  if (!past.length) return <section className="past-insights compact-insights"><CalendarDays size={17} /><div><strong>Your past-event snapshot</strong><span>Completed events and their guest activity will appear here.</span></div></section>
  const pastIds = new Set(past.map((event) => event.id))
  const pastRegs = registrations.filter((item) => pastIds.has(item.eventId) && item.status === 'Confirmed')
  const tickets = pastRegs.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const checkedIn = pastRegs.filter((item) => item.checkedIn).reduce((sum, item) => sum + (item.quantity || 1), 0)
  const ratings = pastRegs.flatMap((item) => item.rating ? Array.from({ length: item.quantity || 1 }, () => item.rating!) : [])
  const average = ratings.length ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1) : '—'
  return <section className="past-insights compact-insights" aria-label="Your past event stats">
    <div className="compact-insights-title"><CalendarDays size={17} /><div><strong>Past-event snapshot</strong><span>From {past.length} event{past.length === 1 ? '' : 's'} you hosted</span></div></div>
    <div className="compact-insight"><span>Tickets</span><strong>{tickets}</strong></div>
    <div className="compact-insight"><span>Checked in</span><strong>{pastRegs.some((item) => item.checkedIn !== undefined) ? checkedIn : '—'}</strong></div>
    <div className="compact-insight"><span>Guest rating</span><strong>{average}{average !== '—' && <small><Star size={12} fill="currentColor" /></small>}</strong></div>
  </section>
}
