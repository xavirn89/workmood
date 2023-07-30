'use client'
import { useEffect, useState } from 'react'
import OnOffButton from '@/components/buttons/OnOffButton'
import { AiFillYoutube } from "react-icons/ai"
import YoutubeInput from '@/components/YoutubeInput'
import { PlayerObject } from '@/types/mainTypes'
import { extractYouTubeVideoId } from '@/utils/functions'
import { StateName } from '@/utils/constants'
import { TbSquareLetterW, TbSquareLetterS, TbSquareLetterL } from 'react-icons/tb'
import { BiSolidVolumeMute } from 'react-icons/bi'
import clsx from 'clsx'
import { useStore } from '@/stores/globalStore'

interface Props {
  musicVolume: number
  onHandleMove: (event: React.ChangeEvent<HTMLInputElement>, playerType: 'input' | 'ambience') => void
  players: PlayerObject[]
  stateData: any
  addPlayerIDToStateData: (playerID: string, state: StateName) => void
  createNewInputPlayer: (playerID: string, videoId: string) => void
}

const YoutubeLinksSection = ({ musicVolume, onHandleMove, players, stateData, addPlayerIDToStateData, createNewInputPlayer }: Props): JSX.Element => {
  const { mute, toggleMute } = useStore()

  const [inputState, setInputState] = useState<StateName | null>(null)
  const [textDivInput, setTextDivInput] = useState<string | null>('')
  const showInput = inputState !== null
  const inputStateToText: string | undefined = inputState?.toString().replace(/\s/g, "")

  useEffect(() => {
    if (inputState) setTextDivInput(inputState)
  }, [inputState])

  const handleInputClick = (playerID: string, inputURL: string, stateIndicator: StateName): void => {
    if (stateData[stateIndicator].players.includes(playerID)) return
    const value = inputURL
    const videoId = extractYouTubeVideoId(value)
    if (!videoId || videoId === '') return

    createNewInputPlayer(playerID, videoId)

    if (!stateData[stateIndicator].players.includes(playerID)) {
      addPlayerIDToStateData(playerID, stateIndicator)
    }
  }

  return (<>
    <div className='flex flex-col w-full'>
      <div className={clsx(
        'px-4 py-2 bg-base-200 mb-2 rounded-2xl border-b-4 border-l-2 border-zinc-900 transition-all duration-200',
        {
          'translate-y-0 opacity-100': showInput,
          'translate-y-20 opacity-0': !showInput
        }
      )}>
        <p className='pb-2'>{textDivInput} - Youtube Video URL</p>
        <YoutubeInput
          playerID={inputStateToText}
          functionOnClick={handleInputClick}
          stateIndicator={inputState}
          isReady={players.find(player => player.id === inputStateToText)?.ready || false}
          playerTitle={players.find(player => player.id === inputStateToText)?.title || null}
        />
      </div>

      <div className='flex justify-end'>
        <OnOffButton 
          icon={BiSolidVolumeMute} 
          functionToggle={toggleMute}
          isPushed={mute} 
        />
        <OnOffButton 
          icon={TbSquareLetterL} 
          functionToggle={() => setInputState(inputState !== StateName.LONG_BREAK ? StateName.LONG_BREAK : null)}
          isPushed={inputState === StateName.LONG_BREAK} 
        />
        <OnOffButton 
          icon={TbSquareLetterS} 
          functionToggle={() => setInputState(inputState !== StateName.SHORT_BREAK ? StateName.SHORT_BREAK : null)}
          isPushed={inputState === StateName.SHORT_BREAK} 
        />
        <OnOffButton 
          icon={TbSquareLetterW} 
          functionToggle={() => setInputState(inputState !== StateName.WORK ? StateName.WORK : null)}
          isPushed={inputState === StateName.WORK} 
        />
      </div>
      <div className='flex justify-end'>
        <input type="range" min={0} max="100" value={mute ? 0 : musicVolume} className="range range-xs w-48" onChange={(event) => onHandleMove(event, 'input')} />
      </div>
    </div>
   
  </>)
}
export default YoutubeLinksSection
