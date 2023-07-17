export const formatTime = (seconds: number): string => {
  const minutes: number = Math.floor(seconds / 60)
  const remainingSeconds: number = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

export const getTimeFormatted = (inputSeconds: number): { minutes: string, seconds: string } => {
  const auxMinutes: number = Math.floor(inputSeconds / 60)
  const remainingSeconds: number = inputSeconds % 60
  const minutes: string = String(auxMinutes).padStart(2, '0')
  const seconds: string = String(remainingSeconds).padStart(2, '0')
  return { minutes, seconds }
}

export const getTimeValue = (inputSeconds: number, format: 'minutes' | 'seconds' | 'hours'): string => {
  const totalSeconds: number = Math.floor(inputSeconds)

  switch (format) {
    case 'minutes': {
      const minutes: number = Math.floor(totalSeconds / 60)
      return String(minutes).padStart(2, '0')
    }
    case 'seconds': {
      const seconds: number = totalSeconds % 60
      return String(seconds).padStart(2, '0')
    }
    case 'hours': {
      const hours: number = Math.floor(totalSeconds / 3600)
      return String(hours).padStart(2, '0')
    }
    default:
      throw new Error(`Invalid format: ${format}`)
  }
}

export const extractYouTubeVideoId = (url: string): string => {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/
  const match = url.match(regExp)
  return match && match[1] ? match[1] : ''
}

