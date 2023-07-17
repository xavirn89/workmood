'use client'
import { ChangeEvent, useState, useRef, useEffect } from 'react'
import { FaPlay, FaPause, FaUndo, FaForward } from 'react-icons/fa'
import { BsGearFill } from 'react-icons/bs'
import YouTube from 'react-youtube'

import { formatTime, extractYouTubeVideoId , getTimeValue} from '@/utils/functions'
import { timers, stateName } from '@/utils/constants'
import YoutubeInput from '@/components/YoutubeInput'
import Button from '@/components/Button'

const Test = () => {
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

  const playerOptions: {
    height: string;
    width: string;
  } = {
    height: '390',
    width: '640',
  }

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

  return (<>
    <div className="flex flex-col h-screen justify-between bg-[#BA4949]">
      {/* Menú superior */}
      <nav className="flex items-center justify-end p-6 w-3/6 mx-auto">
        <div className="text-white">
          <BsGearFill />
        </div>
      </nav>

      {/* Elemento central */}
      <main className="flex-grow">
        <div className="flex flex-col items-center h-full">
          <h1 className="text-white text-4xl font-bold">{stateName[state]}</h1>

          <div className="grid grid-flow-col gap-5 text-center auto-cols-max mt-10">
            <div className="flex flex-col p-2 bg-slate-200 rounded-box text-neutral-content">
              <span className="countdown font-mono text-8xl text-black">
                <span style={{ "--value": getTimeValue(currentTimer, 'minutes') } as React.CSSProperties}></span>
              </span>
              min
            </div> 
            <div className="flex flex-col p-2 bg-slate-200 rounded-box text-neutral-content">
              <span className="countdown font-mono text-8xl text-black">
                <span style={{ "--value": getTimeValue(currentTimer, 'seconds') } as React.CSSProperties}></span>
              </span>
              sec
            </div>
          </div>

          {showInputs && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-10">
              <div className="bg-white p-8 rounded-md">
                <YoutubeInput
                  placeholder="Pommodoro YouTube URL"
                  onChange={(e) => handleInputChange(0, e)}
                  isReady={playerReady[0]}
                />

                <YoutubeInput
                  placeholder="Short Break YouTube URL"
                  onChange={(e) => handleInputChange(1, e)}
                  isReady={playerReady[1]}
                />

                <YoutubeInput
                  placeholder="Long Break YouTube URL"
                  onChange={(e) => handleInputChange(2, e)}
                  isReady={playerReady[2]}
                />
              </div>
            </div>
          )}

          <div className={`hidden`}>
            {videoIds.map((videoId, index) => (
              <div key={index} className={`${state !== index ? 'hidden' : ''} p-2 bg-neutral-200 rounded border-b-4 border-l-2 shadow-lg border-neutral-500 youtube-player-wrapper`}>
                <YouTube
                  videoId={videoId}
                  opts={{
                    height: '100%',
                    width: '100%',
                    playerVars: {
                      autoplay: 0,
                      controls: 0,
                      loop: 1,
                      modestbranding: 1,
                      rel: 0,
                      showinfo: 0,
                    },
                  }}
                  onReady={(e) => onPlayerReady(index, e)}
                />
              </div>
            ))}
          </div>

        </div>
      </main>


      {/* Caja de botones en la parte inferior */}
      <footer className="flex flex-col justify-center mb-10">
        <div className='flex justify-center mb-2'>
          {timers[state]-currentTimer !== 0 && <progress className="progress w-3/6 mx-auto" value={timers[state]-currentTimer} max={timers[state]}></progress>}
        </div>
        <div className='flex gap-2 justify-center items-center'>
          <span className={showInputs ? "z-10" : ""}><Button type={2} label={showInputs ? "Hide Music" : "Add Music"} onClick={() => setShowInputs(!showInputs)} /></span>
          { /* playerReady.some((ready) => ready) && <Button type={2} label={showVideos ? "Hide Video" : "Show Video"} onClick={() => setShowVideos(!showVideos)}/> */}
        </div>
        
        <div className="flex mt-3 justify-center items-center">
          {!timerActive ? (
            <Button type={1} icon={FaPlay} onClick={handleStart} />
          ) : (
            <Button type={1} icon={FaPause} onClick={handlePause} />
          )}
          <Button type={1} icon={FaUndo} onClick={handleReset} />
          <Button type={1} icon={FaForward} onClick={changeState} />
        </div>
      </footer>
    </div>
  </>)
}
export default Test






