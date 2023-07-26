import { useState, useEffect } from 'react'
import { FC } from 'react'
import { extractYouTubeVideoId } from '@/utils/functions'
import { BsCheck, BsUpload } from 'react-icons/bs'
import YoutubeInputButton from '@/components/buttons/YoutubeInputButton'

type YoutubeInputProps = {
  placeholder: string
  playerID: string
  functionOnClick: (playerID: string, inputURL: string) => void
  isReady: boolean
  playerTitle: string | null
}

const YoutubeInput: FC<YoutubeInputProps> = ({ placeholder, playerID, functionOnClick, isReady = false, playerTitle }) => {
  const [text, setText] = useState<string>('')
  const [videoId, setVideoId] = useState<string>('')

  useEffect(() => {
    const newVideoId = extractYouTubeVideoId(text)
    if (!newVideoId || newVideoId === '') return
    setVideoId(newVideoId)
  }, [text])

  return (
    <div className="flex flex-col w-full">
      <div className='flex'>
        <div className='flex w-2/6'>
          <p>{playerID}</p>
        </div>
        <div className='flex w-3/6'>
          <input
            type="text"
            className="border-2 border-gray-600 rounded-lg bg-white shadow-sm text-black text-xs"
            placeholder={placeholder}
            value={text}
            onChange={(event) => {
              setText(event.target.value)
            }}
          />
        </div>
        <div className='flex w-1/6'>
          <YoutubeInputButton
            icon={BsUpload}
            pushedIcon={BsCheck}
            onClick={() => {
              if (videoId !== '') {
                functionOnClick(playerID, text)
              }
            }}
            readyFlag={isReady}
          />
        </div>
      </div>
      <div className='flex'>
        {playerTitle && <div className='flex w-4/6 text-xs text-gray-400'>{playerTitle}</div>}
      </div>
    </div>
  )
}

export default YoutubeInput
