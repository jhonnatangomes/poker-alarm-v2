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
import { assoc, prop } from 'ramda';
import dayjs from 'dayjs';

type Clock = {
  remainingTime: number;
  duration: number;
  finishTime?: Date;
  name: string;
  isTicking: boolean;
  tournament: Tournament;
};
function App() {
  const { tournaments } = useTournaments();
  const tournamentClocksToRender = tournaments.filter(tournament =>
    isWithinStartingRange(tournament, Date.now()),
  );
  const [state, setState] = useState({
    isModalOpen: false,
    clockIndexToEdit: -1,
    clocks: [] as Clock[],
    intervalId: null as number | null,
  });
  const { isModalOpen, clocks } = state;
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
        })),
      ),
    );
  }, [tournaments]);
  return (
    <div className='h-screen w-full flex flex-col justify-between'>
      <div className='h-[95%] p-6 flex flex-wrap gap-4 overflow-y-auto'>
        {clocks.map((clock, i) => (
          <ClockCard key={i} {...clock} onPlay={onPlay(i)} onStop={onStop(i)} />
        ))}
        <NewClockCard onClick={openClockModal} />
      </div>
      <div className='h-[5%] bg-grayCard'></div>
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
    return () =>
      setState(state => {
        const { intervalId, clocks } = state;
        const { tournament } = clocks[index];
        const now = Date.now();
        const tournamentEnterTime = calculateEnterTime(tournament, now);
        const duration = dayjs(tournamentEnterTime).diff(dayjs(now));
        return {
          ...state,
          ...(!intervalId ? { intervalId: setInterval(tickClocks, 300) } : {}),
          clocks: clocks.map((clock, i) =>
            i === index
              ? {
                  ...clock,
                  isTicking: true,
                  duration,
                  remainingTime: duration,
                  finishTime: tournamentEnterTime,
                }
              : clock,
          ),
        };
      });
  }
  function onStop(index: number) {
    return () =>
      setState(state => {
        const { clocks, intervalId } = state;
        const singleClockTicking =
          clocks.filter(prop('isTicking')).length === 1;
        if (singleClockTicking && intervalId) clearInterval(intervalId);
        return {
          ...state,
          ...(singleClockTicking ? { intervalId: null } : {}),
          clocks: clocks.map((clock, i) =>
            i === index
              ? {
                  ...clock,
                  isTicking: false,
                  duration: 0,
                  remainingTime: 0,
                  finishTime: undefined,
                }
              : clock,
          ),
        };
      });
  }
  function tickClocks() {
    setState(state => {
      const { clocks } = state;
      return {
        ...state,
        clocks: clocks.map(clock => {
          const { isTicking, finishTime } = clock;
          if (!isTicking) return clock;
          const now = dayjs();
          return { ...clock, remainingTime: dayjs(finishTime).diff(now) };
        }),
      };
    });
  }
}

export default App;
