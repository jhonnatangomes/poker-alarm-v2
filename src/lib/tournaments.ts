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
    .set('minutes', minutes);
  const totalWaitingTime = level * blindDuration;
  return getEnterTimeRecursive(tournamentStartTime, totalWaitingTime).toDate();
  function getEnterTimeRecursive(time: Dayjs, blindsTimeLeft: number) {
    const endOfHour = time.endOf('hour');
    const timeToBreak = endOfHour.subtract(5, 'minutes').diff(time);
    if (blindsTimeLeft <= timeToBreak) {
      return time.add(blindsTimeLeft, 'minutes');
    }
    return getEnterTimeRecursive(endOfHour, blindsTimeLeft - timeToBreak);
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
