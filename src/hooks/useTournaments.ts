import { useEffect, useState } from 'react';
import { Tournament } from '../lib/tournaments';
import { equals } from 'ramda';

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  useEffect(() => {
    updateTournaments();
    window.addEventListener('storage', updateTournaments);
    return () => window.removeEventListener('storage', updateTournaments);
  }, []);
  return {
    tournaments,
    addTournaments: (...tournamentsToAdd: Tournament[]) => {
      localStorage.setItem(
        'tournaments',
        JSON.stringify([...tournaments, ...tournamentsToAdd]),
      );
      dispatchEvent(new Event('storage'));
    },
    deleteTournament: (tournament: Tournament) => {
      localStorage.setItem(
        'tournaments',
        JSON.stringify(tournaments.filter(t => !equals(t, tournament))),
      );
      dispatchEvent(new Event('storage'));
    },
  };
  function updateTournaments() {
    setTournaments(JSON.parse(localStorage.getItem('tournaments') || '[]'));
  }
}
