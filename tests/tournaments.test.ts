import { calculateEnterTime, Tournament } from '../src/lib/tournaments';

describe('calculateEnterTime', () => {
  const tournament: Tournament = {
    name: 'name',
    buyIn: 1,
    site: 'site',
    weekdays: [0],
    startTime: '19:00',
    initialStackSize: 10_000,
    desiredStackSize: 20,
    level: 10,
    blind: 10,
    blindDuration: 10,
  };
  it('works', () => {
    const tournamentEnterTime = calculateEnterTime(tournament);
    expect(tournamentEnterTime.getHours()).toBe(20);
    expect(tournamentEnterTime.getMinutes()).toBe(35);
  });
  it('works when startTime is in break', () => {
    const tournamentEnterTime = calculateEnterTime({
      ...tournament,
      startTime: '19:57',
    });
    expect(tournamentEnterTime.getHours()).toBe(21);
    expect(tournamentEnterTime.getMinutes()).toBe(35);
  });
  it('works when we wanna enter in first level', () => {
    const tournamentEnterTime = calculateEnterTime({ ...tournament, level: 1 });
    expect(tournamentEnterTime.getHours()).toBe(19);
    expect(tournamentEnterTime.getMinutes()).toBe(0);
  });
});
