import {
  FormControl,
  FormLabel,
  Input as CInput,
  FormErrorMessage,
} from '@chakra-ui/react';
import { ChangeEvent, KeyboardEvent } from 'react';

type Value<T> = T extends 'number' ? number : string;
type InputType = 'text' | 'number' | 'time';
type InputProps<T extends InputType> = {
  label: string;
  required?: boolean;
  type?: T | null;
  value: Value<T> | null;
  onChange?: (e: Value<T>) => unknown;
};

export function Input<T extends InputType>({
  label,
  required,
  type,
  value,
  onChange,
}: InputProps<T>) {
  const isError = required && value !== null && !value;
  return (
    <FormControl isInvalid={isError} isRequired={required}>
      <FormLabel>{label}</FormLabel>
      <CInput
        onChange={internalOnChange}
        value={value || ''}
        type={type || 'text'}
        onKeyDown={sanitizeInput}
      />
      <FormErrorMessage>{label} is required</FormErrorMessage>
    </FormControl>
  );
  function internalOnChange(e: ChangeEvent<HTMLInputElement>) {
    switch (type) {
      case 'number':
        return onChange?.(parseFloat(e.target.value) as Value<T>);
      default:
        return onChange?.(e.target.value as Value<T>);
    }
  }
  function sanitizeInput(e: KeyboardEvent<HTMLInputElement>) {
    if (
      type === 'number' &&
      !e.key.match(/[0-9.]/) &&
      e.key !== 'Tab' &&
      e.key !== 'Backspace'
    ) {
      e.preventDefault();
    }
  }
}
