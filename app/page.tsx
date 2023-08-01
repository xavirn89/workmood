'use client'
import { useEffect, useCallback } from 'react'
import { ambiencesURLs } from '@/utils/constants'
import { extractYouTubeVideoId } from '@/utils/functions'

import TopNav from '@/components/TopNav'
import Timer from '@/components/Timer'
import YoutubeEmbeds from '@/components/YoutubeEmbeds'
import YoutubeLinksSection from '@/components/YoutubeLinksSection'
import useAppState from '@/hooks/useAppState'
import useTimer from '@/hooks/useTimer'
import usePlayers from '@/hooks/usePlayers'
import AmbienceSection from '@/components/AmbienceSection'
import MainControls from '@/components/MainControls'
import { useStore } from '@/stores/globalStore'

const Home = () => {
  const { musicVolume, ambienceVolume, changeMusicVolume, changeAmbienceVolume } = useStore()

  const { 
    state, stateData, addPlayerIDToStateData, removePlayerIDFromStateData, changeState, 
  } = useAppState()
  const { 
    timer, timerActive, resetTimer, toggleTimerActive
  } = useTimer({ state, changeState })
  const {
    players, checkPlayersForCurrentState, handlePlayerReady, createNewPlayer, updatePlayersVolume
  } = usePlayers({ stateData, state, musicVolume, ambienceVolume, timerActive })

  const handleClickAmbience = useCallback((buttonPlayerId: string) => {
    const typeURL = ambiencesURLs[buttonPlayerId]
    const videoId = extractYouTubeVideoId(typeURL)
    if (!videoId || videoId === '') return

    const player = players.find(player => player.videoId === videoId)
    if (!player) {
      createNewPlayer(buttonPlayerId, videoId, 'ambience')
    }

    if (!stateData[state].players.includes(buttonPlayerId)) {
      addPlayerIDToStateData(buttonPlayerId, state)
    } else {
      removePlayerIDFromStateData(buttonPlayerId, state)
    }
  }, [players, stateData, state, createNewPlayer, addPlayerIDToStateData, removePlayerIDFromStateData])

  const handleVolumeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, playerType: 'input' | 'ambience') => {
    updatePlayersVolume(event, playerType)
    if (playerType === 'input') {
      changeMusicVolume(Number(event.target.value))
    } else if (playerType === 'ambience') {
      changeAmbienceVolume(Number(event.target.value))
    }
  }, [updatePlayersVolume, changeMusicVolume, changeAmbienceVolume])

  useEffect(() => {
    checkPlayersForCurrentState()
  }, [stateData[state].players, timerActive, state])

  return (
    <main className='flex flex-col h-screen items-center'>
      <div className='flex flex-col w-2/4'>
        <TopNav />
        <div className="divider"></div> 
      </div>
      
      <div className='flex flex-col flex-grow w-full'>
        <div className='flex flex-col w-full items-center pt-20'>
          <Timer state={state} timer={timer} />
        </div>
        <div className='flex flex-grow w-full justify-center'>
          <div className='flex items-end pb-6 pr-3 w-96'>
            <YoutubeLinksSection 
              musicVolume={musicVolume}
              onHandleMove={handleVolumeChange}
              players={players.filter(player => player.type === 'input')}
              stateData={stateData}
              addPlayerIDToStateData={addPlayerIDToStateData}
              createNewPlayer={createNewPlayer}
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
          <div className='flex items-end pb-6 pl-3 w-96'>
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

export default Home

