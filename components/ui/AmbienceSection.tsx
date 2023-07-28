'use client'
import { useState, useEffect } from 'react'
import { IoThunderstormSharp, IoCloudyNight } from 'react-icons/io5'
import { GiBigWave } from 'react-icons/gi'
import { MdForest } from 'react-icons/md'

import Button from '../Button'

interface Props {
  handleClickAmbience: (buttonPlayerId: string) => void
  currentPlayers: string[]
  ambienceVolume: number
  handleVolumeChange: (event: React.ChangeEvent<HTMLInputElement>, playerType: 'input' | 'ambience') => void
}

const AmbienceSection = ({ handleClickAmbience, currentPlayers, ambienceVolume, handleVolumeChange }: Props): JSX.Element => {
  return (<>
    <Button 
      type={3} 
      icon={IoThunderstormSharp} 
      onClick={() => handleClickAmbience("Thunderstorm")} 
      players={currentPlayers}
      playerName="Thunderstorm"
    />
    <Button 
      type={3} 
      icon={GiBigWave} 
      onClick={() => handleClickAmbience("Waves")} 
      players={currentPlayers}
      playerName="Waves"
    />
    <Button 
      type={3} 
      icon={MdForest} 
      onClick={() => handleClickAmbience("Forest")} 
      players={currentPlayers}
      playerName="Forest"
    />
    <Button 
      type={3} 
      icon={IoCloudyNight} 
      onClick={() => handleClickAmbience("Night")} 
      players={currentPlayers}
      playerName="Night"
    />
    <input type="range" min={0} max="100" value={ambienceVolume} className="range range-xs" onChange={(event) => handleVolumeChange(event, 'ambience')} />
  </>)
}
export default AmbienceSection