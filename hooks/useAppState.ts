'use client'
import { useState, useEffect } from 'react'

import { StateName } from '@/utils/constants'
import { StateObject } from '@/types/mainTypes'

const useAppState = () => {
  const [state, setState] = useState<StateName>(StateName.WORK)
  const [longBreakInterval, setLongBreakInterval] = useState<number>(3)

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

  function addPlayerIDToStateData (playerID: string, state: StateName): void {
    /* en stateData[state].players, añadir un elemento con el valor de playerID */
    setStateData(prevStateData => ({
      ...prevStateData,
      [state]: {
        ...prevStateData[state],
        players: [...prevStateData[state].players, playerID]
      }
    }))
  }

  function removePlayerIDFromStateData (buttonPlayerId: string, state: StateName): void {
    /* en stateData[state].players, eliminar el elemento que tenga el mismo valor que playerID */
    setStateData(prevStateData => ({
      ...prevStateData,
      [state]: {
        ...prevStateData[state],
        players: prevStateData[state].players.filter(player => player !== buttonPlayerId)
      }
    }))
  }

  const changeState = (): void => {
    if (state === StateName.WORK) {
      setState(StateName.SHORT_BREAK)
    } else if (state === StateName.SHORT_BREAK) {
      setState(StateName.LONG_BREAK)
    } else if (state === StateName.LONG_BREAK) {
      setState(StateName.WORK)
    }
  }


  return { state, stateData, addPlayerIDToStateData, removePlayerIDFromStateData, changeState, longBreakInterval }
}
export default useAppState