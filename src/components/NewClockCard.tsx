import { BsPlusCircleDotted } from 'react-icons/bs';

type NewClockCardProps = { onClick: () => unknown; label?: string };
export function NewClockCard({ onClick, label }: NewClockCardProps) {
  return (
    <div className='bg-grayCard w-[250px] h-[250px] flex flex-col items-center justify-center gap-y-8'>
      {label && <p>{label}</p>}
      <BsPlusCircleDotted
        className='w-10 h-10 cursor-pointer'
        onClick={onClick}
      />
    </div>
  );
}
