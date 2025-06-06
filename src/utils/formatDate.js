// path: src/utils/formatDate.js
export const formatDate = (date) => {
  if (!date) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}

export const formatDateTime = (date) => {
  if (!date) return ''
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(date).toLocaleString(undefined, options)
}

export const formatTime = (date) => {
  if (!date) return ''
  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' }
  return new Date(date).toLocaleTimeString(undefined, options)
}
