import { BsPlayCircle, BsStopCircle } from 'react-icons/bs';
import { Clock } from './Clock';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

type ClockCardProps = {
  name: string;
  isTicking: boolean;
  onPlay: () => unknown;
  onStop: () => unknown;
  duration: number;
  remainingTime: number;
  finishTime?: Date;
  disabled?: boolean;
  onEdit: () => unknown;
  onDelete: () => unknown;
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
  onDelete,
  onEdit,
}: ClockCardProps) {
  return (
    <div
      className={`bg-grayCard w-[250px] p-8 flex flex-col items-center justify-between gap-y-2 relative ${
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
      <div className='absolute top-3 right-2 flex gap-x-2'>
        <AiOutlineEdit
          onClick={!disabled ? onEdit : undefined}
          className='cursor-pointer'
        />
        <AiOutlineDelete
          onClick={!disabled ? onDelete : undefined}
          className='cursor-pointer'
        />
      </div>
    </div>
  );
}
