'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import YouTube from 'react-youtube'

export default function Home() {
  const [currentTimer, setCurrentTimer] = useState<number>(25 * 60)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [state, setState] = useState<string>('Pomodoro')
  const [rounds, setRounds] = useState<number>(0)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [volume, setVolume] = useState<number>(50)
  const numRounds: number = 3
  const playerRef = useRef<any>(null)

  const timers: Record<string, number> = {
    'Pomodoro': 25 * 60,
    'Short Break': 5 * 60,
    'Long Break': 15 * 60
  }

  const changeState = useCallback(() => {
    switch (state) {
      case 'Pomodoro':
        if (rounds >= numRounds) {
          setState('Long Break')
          setCurrentTimer(timers['Long Break'])
          setRounds(0)
        } else {
          setState('Short Break')
          setCurrentTimer(timers['Short Break'])
        }
        break
      case 'Short Break':
        setRounds(prevRounds => prevRounds + 1)
        setState('Pomodoro')
        setCurrentTimer(timers['Pomodoro'])
        break
      case 'Long Break':
        setState('Pomodoro')
        setCurrentTimer(timers['Pomodoro'])
        break
      default:
        break
    }
  }, [state, rounds])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        setCurrentTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    }

    return () => clearInterval(interval!)
  }, [isActive])

  useEffect(() => {
    if (currentTimer === 0) {
      setIsActive(false)
      changeState()
    }
  }, [currentTimer, changeState])

  useEffect(() => {
    if (state === 'Pomodoro' && isActive && playerRef.current) {
      playerRef.current.playVideo();
    } else if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  }, [state, isActive])

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume])

  const formatTime = (seconds: number): string => {
    const minutes: number = Math.floor(seconds / 60)
    const remainingSeconds: number = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  const handleStart = (): void => {
    setIsActive(true)
  }

  const handlePause = (): void => {
    setIsActive(false)
  }

  const handleReset = (): void => {
    setIsActive(false)
    setState('Pomodoro')
    setCurrentTimer(25 * 60)
    setRounds(0)
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setVolume(parseInt(event.target.value, 10))
  }

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setVideoUrl(event.target.value)
  }

  const getVideoId = (url: string): string => {
    // Extracts the video ID from a YouTube URL
    const regex = /(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const matches = url.match(regex)
    if (matches && matches[2].length === 11) {
      return matches[2]
    } else {
      return ''
    }
  }

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 0,
    },
  }

  const onPlayerReady = (event: { target: any }) => {
    playerRef.current = event.target
    setVolume(playerRef.current.getVolume())
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-red-400">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl font-bold">{state}</h1>
        <div className="bg-white text-black text-6xl font-bold rounded-full w-40 h-40 flex items-center justify-center mt-8">
          {formatTime(currentTimer)}
        </div>
      </div>
      <div className="flex justify-center mt-8">
        {!isActive ? (
          <button className="mr-4 bg-white text-black px-4 py-2 rounded-lg" onClick={handleStart}>
            Start
          </button>
        ) : (
          <button className="mr-4 bg-white text-black px-4 py-2 rounded-lg" onClick={handlePause}>
            Pause
          </button>
        )}
        <button className="mr-4 bg-white text-black px-4 py-2 rounded-lg" onClick={handleReset}>
          Reset
        </button>
        <button className="mr-4 bg-white text-black px-4 py-2 rounded-lg" onClick={changeState}>
          Next
        </button>
      </div>
      <div className="flex justify-center mt-8">
        <input type="text" value={videoUrl} onChange={handleVideoChange} placeholder="Enter YouTube video URL"/>
        <YouTube videoId={getVideoId(videoUrl)} opts={opts} onReady={onPlayerReady}/>
      </div>
      <div className="flex justify-center mt-8">
        <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange}/>
      </div>
    </main>
  )
}
