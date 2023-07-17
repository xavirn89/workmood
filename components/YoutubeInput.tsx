import { useState, useEffect } from 'react'
import { ChangeEvent, FC } from 'react'
import { FaCheck, FaYoutube } from 'react-icons/fa'
import { extractYouTubeVideoId } from '@/utils/functions'
import Button from '@/components/Button'

type YoutubeInputProps = {
  placeholder: string
  playerID: string
  functionOnClick: (playerID: string, inputURL: string) => void
  isReady: boolean
}

const YoutubeInput: FC<YoutubeInputProps> = ({ placeholder, playerID, functionOnClick, isReady }) => {
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
        className="border p-3 mb-2 shadow-sm rounded-lg"
        placeholder={placeholder}
        value={text}
        onChange={(event) => {
          setText(event.target.value)
        }}
      />
      <Button
        type={3}
        icon={FaYoutube}
        onClick={() => {
          if (videoId !== '') {
            functionOnClick(playerID, text)
          }
        }}
      />
      {isReady && <FaCheck className="text-green-500 ml-2" />}
    </div>
  )
}

export default YoutubeInput
