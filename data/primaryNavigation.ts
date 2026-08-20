export type PrimaryNavigationSection =
  | 'challenge'
  | 'phonetics'
  | 'characters'
  | 'stats'

export type PrimaryNavigationIcon =
  | 'map'
  | 'phonetics'
  | 'characters'
  | 'stats'

export interface PrimaryNavigationItem {
  section: PrimaryNavigationSection
  label: string
  to: string
  icon: PrimaryNavigationIcon
}

export const primaryNavigationItems: PrimaryNavigationItem[] = [
  {
    section: 'challenge',
    label: 'Challenge',
    to: '/',
    icon: 'map',
  },
  {
    section: 'phonetics',
    label: 'Phonetics',
    to: '/phonetics',
    icon: 'phonetics',
  },
  {
    section: 'characters',
    label: 'Characters',
    to: '/reference',
    icon: 'characters',
  },
  {
    section: 'stats',
    label: 'Stats',
    to: '/stats',
    icon: 'stats',
  },
]

export function getAdjacentPrimaryNavigation(
  section: PrimaryNavigationSection,
): {
  previous: PrimaryNavigationItem
  next: PrimaryNavigationItem
} {
  const currentIndex = primaryNavigationItems.findIndex(item => item.section === section)
  const previousIndex = (currentIndex - 1 + primaryNavigationItems.length)
    % primaryNavigationItems.length
  const nextIndex = (currentIndex + 1) % primaryNavigationItems.length

  return {
    previous: primaryNavigationItems[previousIndex]!,
    next: primaryNavigationItems[nextIndex]!,
  }
}
