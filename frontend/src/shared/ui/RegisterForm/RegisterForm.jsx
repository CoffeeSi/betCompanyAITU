import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from './RegisterForm.module.css';

export function RegisterForm() {
 return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Create an account
      </Title>

      <Text className={classes.subtitle}>
        Do you have an account? <Anchor component={Link} to="/login">Login</Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <Group justify="space-between" mb="md" grow>
          <TextInput label="First Name" placeholder="Ivan" required radius="md" />
          <TextInput label="Last Name" placeholder="Kuznetsov" required radius="md" />
        </Group>
        <TextInput label="Email" placeholder="241258@astanait.edu.kz" required radius="md" />
        <PasswordInput label="Password" placeholder="Your password" required mt="md" radius="md" />
        <Group justify="space-between" mt="lg">
          <Checkbox label="Remember me" />
          <Anchor component={Link} to="/forgot-password" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" radius="md">
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}