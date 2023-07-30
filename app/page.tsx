'use client'
import { useState, useEffect } from 'react'

import { ambiencesURLs } from '@/utils/constants'
import { extractYouTubeVideoId } from '@/utils/functions'

import TopNav from '@/components/ui/TopNav'
import Timer from '@/components/ui/Timer'
import YoutubeEmbeds from '@/components/ui/YoutubeEmbeds'
import YoutubeLinksSection from '@/components/ui/YoutubeLinksSection'

import useAppState from '@/hooks/useAppState'
import useTimer from '@/hooks/useTimer'
import usePlayers from '@/hooks/usePlayers'
import AmbienceSection from '@/components/ui/AmbienceSection'
import MainControls from '@/components/ui/MainControls'

const Test = () => {
  const [musicVolume, setMusicVolume] = useState<number>(50)
  const [ambienceVolume, setAmbienceVolume] = useState<number>(25) 
  const { 
    state, stateData, addPlayerIDToStateData, removePlayerIDFromStateData, changeState, 
  } = useAppState()
  const { 
    timer, timerActive, resetTimer, toggleTimerActive
  } = useTimer({ state, changeState })
  const {
    players, checkPlayersForCurrentState, handlePlayerReady, createNewInputPlayer, createNewAmbiencePlayer, updatePlayersVolume
  } = usePlayers({ stateData, state, musicVolume, ambienceVolume, timerActive })

  useEffect(() => {
    console.log('State: ', state)
  }, [state])

  useEffect(() => {
    console.log('Players: ', players)
  }, [players])

  useEffect(() => {
    console.log('StateData: ', stateData)
  }, [stateData])

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

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>, playerType: 'input' | 'ambience') => {
    updatePlayersVolume(event, playerType)
    if (playerType === 'input') {
        setMusicVolume(Number(event.target.value))
    } else if (playerType === 'ambience') {
        setAmbienceVolume(Number(event.target.value))
    }
  }

  useEffect(() => {
    checkPlayersForCurrentState()
  }, [stateData[state].players, timerActive, state])
  
  return (
    <main className='flex flex-col h-screen items-center'>
      <div className='flex flex-col w-3/4'>
        <TopNav />
        <div className="divider"></div> 
      </div>
      
      <div className='flex flex-col flex-grow w-full'>
        <div className='flex flex-col w-full items-center'>
          <Timer state={state} timer={timer} />
        </div>
        <div className='flex flex-grow w-full justify-center'>
          <div className='flex items-end pb-6 pr-3 w-60'>
            <YoutubeLinksSection 
              musicVolume={musicVolume}
              onHandleMove={handleVolumeChange}
              players={players.filter(player => player.type === 'input')}
              stateData={stateData}
              addPlayerIDToStateData={addPlayerIDToStateData}
              createNewInputPlayer={createNewInputPlayer}
            />
          </div>
          <div className='flex items-end justify-center pb-10'>
            <MainControls
              timerActive={timerActive}
              toggleTimerActive={toggleTimerActive}
              resetTimer={resetTimer}
              changeState={changeState}
            />
          </div>
          <div className='flex items-end pb-6 pl-3 w-60'>
            <AmbienceSection 
              handleClickAmbience={handleClickAmbience} 
              currentPlayers={stateData[state]?.players}
              ambienceVolume={ambienceVolume}
              handleVolumeChange={handleVolumeChange}
            />
          </div>
        </div>   
      </div>
      <YoutubeEmbeds players={players} onReady={handlePlayerReady} />
    </main>
  )
}

export default Test
