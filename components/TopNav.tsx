'use client'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { BsFillGearFill, BsGear } from 'react-icons/bs'
import { useStore } from "@/stores/globalStore"
import TimeSection from '@/components/topnav/TimeSection'

declare global {
  interface Window {
    modalConfig: {
      showModal: () => void
    }
  }
}

const MIN_TIME_WORK = 300
const MIN_TIME_SHORT_BREAK = 60

function TopNav(): JSX.Element {
  const [isChecked, setIsChecked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null)
  const { 
    timeWork, changeTimeWork, 
    timeShortBreak, changeTimeShortBreak, 
    timeLongBreak, changeTimeLongBreak,
    longBreakInterval, changeLongBreakInterval
  } = useStore()

  const [tempTimeWork, setTempTimeWork] = useState(() => timeWork)
  const [tempTimeShortBreak, setTempTimeShortBreak] = useState(() => timeShortBreak)
  const [tempTimeLongBreak, setTempTimeLongBreak] = useState(() => timeLongBreak)
  const [tempLongBreakInterval, setTempLongBreakInterval] = useState(() => longBreakInterval)

  const handleCheckboxChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked)
    if (event.target.checked && window.modalConfig) {
      window.modalConfig.showModal()
    }
    if (audioRef.current) {
      audioRef.current.play()
    }
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsChecked(false)
    setTempTimeWork(timeWork)
    setTempTimeShortBreak(timeShortBreak)
    setTempTimeLongBreak(timeLongBreak)
    setTempLongBreakInterval(longBreakInterval)
  }, [timeWork, timeShortBreak, timeLongBreak, longBreakInterval])

  const handleSaveModal = useCallback(() => {
    changeTimeWork(tempTimeWork < MIN_TIME_WORK ? MIN_TIME_WORK : tempTimeWork)
    changeTimeShortBreak(tempTimeShortBreak < MIN_TIME_SHORT_BREAK ? MIN_TIME_SHORT_BREAK : tempTimeShortBreak)
    changeTimeLongBreak(tempTimeLongBreak)
    changeLongBreakInterval(tempLongBreakInterval)
    handleCloseModal()
  }, [tempTimeWork, tempTimeShortBreak, tempTimeLongBreak, tempLongBreakInterval])

  return (
    <>
      <div className='flex w-full justify-between pt-5'>
        <p className='font-mono font-bold tracking-widest'>WorkMood</p>
        <label className="swap swap-rotate">
          <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
          <BsGear className="swap-on fill-current w-6 h-6" />
          <BsFillGearFill className="swap-off fill-current w-6 h-6" />
        </label>
        <audio ref={audioRef} src={'/sounds/bicClick.mp3'} />
      </div>

      <dialog id="modalConfig" className="modal" onClose={handleCloseModal}>
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

          <div className='flex flex-col'>
            <h3 className="font-bold text-lg">Settings</h3>
          </div>
          <div className="divider"></div> 

          <div className='flex justify-between'>
            <TimeSection value={tempTimeWork} setValue={setTempTimeWork} label="Work" />
            <TimeSection value={tempTimeShortBreak} setValue={setTempTimeShortBreak} label="Short Break" />
            <TimeSection value={tempTimeLongBreak} setValue={setTempTimeLongBreak} label="Long Break" />
          </div>

          <div className='flex justify-end'>
            <div className="flex p-1">
              <label className="input-group">
                <span>Long Break interval</span>
                <input 
                  type="text" 
                  value={tempLongBreakInterval.toString()} 
                  className="input input-sm input-bordered w-14 bg-slate-300 text-black pl-1"
                  onChange={(e) => {
                    const rounds = parseInt(e.target.value);
                    if (!isNaN(rounds) && rounds >= 0) {
                      setTempLongBreakInterval(rounds);
                    } else {
                      setTempLongBreakInterval(0);
                    }
                  }} 
                />
              </label>
            </div>
          </div>

          <div className="divider"></div> 
          <div className="flex justify-end">
            <button className="btn btn-success" onClick={handleSaveModal} >Save</button>
          </div>
          
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default TopNav
