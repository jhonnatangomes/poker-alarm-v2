type ClockProps = {
  radius?: number;
  remainingTime: number;
  duration: number;
  finishTime?: string;
};
export function Clock({
  radius = 68,
  remainingTime,
  duration,
  finishTime,
}: ClockProps) {
  const progress = remainingTime / duration || 0;
  const circumference = 2 * Math.PI * radius;
  const unfilledSection = circumference * (1 - progress);
  return (
    <div className='w-[160px] h-[160px] relative'>
      <svg
        viewBox='0 0 165 165'
        width='160'
        height='160'
        className='-rotate-90'
      >
        <circle
          cx='80'
          cy='80'
          r={radius}
          fill='transparent'
          stroke='#3A3F45'
          strokeWidth='12'
        />
        <circle
          cx='80'
          cy='80'
          r='68'
          fill='transparent'
          stroke='#4FC2FB'
          strokeWidth='12px'
          strokeDasharray={circumference}
          strokeDashoffset={unfilledSection}
          className='progress'
        />
      </svg>
      <div className='absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2'>
        <p className='text-xl'>{formatTime(remainingTime)}</p>
        {finishTime && (
          <div className='flex justify-center mt-2'>
            <p className='text-xs w-14 text-center border border-solid border-gray rounded-lg'>
              {finishTime}
            </p>
          </div>
        )}
      </div>
    </div>
  );
  function formatTime(time: number) {
    const secondsTime = time / 1000;
    return [
      Math.floor(secondsTime / 3600),
      Math.floor(secondsTime / 60) % 60,
      Math.floor(secondsTime % 60),
    ]
      .map(t => t.toString().padStart(2, '0'))
      .join(':');
  }
}
