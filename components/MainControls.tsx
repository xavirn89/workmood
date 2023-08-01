'use client'
import { FaPlay, FaPause, FaUndo, FaForward } from 'react-icons/fa'
import ButtonMain from '@/components/maincontrols/ButtonMain'

interface Props {
  timerActive: boolean
  toggleTimerActive: () => void
  resetTimer: () => void
  changeState: () => void
}

const MainControls = ({ timerActive, toggleTimerActive, resetTimer, changeState }: Props): JSX.Element => {
  return (<>
  
    <ButtonMain icon={FaUndo} onClick={resetTimer} />
    {!timerActive ? (
      <ButtonMain icon={FaPlay} onClick={toggleTimerActive} />
    ) : (
      <ButtonMain icon={FaPause} onClick={toggleTimerActive} />
    )}
    <ButtonMain icon={FaForward} onClick={changeState} />

  </>)
}
export default MainControls