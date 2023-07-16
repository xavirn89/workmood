'use client'
import { ChangeEvent, useState, useRef, useEffect } from 'react'
import { FaPlay, FaPause, FaUndo, FaForward } from 'react-icons/fa'
import YouTube from 'react-youtube'

import { formatTime, extractYouTubeVideoId } from '@/utils/functions'
import { timers, stateName, playerOptions } from '@/utils/constants'
import YoutubeInput from '@/components/YoutubeInput'
import Button from '@/components/Button'

const Home = () => {
  const [state, setState] = useState<number>(0)
  const [currentTimer, setCurrentTimer] = useState<number>(timers[0])
  const [timerActive, setTimerActive] = useState<boolean>(false)

  const [activePlayer, setActivePlayer] = useState<number>(0)
  const [videoIds, setVideoIds] = useState<string[]>(['', '', ''])
  const players = useRef<(YouTube | null)[]>([null, null, null])
  const isVideoPlaying = useRef<boolean[]>([false, false, false])

  const [showInputs, setShowInputs] = useState<boolean>(false)
  const [showVideos, setShowVideos] = useState<boolean>(false)
  const [playerReady, setPlayerReady] = useState<boolean[]>([false, false, false])
  const [videoTitles, setVideoTitles] = useState<string[]>(['', '', ''])

  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    const videoId = extractYouTubeVideoId(value)
    if (!videoId || videoId === '') return

    const newVideoIds = [...videoIds]
    newVideoIds[index] = videoId
    setVideoIds(newVideoIds)

    const newPlayerReady = [...playerReady]
    newPlayerReady[index] = true
    setPlayerReady(newPlayerReady)

    // Reset the player when the URL changes
    players.current[index] = null
    isVideoPlaying.current[index] = false
  }

  useEffect(() => {
    if (players.current[activePlayer]) {
      (players.current[activePlayer] as any)?.pauseVideo()
      isVideoPlaying.current[activePlayer] = false
    }
    setActivePlayer(state)
    if (players.current[state]) {
      (players.current[state] as any)?.playVideo()
      isVideoPlaying.current[state] = true
    }
  }, [state])

  const onPlayerReady = (index: number, event: { target: any }): void => {
    players.current[index] = event.target
    const newVideoTitles = [...videoTitles]
    newVideoTitles[index] = event.target.getVideoData().title
    setVideoTitles(newVideoTitles)
  }

  const handleTest = (): void => {
    const testUrls = [
      "https://www.youtube.com/watch?v=K69tbUo3vGs&ab_channel=VisualEscape-RelaxingMusicwith4KVisuals",
      "https://www.youtube.com/watch?v=ipFaubyDUT4&ab_channel=CelticMusicWorld",
      "https://www.youtube.com/watch?v=MYPVQccHhAQ&ab_channel=RelaxingJazzPiano"
    ]
    const testIds = testUrls.map(url => extractYouTubeVideoId(url))
    setVideoIds(testIds)
  }

  const handleStart = (): void => {
    setTimerActive(true)
  }

  const handlePause = (): void => {
    setTimerActive(false)
  }

  const handleReset = (): void => {
    setCurrentTimer(timers[state])
    setCurrentTimer(timers[activePlayer])
  }

  const changeState = (): void => {
    
    let newState = state + 1
    if (newState >= 3) {
      newState = 0
    }
    setState(newState)
    setCurrentTimer(timers[newState])
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerActive) {
      interval = setInterval(() => {
        setCurrentTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    }


    if (timerActive && players.current[state]) {
      (players.current[state] as any)?.playVideo()
      isVideoPlaying.current[state] = true
    } else if (!timerActive && players.current[state]) {
      (players.current[state] as any)?.pauseVideo()
      isVideoPlaying.current[state] = false
    }

    return () => clearInterval(interval!)
  }, [timerActive])



  useEffect(() => {
    if (currentTimer === 0) {
      changeState()
    }
  }, [currentTimer])

  return (
    <main className="h-screen flex flex-col p-24 bg-[#BA4949] items-center">

        <div className="flex-grow flex flex-col">

          <div className="flex flex-col items-center justify-center">
            <h1 className="text-white text-4xl font-bold">{stateName[state]}</h1>
            <div className="bg-white text-black text-6xl font-bold rounded-full w-40 h-40 flex items-center justify-center mt-8">
              {formatTime(currentTimer)}
            </div>
          </div>
          

          <div className="flex flex-col flex-shrink-0">
            {showInputs && (<>
            <YoutubeInput
              placeholder="Pommodoro YouTube URL"
              onChange={(e) => handleInputChange(0, e)}
              isReady={playerReady[0]}
            />
            <p>{videoTitles[0]}</p>

            <YoutubeInput
              placeholder="Short Break YouTube URL"
              onChange={(e) => handleInputChange(1, e)}
              isReady={playerReady[1]}
            />
            <p>{videoTitles[1]}</p>

            <YoutubeInput
              placeholder="Long Break YouTube URL"
              onChange={(e) => handleInputChange(2, e)}
              isReady={playerReady[2]}
            />
            <p>{videoTitles[2]}</p>
            </>)}

            <div className={`flex space-x-2 ${!showVideos ? 'hidden' : ''}`}>
              {videoIds.map((videoId, index) => (
                <YouTube
                  key={index}
                  videoId={videoId}
                  opts={playerOptions}
                  // @ts-ignore
                  containerClassName={`w-64 h-36 ${activePlayer === index ? 'border-2 border-blue-500' : ''}`}
                  onReady={(e) => onPlayerReady(index, e)}
                />
              ))}
            </div>
          </div>
          

          <div className="flex-grow flex flex-col">
            <div className='flex gap-2'>
              <Button type={2} label={showInputs ? "Hide" : "Add Music"} onClick={() => setShowInputs(!showInputs)} />
              { playerReady.some((ready) => ready) && <Button type={2} label={showVideos ? "Hide Video" : "Show Video"} onClick={() => setShowVideos(!showVideos)}/> }
            </div>
            

            <div className="flex justify-center align-bottom mt-3">
              {!timerActive ? (
                <Button type={1} icon={FaPlay} onClick={handleStart} />
              ) : (
                <Button type={1} icon={FaPause} onClick={handlePause} />
              )}
              <Button type={1} icon={FaUndo} onClick={handleReset} />
              <Button type={1} icon={FaForward} onClick={changeState} />
              <button onClick={handleTest}>Test</button>
            </div>
          </div>
        </div>
    </main>
  )
}

export default Home

