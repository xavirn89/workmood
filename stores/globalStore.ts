import { create } from 'zustand'
import { StateName, timers } from '@/utils/constants'

type Store = {
  timeWork: number
  timeShortBreak: number
  timeLongBreak: number
  longBreakInterval: number
  changeTimeWork: (newValue: number) => void
  changeTimeShortBreak: (newValue: number) => void
  changeTimeLongBreak: (newValue: number) => void
  changeLongBreakInterval: (newValue: number) => void
}

export const useStore = create<Store>((set) => ({
  timeWork: timers[StateName.WORK],
  timeShortBreak: timers[StateName.SHORT_BREAK],
  timeLongBreak: timers[StateName.LONG_BREAK],
  longBreakInterval: 3,
  changeTimeWork: (newValue: number) => {
    set({ timeWork: newValue })
  },
  changeTimeShortBreak: (newValue: number) => {
    set({ timeShortBreak: newValue })
  },
  changeTimeLongBreak: (newValue: number) => {
    set({ timeLongBreak: newValue })
  },
  changeLongBreakInterval: (newValue: number) => {
    set({ longBreakInterval: newValue })
  },
}))



