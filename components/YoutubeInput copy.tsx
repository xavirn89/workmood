import { useState, useEffect } from 'react'
import { FC } from 'react'
import { extractYouTubeVideoId } from '@/utils/functions'
import { BsCheck } from 'react-icons/bs'
import { HiUpload } from 'react-icons/hi'
import YoutubeInputButton from '@/components/buttons/YoutubeInputButton'
import { StateName } from '@/utils/constants'

type YoutubeInputProps = {
  placeholder: string
  playerID: string
  functionOnClick: (playerID: string, inputURL: string, stateIndicator: StateName) => void
  stateIndicator: StateName
  isReady: boolean
  playerTitle: string | null
}

const YoutubeInput: FC<YoutubeInputProps> = ({ placeholder, playerID, functionOnClick, stateIndicator, isReady = false, playerTitle }) => {
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
          <span className='w-32'>{playerID}</span>
          <input 
            type="text" 
            className="input input-bordered input-md"
            placeholder={placeholder}
            value={text}
            onChange={(event) => {
              setText(event.target.value)
            }}
          />
          <YoutubeInputButton
            icon={HiUpload}
            pushedIcon={BsCheck}
            onClick={() => {
              if (videoId !== '') {
                functionOnClick(playerID, text, stateIndicator)
              }
            }}
            readyFlag={isReady}
          />
        </label>
      </div>
      <div className='flex h-8 pt-2 pl-2'>
        {playerTitle ? <p className='text-xs'>{playerTitle}</p> : <p></p>}
      </div>

    </div>
  )
}

export default YoutubeInput
