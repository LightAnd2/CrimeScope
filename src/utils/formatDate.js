import { format } from 'date-fns'

export const formatDateTime = (date) => {
  if (!date || isNaN(date.getTime())) return 'Unknown'
  return format(date, 'MMM d, yyyy h:mm a')
}

export const formatDate = (date) => {
  if (!date || isNaN(date.getTime())) return 'Unknown'
  return format(date, 'MMM d, yyyy')
}

export const formatISODate = (date) => {
  if (!date) return ''
  return format(date, "yyyy-MM-dd'T'HH:mm:ss")
}
