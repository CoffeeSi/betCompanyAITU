import { Burger, Container, Group, Button, Flex, UnstyledButton, Text } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useIsAuthenticated, useUserActions } from '@/features/auth/hooks/useAuth';
import classes from './Header.module.css';
import { useUser } from '@/features/user/hooks/useUser';

export default function Header({ onBurgerClick, burgerOpened }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const isAuthenticated = useIsAuthenticated();
  const { logout } = useUserActions();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={classes.header}>
      <Container className={classes.inner}>
        <Burger
          opened={burgerOpened}
          onClick={onBurgerClick}
          hiddenFrom="sm"
          size="sm"
          aria-label="Toggle navigation"
        />
        <Link to="/" className={classes.logo}>
          BetCompany
        </Link>
        <Group gap={5} visibleFrom="xs">
          {isAuthenticated ? (
            <Flex>
            <UnstyledButton className={classes.user} component={Link} to="/profile">
              <Group>

                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {user?.full_name}
                  </Text>

                  <Text c="dimmed" size="xs">
                    {user?.email}
                  </Text>
                </div>
              </Group>
            </UnstyledButton>
            <Button onClick={handleLogout} variant="subtle" size="sm">
              Logout
            </Button>
            </Flex>
          ) : (
            <Button component={Link} to="/login" variant="subtle" size="sm">
              Login
            </Button>
          )}
        </Group>
      </Container>
    </header>
  );
}