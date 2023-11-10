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
import { assoc, mergeLeft, prop } from 'ramda';
import dayjs from 'dayjs';
import { BsStopCircle, BsPlayCircle } from 'react-icons/bs';

type Clock = {
  remainingTime: number;
  duration: number;
  finishTime?: Date;
  name: string;
  isTicking: boolean;
  tournament: Tournament;
  notificationTimeoutId?: number;
};

function App() {
  const { tournaments, addTournaments } = useTournaments();
  const tournamentClocksToRender = tournaments.filter(tournament =>
    isWithinStartingRange(tournament, Date.now()),
  );
  const [state, setState] = useState({
    isModalOpen: false,
    clockIndexToEdit: -1,
    clocks: [] as Clock[],
    intervalId: null as number | null,
  });
  const { isModalOpen, clocks, intervalId } = state;
  const anyClocksTicking = clocks.some(prop('isTicking'));
  const isDev = import.meta.env.DEV;
  useEffect(() => {
    setState(
      assoc(
        'clocks',
        tournamentClocksToRender.map(tournament => ({
          name: getClockTournamentName(tournament),
          duration: 0,
          remainingTime: 0,
          isTicking: false,
          tournament,
          notificationTimeoutId: null,
        })),
      ),
    );
  }, [tournaments]);
  return (
    <div className='h-screen w-full flex flex-col justify-between'>
      <div className='p-6 flex flex-wrap gap-4 overflow-y-auto'>
        {clocks.map((clock, i) => (
          <ClockCard key={i} {...clock} onPlay={onPlay(i)} onStop={onStop(i)} />
        ))}
        <NewClockCard onClick={openClockModal} />
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
      <div className='bg-grayCard p-2 flex items-center justify-center'>
        {anyClocksTicking ? (
          <BsStopCircle
            className='w-10 h-10 cursor-pointer'
            onClick={stopAllClocks}
          />
        ) : (
          <BsPlayCircle
            className='w-10 h-10 cursor-pointer'
            onClick={startAllClocks}
          />
        )}
      </div>
      <ClockModal show={isModalOpen} hide={hideClockModal} />
    </div>
  );
  function openClockModal() {
    setState(assoc('isModalOpen', true));
  }
  function hideClockModal() {
    setState(assoc('isModalOpen', false));
  }
  function onPlay(index: number) {
    return () => {
      const { tournament } = clocks[index];
      const now = Date.now();
      const tournamentEnterTime = calculateEnterTime(tournament, now);
      const duration = dayjs(tournamentEnterTime).diff(dayjs(now));
      setState(
        mergeLeft({
          ...(!intervalId ? { intervalId: setInterval(tickClocks, 200) } : {}),
          clocks: clocks.map((clock, i) =>
            i === index
              ? {
                  ...clock,
                  isTicking: true,
                  duration,
                  remainingTime: duration,
                  finishTime: tournamentEnterTime,
                  notificationTimeoutId: setTimeout(
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
                finishTime: undefined,
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
      startTime: now.add(2, 'minute').format('HH:mm'),
      initialStackSize: 10_000,
      desiredStackSize: 20,
      level: 2,
      blind: 500,
      blindDuration: 0.1,
    };
    addTournaments(tournament, tournament2);
  }
  function startAllClocks() {
    const now = Date.now();
    setState(
      mergeLeft({
        intervalId: setInterval(tickClocks, 200),
        clocks: clocks.map(clock => {
          const { tournament } = clock;
          const tournamentEnterTime = calculateEnterTime(tournament, now);
          const duration = dayjs(tournamentEnterTime).diff(dayjs(now));
          return {
            ...clock,
            isTicking: true,
            duration,
            remainingTime: duration,
            finishTime: tournamentEnterTime,
            notificationTimeoutId: setTimeout(notifyEndClock, duration),
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
          clearTimeout(clock.notificationTimeoutId);
          return {
            ...clock,
            isTicking: false,
            duration: 0,
            remainingTime: 0,
            finishTime: undefined,
            notificationTimeoutId: undefined,
          };
        }),
      }),
    );
  }
}

export default App;
