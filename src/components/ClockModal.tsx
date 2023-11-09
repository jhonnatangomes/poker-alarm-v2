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
  name: string | null;
  buyIn: number | null;
  site: string | null;
  weekdays: number[] | null;
  startTime: string | null;
  initialStackSize: number | null;
  desiredStackSize: number | null;
  level: number | null;
  blind: number | null;
  blindDuration: number | null;
};

export function ClockModal({ show = false, onHide }: ClockModalProps) {
  const [state, setState] = useState<State>({
    name: null,
    buyIn: null,
    site: null,
    weekdays: null,
    startTime: null,
    initialStackSize: null,
    desiredStackSize: null,
    level: null,
    blind: null,
    blindDuration: null,
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
            type='number'
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
              onChange={changeDesiredStackSize}
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
              onChange={changeBlind}
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
          <Button
            colorScheme='green'
            isDisabled={!isValidForm()}
            onClick={saveTournament}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  function onChange(label: keyof State) {
    return (value: string | number) => {
      setState({ ...state, [label]: value });
    };
  }
  function toggleWeekday(index: number) {
    setState({
      ...state,
      weekdays: weekdays?.includes(index)
        ? weekdays.filter(weekday => weekday !== index)
        : [...(weekdays || []), index],
    });
  }
  function isValidForm() {
    return Object.values(state).every(value =>
      Array.isArray(value) ? value.length : value,
    );
  }
  function changeDesiredStackSize(value: number) {
    setState({
      ...state,
      ...(initialStackSize
        ? {
            blind: initialStackSize / value,
          }
        : {}),
      desiredStackSize: value,
    });
  }
  function changeBlind(value: number) {
    setState({
      ...state,
      ...(initialStackSize
        ? {
            desiredStackSize: initialStackSize / value,
          }
        : {}),
      blind: value,
    });
  }
  function saveTournament() {
    console.log(state);
  }
}
