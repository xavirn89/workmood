import YouTube from 'react-youtube'

export interface PlayerObject {
  player: YouTube | null
  isPlaying: boolean
  videoId: string
  title: string
  ready: boolean
  id: string
  type: string
}

export interface StateObject {
  state: string
  players: string[]
}
