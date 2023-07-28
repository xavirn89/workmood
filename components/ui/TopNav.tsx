import { BsFillGearFill } from 'react-icons/bs'

type Props = {
  timeWork: number
  timeShortBreak: number
  timeLongBreak: number
  longBreakInterval: number
}

function TopNav({ timeWork, timeShortBreak, timeLongBreak, longBreakInterval }: Props): JSX.Element {
  return (<>
      <BsFillGearFill className='text-gray' onClick={()=>(window as any).modalConfig.showModal()}/>

      <dialog id="modalConfig" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

          <div className='flex flex-col'>
            <h3 className="font-bold text-lg">Settings</h3>
          </div>
          <div className="divider"></div> 

          <div className='flex justify-between'>
            <div className='flex w-1/3 p-1'>
              <label className="input-group input-group-vertical">
                <span>Work</span>
                <input type="text" value={timeWork} readOnly className="input input-bordered" />
              </label>
            </div>

            <div className='flex w-1/3 p-1'>
              <label className="input-group input-group-vertical">
                <span>Short Break</span>
                <input type="text" value={timeShortBreak} readOnly className="input input-bordered" />
              </label>
            </div>

            <div className='flex w-1/3 p-1'>
              <label className="input-group input-group-vertical">
                <span>Long Break</span>
                <input type="text" value={timeLongBreak} readOnly className="input input-bordered" />
              </label>
            </div>
          </div>
          
          <div className='flex justify-end'>
            <div className="flex p-1">
              <label className="input-group">
                <span>Long Break interval</span>
                <input type="text" value={longBreakInterval} readOnly className="input input-sm input-bordered w-14" />
              </label>
            </div>
          </div>
          

          <div className="divider"></div> 
          <div className="flex justify-end">
            <button className="btn btn-success">Save</button>
          </div>
          
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
  </>)
}
export default TopNav