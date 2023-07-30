import { create } from 'zustand'
import { StateName, timers } from '@/utils/constants'

type Store = {
  timeWork: number
  timeShortBreak: number
  timeLongBreak: number
  longBreakInterval: number
  musicVolume: number
  ambienceVolume: number
  mute: boolean
  timer: number
  changeTimeWork: (newValue: number) => void
  changeTimeShortBreak: (newValue: number) => void
  changeTimeLongBreak: (newValue: number) => void
  changeLongBreakInterval: (newValue: number) => void
  changeMusicVolume: (newValue: number) => void
  changeAmbienceVolume: (newValue: number) => void
  toggleMute: () => void
  changeTimer: (newValue: number) => void
  tickTimer: () => void
}

export const useStore = create<Store>((set) => ({
  timeWork: timers[StateName.WORK],
  timeShortBreak: timers[StateName.SHORT_BREAK],
  timeLongBreak: timers[StateName.LONG_BREAK],
  longBreakInterval: 3,
  musicVolume: 50,
  ambienceVolume: 25,
  mute: false,
  timer: timers[StateName.WORK],
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
  changeMusicVolume: (newValue: number) => {
    set({ musicVolume: newValue })
  },
  changeAmbienceVolume: (newValue: number) => {
    set({ ambienceVolume: newValue })
  },
  toggleMute: () => {
    set((state) => ({ mute: !state.mute }))
  },
  changeTimer: (newValue: number) => {
    set({ timer: newValue })
  },
  tickTimer: () => {
    set((state) => ({ timer: state.timer - 1 }))
  }
}))



