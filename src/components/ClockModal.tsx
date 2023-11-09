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
import { useState } from 'react';
import { Input } from './Input';
import { Weekdays } from './Weekdays';
import { useTournaments } from '../hooks/useTournaments';
import { Form } from '../lib/types';
import { Tournament } from '../lib/tournaments';
import { assoc, mergeLeft } from 'ramda';

type ClockModalProps = {
  show?: boolean;
  hide: () => unknown;
};

export type TournamentForm = Form<Tournament>;
const INITIAL_STATE = {
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
};

export function ClockModal({ show = false, hide }: ClockModalProps) {
  const [state, setState] = useState<TournamentForm>({
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
  const { addTournament } = useTournaments();
  return (
    <Modal isOpen={show} onClose={hide} isCentered size='2xl'>
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
            isDisabled={!isValidForm(state)}
            onClick={saveTournament}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  function onChange(label: keyof TournamentForm) {
    return (value: string | number) => {
      setState({ ...state, [label]: value });
    };
  }
  function toggleWeekday(index: number) {
    setState(
      assoc(
        'weekdays',
        weekdays?.includes(index)
          ? weekdays.filter(weekday => weekday !== index)
          : [...(weekdays || []), index],
      ),
    );
  }
  function isValidForm(state: TournamentForm): state is Tournament {
    return Object.values(state).every(value =>
      Array.isArray(value) ? value.length : value,
    );
  }
  function changeDesiredStackSize(value: number) {
    setState(
      mergeLeft({
        ...(initialStackSize
          ? {
              blind: initialStackSize / value,
            }
          : {}),
        desiredStackSize: value,
      }),
    );
  }
  function changeBlind(value: number) {
    setState(
      mergeLeft({
        ...(initialStackSize
          ? {
              desiredStackSize: initialStackSize / value,
            }
          : {}),
        blind: value,
      }),
    );
  }
  function saveTournament() {
    if (!isValidForm(state)) return;
    addTournament(state);
    setState(INITIAL_STATE);
    hide();
  }
}
