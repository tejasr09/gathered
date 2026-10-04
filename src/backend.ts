import type { EventItem, Registration } from './data'

const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
const TOKEN_KEY = 'gathered-db-token'
const ready = Boolean(url && anonKey)

type DbSession = { access_token: string; user: { id: string; email: string; user_metadata?: { name?: string; organizer?: boolean } } }
const headers = (json = false): HeadersInit => {
  const session = localStorage.getItem(TOKEN_KEY)
  const legacyAnon = !session && anonKey?.startsWith('eyJ') ? anonKey : ''
  return { apikey: anonKey || '', ...(session || legacyAnon ? { Authorization: `Bearer ${session || legacyAnon}` } : {}), ...(json ? { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' } : {}) }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!ready) throw new Error('Database is not configured.')
  const response = await fetch(`${url}${path}`, { ...init, headers: { ...headers(Boolean(init?.body)), ...init?.headers } })
  if (!response.ok) {
    const details = await response.json().catch(() => null)
    throw new Error(details?.msg || details?.message || `Database request failed (${response.status}).`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const database = {
  ready,
  signUp: async (email: string, password: string, name: string, organizer: boolean) => {
    const session = await request<DbSession>('/auth/v1/signup', { method: 'POST', body: JSON.stringify({ email, password, data: { name, organizer } }) })
    if (!session.access_token) throw new Error('Account created. Verify your email, then log in to continue.')
    localStorage.setItem(TOKEN_KEY, session.access_token)
    return session
  },
  signIn: async (email: string, password: string) => {
    const session = await request<DbSession>('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) })
    localStorage.setItem(TOKEN_KEY, session.access_token)
    return session
  },
  signOut: async () => {
    const session = localStorage.getItem(TOKEN_KEY)
    try {
      if (ready && session) {
        await fetch(`${url}/auth/v1/logout`, { method: 'POST', headers: { apikey: anonKey || '', Authorization: `Bearer ${session}` } })
      }
    } catch {
      // Always clear the local session, including when the browser is offline.
    } finally {
      localStorage.removeItem(TOKEN_KEY)
    }
  },
  load: async () => {
    const [events, registrations] = await Promise.all([
      request<EventItem[]>('/rest/v1/events?select=*&order=date.asc'),
      request<Registration[]>('/rest/v1/registrations?select=*'),
    ])
    return { events, registrations }
  },
  saveEvent: (event: EventItem, ownerId: string) => request<unknown>('/rest/v1/events', { method: 'POST', body: JSON.stringify({ ...event, organizerId: ownerId }) }),
  saveRegistration: (registration: Registration, attendeeId?: string) => request<unknown>('/rest/v1/registrations', { method: 'POST', body: JSON.stringify({ ...registration, attendeeId: attendeeId || null }) }),
  updateRegistration: (registration: Registration, changes: Partial<Registration>) => request<unknown>(`/rest/v1/registrations?id=eq.${encodeURIComponent(registration.id)}`, { method: 'PATCH', body: JSON.stringify({ ...(changes.status ? { status: changes.status } : {}), ...(changes.checkedIn !== undefined ? { checkedIn: changes.checkedIn } : {}), ...(changes.rating !== undefined ? { rating: changes.rating } : {}) }) }),
}

export function mapSession(session: DbSession, organizerFallback = false) {
  return { id: session.user.id, email: session.user.email, name: session.user.user_metadata?.name || session.user.email.split('@')[0], organizer: session.user.user_metadata?.organizer ?? organizerFallback }
}
