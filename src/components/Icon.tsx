import { IconType as IconComponent } from 'react-icons';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BiDuplicate } from 'react-icons/bi';
import {
  BsFillPlusCircleFill,
  BsPlayCircle,
  BsPlusCircleDotted,
  BsStopCircle,
} from 'react-icons/bs';

type Icon =
  | 'stop'
  | 'play'
  | 'duplicate'
  | 'edit'
  | 'delete'
  | 'add'
  | 'add-dotted';
type IconProps = {
  icon: Icon;
  className?: string;
  onClick?: () => unknown;
  disabled?: boolean;
};

export function Icon({ icon, className, onClick, disabled }: IconProps) {
  const Component: IconComponent = {
    stop: BsStopCircle,
    play: BsPlayCircle,
    duplicate: BiDuplicate,
    edit: AiOutlineEdit,
    delete: AiOutlineDelete,
    add: BsFillPlusCircleFill,
    'add-dotted': BsPlusCircleDotted,
  }[icon];
  return (
    <Component
      className={`${className} ${
        disabled ? 'cursor-not-allowed opacity-20' : 'cursor-pointer'
      }`}
      onClick={!disabled ? onClick : () => {}}
    />
  );
}
