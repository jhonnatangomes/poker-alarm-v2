import { Clock } from './Clock';
import { Icon } from './Icon';

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
  onDuplicate: () => unknown;
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
  onDuplicate,
}: ClockCardProps) {
  return (
    <div
      className={`bg-grayCard w-[250px] p-8 flex flex-col items-center justify-between gap-y-2 relative`}
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
            <Icon
              icon='stop'
              className='w-10 h-10'
              onClick={onStop}
              disabled={disabled}
            />
          ) : (
            <Icon
              icon='play'
              className='w-10 h-10'
              onClick={onPlay}
              disabled={disabled}
            />
          )}
        </button>
      </div>
      <div className='absolute top-3 right-2 flex gap-x-2'>
        <Icon
          icon='duplicate'
          onClick={onDuplicate}
          className='cursor-pointer'
        />
        <Icon icon='edit' onClick={onEdit} className='cursor-pointer' />
        <Icon icon='delete' onClick={onDelete} className='cursor-pointer' />
      </div>
    </div>
  );
}
