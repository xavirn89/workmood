import { getTimeValue } from '@/utils/functions'

function TimeInput({ value, setValue }: { value: number, setValue: (value: number) => void }) {
  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value)
    if (!isNaN(minutes)) {
      setValue(minutes * 60)
    } else {
      setValue(1)
    }
  }

  return (
    <input 
      type="text" 
      value={getTimeValue(value, 'minutes').toString()} 
      className="input input-bordered bg-slate-300 text-black pl-1" 
      onChange={handleTimeInputChange} 
    />
  )
}
export default TimeInput

