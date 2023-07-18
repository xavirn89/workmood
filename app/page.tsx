'use client'
import { useState, useEffect, useRef, ChangeEvent } from 'react'
import YouTube from 'react-youtube'
import { FaPlay, FaPause, FaUndo, FaForward, FaCheck } from 'react-icons/fa'
import { IoThunderstormSharp, IoCloudyNight } from 'react-icons/io5'
import { GiBigWave } from 'react-icons/gi'
import { MdForest } from 'react-icons/md'

import { getTimeValue, extractYouTubeVideoId } from '@/utils/functions'

import YoutubeInput from '@/components/YoutubeInput'
import Button from '@/components/Button'


const timers: Record<string, number> = {
  "Work": 25 * 60,
  "Short Break": 5 * 60,
  "Long Break": 15 * 60
}

const stateName = {
  WORK: "Work",
  SHORT_BREAK: "Short Break",
  LONG_BREAK: "Long Break"
}

const ambiencesURLs: Record<string, string> = {
  "Thunderstorm": "https://www.youtube.com/watch?v=gVKEM4K8J8A",
  "Waves": "https://www.youtube.com/watch?v=btmjDyff6E8",
  "Forest": "https://www.youtube.com/watch?v=xNN7iTA57jM",
  "Night": "https://www.youtube.com/watch?v=3TNK916Pjto"
}

interface PlayerObject {
  player: YouTube | null
  isPlaying: boolean
  videoId: string
  title: string
  ready: boolean
  id: string
  type: string
}

interface StateObject {
  state: string
  players: string[]
}


const Test = () => {
  const [prevState, setPrevState] = useState<string>('')
  const [state, setState] = useState<string>(stateName.WORK)
  const [timer, setTimer] = useState<number>(timers[state])

  const [players, setPlayers] = useState<PlayerObject[]>([])

  //flags
  const [timerActive, setTimerActive] = useState<boolean>(false)
  const [musicMuted, setMusicMuted] = useState<boolean>(false)
  const [ambienceMuted, setAmbienceMuted] = useState<boolean>(false)
  

  const [stateData, setStateData] = useState<Record<string, StateObject>>({
    [stateName.WORK]: {
      state: stateName.WORK,
      players: []
    },
    [stateName.SHORT_BREAK]: {
      state: stateName.SHORT_BREAK,
      players: []
    },
    [stateName.LONG_BREAK]: {
      state: stateName.LONG_BREAK,
      players: []
    }
  })
  

  const handleInputClick = (playerID: string, inputURL: string): void => {
    if (stateData[state].players.includes(playerID)) return
    const value = inputURL
    const videoId = extractYouTubeVideoId(value)
    if (!videoId || videoId === '') return
    const newPlayers = [...players]
    newPlayers.push({
      player: null,
      isPlaying: false,
      videoId: videoId,
      title: '',
      ready: false,
      id: playerID,
      type: 'input'
    })
    setPlayers(newPlayers)
    /* mirar si el player ya existe en el stateData del state actual, y si no, añadir el player al stateData  */
    if (!stateData[state].players.includes(playerID)) {
      setStateData(prevStateData => ({
        ...prevStateData,
        [state]: {
          ...prevStateData[state],
          players: [...prevStateData[state].players, playerID]
        }
      }))
    }
  }

  useEffect(() => {
    console.log(state)
  }, [state])

  useEffect(() => {
    console.log(players)
  }, [players])

  useEffect(() => {
    console.log(stateData)
  }, [stateData])
  
  const handlePlayerReady = (playerID: string, event: { target: any }): void => {
    const newPlayers = [...players]
    const index = newPlayers.findIndex(player => player.id === playerID)
    newPlayers[index].player = event.target
    newPlayers[index].ready = true
    newPlayers[index].title = event.target.getVideoData().title
    setPlayers(newPlayers)
  }
    
  const handleStart = (): void => {
    setTimerActive(true)
  }

  const handlePause = (): void => {
    setTimerActive(false)
  }

  const handleReset = (): void => {
    setTimer(timers[state])
  }

  const changeState = (): void => {
    if (state === stateName.WORK) {
      setState(stateName.SHORT_BREAK)
      setTimer(timers[stateName.SHORT_BREAK])
      setPrevState(stateName.WORK)
    } else if (state === stateName.SHORT_BREAK) {
      setState(stateName.LONG_BREAK)
      setTimer(timers[stateName.LONG_BREAK])
      setPrevState(stateName.SHORT_BREAK)
    } else if (state === stateName.LONG_BREAK) {
      setState(stateName.WORK)
      setTimer(timers[stateName.WORK])
      setPrevState(stateName.LONG_BREAK)
    }
  }

  const playVideos = (playerIDs: string[]) => {
    const playersToPlay = players.filter(player => playerIDs.includes(player.id))
    playersToPlay.forEach(player => {
      if (player.ready) {
        (player.player as any)?.playVideo()
      }
    })
  }
  
  const pauseVideos = (playerIDs: string[]) => {
    const playersToPause = players.filter(player => playerIDs.includes(player.id))
    playersToPause.forEach(player => {
      if (player.ready) {
        (player.player as any)?.pauseVideo()
      }
    })
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerActive) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1)
      }, 1000)
    } else if (!timerActive && timer !== 0) {
      clearInterval(interval!)
    } else if (!timerActive && timer === 0) {
      changeState()
    }

    if (timerActive && !musicMuted) {
      playVideos(stateData[state].players)
    } else if (!timerActive && !musicMuted) {
      pauseVideos(stateData[state].players)
    }

    return () => clearInterval(interval!)
  }, [timerActive])
  
  useEffect(() => {
    const playersToPause = stateData[prevState]?.players.filter(playerID => !stateData[state]?.players.includes(playerID))
    const playersToPlay = stateData[state]?.players.filter(playerID => !stateData[prevState]?.players.includes(playerID))
    if (!playersToPause || !playersToPlay) return
    if (timerActive) {
      pauseVideos(playersToPause)
      playVideos(playersToPlay)
    } else {
      pauseVideos(playersToPause)
    }
  }, [state])

  const handleClickAmbience = (type: string) => {
    const typeURL = ambiencesURLs[type]
    const videoId = extractYouTubeVideoId(typeURL)
    if (!videoId || videoId === '') return

    /* mirar si existe algun player con este videoId */
    const player = players.find(player => player.videoId === videoId)
    if (!player) {
      const newPlayers = [...players]
      newPlayers.push({
        player: null,
        isPlaying: false,
        videoId: videoId,
        title: '',
        ready: false,
        id: type,
        type: 'ambience'
      })
      setPlayers(newPlayers)
    }

    /* mirar si el player ya existe en el stateData del state actual, y si no, añadir el player al stateData  */
    if (!stateData[state].players.includes(type)) {
      setStateData(prevStateData => ({
        ...prevStateData,
        [state]: {
          ...prevStateData[state],
          players: [...prevStateData[state].players, type]
        }
      }))
    } else {
      /* sino, eliminarlo del stateData del state actual */
      setStateData(prevStateData => ({
        ...prevStateData,
        [state]: {
          ...prevStateData[state],
          players: prevStateData[state].players.filter(player => player !== type)
        }
      }))
    }

    
  }



  return (
    <main className='felx flex-col h-screen bg-red-800 bg-opacity-70'>

      <div className='flex flex-col items-center'>
        <h1 className="text-white text-4xl font-bold">{state}</h1>

        <div className="grid grid-flow-col gap-5 text-center auto-cols-max mt-10">
          <div className="flex flex-col p-2 bg-slate-200 rounded-box text-neutral-content">
            <span className="countdown font-mono text-8xl text-black">
              <span style={{ "--value": getTimeValue(timer, 'minutes') } as React.CSSProperties}></span>
            </span>
            min
          </div> 
          <div className="flex flex-col p-2 bg-slate-200 rounded-box text-neutral-content">
            <span className="countdown font-mono text-8xl text-black">
              <span style={{ "--value": getTimeValue(timer, 'seconds') } as React.CSSProperties}></span>
            </span>
            sec
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center'>
        <div className='flex items-center'>
          <YoutubeInput
            placeholder="Work YouTube URL"
            playerID="Work"
            functionOnClick={handleInputClick}
            isReady={players.find(player => player.id === "Work")?.ready || false}
          />
        </div>
      </div>

      <div className="hidden">
        {players.map((playerObject) => (
          <span key={playerObject.id}>
            <YouTube
              videoId={playerObject.videoId}
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
              onReady={(e) => handlePlayerReady(playerObject.id, e)}
            />
          </span>
        ))}
      </div>

      <div className="flex mt-3 justify-center items-center">
        {!timerActive ? (
          <Button type={1} icon={FaPlay} onClick={handleStart} />
        ) : (
          <Button type={1} icon={FaPause} onClick={handlePause} />
        )}
        <Button type={1} icon={FaUndo} onClick={handleReset} />
        <Button type={1} icon={FaForward} onClick={changeState} />
        <Button 
          type={3} 
          icon={IoThunderstormSharp} 
          onClick={() => handleClickAmbience("Thunderstorm")} 
          players={stateData[state]?.players}
          playerName="Thunderstorm"
        />
        <Button 
          type={3} 
          icon={GiBigWave} 
          onClick={() => handleClickAmbience("Waves")} 
          players={stateData[state]?.players}
          playerName="Waves"
        />
        <Button 
          type={3} 
          icon={MdForest} 
          onClick={() => handleClickAmbience("Forest")} 
          players={stateData[state]?.players}
          playerName="Forest"
        />
        <Button 
          type={3} 
          icon={IoCloudyNight} 
          onClick={() => handleClickAmbience("Night")} 
          players={stateData[state]?.players}
          playerName="Night"
        />
        
      </div>
    </main>
  )
}

export default Test
