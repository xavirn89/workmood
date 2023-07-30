import { getTimeValue } from '@/utils/functions'

type Props = {
  state: string
  timer: number
}

function Timer({ state, timer }: Props): JSX.Element {
  return (<>
    <div className='flex w-96'>
      <div className="hero bg-base-200 rounded-2xl py-8 border-b-4 border-l-2 border-zinc-900">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">{state}</h1>

            <div className="grid grid-flow-col gap-5 text-center auto-cols-max mt-10 justify-center">
              <div className="flex flex-col p-2 bg-slate-200 rounded-box text-neutral-content border-b-4 border-l-2 border-slate-400">
                <span className="countdown font-mono text-8xl text-black">
                  <span style={{ "--value": getTimeValue(timer, 'minutes') } as React.CSSProperties}></span>
                </span>
                min
              </div> 
              <div className="flex flex-col p-2 bg-slate-200 rounded-box text-neutral-content border-b-4 border-l-2 border-slate-400">
                <span className="countdown font-mono text-8xl text-black">
                  <span style={{ "--value": getTimeValue(timer, 'seconds') } as React.CSSProperties}></span>
                </span>
                sec
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    
  </>)
}
export default Timer