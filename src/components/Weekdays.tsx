import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
} from '@chakra-ui/react';
import { Checkbox } from './Checkbox';

type WeekdaysProps = {
  toggleWeekday: (day: number) => unknown;
  weekdays: number[] | null;
};
export function Weekdays({ toggleWeekday, weekdays }: WeekdaysProps) {
  const isError = weekdays?.length === 0;
  return (
    <FormControl isRequired isInvalid={isError}>
      <FormLabel marginBottom='2px'>Weekdays</FormLabel>
      <HStack>
        <Checkbox
          label='S'
          onChange={() => toggleWeekday(0)}
          checked={weekdays?.includes(0)}
        />
        <Checkbox
          label='M'
          onChange={() => toggleWeekday(1)}
          checked={weekdays?.includes(1)}
        />
        <Checkbox
          label='T'
          onChange={() => toggleWeekday(2)}
          checked={weekdays?.includes(2)}
        />
        <Checkbox
          label='W'
          onChange={() => toggleWeekday(3)}
          checked={weekdays?.includes(3)}
        />
        <Checkbox
          label='T'
          onChange={() => toggleWeekday(4)}
          checked={weekdays?.includes(4)}
        />
        <Checkbox
          label='F'
          onChange={() => toggleWeekday(5)}
          checked={weekdays?.includes(5)}
        />
        <Checkbox
          label='S'
          onChange={() => toggleWeekday(6)}
          checked={weekdays?.includes(6)}
        />
      </HStack>
      <FormErrorMessage>At least one weekday must be selected</FormErrorMessage>
    </FormControl>
  );
}
