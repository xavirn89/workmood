'use client'
import { useState, useEffect } from 'react'

import { StateName, timers } from '@/utils/constants'
import { useStore } from "@/stores/globalStore"

interface Props {
  state: StateName
  changeState: () => void
}

const useTimer = ({ state, changeState }: Props) => {
  const { timeWork, timeShortBreak, timeLongBreak, timer, changeTimer, tickTimer } = useStore()

  const [timerActive, setTimerActive] = useState<boolean>(false)

  const resetTimer = () => {
    if (state === StateName.WORK) {
      changeTimer(timeWork)
    } else if (state === StateName.SHORT_BREAK) {
      changeTimer(timeShortBreak)
    } else if (state === StateName.LONG_BREAK) {
      changeTimer(timeLongBreak)
    }
  }

  const toggleTimerActive = () => {
    setTimerActive(prevTimerActive => !prevTimerActive)
  }

  useEffect(() => {
    resetTimer()
  }, [state, timeWork, timeShortBreak, timeLongBreak])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerActive) {
      interval = setInterval(() => {
        tickTimer()
      }, 1000)
    } else if (!timerActive && timer !== 0) {
      clearInterval(interval!)
    } else if (!timerActive && timer === 0) {
      changeState()
    }

    return () => clearInterval(interval!)
  }, [timerActive])

  return { timer, timerActive, resetTimer, tickTimer, toggleTimerActive }
}
export default useTimer