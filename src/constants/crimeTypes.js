export const CRIME_COLORS = {
  // Violent
  'HOMICIDE': '#cc0000',
  'MURDER (NON-NEGLIGENT)': '#cc0000',
  'CRIM SEXUAL ASSAULT': '#cc0066',
  'CRIMINAL SEXUAL ASSAULT': '#cc0066',
  'SEXUAL ASSAULT': '#cc0066',
  'RAPE': '#cc0066',
  'ASSAULT': '#ff3333',
  'AGGRAVATED ASSAULT': '#ff3333',
  'BATTERY': '#ff4444',
  'AGGRAVATED BATTERY': '#ff4444',
  'ROBBERY': '#ff6600',
  'KIDNAPPING': '#990000',

  // Property
  'BURGLARY': '#ffaa00',
  'THEFT': '#3399ff',
  'MOTOR VEHICLE THEFT': '#6633cc',
  'LARCENY': '#3399ff',
  'ARSON': '#ff8800',
  'CRIMINAL DAMAGE': '#cc8800',
  'VANDALISM': '#cc8800',

  // Other
  'NARCOTICS': '#33aa33',
  'DRUG OFFENSES': '#33aa33',
  'WEAPONS VIOLATION': '#aa6600',
  'WEAPONS OFFENSES': '#aa6600',
  'PROSTITUTION': '#aa3399',
  'STALKING': '#884400',
  'DECEPTIVE PRACTICE': '#666699',
  'FRAUD': '#666699',
  'OTHER': '#666666',
  'OTHER OFFENSE': '#666666',
  'MISCELLANEOUS': '#666666',
}

export const getCrimeColor = (type) =>
  CRIME_COLORS[type?.toUpperCase()] || CRIME_COLORS['OTHER']

export const CRIME_CATEGORIES = [
  { label: 'Homicide', key: 'HOMICIDE', color: '#cc0000' },
  { label: 'Sexual Assault', key: 'SEXUAL ASSAULT', color: '#cc0066' },
  { label: 'Assault / Battery', key: 'ASSAULT', color: '#ff3333' },
  { label: 'Robbery', key: 'ROBBERY', color: '#ff6600' },
  { label: 'Burglary', key: 'BURGLARY', color: '#ffaa00' },
  { label: 'Theft', key: 'THEFT', color: '#3399ff' },
  { label: 'Motor Vehicle Theft', key: 'MOTOR VEHICLE THEFT', color: '#6633cc' },
  { label: 'Narcotics', key: 'NARCOTICS', color: '#33aa33' },
  { label: 'Weapons', key: 'WEAPONS VIOLATION', color: '#aa6600' },
  { label: 'Arson', key: 'ARSON', color: '#ff8800' },
  { label: 'Other', key: 'OTHER', color: '#666666' },
]

export const CRIME_TYPE_GROUPS = {
  'HOMICIDE': 'HOMICIDE',
  'MURDER (NON-NEGLIGENT)': 'HOMICIDE',
  'CRIM SEXUAL ASSAULT': 'SEXUAL ASSAULT',
  'CRIMINAL SEXUAL ASSAULT': 'SEXUAL ASSAULT',
  'RAPE': 'SEXUAL ASSAULT',
  'ASSAULT': 'ASSAULT',
  'AGGRAVATED ASSAULT': 'ASSAULT',
  'BATTERY': 'ASSAULT',
  'AGGRAVATED BATTERY': 'ASSAULT',
  'ROBBERY': 'ROBBERY',
  'BURGLARY': 'BURGLARY',
  'THEFT': 'THEFT',
  'LARCENY': 'THEFT',
  'MOTOR VEHICLE THEFT': 'MOTOR VEHICLE THEFT',
  'NARCOTICS': 'NARCOTICS',
  'DRUG OFFENSES': 'NARCOTICS',
  'WEAPONS VIOLATION': 'WEAPONS VIOLATION',
  'WEAPONS OFFENSES': 'WEAPONS VIOLATION',
  'ARSON': 'ARSON',
}

export const normalizeType = (type) => {
  if (!type) return 'OTHER'
  return CRIME_TYPE_GROUPS[type.toUpperCase()] || type.toUpperCase()
}
