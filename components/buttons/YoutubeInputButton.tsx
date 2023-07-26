'use client'
import { IconType } from 'react-icons'
import { FC, use, useEffect, useState } from "react"

type Props = {
  icon: IconType
  pushedIcon: IconType
  onClick: () => void
  readyFlag: boolean
}

const YoutubeInputButton: FC<Props> = ({ icon: Icon, pushedIcon, onClick: fatherOnClick, readyFlag }) => {
  const [pushed, setPushed] = useState<boolean>(false)

  const buttonColor = pushed ? 'bg-green-400' : 'bg-neutral-200'
  const buttonBorderColor = pushed ? 'border-green-800' : 'border-neutral-400'
  Icon = pushed ? pushedIcon : Icon 

  useEffect(() => {
    setPushed(readyFlag)
  }, [readyFlag])

  return (
    <button
      className={`rounded px-4 py-2 m-1 border-b-4 border-l-2 shadow-lg ${buttonColor} ${buttonBorderColor} transform transition-all duration-200 ease-in-out active:scale-95 active:border-b-2`}
      onClick={fatherOnClick}
    >
      {Icon && <Icon className={'text-black'} />}
    </button>
  )
}
export default YoutubeInputButton
