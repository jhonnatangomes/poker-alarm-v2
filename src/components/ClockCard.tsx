import { BsPlayCircle } from 'react-icons/bs';
import { Clock } from './Clock';

type ClockCardProps = {
  name: string;
};

export function ClockCard({ name }: ClockCardProps) {
  return (
    <div className='bg-grayCard w-[250px] h-[250px] flex flex-col items-center gap-y-2'>
      <div>{name}</div>
      <Clock duration={0} remainingTime={0} />
      <div>
        <button>
          <BsPlayCircle className='w-10 h-10 cursor-pointer' />
        </button>
      </div>
    </div>
  );
}
