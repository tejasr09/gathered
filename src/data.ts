export type EventItem = {
  id: string
  name: string
  description: string
  date: string
  time: string
  venue: string
  city: string
  category: string
  capacity: number
  status: 'Open' | 'Filling fast' | 'Full' | 'Draft'
  image: string
  tone: string
  price: string
  organizer: string
}

export type Registration = {
  id: string
  eventId: string
  name: string
  email: string
  phone: string
  registrationDate: string
  status: 'Confirmed' | 'Waitlist' | 'Cancelled'
  ticketType?: 'Standard' | 'VIP'
  quantity?: number
  unitPrice?: number
  ticketCode?: string
}

export type PastEventStat = {
  id: string
  eventName: string
  date: string
  category: string
  venue: string
  capacity: number
  registrations: number
  checkedIn: number
  averageRating: number
  ratingCount: number
  repeatGuestPercent: number
  topFeedback: string
}

export const categories = [
  { name: 'Birthday party', tint: 'peach', icon: '✳', image: 'photo-1530103862676-de8c9debad1d', note: 'Make their day feel like them.' },
  { name: 'Wedding', tint: 'rose', icon: '♡', image: 'photo-1519741497674-611481863552', note: 'A little magic, all in one place.' },
  { name: 'Naming ceremony', tint: 'lilac', icon: '☼', image: 'photo-1478146896981-b80fe463b330', note: 'A lovely start to a lovely story.' },
  { name: 'Get-together', tint: 'sage', icon: '◌', image: 'photo-1511988617509-a57c8a288659', note: 'Good people, no big occasion needed.' },
  { name: 'Anniversary', tint: 'rose', icon: '✷', image: 'photo-1519225421980-715cb0215aed', note: 'Celebrate the years and the next ones.' },
  { name: 'Baby shower', tint: 'lilac', icon: '☁', image: 'photo-1484820540004-51a76a03ca4f', note: 'A warm welcome for what’s next.' },
  { name: 'Graduation', tint: 'peach', icon: '✦', image: 'photo-1523050854058-8df90110c9f1', note: 'The capstone to a big chapter.' },
  { name: 'Corporate', tint: 'sage', icon: '▤', image: 'photo-1517457373958-b7bdd4587205', note: 'Bring your team into the room.' },
  { name: 'Cultural event', tint: 'peach', icon: '❋', image: 'photo-1528605248644-14dd04022da1', note: 'Make space for every tradition.' },
  { name: 'Workshop', tint: 'lilac', icon: '⌘', image: 'photo-1513364776144-60967b0f800f', note: 'A good day to learn something new.' },
  { name: 'Celebration', tint: 'sage', icon: '✺', image: 'photo-1464366400600-7168b8af9bc3', note: 'For the moments worth marking.' },
]

export const serviceItems = [
  { icon: '✿', title: 'Food & drink', detail: 'Caterers, bakers and bar teams who make the menu memorable.', type: 'Service' },
  { icon: '◉', title: 'Photo & film', detail: 'Find the people who know how to catch the in-between moments.', type: 'Service' },
  { icon: '♫', title: 'Music & sound', detail: 'DJs, live bands and the right sound for your kind of gathering.', type: 'Service' },
  { icon: '✧', title: 'Flowers & styling', detail: 'The finishing touches that make a room feel like yours.', type: 'Service' },
  { icon: '⌂', title: 'Planning support', detail: 'Thoughtful help with a schedule, suppliers and all the small details.', type: 'Service' },
  { icon: '✈', title: 'Guest experiences', detail: 'Transport, activities and the extras guests remember.', type: 'Service' },
]

export const venueItems = [
  { title: 'The Glasshouse', location: 'Indiranagar · Bengaluru', capacity: 'Up to 120', image: 'photo-1519167758481-83f550bb49b3', style: 'Garden · Light-filled', rating: '4.9' },
  { title: 'Palm & Pine Courtyard', location: 'Koramangala · Bengaluru', capacity: 'Up to 80', image: 'photo-1519225421980-715cb0215aed', style: 'Courtyard · Intimate', rating: '4.8' },
  { title: 'Studio 06', location: 'Richmond Town · Bengaluru', capacity: 'Up to 45', image: 'photo-1517457373958-b7bdd4587205', style: 'Modern · Flexible', rating: '4.9' },
]

export const initialEvents: EventItem[] = [
  { id: 'e-01', name: 'Sunday table, long lunch', description: 'A slow afternoon of good food, open-air conversation and the kind of company that makes the week feel lighter.', date: '2026-10-18', time: '12:30 PM', venue: 'The Glasshouse', city: 'Indiranagar, Bengaluru', category: 'Get-together', capacity: 48, status: 'Open', image: 'photo-1511795409834-ef04bbd61622', tone: 'sunset', price: '₹1,200', organizer: 'Mira S.' },
  { id: 'e-02', name: 'Little lights, big birthday', description: 'An evening made for tiny dancers, paper lanterns and one very important birthday wish.', date: '2026-10-24', time: '4:00 PM', venue: 'Palm & Pine Courtyard', city: 'Koramangala, Bengaluru', category: 'Birthday party', capacity: 32, status: 'Filling fast', image: 'photo-1530103862676-de8c9debad1d', tone: 'bloom', price: '₹850', organizer: 'Aarav K.' },
  { id: 'e-03', name: 'A promise in the garden', description: 'A small, thoughtful wedding with marigolds, a garden ceremony and dinner under the trees.', date: '2026-11-02', time: '5:30 PM', venue: 'The Glasshouse', city: 'Indiranagar, Bengaluru', category: 'Wedding', capacity: 120, status: 'Open', image: 'photo-1519741497674-611481863552', tone: 'garden', price: 'Invite only', organizer: 'Tara & Dev' },
  { id: 'e-04', name: 'Make a little room for art', description: 'A hands-on Sunday workshop for curious people. All materials included; no experience needed.', date: '2026-10-20', time: '10:00 AM', venue: 'Studio 06', city: 'Richmond Town, Bengaluru', category: 'Workshop', capacity: 20, status: 'Open', image: 'photo-1513364776144-60967b0f800f', tone: 'studio', price: '₹650', organizer: 'Studio 06' },
  { id: 'e-05', name: 'A new name, a new story', description: 'An intimate naming ceremony with family, flowers and a table set for everyone who helped us get here.', date: '2026-11-08', time: '11:00 AM', venue: 'Palm & Pine Courtyard', city: 'Koramangala, Bengaluru', category: 'Naming ceremony', capacity: 55, status: 'Open', image: 'photo-1478146896981-b80fe463b330', tone: 'bloom', price: 'Free', organizer: 'Neha R.' },
  { id: 'e-06', name: 'Good ideas, better company', description: 'A half-day gathering for independent makers to share what is working and build something together.', date: '2026-11-14', time: '9:00 AM', venue: 'Studio 06', city: 'Richmond Town, Bengaluru', category: 'Corporate', capacity: 36, status: 'Open', image: 'photo-1517457373958-b7bdd4587205', tone: 'studio', price: '₹950', organizer: 'Common Ground' },
]

export const initialRegistrations: Registration[] = [
  { id: 'r-01', eventId: 'e-01', name: 'Ananya Rao', email: 'ananya@example.com', phone: '+91 98765 43210', registrationDate: '2026-09-21', status: 'Confirmed' },
  { id: 'r-02', eventId: 'e-01', name: 'Kabir Mehta', email: 'kabir@example.com', phone: '+91 98450 32109', registrationDate: '2026-09-23', status: 'Confirmed' },
  { id: 'r-03', eventId: 'e-02', name: 'Rhea Kapoor', email: 'rhea@example.com', phone: '+91 99860 12345', registrationDate: '2026-09-24', status: 'Confirmed' },
]

// Illustrative aggregate reports for the demo dashboard; not linked to real people.
export const pastEventStats: PastEventStat[] = [
  { id: 'p-01', eventName: 'An evening under the trees', date: '2026-05-16', category: 'Wedding', venue: 'The Glasshouse', capacity: 120, registrations: 108, checkedIn: 96, averageRating: 4.8, ratingCount: 62, repeatGuestPercent: 28, topFeedback: 'The garden setting and relaxed dinner made the evening feel personal.' },
  { id: 'p-02', eventName: 'Sunday table, long lunch', date: '2026-04-19', category: 'Get-together', venue: 'The Glasshouse', capacity: 48, registrations: 43, checkedIn: 38, averageRating: 4.6, ratingCount: 24, repeatGuestPercent: 41, topFeedback: 'Guests loved the long-table format and the easy pace of the afternoon.' },
  { id: 'p-03', eventName: 'Make a little room for art', date: '2026-03-22', category: 'Workshop', venue: 'Studio 06', capacity: 20, registrations: 20, checkedIn: 18, averageRating: 4.9, ratingCount: 16, repeatGuestPercent: 22, topFeedback: 'Clear materials and a welcoming host helped first-timers feel comfortable.' },
]

export function readStored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}
