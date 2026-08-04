const DEFAULT_LOCALE = 'vi-VN'

export function formatDate(value: string | number | Date, locale = DEFAULT_LOCALE) {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatDateTime(value: string | number | Date, locale = DEFAULT_LOCALE) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}
