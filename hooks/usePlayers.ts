'use client'
import { useState, useEffect, useCallback } from 'react'
import { PlayerObject } from '@/types/mainTypes'
import { useStore } from "@/stores/globalStore"

interface Props {
  stateData: Record<string, any>
  state: string
  musicVolume: number
  ambienceVolume: number
  timerActive: boolean
}

const usePlayers = ({ stateData, state, musicVolume, ambienceVolume, timerActive }: Props) => {
  const [players, setPlayers] = useState<PlayerObject[]>([])
  const { mute } = useStore()

  const toggleVideoPlayback = useCallback((playerIDs: string[], shouldPlay: boolean) => {
    setPlayers(players => players.map(player => {
      if (!playerIDs.includes(player.id) || !player.ready) {
        return player
      }

      (player.player as any)?.[shouldPlay ? 'playVideo' : 'pauseVideo']()

      return {...player, isPlaying: shouldPlay}
    }))
  }, [])

  const checkPlayersForCurrentState = useCallback(() => {
    const playerIDsToPlay: string[] = stateData[state].players
    const playerIDsToPause: string[] = players
      .filter(player => !playerIDsToPlay.includes(player.id))
      .map(player => player.id)

    toggleVideoPlayback(players.map(player => player.id), timerActive)
    if (timerActive) {
      toggleVideoPlayback(playerIDsToPause, false)
    }
  }, [stateData, state, players, timerActive, toggleVideoPlayback])

  const handlePlayerReady = useCallback((playerID: string, event: { target: any }): void => {
    setPlayers(players => players.map(player => {
      if (player.id !== playerID) {
        return player
      }

      const newVolume = player.type === 'input' ? musicVolume : ambienceVolume
      event.target.setVolume(newVolume)

      return {
        ...player,
        player: event.target,
        ready: true,
        title: event.target.getVideoData().title
      }
    }))

    checkPlayersForCurrentState()
  }, [musicVolume, ambienceVolume, checkPlayersForCurrentState])

  const createNewPlayer = useCallback((playerID: string, videoId: string, type: 'input' | 'ambience'): void => {
    setPlayers(players => [...players, {
      player: null,
      isPlaying: false,
      videoId,
      title: '',
      ready: false,
      id: playerID,
      type
    }])
  }, [])

  const updatePlayersVolume = useCallback((event: React.ChangeEvent<HTMLInputElement>, playerType: 'input' | 'ambience') => {
    setPlayers(players => players.map(player => {
      if (player.type !== playerType) {
        return player
      }

      (player.player as any)?.setVolume(Number(event.target.value))

      return player
    }))
  }, [])

  useEffect(() => {  
    if (mute) {
      let event = {
        target: { value: '0' }
      } as React.ChangeEvent<HTMLInputElement>
      updatePlayersVolume(event, 'ambience')
      updatePlayersVolume(event, 'input')
    } else {
      let event = {
        target: { value: String(ambienceVolume) }
      } as React.ChangeEvent<HTMLInputElement>
      updatePlayersVolume(event, 'ambience')
      updatePlayersVolume(event, 'input')
    }
  }, [mute, ambienceVolume, updatePlayersVolume])

  return { players, checkPlayersForCurrentState, handlePlayerReady, createNewPlayer, updatePlayersVolume }
}

export default usePlayers
