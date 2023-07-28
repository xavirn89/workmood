'use client'
import { useState, useEffect } from 'react'
import OnOffButton from '@/components/buttons/OnOffButton'
import { AiFillYoutube } from "react-icons/ai"
import YoutubeInput from '@/components/YoutubeInput'
import { PlayerObject } from '@/types/mainTypes'
import { extractYouTubeVideoId } from '@/utils/functions'
import { StateName } from '@/utils/constants'

interface Props {
  musicVolume: number
  onHandleMove: (event: React.ChangeEvent<HTMLInputElement>, playerType: 'input' | 'ambience') => void
  players: PlayerObject[]
  stateData: any
  addPlayerIDToStateData: (playerID: string, state: StateName) => void
  createNewInputPlayer: (playerID: string, videoId: string) => void
}

const YoutubeLinksSection = ({ musicVolume, onHandleMove, players, stateData, addPlayerIDToStateData, createNewInputPlayer }: Props): JSX.Element => {
  const [showYoutubeModal, setShowYoutubeModal] = useState<boolean>(false)

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

  useEffect(() => {
    if (showYoutubeModal){
      // @ts-ignore
      window.modalYTInputs.showModal()
    }
  }, [showYoutubeModal])

  return (<>
    <OnOffButton 
      icon={AiFillYoutube} 
      functionToggle={() => setShowYoutubeModal((prev) => !prev)}
      isPushed={showYoutubeModal} 
    />
    <input type="range" min={0} max="100" value={musicVolume} className="range range-xs" onChange={(event) => onHandleMove(event, 'input')} />
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
              stateIndicator={StateName.WORK}
              isReady={players.find(player => player.id === "Work")?.ready || false}
              playerTitle={players.find(player => player.id === "Work")?.title || null}
            />
          </div>

          <div className='flex items-center mb-2'>
            <YoutubeInput
              placeholder="Short Break YouTube URL"
              playerID="ShortBreak"
              functionOnClick={handleInputClick}
              stateIndicator={StateName.SHORT_BREAK}
              isReady={players.find(player => player.id === "ShortBreak")?.ready || false}
              playerTitle={players.find(player => player.id === "ShortBreak")?.title || null}
            />
          </div>

          <div className='flex items-center mb-2'>
            <YoutubeInput
              placeholder="Long Break YouTube URL"
              playerID="LongBreak"
              functionOnClick={handleInputClick}
              stateIndicator={StateName.LONG_BREAK}
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
  </>)
}
export default YoutubeLinksSection