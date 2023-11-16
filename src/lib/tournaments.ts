import dayjs, { Dayjs } from 'dayjs';
import { sort, subtract } from 'ramda';

export type Tournament = {
  id?: number;
  name: string;
  buyIn: number;
  site: string;
  weekdays: number[];
  startTime: string;
  initialStackSize: number;
  desiredStackSize: number;
  level: number;
  blind: number;
  blindDuration: number;
};

const STARTING_RANGE_IN_HOURS = 8;

export function isWithinStartingRange(tournament: Tournament): boolean {
  const timestamp = dayjs();
  const minimumStartTimestamp = timestamp.subtract(
    STARTING_RANGE_IN_HOURS / 2,
    'hour',
  );
  const maximumStartTimestamp = timestamp.add(STARTING_RANGE_IN_HOURS, 'hour');
  const tournamentTimestamp = getTournamentEnterTime(tournament);
  return (
    tournamentTimestamp.isAfter(minimumStartTimestamp) &&
    tournamentTimestamp.isBefore(maximumStartTimestamp)
  );
}

export function calculateEnterTime(tournament: Tournament): Date {
  const { level, blindDuration } = tournament;
  const tournamentStartTime = getTournamentEnterTime(tournament);
  const totalWaitingTime = (level - 1) * blindDuration;
  if (totalWaitingTime === 0) return tournamentStartTime.toDate();
  return getEnterTimeRecursive(tournamentStartTime, totalWaitingTime).toDate();
  function getEnterTimeRecursive(time: Dayjs, blindsTimeLeft: number) {
    const startOfNextHour = time.add(1, 'hour').startOf('hour');
    const breakTime = startOfNextHour.subtract(5, 'minutes');
    const timeTillBreak = breakTime.diff(time, 'minutes');
    if (time.isAfter(breakTime)) {
      return getEnterTimeRecursive(startOfNextHour, blindsTimeLeft);
    }
    if (blindsTimeLeft <= timeTillBreak) {
      return time.add(blindsTimeLeft, 'minutes');
    }
    return getEnterTimeRecursive(
      startOfNextHour,
      blindsTimeLeft - timeTillBreak,
    );
  }
}

function getTournamentEnterTime(tournament: Tournament) {
  const [hours, minutes] = tournament.startTime.split(':').map(Number);
  return dayjs()
    .set('day', getClosestWeekday(tournament.weekdays))
    .set('hours', hours)
    .set('minutes', minutes)
    .set('seconds', 0)
    .set('milliseconds', 0);
}

export function getClockTournamentName({
  name,
  site,
  buyIn,
}: Tournament): string {
  return `${name} - ${site}, ${buyIn}`;
}

function getClosestWeekday(weekdays: number[]) {
  const currentDay = dayjs().get('day');
  return (
    sort(subtract, weekdays).find(weekday => weekday >= currentDay) ||
    Math.min(...weekdays) + 7
  );
}
