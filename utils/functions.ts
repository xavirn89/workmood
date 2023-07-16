export const formatTime = (seconds: number): string => {
  const minutes: number = Math.floor(seconds / 60)
  const remainingSeconds: number = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

export const extractYouTubeVideoId = (url: string): string => {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/
  const match = url.match(regExp)
  return match && match[1] ? match[1] : ''
}

