import { IoThunderstormSharp, IoCloudyNight } from 'react-icons/io5'
import { GiBigWave } from 'react-icons/gi'
import { MdForest } from 'react-icons/md'

import Button from './ui/Button'
import { useStore } from '@/stores/globalStore'

interface Props {
  handleClickAmbience: (buttonPlayerId: string) => void
  currentPlayers: string[]
  ambienceVolume: number
  handleVolumeChange: (event: React.ChangeEvent<HTMLInputElement>, playerType: 'input' | 'ambience') => void
}

const AmbienceSection = ({ handleClickAmbience, currentPlayers, ambienceVolume, handleVolumeChange }: Props): JSX.Element => {
  const { mute } = useStore()

  return (<>
    <div className='flex flex-col'>
      <div className='flex'>
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
      </div>
      
      <input type="range" min={0} max="100" value={mute ? 0 : ambienceVolume} className="range range-xs scale-x-[-1] w-48" onChange={(event) => handleVolumeChange(event, 'ambience')} />
    </div>
  </>)
}
export default AmbienceSection