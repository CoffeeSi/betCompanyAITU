import { useState } from 'react';
import { IconSwitchHorizontal, IconLogout } from '@tabler/icons-react';
import classes from './Navbar.module.css';
import { SportCards } from '@/features/sports/components/SportCards';

export default function Navbar({ onNavigate }) {
  const [active, setActive] = useState('Billing');

  const handleLinkClick = (callback) => (event) => {
    event.preventDefault();
    if (callback) callback();
    if (onNavigate) onNavigate();
  };

  return (
    <nav className={classes.navbar}>

      <SportCards active={active} setActive={setActive} />

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={handleLinkClick()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a href="#" className={classes.link} onClick={handleLinkClick()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}