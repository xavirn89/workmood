'use client'
import { useState, useEffect } from 'react'
import { PlayerObject } from '@/types/mainTypes'

interface Props {
  stateData: Record<string, any>
  state: string
  musicVolume: number
  ambienceVolume: number
  timerActive: boolean
}

const usePlayers = ({ stateData, state, musicVolume, ambienceVolume, timerActive }: Props) => {
  const [players, setPlayers] = useState<PlayerObject[]>([])

  const playVideos = (playerIDs: string[]) => {
    let newPlayers = [...players]
    newPlayers = newPlayers.map(player => {
        if (!playerIDs.includes(player.id)) {
            return player
        }
        if (player.ready) {
            (player.player as any)?.playVideo()
            return {...player, isPlaying: true}
        }
        return player
    })
    setPlayers(newPlayers)
  }

  
  const pauseVideos = (playerIDs: string[]) => {
    let newPlayers = [...players]
    newPlayers = newPlayers.map(player => {
        if (!playerIDs.includes(player.id)) {
            return player
        }
        if (player.ready) {
            (player.player as any)?.pauseVideo()
            return {...player, isPlaying: false}
        }
        return player
    })
    setPlayers(newPlayers)
  }

  const checkPlayersForCurrentState = () => {
    const playersIDsToPlay: string[] = stateData[state].players
    const playersToPause = players.filter(player => !playersIDsToPlay.includes(player.id))
    const playersIDsToPause: string[] = playersToPause.map(player => player.id)

    if (!timerActive) {
      const allPlayersIDs = players.map(player => player.id)
      pauseVideos(allPlayersIDs)
    } else {
      playVideos(playersIDsToPlay)
      pauseVideos(playersIDsToPause)
    }
  }

  const handlePlayerReady = (playerID: string, event: { target: any }): void => {
    const newPlayers = [...players]
    const index = newPlayers.findIndex(player => player.id === playerID)
    const newVolume = newPlayers[index].type === 'input' ? musicVolume : ambienceVolume
    event.target.setVolume(newVolume)
    newPlayers[index].player = event.target
    newPlayers[index].ready = true
    newPlayers[index].title = event.target.getVideoData().title
    setPlayers(newPlayers)
    checkPlayersForCurrentState()
  }

  const createNewInputPlayer = (playerID: string, videoId: string): void => {
    const newPlayers = [...players]
    newPlayers.push({
      player: null,
      isPlaying: false,
      videoId: videoId,
      title: '',
      ready: false,
      id: playerID,
      type: 'input'
    })
    setPlayers(newPlayers)
  }

  const createNewAmbiencePlayer = (buttonPlayerId: string, videoId: string): void => {
    const newPlayers = [...players]
    newPlayers.push({
      player: null,
      isPlaying: false,
      videoId: videoId,
      title: '',
      ready: false,
      id: buttonPlayerId,
      type: 'ambience'
    })
    setPlayers(newPlayers)
  }

  function updatePlayersVolume (event: React.ChangeEvent<HTMLInputElement>, playerType: 'input' | 'ambience') {
    const newPlayers = [...players]
    newPlayers.forEach(player => {
      if (player.type === playerType) {
        (player.player as any)?.setVolume(Number(event.target.value))
      }
    })
    setPlayers(newPlayers)
  }

  return { players, checkPlayersForCurrentState, handlePlayerReady, createNewInputPlayer, createNewAmbiencePlayer, updatePlayersVolume }
}
export default usePlayers