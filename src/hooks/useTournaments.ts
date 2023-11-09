import { useEffect, useState } from 'react';
import { Tournament } from '../lib/tournaments';

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  useEffect(() => {
    setTournaments(JSON.parse(localStorage.getItem('tournaments') || '[]'));
  }, [localStorage.getItem('tournaments')]);
  return {
    tournaments,
    addTournament: (tournament: Tournament) =>
      localStorage.setItem(
        'tournaments',
        JSON.stringify([...tournaments, tournament]),
      ),
  };
}
