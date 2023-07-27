import { BsFillGearFill } from 'react-icons/bs'

type Props = {
  openConfig: () => void
}

function TopNav({ openConfig }: Props): JSX.Element {
  return (
      <BsFillGearFill className='text-gray' onClick={openConfig}/>
  )
}
export default TopNav