import { ScheduleItem, ScheduleCategory } from './types';

/**
 * Converts a 12-hour time string (e.g., "07:00 AM", "6:00 PM", "7:30 PM") into minutes from midnight.
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridian = match[3]?.toUpperCase();

  if (meridian === 'PM' && hours < 12) {
    hours += 12;
  } else if (meridian === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Extracts a comparable day number or date key (e.g. "14", "15", "16", "17", "18", "19") from date strings.
 */
export function extractDayNumber(dateStr: string): number {
  if (!dateStr) return 0;
  const match = dateStr.match(/(\d{1,2})/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Sorts schedule items chronologically: first by day of festival (14-19 Sep), then by start time.
 */
export function sortScheduleChronologically(items: ScheduleItem[]): ScheduleItem[] {
  return [...items].sort((a, b) => {
    const dayA = extractDayNumber(a.date);
    const dayB = extractDayNumber(b.date);

    if (dayA !== dayB) {
      return dayA - dayB;
    }

    const timeA = parseTimeToMinutes(a.startTime);
    const timeB = parseTimeToMinutes(b.startTime);
    return timeA - timeB;
  });
}

/**
 * Category styling tokens and icons matching the Royal Chintamani design system.
 */
export function getCategoryBadgeStyle(category: ScheduleCategory | string): {
  bg: string;
  color: string;
  border: string;
  icon: string;
} {
  switch (category) {
    case 'Morning Aarti':
      return {
        bg: 'rgba(255, 179, 0, 0.2)',
        color: '#ffc107',
        border: '1px solid rgba(255, 179, 0, 0.45)',
        icon: '🌅',
      };
    case 'Pooja':
      return {
        bg: 'rgba(212, 175, 55, 0.22)',
        color: '#ffd700',
        border: '1px solid rgba(212, 175, 55, 0.5)',
        icon: '🪔',
      };
    case 'Aarti':
      return {
        bg: 'rgba(244, 81, 30, 0.22)',
        color: '#ff7043',
        border: '1px solid rgba(244, 81, 30, 0.5)',
        icon: '🔥',
      };
    case 'Dhol':
      return {
        bg: 'rgba(183, 28, 28, 0.25)',
        color: '#ff8a80',
        border: '1px solid rgba(255, 82, 82, 0.5)',
        icon: '🥁',
      };
    case 'Cultural':
      return {
        bg: 'rgba(156, 39, 176, 0.22)',
        color: '#ce93d8',
        border: '1px solid rgba(186, 104, 200, 0.5)',
        icon: '🎭',
      };
    case 'Competition':
      return {
        bg: 'rgba(46, 125, 50, 0.22)',
        color: '#81c784',
        border: '1px solid rgba(76, 175, 80, 0.5)',
        icon: '🏆',
      };
    case 'Other':
    default:
      return {
        bg: 'rgba(253, 251, 247, 0.12)',
        color: '#fdfbf7',
        border: '1px solid rgba(253, 251, 247, 0.3)',
        icon: '✨',
      };
  }
}
