import { getTimeValue } from '@/utils/functions'
import TimerDisplay from '@/components/timer/TimerDisplay'

type TimerProps = {
  state: string
  timer: number
}

const Timer = ({ state, timer }: TimerProps): JSX.Element => (
  <div className='flex w-96'>
    <div className="hero bg-base-200 rounded-2xl py-8 border-b-4 border-l-2 border-zinc-900">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">{state}</h1>

          <div className="grid grid-flow-col gap-5 text-center auto-cols-max mt-10 justify-center">
            <TimerDisplay value={getTimeValue(timer, 'minutes')} label='min' />
            <TimerDisplay value={getTimeValue(timer, 'seconds')} label='sec' />
          </div>
          
        </div>
      </div>
    </div>
  </div>
)

export default Timer
