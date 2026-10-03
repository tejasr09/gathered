import { useState } from 'react'
import { ArrowUpRight, CalendarDays, MapPin, Star, Users } from 'lucide-react'
import { pastEventStats, type PastEventStat } from './data'

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function PastEventInsights({ reports = pastEventStats }: { reports?: PastEventStat[] }) {
  const [selectedId, setSelectedId] = useState(reports[0]?.id || '')
  const report = reports.find((item) => item.id === selectedId) || reports[0]
  if (!report) return null
  const attendanceRate = Math.round(report.checkedIn / Math.max(report.registrations, 1) * 100)
  const capacityRate = Math.round(report.registrations / Math.max(report.capacity, 1) * 100)

  return <section className="past-insights" aria-labelledby="past-insights-title">
    <div className="past-insights-heading"><div><p className="eyebrow">LEARN FROM THE LAST GATHERING</p><h2 id="past-insights-title">A look <em>back.</em></h2><p>Attendance, guest feedback and a few useful signals from past events.</p></div><label className="past-event-select"><span className="sr-only">Choose a past event report</span><select value={report.id} onChange={(event) => setSelectedId(event.target.value)}>{reports.map((item) => <option key={item.id} value={item.id}>{item.eventName}</option>)}</select><ArrowUpRight size={14} /></label></div>
    <div className="past-report-topline"><div><strong>{report.eventName}</strong><span>{report.category} · {report.venue}</span></div><span className="past-report-date"><CalendarDays size={13} /> {formatDate(report.date)}</span></div>
    <div className="past-stat-grid">
      <article className="past-stat"><span>REGISTERED</span><strong>{report.registrations}<small> / {report.capacity}</small></strong><div className="mini-progress"><i style={{ width: `${capacityRate}%` }} /></div><small>{capacityRate}% of capacity</small></article>
      <article className="past-stat"><span>ATTENDED</span><strong>{report.checkedIn}<small> guests</small></strong><div className="mini-progress"><i style={{ width: `${attendanceRate}%` }} /></div><small>{attendanceRate}% of registrations checked in</small></article>
      <article className="past-stat rating-stat"><span>AVERAGE RATING</span><strong>{report.averageRating.toFixed(1)}<small> / 5</small></strong><div className="rating-stars" aria-label={`${report.averageRating} out of 5 stars`}><Star /><Star /><Star /><Star /><Star /></div><small>{report.ratingCount} guest ratings</small></article>
      <article className="past-stat"><span>RETURNING GUESTS</span><strong>{report.repeatGuestPercent}<small>%</small></strong><div className="repeat-mark"><Users size={18} /><span>came back for another gathering</span></div></article>
    </div>
    <blockquote className="past-feedback"><span>WHAT GUESTS REMEMBERED</span><p>“{report.topFeedback}”</p></blockquote>
    <p className="past-demo-note"><MapPin size={13} /> Sample dashboard data for this demo; replace with real check-in and rating records when a backend is connected.</p>
  </section>
}
