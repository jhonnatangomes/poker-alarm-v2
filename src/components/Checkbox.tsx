import { Checkbox as CCheckbox, Stack } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

type CheckboxProps = {
  label: string;
  checked?: boolean;
  onChange?: () => unknown;
};
export function Checkbox({ label, checked = false, onChange }: CheckboxProps) {
  return (
    <Stack
      display='flex'
      justifyContent='center'
      alignItems='center'
      spacing={1}
    >
      <span>{label}</span>
      <CCheckbox checked={checked} onChange={internalOnChange} />
    </Stack>
  );
  function internalOnChange(e: ChangeEvent<HTMLInputElement>) {
    onChange?.();
  }
}
