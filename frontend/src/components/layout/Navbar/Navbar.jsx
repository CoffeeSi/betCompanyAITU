import { useState } from 'react';
import { IconSwitchHorizontal, IconLogout } from '@tabler/icons-react';
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import classes from './Navbar.module.css';
import { SportCards } from '@/features/sports/components/SportCards';

export default function Navbar({ onNavigate }) {
  const [active, setActive] = useState('Football');

  const handleLinkClick = (callback) => (event) => {
    event.preventDefault();
    if (callback) callback();
    if (onNavigate) onNavigate();
  };

  return (
    <nav className={classes.navbar}>
      <SportCards active={active} setActive={setActive} />
    </nav>
  );
}