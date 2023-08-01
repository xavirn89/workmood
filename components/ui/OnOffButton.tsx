'use client'
import { IconType } from 'react-icons'
import { FC, useEffect, useState, useRef } from "react"
import { buttonSources } from '@/utils/constants'

type Props = {
  icon: IconType
  functionToggle: () => void
  isPushed: boolean
}

const OnOffButton: FC<Props> = ({ icon: Icon, functionToggle, isPushed }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [pushed, setPushed] = useState<boolean>(isPushed)

  useEffect(() => {
    setPushed(isPushed)
  }, [isPushed])

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.play()
    }
    functionToggle()
  }

  const buttonStyles = `rounded px-4 py-2 m-1 border-l-2 shadow-lg bg-neutral-200 transition-all duration-200 ease-in-out 
    ${pushed ? 'border-b-2 border-neutral-800 scale-95' : 'border-b-4 border-neutral-400 scale-100'}`;

  return (<>
    <button
      className={buttonStyles}
      onClick={handleClick}
    >
      {Icon && <Icon className={'text-black'} />}
    </button>
    <audio ref={audioRef} src={buttonSources[3]} />
  </>)
}

export default OnOffButton
