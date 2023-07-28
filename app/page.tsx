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
    state, stateData, longBreakInterval, addPlayerIDToStateData, removePlayerIDFromStateData, changeState, 
  } = useAppState()
  const { 
    timer, timeWork, timeShortBreak, timeLongBreak, timerActive, resetTimer, toggleTimerActive 
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
    <main className='flex flex-col h-screen justify-between py-8'>
      <div className='flex flex-col items-end px-32'>
        {/* @ts-ignore */}
        <TopNav 
          timeWork={timeWork}
          timeShortBreak={timeShortBreak}
          timeLongBreak={timeLongBreak}
          longBreakInterval={longBreakInterval}
        />
      </div>

      <div className='flex flex-col items-center'>
        <Timer state={state} timer={timer} />
      </div>

      <div className="flex mt-3 justify-center items-center">

        <div className='flex w-1/3 justify-end'>
          <YoutubeLinksSection 
            musicVolume={musicVolume}
            onHandleMove={handleVolumeChange}
            players={players.filter(player => player.type === 'input')}
            stateData={stateData}
            addPlayerIDToStateData={addPlayerIDToStateData}
            createNewInputPlayer={createNewInputPlayer}
          />
        </div>
        <div className='flex justify-center'>
          <MainControls
            timerActive={timerActive}
            toggleTimerActive={toggleTimerActive}
            resetTimer={resetTimer}
            changeState={changeState}
          />
        </div>
        <div className='flex w-1/3 justify-start'>
          <AmbienceSection 
            handleClickAmbience={handleClickAmbience} 
            currentPlayers={stateData[state]?.players}
            ambienceVolume={ambienceVolume}
            handleVolumeChange={handleVolumeChange}
          />
        </div>
        
      </div>
      <YoutubeEmbeds players={players} onReady={handlePlayerReady} />
    </main>

    
  )
}

export default Test
