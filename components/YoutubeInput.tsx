import { ChangeEvent, FC } from 'react'
import { FaCheck, FaYoutube } from 'react-icons/fa'

type YoutubeInputProps = {
  placeholder: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  isReady: boolean
}

const YoutubeInput: FC<YoutubeInputProps> = ({ placeholder, onChange, isReady }) => {
  return (
    <div className="flex items-center">
      <input
        type="text"
        className="border p-3 mb-2 shadow-sm rounded-lg"
        placeholder={placeholder}
        onChange={onChange}
      />
      {isReady && <FaCheck className="text-green-500 ml-2" />}
    </div>
  )
}

export default YoutubeInput
