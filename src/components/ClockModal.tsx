import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Input } from './Input';
import { Weekdays } from './Weekdays';
import { useState } from 'react';

type ClockModalProps = {
  show?: boolean;
  onHide: () => unknown;
};

type State = {
  name: string | undefined;
  buyIn: string | undefined;
  site: string | undefined;
  weekdays: number[] | undefined;
  startTime: string | undefined;
  initialStackSize: string | undefined;
  desiredStackSize: string | undefined;
  level: string | undefined;
  blind: string | undefined;
  blindDuration: string | undefined;
};

export function ClockModal({ show = false, onHide }: ClockModalProps) {
  const [state, setState] = useState<State>({
    name: undefined,
    buyIn: undefined,
    site: undefined,
    weekdays: undefined,
    startTime: undefined,
    initialStackSize: undefined,
    desiredStackSize: undefined,
    level: undefined,
    blind: undefined,
    blindDuration: undefined,
  });
  const {
    name,
    buyIn,
    site,
    weekdays,
    startTime,
    initialStackSize,
    desiredStackSize,
    level,
    blind,
    blindDuration,
  } = state;
  return (
    <Modal isOpen={show} onClose={onHide} isCentered size='2xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Tournament Clock</ModalHeader>
        <ModalCloseButton />
        <ModalBody display='flex' flexDir='column' rowGap={4}>
          <Input
            label='Name'
            value={name}
            onChange={onChange('name')}
            required
          />
          <Input
            label='Buy-in'
            value={buyIn}
            onChange={onChange('buyIn')}
            required
          />
          <Input
            label='Site'
            value={site}
            onChange={onChange('site')}
            required
          />
          <HStack>
            <Weekdays weekdays={weekdays} toggleWeekday={toggleWeekday} />
            <Input
              label='Start Time'
              value={startTime}
              onChange={onChange('startTime')}
              type='time'
              required
            />
          </HStack>
          <HStack>
            <Input
              label='Initial Stack Size (in chips)'
              value={initialStackSize}
              onChange={onChange('initialStackSize')}
              type='number'
              required
            />
            <Input
              label='Desired Stack Size (in BB)'
              value={desiredStackSize}
              onChange={onChange('desiredStackSize')}
              type='number'
              required
            />
          </HStack>
          <HStack>
            <Input
              label='Level'
              value={level}
              onChange={onChange('level')}
              type='number'
              required
            />
            <Input
              label='Blind'
              value={blind}
              onChange={onChange('blind')}
              type='number'
              required
            />
            <Input
              label='Blind Duration (in min)'
              value={blindDuration}
              onChange={onChange('blindDuration')}
              type='number'
              required
            />
          </HStack>
        </ModalBody>
        <ModalFooter gap={4}>
          <Button>Close</Button>
          <Button colorScheme='green' isDisabled={!isValidForm()}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  function onChange(label: keyof State) {
    return (value: string) => {
      setState(prev => ({ ...prev, [label]: value }));
    };
  }
  function toggleWeekday(index: number) {
    setState(prev => ({
      ...prev,
      weekdays: weekdays?.includes(index)
        ? weekdays.filter(weekday => weekday !== index)
        : [...(weekdays || []), index],
    }));
  }
  function isValidForm() {
    return Object.values(state).every(value =>
      Array.isArray(value) ? value.length : value,
    );
  }
}
