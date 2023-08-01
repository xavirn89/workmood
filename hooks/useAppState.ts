'use client'
import { useState } from 'react'

import { StateName } from '@/utils/constants'
import { StateObject } from '@/types/mainTypes'

import { useStore } from "@/stores/globalStore"

const useAppState = () => {
  const [state, setState] = useState<StateName>(StateName.WORK)
  const { longBreakInterval } = useStore()
  const [round, setRound] = useState<number>(0)

  const [stateData, setStateData] = useState<Record<string, StateObject>>({
    [StateName.WORK]: {
      state: StateName.WORK,
      players: []
    },
    [StateName.SHORT_BREAK]: {
      state: StateName.SHORT_BREAK,
      players: []
    },
    [StateName.LONG_BREAK]: {
      state: StateName.LONG_BREAK,
      players: []
    }
  })

  const addPlayerIDToStateData = (playerID: string, state: StateName): void => {
    setStateData(prevStateData => {
      const updatedPlayers = [...prevStateData[state].players, playerID]
      return { ...prevStateData, [state]: { ...prevStateData[state], players: updatedPlayers } }
    })
  }

  const removePlayerIDFromStateData = (buttonPlayerId: string, state: StateName): void => {
    setStateData(prevStateData => {
      const updatedPlayers = prevStateData[state].players.filter(player => player !== buttonPlayerId)
      return { ...prevStateData, [state]: { ...prevStateData[state], players: updatedPlayers } }
    })
  }

  const changeState = (): void => {
    if (state === StateName.WORK) {
      if (round === longBreakInterval) {
        setRound(0)
        setState(StateName.LONG_BREAK)
      } else {
        setState(StateName.SHORT_BREAK)
      }
    } else if (state === StateName.SHORT_BREAK) {
      if (round < longBreakInterval) {
        setRound(round + 1)
      }
      setState(StateName.WORK)
    } else if (state === StateName.LONG_BREAK) {
      setState(StateName.WORK)
    }
  }


  return { state, stateData, addPlayerIDToStateData, removePlayerIDFromStateData, changeState }
}
export default useAppState