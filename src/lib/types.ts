export type ScheduleCategory =
  | 'Morning Aarti'
  | 'Pooja'
  | 'Aarti'
  | 'Dhol'
  | 'Cultural'
  | 'Competition'
  | 'Other';

export interface ScheduleItem {
  id: string;
  name: string;
  category: ScheduleCategory;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  description?: string;
  active: boolean;
  order?: number;
}

export interface PoojaTiming {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  location: string; // Strictly "Stage"
  isSpecial: boolean;
  order: number;
}

export interface FestivalEvent {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  image: string;
  category: 'Cultural Program' | 'Bhajan' | 'Kids Activities' | 'Games' | 'Dance' | 'Music' | 'Special Pooja' | 'Prasadam';
  isFeatured: boolean;
  order: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isImportant: boolean;
  publishDate: string;
  expiryDate: string;
  active: boolean;
}

export interface CountdownItem {
  id: string;
  title: string;
  targetDate: string; // ISO 8601 string
  description: string;
  isActive: boolean;
  postEventMessage: string;
}

export interface VisarjanConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  targetDate: string; // ISO string
  routeDescription: string;
  stageLocation: string; // "Stage"
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: string;
  year: number;
  isFeatured: boolean;
  createdAt: string;
}

export interface Volunteer {
  id: string;
  name: string;
  flatNo: string;
  phone: string;
  category: 'Decoration' | 'Pooja' | 'Prasadam' | 'Cultural Events' | 'Photography' | 'Cleanup' | 'Visarjan';
  notes: string;
  createdAt: string;
  status: 'registered' | 'contacted' | 'confirmed';
}

export interface PrasadamSchedule {
  id: string;
  date: string;
  menu: string;
  time: string;
  location: string; // "Stage"
  sponsorNotes: string;
  isSpecial: boolean;
}

export interface Competition {
  id: string;
  name: string;
  date: string;
  time: string;
  category: string;
  description: string;
  registrationInfo: string;
  winners?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface MapMarker {
  id: string;
  title: string;
  category: 'stage' | 'gate' | 'parking' | 'seating' | 'photo' | 'washroom' | 'prasadam' | 'footwear';
  description: string;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  icon: string;
}

export interface ContactPerson {
  id: string;
  role: string;
  name: string;
  phone: string;
  availableHours: string;
}

export interface DonationInfo {
  heading: string;
  notice: string;
  contacts: {
    name: string;
    phone: string;
    role: string;
  }[];
}

export interface BlessingMessage {
  id: string;
  name: string;
  flatNo: string;
  message: string;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: string;
}

export interface MemoryItem {
  id: string;
  year: number;
  title: string;
  description: string;
  coverImage: string;
  highlights: string[];
}

export interface SiteSettings {
  siteTitle: string;
  subtitle: string;
  tagline: string;
  activeCountdownId: string;
  liveAartiUrl: string;
  announcementTickerEnabled: boolean;
  apartmentName: string;
  city: string;
  maintenanceMode?: boolean;
}

export interface PushSubscriptionItem {
  id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: string;
}

export interface SentNotificationItem {
  id: string;
  title: string;
  message: string;
  url?: string;
  category: 'aarti' | 'announcement' | 'event' | 'general';
  sentAt: string;
  recipientCount: number;
}

export interface FullDatabaseState {
  schedule: ScheduleItem[];
  poojaTimings: PoojaTiming[];
  events: FestivalEvent[];
  announcements: Announcement[];
  countdowns: CountdownItem[];
  visarjan: VisarjanConfig;
  gallery: GalleryItem[];
  volunteers: Volunteer[];
  prasadam: PrasadamSchedule[];
  competitions: Competition[];
  mapMarkers: MapMarker[];
  contacts: ContactPerson[];
  donations: DonationInfo;
  blessings: BlessingMessage[];
  memories: MemoryItem[];
  siteSettings: SiteSettings;
  pushSubscriptions?: PushSubscriptionItem[];
  sentNotifications?: SentNotificationItem[];
}

