import dayjs, { Dayjs } from 'dayjs';
import { intersection, uniq } from 'ramda';

export type Tournament = {
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

export function isWithinStartingRange(
  tournament: Tournament,
  startTimestamp: number,
): boolean {
  const timestamp = dayjs(startTimestamp);
  const maximumStartTimestamp = timestamp.add(STARTING_RANGE_IN_HOURS, 'hour');
  const possibleStartingDays = uniq([
    timestamp.get('day'),
    maximumStartTimestamp.get('day'),
  ]);
  if (!intersection(possibleStartingDays, tournament.weekdays).length) {
    return false;
  }
  const [hours, minutes] = getTournamentEnterTime(tournament);
  const tournamentStartTimestamps = possibleStartingDays.map(startDay =>
    dayjs(startTimestamp)
      .set('hours', hours)
      .set('minutes', minutes)
      .set('day', startDay),
  );
  return tournamentStartTimestamps.some(
    tournamentTimestamp =>
      tournamentTimestamp.isAfter(timestamp) &&
      tournamentTimestamp.isBefore(maximumStartTimestamp),
  );
}

export function calculateEnterTime(tournament: Tournament, now: number): Date {
  const { level, blindDuration } = tournament;
  const [hours, minutes] = getTournamentEnterTime(tournament);
  const tournamentStartTime = dayjs(now)
    .set('hours', hours)
    .set('minutes', minutes)
    .set('seconds', 0)
    .set('milliseconds', 0);
  const levelToEnter = level === 1 ? 1 : level - 1;
  const totalWaitingTime = levelToEnter * blindDuration;
  return getEnterTimeRecursive(tournamentStartTime, totalWaitingTime).toDate();
  function getEnterTimeRecursive(time: Dayjs, blindsTimeLeft: number) {
    const startOfNextHour = time.add(1, 'hour').startOf('hour');
    const breakTime = startOfNextHour.subtract(5, 'minutes');
    const timeTillBreak = breakTime.diff(time);
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

function getTournamentEnterTime(tournament: Tournament): [number, number] {
  return tournament.startTime.split(':').map(Number) as [number, number];
}

export function getClockTournamentName({
  name,
  site,
  buyIn,
}: Tournament): string {
  return `${name} - ${site}, ${buyIn}`;
}
