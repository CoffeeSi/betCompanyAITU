import { useState } from 'react';
import { IconSwitchHorizontal, IconLogout } from '@tabler/icons-react';
import classes from './Navbar.module.css';
import { SportCards } from '@/features/sports/components/SportCards';

export function Navbar() {
  const [active, setActive] = useState('Billing');

  return (
    <nav className={classes.navbar}>

      <SportCards active={active} setActive={setActive} />

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}