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
  disabled?: boolean;
};

export function ClockCard({
  name,
  isTicking,
  onStop,
  onPlay,
  finishTime,
  duration,
  remainingTime,
  disabled,
}: ClockCardProps) {
  return (
    <div
      className={`bg-grayCard w-[250px] p-2 flex flex-col items-center justify-between gap-y-2 ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      <span className='text-center'>{name}</span>
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
              onClick={!disabled ? onStop : undefined}
            />
          ) : (
            <BsPlayCircle
              className='w-10 h-10 cursor-pointer'
              onClick={!disabled ? onPlay : undefined}
            />
          )}
        </button>
      </div>
    </div>
  );
}
