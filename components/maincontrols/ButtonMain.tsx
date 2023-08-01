'use client'
import { FC, useRef } from 'react'
import { IconType } from 'react-icons'
import { buttonSources } from '@/utils/constants'

type ButtonProps = {
  icon: IconType
  onClick: () => void
}

const buttonStyles = 'rounded px-6 py-4 m-1 border-b-4 border-l-2 shadow-lg bg-slate-200 border-slate-400 transform transition-all duration-200 ease-in-out active:scale-95 active:border-b-2';

const Button: FC<ButtonProps> = ({ icon: Icon, onClick }) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.play()
    }
    onClick()
  }

  return (
    <>
      <button className={buttonStyles} onClick={handleClick}>
        {Icon && <Icon className="text-black" />}
      </button>
      <audio ref={audioRef} src={buttonSources[1]} />
    </>
  )
}

export default Button
