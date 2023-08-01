import { useState, useEffect } from 'react'
import { FC } from 'react'
import { extractYouTubeVideoId } from '@/utils/functions'
import { BsCheck } from 'react-icons/bs'
import { HiUpload } from 'react-icons/hi'
import YoutubeInputButton from '@/components/youtubesection/YoutubeInputButton'
import { StateName } from '@/utils/constants'
import { truncateString } from '@/utils/functions'

type YoutubeInputProps = {
  playerID: string | undefined
  functionOnClick: (playerID: string, inputURL: string, stateIndicator: StateName) => void
  stateIndicator: StateName | null
  isReady: boolean
  playerTitle: string | null
}

const YoutubeInput: FC<YoutubeInputProps> = ({ playerID, functionOnClick, stateIndicator, isReady = false, playerTitle }) => {
  const [text, setText] = useState<string>('')
  const [videoId, setVideoId] = useState<string>('')

  useEffect(() => {
    const newVideoId = extractYouTubeVideoId(text)
    if (!newVideoId || newVideoId === '') return
    setVideoId(newVideoId)
  }, [text])

  return (
    <div className="flex flex-col w-full">
      
      <div className="form-control">
        <label className="input-group input-group-md">
          <input 
            type="text" 
            className="input input-bordered input-md bg-slate-200 text-black pl-1"
            value={text}
            onChange={(event) => {
              setText(event.target.value)
            }}
          />
          <YoutubeInputButton
            icon={HiUpload}
            pushedIcon={BsCheck}
            onClick={() => {
              if (videoId !== '' && playerID && stateIndicator) {
                functionOnClick(playerID, text, stateIndicator)
              }
            }}
            readyFlag={isReady}
          />
        </label>
      </div>
      <p className='text-xs pt-1'>
        {playerTitle
          ? playerTitle.length > 40
            ? `${playerTitle.substring(0, 40)}...`
            : playerTitle
          : "No Data"
        }
      </p>

    </div>
  )
}

export default YoutubeInput
