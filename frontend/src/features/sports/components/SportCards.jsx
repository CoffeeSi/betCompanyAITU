import classes from './SportCards.module.css';
import { useSports } from '@/features/sports/hooks/useSports';

export function SportCards({ active, setActive }) {
  const { sports, loading, error } = useSports();

  if (loading) return <div>Loading sports...</div>;
  if (error) return <div>Error loading sports: {error}</div>;

  const links = sports.map(sport => (
    <a
      className={classes.link}
      data-active={sport.name === active || undefined}
      href={sport.link}
      key={sport.id}
      onClick={(event) => {
        event.preventDefault();
        setActive(sport.name);
      }}
    >
      <span>{sport.name}</span>
    </a>
  ));

  return (
    <div className={classes.navbarMain}>{links}</div>
  )
}