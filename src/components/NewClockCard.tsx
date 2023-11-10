import { Icon } from './Icon';

type NewClockCardProps = { onClick: () => unknown; label?: string };
export function NewClockCard({ onClick, label }: NewClockCardProps) {
  return (
    <div className='bg-grayCard w-[250px] min-h-[250px] flex flex-col items-center justify-center gap-y-8'>
      {label && <p>{label}</p>}
      <Icon icon='add-dotted' className='w-10 h-10' onClick={onClick} />
    </div>
  );
}
