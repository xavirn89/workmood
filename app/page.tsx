'use client'
import { useState, useEffect, useRef, ChangeEvent, use } from 'react'
import YouTube from 'react-youtube'
import { FaPlay, FaPause, FaUndo, FaForward, FaCheck } from 'react-icons/fa'
import { IoThunderstormSharp, IoCloudyNight } from 'react-icons/io5'
import { GiBigWave } from 'react-icons/gi'
import { MdForest } from 'react-icons/md'
import { BsFillGearFill, BsCheck } from 'react-icons/bs'
import { AiFillYoutube, AiOutlineYoutube } from 'react-icons/ai'

import { getTimeValue, extractYouTubeVideoId } from '@/utils/functions'

import YoutubeInput from '@/components/YoutubeInput'
import OnOffButton from '@/components/buttons/OnOffButton'
import Button from '@/components/Button'

const timers: Record<string, number> = {
  "Work": 25 * 60,
  "Short Break": 5 * 60,
  "Long Break": 15 * 60
}

enum StateName {
  WORK = "Work",
  SHORT_BREAK = "Short Break",
  LONG_BREAK = "Long Break"
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
  const [state, setState] = useState<StateName>(StateName.WORK);
  const [timer, setTimer] = useState<number>(timers[state])

  const [players, setPlayers] = useState<PlayerObject[]>([])

  //flags
  const [timerActive, setTimerActive] = useState<boolean>(false)
  const [musicMuted, setMusicMuted] = useState<boolean>(false)
  const [ambienceMuted, setAmbienceMuted] = useState<boolean>(false)

  const [showYoutubeModal, setShowYoutubeModal] = useState<boolean>(false)
  

  const [stateData, setStateData] = useState<Record<string, StateObject>>({
    [StateName.WORK]: {
      state: StateName.WORK,
      players: []
    },
    [StateName.SHORT_BREAK]: {
      state: StateName.SHORT_BREAK,
      players: []
    },
    [StateName.LONG_BREAK]: {
      state: StateName.LONG_BREAK,
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
    console.log('State: ', state)
  }, [state])

  useEffect(() => {
    console.log('Players: ', players)
  }, [players])

  useEffect(() => {
    console.log('StateData: ', stateData)
  }, [stateData])
    
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
    if (state === StateName.WORK) {
      setState(StateName.SHORT_BREAK)
      setTimer(timers[StateName.SHORT_BREAK])
    } else if (state === StateName.SHORT_BREAK) {
      setState(StateName.LONG_BREAK)
      setTimer(timers[StateName.LONG_BREAK])
    } else if (state === StateName.LONG_BREAK) {
      setState(StateName.WORK)
      setTimer(timers[StateName.WORK])
    }
  }

  const playVideos = (playerIDs: string[]) => {
    if (!timerActive) return
    let newPlayers = [...players]
    newPlayers = newPlayers.map(player => {
        if (!playerIDs.includes(player.id)) {
            return player
        }
        if (player.ready) {
            (player.player as any)?.playVideo()
            return {...player, isPlaying: true}
        }
        return player
    })
    setPlayers(newPlayers)
  }

  
  const pauseVideos = (playerIDs: string[]) => {
    let newPlayers = [...players]
    newPlayers = newPlayers.map(player => {
        if (!playerIDs.includes(player.id)) {
            return player
        }
        if (player.ready) {
            (player.player as any)?.pauseVideo()
            return {...player, isPlaying: false}
        }
        return player
    })
    setPlayers(newPlayers)
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

    return () => clearInterval(interval!)
  }, [timerActive])

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

    /* mirar si el player ya existe en el stateData del state actual, y si no, añadir el player al stateData, pausarlo y poner el isPlaying a false  */
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

  const checkPlayersForCurrentState = () => {

    const playersIDsToPlay: string[] = stateData[state].players
    const playersToPlay = players.filter(player => playersIDsToPlay.includes(player.id))
    const playersToPause = players.filter(player => !playersIDsToPlay.includes(player.id))
    const playersIDsToPause: string[] = playersToPause.map(player => player.id)
    const allPaused = players.every(player => !player.isPlaying)
    const allPlayersPlaying = playersToPlay.every(player => player.isPlaying)
    const allPausersPaused = playersToPause.every(player => !player.isPlaying)

    if (!timerActive && !allPaused) {
      const allPlayersIDs = players.map(player => player.id)
      pauseVideos(allPlayersIDs)
      return
    }

    if (timerActive && !allPlayersPlaying) {
      playVideos(playersIDsToPlay)
      return
    }

    if (allPlayersPlaying && allPausersPaused) return

    if (!allPlayersPlaying) {
      playVideos(playersIDsToPlay)
    }
    if (!allPausersPaused) {
      pauseVideos(playersIDsToPause)
    }

  }


  const handlePlayerReady = (playerID: string, event: { target: any }): void => {
    const newPlayers = [...players]
    const index = newPlayers.findIndex(player => player.id === playerID)
    newPlayers[index].player = event.target
    newPlayers[index].ready = true
    newPlayers[index].title = event.target.getVideoData().title
    setPlayers(newPlayers)
    checkPlayersForCurrentState()
  }

  useEffect(() => {
    checkPlayersForCurrentState()
  }, [stateData[state].players, timerActive, state])

  useEffect(() => {
    if (showYoutubeModal){
      // @ts-ignore
      window.modalYTInputs.showModal()
    }
  }, [showYoutubeModal])

  return (
    <main className='flex flex-col h-screen justify-between py-8 bg-neutral-800 bg-opacity-70'>
      
      <div className='flex flex-col items-end px-32'>
        <BsFillGearFill className='text-white' />
      </div>

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

      <dialog id="modalYTInputs" className="modal" onClose={() => setShowYoutubeModal((prev) => !prev)}>
        <div className="modal-box flex flex-col items-center">
          <h3 className="font-bold text-lg">Youtube Links</h3>
          <p className="py-4">Assign music videos to phases</p>

          <div className="flex flex-col w-full px-4 mt-10">
            <div className='flex items-center mb-2'>
              <YoutubeInput
                placeholder="Work YouTube URL"
                playerID="Work"
                functionOnClick={handleInputClick}
                isReady={players.find(player => player.id === "Work")?.ready || false}
                playerTitle={players.find(player => player.id === "Work")?.title || null}
              />
            </div>

            <div className='flex items-center mb-2'>
              <YoutubeInput
                placeholder="Short Break YouTube URL"
                playerID="ShortBreak"
                functionOnClick={handleInputClick}
                isReady={players.find(player => player.id === "ShortBreak")?.ready || false}
                playerTitle={players.find(player => player.id === "ShortBreak")?.title || null}
              />
            </div>

            <div className='flex items-center mb-2'>
              <YoutubeInput
                placeholder="Long Break YouTube URL"
                playerID="LongBreak"
                functionOnClick={handleInputClick}
                isReady={players.find(player => player.id === "LongBreak")?.ready || false}
                playerTitle={players.find(player => player.id === "LongBreak")?.title || null}
              />
            </div>
          </div>

        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div className="hidden">
        {players.map((playerObject) => (
          <div key={playerObject.id}>
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
          </div>
        ))}
      </div>

      <div className="flex mt-3 justify-center items-center">

        <div className='flex w-1/3 justify-end'>
          <OnOffButton 
            icon={AiFillYoutube} 
            functionToggle={() => setShowYoutubeModal((prev) => !prev)}
            isPushed={showYoutubeModal} 
          />
        </div>
        <div className='flex justify-center'>
          {!timerActive ? (
            <Button type={1} icon={FaPlay} onClick={handleStart} />
          ) : (
            <Button type={1} icon={FaPause} onClick={handlePause} />
          )}
          <Button type={1} icon={FaUndo} onClick={handleReset} />
          <Button type={1} icon={FaForward} onClick={changeState} />
        </div>
        <div className='flex w-1/3 justify-start'>
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
        
      </div>
    </main>
  )
}

export default Test
