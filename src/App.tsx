import { useEffect, useState } from 'react';
import { NewClockCard } from './components/NewClockCard';
import { ClockModal } from './components/ClockModal';
import { useTournaments } from './hooks/useTournaments';
import {
  Tournament,
  calculateEnterTime,
  getClockTournamentName,
  isWithinStartingRange,
} from './lib/tournaments';
import { ClockCard } from './components/ClockCard';
import { assoc, mergeLeft, omit, prop } from 'ramda';
import dayjs from 'dayjs';
import { Icon } from './components/Icon';

type Clock = {
  remainingTime: number;
  duration: number;
  finishTime?: Date;
  name: string;
  isTicking: boolean;
  tournament: Tournament;
  notificationTimeoutId?: number;
  disabled?: boolean;
};

function App() {
  const { tournaments, addTournaments, deleteTournament } = useTournaments();
  const [state, setState] = useState({
    isModalOpen: false,
    clockIndexToEdit: -1,
    clockIndexToDuplicate: -1,
    clocks: [] as Clock[],
    intervalId: null as number | null,
  });
  const {
    isModalOpen,
    clocks,
    intervalId,
    clockIndexToEdit,
    clockIndexToDuplicate,
  } = state;
  const anyClocksTicking = clocks.some(prop('isTicking'));
  const isDev = import.meta.env.DEV;
  useEffect(() => {
    const now = Date.now();
    setState(
      assoc(
        'clocks',
        tournaments
          .map<Clock>(tournament => {
            const finishTime = calculateEnterTime(tournament, now);
            const enterTimePassed = dayjs(finishTime).isBefore(now);
            return {
              name: getClockTournamentName(tournament),
              duration: 0,
              remainingTime: 0,
              isTicking: false,
              tournament,
              ...(isWithinStartingRange(tournament, now) && !enterTimePassed
                ? { finishTime }
                : { disabled: true }),
            };
          })
          .sort((a, b) => {
            if (a.finishTime && b.finishTime) {
              return a.finishTime.getTime() - b.finishTime.getTime();
            }
            if (a.finishTime && !b.finishTime) {
              return -1;
            }
            if (!a.finishTime && b.finishTime) {
              return 1;
            }
            return 0;
          }),
      ),
    );
  }, [tournaments]);
  return (
    <div className='h-screen w-full flex flex-col justify-between gap-6'>
      <div className='p-6 flex justify-center overflow-y-auto relative'>
        <div className='grid grid-cols-4 gap-4'>
          {clocks.map((clock, i) => (
            <ClockCard
              key={i}
              {...clock}
              onPlay={onPlay(i)}
              onStop={onStop(i)}
              onDelete={() => deleteTournament(clock.tournament.id)}
              onEdit={() => editClock(i)}
              onDuplicate={() => duplicateClock(i)}
            />
          ))}
          {isDev && (
            <>
              <NewClockCard
                onClick={createNewTestTournament}
                label='Create Test Tournament'
              />
              <NewClockCard
                onClick={batchCreateTestTournaments}
                label='Batch Create Test Tournaments'
              />
            </>
          )}
        </div>
        <div className='fixed bottom-20 right-6 flex justify-center items-center h-20 w-20'>
          <Icon
            icon='add'
            onClick={openClockModal}
            className='text-green-600 w-16 h-16'
          />
        </div>
      </div>
      <div className='bg-grayCard p-2 flex items-center justify-center'>
        {anyClocksTicking ? (
          <Icon icon='stop' className='w-10 h-10' onClick={stopAllClocks} />
        ) : (
          <Icon icon='play' className='w-10 h-10' onClick={startAllClocks} />
        )}
      </div>
      <ClockModal show={isModalOpen} hide={hideClockModal} />
      {clockIndexToEdit !== -1 && (
        <ClockModal
          show={true}
          hide={hideEditModal}
          tournament={clocks[clockIndexToEdit].tournament}
        />
      )}
      {clockIndexToDuplicate !== -1 && (
        <ClockModal
          show={true}
          hide={hideDuplicateModal}
          tournament={omit(['id'], clocks[clockIndexToDuplicate].tournament)}
        />
      )}
    </div>
  );
  function openClockModal() {
    setState(assoc('isModalOpen', true));
  }
  function hideClockModal() {
    setState(assoc('isModalOpen', false));
  }
  function onPlay(index: number) {
    return async () => {
      await Notification.requestPermission();
      const { finishTime } = clocks[index];
      const now = Date.now();
      const duration = dayjs(finishTime).diff(dayjs(now));
      setState(
        mergeLeft({
          ...(!intervalId
            ? { intervalId: window.setInterval(tickClocks, 200) }
            : {}),
          clocks: clocks.map((clock, i) =>
            i === index
              ? {
                  ...clock,
                  isTicking: true,
                  duration,
                  remainingTime: duration,
                  notificationTimeoutId: window.setTimeout(
                    () => notifyEndClock(clock.name),
                    duration,
                  ),
                }
              : clock,
          ),
        }),
      );
    };
  }
  function onStop(index: number) {
    return () => {
      const singleClockTicking = clocks.filter(prop('isTicking')).length === 1;
      if (singleClockTicking && intervalId) clearInterval(intervalId);
      setState(
        mergeLeft({
          ...(singleClockTicking ? { intervalId: null } : {}),
          clocks: clocks.map((clock, i) => {
            if (i === index) {
              clearTimeout(clock.notificationTimeoutId);
              return {
                ...clock,
                isTicking: false,
                duration: 0,
                remainingTime: 0,
                notificationTimeoutId: undefined,
              };
            }
            return clock;
          }),
        }),
      );
    };
  }
  function tickClocks() {
    setState(state => {
      const { clocks, intervalId } = state;
      const singleClockTicking = clocks.filter(prop('isTicking')).length === 1;
      const clockEnded =
        (clocks.find(prop('isTicking'))?.remainingTime || 0) <= 0;
      const lastClockStopped = singleClockTicking && clockEnded && !!intervalId;
      if (lastClockStopped) {
        if (clockEnded && intervalId) clearInterval(intervalId);
      }
      return {
        ...state,
        clocks: clocks.map(clock => {
          const { isTicking, finishTime } = clock;
          if (!isTicking) return clock;
          const now = dayjs();
          const remainingTime = dayjs(finishTime).diff(now, 'seconds') * 1000;
          const clockEnded = remainingTime <= 0;
          return {
            ...clock,
            ...(clockEnded ? { isTicking: false } : {}),
            remainingTime: clockEnded ? 0 : remainingTime,
          };
        }),
        ...(lastClockStopped ? { intervalId: null } : {}),
      };
    });
  }
  function createSound() {
    const audio = new Audio('alarm.mp3');
    audio.loop = true;
    return audio;
  }
  function startSound(audio: HTMLAudioElement) {
    audio.play();
    return audio;
  }
  function stopSound(audio: HTMLAudioElement) {
    audio.pause();
  }
  async function notifyEndClock(title: string) {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('enable notifications');
      return;
    }
    const notification = new Notification(title);
    let soundElement = createSound();
    notification.addEventListener('show', () => startSound(soundElement));
    notification.addEventListener('click', () => stopSound(soundElement));
    notification.addEventListener('close', () => stopSound(soundElement));
  }
  function createNewTestTournament() {
    const now = dayjs();
    const tournament: Tournament = {
      name: 'name very large big giant enormous gigantic name lol',
      buyIn: 5,
      site: 'site',
      weekdays: [now.get('day')],
      startTime: now.add(1, 'minute').format('HH:mm'),
      initialStackSize: 10_000,
      desiredStackSize: 20,
      level: 2,
      blind: 500,
      blindDuration: 0.1,
    };
    addTournaments(tournament);
  }
  function batchCreateTestTournaments() {
    const now = dayjs();
    const tournament: Tournament = {
      name: 'name',
      buyIn: 5,
      site: 'site',
      weekdays: [now.get('day')],
      startTime: now.add(1, 'minute').format('HH:mm'),
      initialStackSize: 10_000,
      desiredStackSize: 20,
      level: 2,
      blind: 500,
      blindDuration: 0.1,
    };
    const tournament2: Tournament = {
      name: 'name',
      buyIn: 5,
      site: 'site',
      weekdays: [now.get('day')],
      startTime: now.add(50, 'minute').format('HH:mm'),
      initialStackSize: 10_000,
      desiredStackSize: 20,
      level: 2,
      blind: 500,
      blindDuration: 0.1,
    };
    addTournaments(tournament, tournament2);
  }
  async function startAllClocks() {
    await Notification.requestPermission();
    const now = Date.now();
    setState(
      mergeLeft({
        intervalId: window.setInterval(tickClocks, 200),
        clocks: clocks.map(clock => {
          const { finishTime, disabled } = clock;
          if (disabled) return clock;
          const duration = dayjs(finishTime).diff(dayjs(now));
          return {
            ...clock,
            isTicking: true,
            duration,
            remainingTime: duration,
            notificationTimeoutId: window.setTimeout(
              () => notifyEndClock(clock.name),
              duration,
            ),
          };
        }),
      }),
    );
  }
  function stopAllClocks() {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setState(
      mergeLeft({
        intervalId: null,
        clocks: clocks.map(clock => {
          if (clock.disabled) return clock;
          clearTimeout(clock.notificationTimeoutId);
          return {
            ...clock,
            isTicking: false,
            duration: 0,
            remainingTime: 0,
            notificationTimeoutId: undefined,
          };
        }),
      }),
    );
  }
  function editClock(index: number) {
    setState(assoc('clockIndexToEdit', index));
  }
  function hideEditModal() {
    setState(assoc('clockIndexToEdit', -1));
  }
  function duplicateClock(index: number) {
    setState(assoc('clockIndexToDuplicate', index));
  }
  function hideDuplicateModal() {
    setState(assoc('clockIndexToDuplicate', -1));
  }
}

export default App;
