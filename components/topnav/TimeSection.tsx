import TimeInput from '@/components/topnav/TimeInput'

function TimeSection({ value, setValue, label }: { value: number, setValue: (value: number) => void, label: string }) {
  return (
    <div className='flex w-1/3 p-1'>
      <label className="input-group input-group-vertical">
        <span>{label}</span>
        <TimeInput value={value} setValue={setValue} />
      </label>
    </div>
  )
}
export default TimeSection