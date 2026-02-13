import classes from './SportCards.module.css';
import { useSports } from '@/features/sports/hooks/useSports';

export function SportCards({ active, onSportSelect }) {
  const { sports, loading, error } = useSports();

  if (loading) return <div>Loading sports...</div>;
  if (error) return <div>Error loading sports: {error}</div>;

  const links = [
    <a
      key="all"
      className={classes.link}
      data-active={active === null || undefined}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        if (onSportSelect) onSportSelect(null, 'All Sports');
      }}
    >
      <span>All Sports</span>
    </a>,
    ...sports.map(sport => (
      <a
        className={classes.link}
        data-active={sport.id === active || undefined}
        href="#"
        key={sport.id}
        onClick={(event) => {
          event.preventDefault();
          if (onSportSelect) onSportSelect(sport.id, sport.name);
        }}
      >
        <span>{sport.name}</span>
      </a>
    ))
  ];

  return (
    <div className={classes.navbarMain}>{links}</div>
  )
}