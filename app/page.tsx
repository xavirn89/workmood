'use client'
import { useState, useEffect, useRef, ChangeEvent, use } from 'react'
import { FaPlay, FaPause, FaUndo, FaForward, FaCheck } from 'react-icons/fa'
import { IoThunderstormSharp, IoCloudyNight } from 'react-icons/io5'
import { GiBigWave } from 'react-icons/gi'
import { MdForest } from 'react-icons/md'

import { PlayerObject, StateObject } from '@/types/mainTypes'
import { timers, ambiencesURLs, StateName } from '@/utils/constants'

import { getTimeValue, extractYouTubeVideoId } from '@/utils/functions'

import Button from '@/components/Button'
import TopNav from '@/components/ui/TopNav'
import Timer from '@/components/ui/Timer'
import YoutubeEmbeds from '@/components/ui/YoutubeEmbeds'

import useAppState from '@/hooks/useAppState'
import useTimer from '@/hooks/useTimer'
import YoutubeLinksSection from '@/components/ui/YoutubeLinksSection'


const Test = () => {
  const [players, setPlayers] = useState<PlayerObject[]>([])

  const { 
    state, stateData, longBreakInterval, addPlayerIDToStateData, removePlayerIDFromStateData, changeState, 
  } = useAppState()

  const { 
    timer, timeWork, timeShortBreak, timeLongBreak, timerActive, resetTimer, toggleTimerActive 
  } = useTimer({ state, changeState })

  //flags
  
  const [musicVolume, setMusicVolume] = useState<number>(50)
  const [ambienceVolume, setAmbienceVolume] = useState<number>(25)  

  useEffect(() => {
    console.log('State: ', state)
  }, [state])

  useEffect(() => {
    console.log('Players: ', players)
  }, [players])

  useEffect(() => {
    console.log('StateData: ', stateData)
  }, [stateData])

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


  const handleClickAmbience = (buttonPlayerId: string) => {
    const typeURL = ambiencesURLs[buttonPlayerId]
    const videoId = extractYouTubeVideoId(typeURL)
    if (!videoId || videoId === '') return

    const player = players.find(player => player.videoId === videoId)
    if (!player) {
      createNewAmbiencePlayer(buttonPlayerId, videoId)
    }

    if (!stateData[state].players.includes(buttonPlayerId)) {
      addPlayerIDToStateData(buttonPlayerId, state)
    } else {
      removePlayerIDFromStateData(buttonPlayerId, state)
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
    const newVolume = newPlayers[index].type === 'input' ? musicVolume : ambienceVolume
    event.target.setVolume(newVolume)
    newPlayers[index].player = event.target
    newPlayers[index].ready = true
    newPlayers[index].title = event.target.getVideoData().title
    setPlayers(newPlayers)
    checkPlayersForCurrentState()
  }

  useEffect(() => {
    checkPlayersForCurrentState()
  }, [stateData[state].players, timerActive, state])

  const handleMusicVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    /* Para cada player que el type sea 'input', cambiar el volumen */
    const newPlayers = [...players]
    newPlayers.forEach(player => {
      if (player.type === 'input') {
        (player.player as any)?.setVolume(Number(event.target.value))
      }
    })
    setPlayers(newPlayers)
    setMusicVolume(Number(event.target.value))
  }

  const handleAmbienceVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    /* Para cada player que el type sea 'ambience', cambiar el volumen */
    const newPlayers = [...players]
    newPlayers.forEach(player => {
      if (player.type === 'ambience') {
        (player.player as any)?.setVolume(Number(event.target.value))
      }
    })
    setPlayers(newPlayers)
    setAmbienceVolume(Number(event.target.value))
  }

  const createNewInputPlayer = (playerID: string, videoId: string): void => {
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
  }

  const createNewAmbiencePlayer = (buttonPlayerId: string, videoId: string): void => {
    const newPlayers = [...players]
    newPlayers.push({
      player: null,
      isPlaying: false,
      videoId: videoId,
      title: '',
      ready: false,
      id: buttonPlayerId,
      type: 'ambience'
    })
    setPlayers(newPlayers)
  }
  
  return (
    <main className='flex flex-col h-screen justify-between py-8'>

      <div className='flex flex-col items-end px-32'>
        {/* @ts-ignore */}
        <TopNav openConfig={()=>window.modalConfig.showModal()} />
      </div>

      <div className='flex flex-col items-center'>
        <Timer state={state} timer={timer} />
      </div>

      <div className="flex mt-3 justify-center items-center">

        <div className='flex w-1/3 justify-end'>
          <YoutubeLinksSection 
            musicVolume={musicVolume}
            onHandleMove={handleMusicVolumeChange}
            players={players.filter(player => player.type === 'input')}
            stateData={stateData}
            addPlayerIDToStateData={addPlayerIDToStateData}
            createNewInputPlayer={createNewInputPlayer}
          />
        </div>
        <div className='flex justify-center'>
          {!timerActive ? (
            <Button type={1} icon={FaPlay} onClick={toggleTimerActive} />
          ) : (
            <Button type={1} icon={FaPause} onClick={toggleTimerActive} />
          )}
          <Button type={1} icon={FaUndo} onClick={resetTimer} />
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
          <input type="range" min={0} max="100" value={ambienceVolume} className="range range-xs" onChange={handleAmbienceVolumeChange} />
        </div>
        
      </div>
      
      <dialog id="modalConfig" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

          <div className='flex flex-col'>
            <h3 className="font-bold text-lg">Settings</h3>
          </div>
          <div className="divider"></div> 

          <div className='flex justify-between'>
            <div className='flex w-1/3 p-1'>
              <label className="input-group input-group-vertical">
                <span>Work</span>
                <input type="text" value={timeWork} readOnly className="input input-bordered" />
              </label>
            </div>

            <div className='flex w-1/3 p-1'>
              <label className="input-group input-group-vertical">
                <span>Short Break</span>
                <input type="text" value={timeShortBreak} readOnly className="input input-bordered" />
              </label>
            </div>

            <div className='flex w-1/3 p-1'>
              <label className="input-group input-group-vertical">
                <span>Long Break</span>
                <input type="text" value={timeLongBreak} readOnly className="input input-bordered" />
              </label>
            </div>
          </div>
          
          <div className='flex justify-end'>
            <div className="flex p-1">
              <label className="input-group">
                <span>Long Break interval</span>
                <input type="text" value={longBreakInterval} readOnly className="input input-sm input-bordered w-14" />
              </label>
            </div>
          </div>
          

          <div className="divider"></div> 
          <div className="flex justify-end">
            <button className="btn btn-success">Save</button>
          </div>
          
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <YoutubeEmbeds players={players} onReady={handlePlayerReady} />
    </main>

    
  )
}

export default Test
