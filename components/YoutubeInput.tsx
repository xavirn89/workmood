import { useState, useEffect } from 'react'
import { ChangeEvent, FC } from 'react'
import { FaCheck, FaYoutube } from 'react-icons/fa'
import { extractYouTubeVideoId } from '@/utils/functions'
import { BsCheck, BsUpload } from 'react-icons/bs'
import YoutubeInputButton from '@/components/buttons/YoutubeInputButton'

type YoutubeInputProps = {
  placeholder: string
  playerID: string
  functionOnClick: (playerID: string, inputURL: string) => void
  isReady: boolean
}

const YoutubeInput: FC<YoutubeInputProps> = ({ placeholder, playerID, functionOnClick, isReady = false }) => {
  const [text, setText] = useState<string>('')
  const [videoId, setVideoId] = useState<string>('')

  useEffect(() => {
    const newVideoId = extractYouTubeVideoId(text)
    if (!newVideoId || newVideoId === '') return
    setVideoId(newVideoId)
  }, [text])

  return (
    <div className="flex items-center">
      <input
        type="text"
        className="border-2 border-gray-600 p-2 rounded-lg bg-white shadow-sm text-black"
        placeholder={placeholder}
        value={text}
        onChange={(event) => {
          setText(event.target.value)
        }}
      />
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
  )
}

export default YoutubeInput
