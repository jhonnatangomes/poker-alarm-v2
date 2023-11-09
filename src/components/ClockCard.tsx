import { BsPlayCircle, BsStopCircle } from 'react-icons/bs';
import { Clock } from './Clock';

type ClockCardProps = {
  name: string;
  isTicking: boolean;
  onPlay: () => unknown;
  onStop: () => unknown;
  duration: number;
  remainingTime: number;
  finishTime?: Date;
};

export function ClockCard({
  name,
  isTicking,
  onStop,
  onPlay,
  finishTime,
  duration,
  remainingTime,
}: ClockCardProps) {
  return (
    <div className='bg-grayCard w-[250px] h-[250px] flex flex-col items-center gap-y-2'>
      <div>{name}</div>
      <Clock
        duration={duration}
        remainingTime={remainingTime}
        finishTime={finishTime}
      />
      <div>
        <button>
          {isTicking ? (
            <BsStopCircle
              className='w-10 h-10 cursor-pointer'
              onClick={onStop}
            />
          ) : (
            <BsPlayCircle
              className='w-10 h-10 cursor-pointer'
              onClick={onPlay}
            />
          )}
        </button>
      </div>
    </div>
  );
}
