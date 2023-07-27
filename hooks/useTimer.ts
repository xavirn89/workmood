'use client'
import { useState, useEffect } from 'react'

import { StateName, timers } from '@/utils/constants'

interface Props {
  state: StateName
  changeState: () => void
}

const useTimer = ({ state, changeState }: Props) => {
  const [timeWork, setTimeWork] = useState<number>(timers[StateName.WORK])
  const [timeShortBreak, setTimeShortBreak] = useState<number>(timers[StateName.SHORT_BREAK])
  const [timeLongBreak, setTimeLongBreak] = useState<number>(timers[StateName.LONG_BREAK])
  const [timer, setTimer] = useState<number>(timers[StateName.WORK])

  const [timerActive, setTimerActive] = useState<boolean>(false)

  const resetTimer = () => {
    if (state === StateName.WORK) {
      setTimer(timeWork)
    } else if (state === StateName.SHORT_BREAK) {
      setTimer(timeShortBreak)
    } else if (state === StateName.LONG_BREAK) {
      setTimer(timeLongBreak)
    }
  }

  function tickTimer () {
    setTimer(prevTimer => prevTimer - 1)
  }

  const toggleTimerActive = () => {
    setTimerActive(prevTimerActive => !prevTimerActive)
  }

  useEffect(() => {
    resetTimer()
  }, [state])

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

  return { timer, timeWork, timeShortBreak, timeLongBreak, timerActive, resetTimer, tickTimer, toggleTimerActive }
}
export default useTimer