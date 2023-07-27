import { getTimeValue } from '@/utils/functions'

type Props = {
  state: string
  timer: number
}

function Timer({ state, timer }: Props): JSX.Element {
  return (<>
    <h1 className="text-gray text-4xl font-bold">{state}</h1>

    <div className="grid grid-flow-col gap-5 text-center auto-cols-max mt-10">
      <div className="flex flex-col p-2 bg-slate-200 rounded-box text-neutral-content">
        <span className="countdown font-mono text-8xl text-black">
          <span style={{ "--value": getTimeValue(timer, 'minutes') } as React.CSSProperties}></span>
        </span>
        min
      </div> 
      <div className="flex flex-col p-2 bg-slate-200 rounded-box text-neutral-content">
        <span className="countdown font-mono text-8xl text-black">
          <span style={{ "--value": getTimeValue(timer, 'seconds') } as React.CSSProperties}></span>
        </span>
        sec
      </div>
    </div>
  </>)
}
export default Timer