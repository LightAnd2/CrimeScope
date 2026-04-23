export const SEVERITY_COLORS = {
  'VIOLENT':          '#e53e3e',
  'PROPERTY':         '#ed8936',
  'NARCOTICS':        '#38a169',
  'QUALITY OF LIFE':  '#4299e1',
  'OTHER':            '#718096',
}

const VIOLENT_PATTERNS = [
  'homicide', 'murder', 'manslaughter', 'assault', 'battery',
  'robbery', 'rape', 'sexual', 'kidnap', 'stalk', 'shooting',
  'threat', 'intimidat', 'domestic',
]

const PROPERTY_PATTERNS = [
  'theft', 'burglary', 'larceny', 'motor vehicle', 'arson',
  'damage', 'vandal', 'trespass', 'shoplifting', 'stolen',
  'embezzl', 'extort', 'forgery', 'counterfeit',
]

const NARCOTICS_PATTERNS = [
  'narcotic', 'drug', 'marijuana', 'cannabis', 'cocaine', 'heroin',
  'methamphet', 'paraphernalia', 'controlled substance', 'possession of',
]

const QOL_PATTERNS = [
  'weapon', 'fraud', 'deceptive', 'prostitut', 'peace', 'liquor',
  'obscen', 'gambling', 'concealed', 'interference', 'disorder',
  'loiter', 'sex offense', 'child', 'juvenile', 'public',
]

export function getSeverity(type) {
  if (!type) return 'OTHER'
  const t = type.toLowerCase()
  if (VIOLENT_PATTERNS.some(p => t.includes(p))) return 'VIOLENT'
  if (NARCOTICS_PATTERNS.some(p => t.includes(p))) return 'NARCOTICS'
  if (PROPERTY_PATTERNS.some(p => t.includes(p))) return 'PROPERTY'
  if (QOL_PATTERNS.some(p => t.includes(p))) return 'QUALITY OF LIFE'
  return 'OTHER'
}

export const getCrimeColor = (type) =>
  SEVERITY_COLORS[getSeverity(type)] ?? SEVERITY_COLORS['OTHER']

export const CRIME_CATEGORIES = [
  { label: 'Violent',         key: 'VIOLENT',         color: SEVERITY_COLORS['VIOLENT'] },
  { label: 'Property',        key: 'PROPERTY',        color: SEVERITY_COLORS['PROPERTY'] },
  { label: 'Narcotics',       key: 'NARCOTICS',       color: SEVERITY_COLORS['NARCOTICS'] },
  { label: 'Quality of Life', key: 'QUALITY OF LIFE', color: SEVERITY_COLORS['QUALITY OF LIFE'] },
  { label: 'Other',           key: 'OTHER',           color: SEVERITY_COLORS['OTHER'] },
]

export const normalizeType = (type) => {
  if (!type) return 'OTHER'
  return type.toUpperCase()
}
