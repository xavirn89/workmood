'use client'
import { useState, useEffect } from 'react'
import Button from '../Button'
import { FaPlay, FaPause, FaUndo, FaForward } from 'react-icons/fa'

interface Props {
  timerActive: boolean
  toggleTimerActive: () => void
  resetTimer: () => void
  changeState: () => void
}

const MainControls = ({ timerActive, toggleTimerActive, resetTimer, changeState }: Props): JSX.Element => {
  return (<>
    {!timerActive ? (
      <Button type={1} icon={FaPlay} onClick={toggleTimerActive} />
    ) : (
      <Button type={1} icon={FaPause} onClick={toggleTimerActive} />
    )}
    <Button type={1} icon={FaUndo} onClick={resetTimer} />
    <Button type={1} icon={FaForward} onClick={changeState} />
  </>)
}
export default MainControls