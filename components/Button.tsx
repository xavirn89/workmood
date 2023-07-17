import { FC, useRef } from 'react'
import { IconType } from 'react-icons'
import { buttonSources } from '@/utils/constants'

type ButtonProps = {
  type: number
  icon?: IconType
  label?: string
  onClick: () => void
}

const Button: FC<ButtonProps> = ({ type, icon: Icon, label, onClick }) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.play()
    }
    onClick()
  }

  const colorsFromType = (type: number) => {
    let color1 = ''
    let color2 = ''
    let color3 = ''
    let paddingX = ''
    let paddingY = ''
    switch (type) {
      case 1:
        color1 = 'bg-slate-200'
        color2 = 'border-slate-400'
        color3 = 'text-black'
        paddingX = 'px-6'
        paddingY = 'py-4'
        break
      case 2:
        color1 = 'bg-neutral-600'
        color2 = 'border-neutral-800'
        color3 = 'text-white'
        paddingX = 'px-6'
        paddingY = 'py-4'
        break
      case 3:
        color1 = 'bg-neutral-200'
        color2 = 'border-neutral-400'
        color3 = 'text-black'
        paddingX = 'px-4'
        paddingY = 'py-2'
      default:
        break
    }
    return { color1, color2, color3, paddingX, paddingY }
  }

  const { color1, color2, color3, paddingX, paddingY } = colorsFromType(type)

  return (
    <>
      <button
        className={`rounded ${paddingX} ${paddingY} m-1 border-b-4 border-l-2 shadow-lg ${color1} ${color2} transform transition-all duration-200 ease-in-out active:scale-95 active:border-b-2`}
        onClick={handleClick}
      >
        {Icon && <Icon className={color3} />}
        <span className={`${color3} font-extrabold`}>{label && `${label} `}</span>
      </button>
      <audio ref={audioRef} src={buttonSources[type]} />
    </>
  )
}

export default Button
