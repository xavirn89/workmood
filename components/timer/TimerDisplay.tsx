const TimerDisplay = ({ value, label }: { value: string, label: string }) => (
  <div className="flex flex-col p-2 bg-slate-200 rounded-box text-neutral-content border-b-4 border-l-2 border-slate-400">
    <span className="countdown font-mono text-8xl text-black">
      <span style={{ "--value": value } as React.CSSProperties}></span>
    </span>
    {label}
  </div>
)
export default TimerDisplay