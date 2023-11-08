import { BsPlusCircleDotted } from 'react-icons/bs';

type NewClockCardProps = { onClick: () => unknown };
export function NewClockCard({ onClick }: NewClockCardProps) {
  return (
    <div className='bg-grayCard w-[250px] h-[250px] flex items-center justify-center'>
      <BsPlusCircleDotted
        className='w-10 h-10 cursor-pointer'
        onClick={onClick}
      />
    </div>
  );
}
