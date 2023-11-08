import {
  FormControl,
  FormLabel,
  Input as CInput,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

type InputProps = {
  label: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  value?: string;
  onChange?: (e: string) => unknown;
};

export function Input({ label, required, type, value, onChange }: InputProps) {
  const isError = value === '';
  return (
    <FormControl isInvalid={isError} isRequired={required}>
      <FormLabel>{label}</FormLabel>
      {type === 'number' ? (
        <NumberInput>
          <NumberInputField onChange={internalOnChange} value={value} />
        </NumberInput>
      ) : (
        <CInput onChange={internalOnChange} value={value} type={type} />
      )}
      <FormErrorMessage>{label} is required</FormErrorMessage>
    </FormControl>
  );
  function internalOnChange(e: ChangeEvent<HTMLInputElement>) {
    onChange?.(e.target.value);
  }
}
