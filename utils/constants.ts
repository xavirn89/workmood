export const timers: Record<string, number> = {
  "Work": 25 * 60,
  "Short Break": 5 * 60,
  "Long Break": 15 * 60
}

export const ambiencesURLs: Record<string, string> = {
  "Thunderstorm": "https://www.youtube.com/watch?v=gVKEM4K8J8A",
  "Waves": "https://www.youtube.com/watch?v=btmjDyff6E8",
  "Forest": "https://www.youtube.com/watch?v=xNN7iTA57jM",
  "Night": "https://www.youtube.com/watch?v=3TNK916Pjto"
}

export const buttonSources: Record<number, string> = {
  1: '/sounds/buttonSound1.mp3',
  2: '/sounds/buttonSound2.mp3',
  3: '/sounds/buttonSound3.mp3',
}

export enum StateName {
  WORK = "Work",
  SHORT_BREAK = "Short Break",
  LONG_BREAK = "Long Break"
}