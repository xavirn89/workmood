'use client'
import { useState, useEffect, useRef } from 'react'

import { StateName, timers } from '@/utils/constants'
import { useStore } from "@/stores/globalStore"

interface Props {
  state: StateName
  changeState: () => void
}

const useTimer = ({ state, changeState }: Props) => {
  const { timeWork, timeShortBreak, timeLongBreak, timer, changeTimer, tickTimer } = useStore()
  const [timerActive, setTimerActive] = useState<boolean>(false)
  const audioRef = useRef(new Audio('/sounds/ding.mp3'))

  const resetTimer = () => {
    const times = {
      [StateName.WORK]: timeWork,
      [StateName.SHORT_BREAK]: timeShortBreak,
      [StateName.LONG_BREAK]: timeLongBreak
    }

    changeTimer(times[state])
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
    } else {
      clearInterval(interval!)
      if (timer === 0) {
        changeState()
      }
    }

    return () => clearInterval(interval!)
  }, [timerActive, timer])

  useEffect(() => {
    if (timer === 10 || timer < 4) {
      audioRef.current.play()
    }
    if (timer < 0) {
      changeState()
    }
  }, [timer])

  return { timer, timerActive, resetTimer, tickTimer, toggleTimerActive }
}

export default useTimer
