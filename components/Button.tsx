'use client'
import { FC, useState, useEffect, useRef } from 'react'
import { IconType } from 'react-icons'
import { buttonSources } from '@/utils/constants'

type ButtonProps = {
  type: number
  icon?: IconType
  label?: string
  onClick: () => void
  players?: string[]
  playerName?: string
}

const stylesFromType = {
  1: {
    color: 'text-black',
    background: 'bg-slate-200',
    border: 'border-slate-400',
    paddingX: 'px-6',
    paddingY: 'py-4',
  },
  2: {
    color: 'text-white',
    background: 'bg-neutral-600',
    border: 'border-neutral-800',
    paddingX: 'px-6',
    paddingY: 'py-4',
  },
  3: {
    color: 'text-black',
    background: 'bg-neutral-200',
    border: 'border-neutral-400',
    paddingX: 'px-4',
    paddingY: 'py-2',
  },
}

const Button: FC<ButtonProps> = ({ type, icon: Icon, label, onClick, players, playerName }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [pushed, setPushed] = useState<boolean>(false)

  useEffect(() => {
    if (type === 3 && players && playerName) {
      setPushed(players.includes(playerName))
    }
  }, [players])

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.play()
    }
    if (type === 3) {
      setPushed(!pushed)
    }
    onClick()
  }

  const styles = stylesFromType[type] || stylesFromType[1]
  
  let buttonStyles = ''
  if (type === 1 || type === 2) {
    buttonStyles = `rounded ${styles.paddingX} ${styles.paddingY} m-1 border-b-4 border-l-2 shadow-lg ${styles.background} ${styles.border} transform transition-all duration-200 ease-in-out active:scale-95 active:border-b-2`
  } else if (type === 3) {
    const scale = pushed ? 'scale-95' : 'scale-100'
    const borderB = pushed ? 'border-b-2' : 'border-b-4'
    buttonStyles = `rounded ${styles.paddingX} ${styles.paddingY} m-1 ${borderB} border-l-2 shadow-lg ${styles.background} ${styles.border} transform transition-all duration-200 ease-in-out active:${scale}`
  }

  return (
    <>
      <button
        className={buttonStyles}
        onClick={handleClick}
      >
        {Icon && <Icon className={styles.color} />}
        <span className={`${styles.color} font-extrabold`}>{label && `${label} `}</span>
      </button>
      <audio ref={audioRef} src={buttonSources[type]} />
    </>
  )
}

export default Button
