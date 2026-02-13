import classes from './Navbar.module.css';
import { SportCards } from '@/features/sports/components/SportCards';

export default function Navbar({ onNavigate, activeSportId, onSportSelect }) {
  const handleSportSelect = (sportId, sportName) => {
    if (onSportSelect) onSportSelect(sportId, sportName);
    if (onNavigate) onNavigate();
  };

  return (
    <nav className={classes.navbar}>
      <SportCards active={activeSportId} onSportSelect={handleSportSelect} />
    </nav>
  );
}