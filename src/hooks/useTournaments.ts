import { useEffect, useState } from 'react';
import { Tournament } from '../lib/tournaments';

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
      const nextId = tournaments.length + 1;
      localStorage.setItem(
        'tournaments',
        JSON.stringify([
          ...tournaments,
          ...tournamentsToAdd.map((tournament, i) => ({
            ...tournament,
            id: nextId + i,
          })),
        ]),
      );
      dispatchEvent(new Event('storage'));
    },
    deleteTournament: (id?: number) => {
      localStorage.setItem(
        'tournaments',
        JSON.stringify(tournaments.filter(t => t.id !== id)),
      );
      dispatchEvent(new Event('storage'));
    },
    editTournament: (tournament: Tournament) => {
      localStorage.setItem(
        'tournaments',
        JSON.stringify(
          tournaments.map(t => (t.id === tournament.id ? tournament : t)),
        ),
      );
      dispatchEvent(new Event('storage'));
    },
  };
  function updateTournaments() {
    setTournaments(JSON.parse(localStorage.getItem('tournaments') || '[]'));
  }
}
