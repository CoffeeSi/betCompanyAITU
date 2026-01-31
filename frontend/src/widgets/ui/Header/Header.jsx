import { useState } from 'react';
import { Burger, Container, Group, Button } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { useIsAuthenticated, useUserActions } from '@/entities/user/model/user.selectors';
import classes from './Header.module.css';

const links = [
  { link: '/about', label: 'Features' },
  { link: '/pricing', label: 'Pricing' },
  { link: '/learn', label: 'Learn' },
  { link: '/community', label: 'Community' },
];

export default function Header() {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const isAuthenticated = useIsAuthenticated();
  const { logout } = useUserActions();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        setActive(link.link);
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="xl" className={classes.inner}>
        <h2>BetCompany</h2>
        <Group gap={5} visibleFrom="xs">
          {items}
          {isAuthenticated ? (
            <Button onClick={handleLogout} variant="subtle" size="sm">
              Logout
            </Button>
          ) : (
            <Button component={Link} to="/login" variant="subtle" size="sm">
              Login
            </Button>
          )}
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="xs"
          size="sm"
          aria-label="Toggle navigation"
        />
      </Container>
    </header>
  );
}