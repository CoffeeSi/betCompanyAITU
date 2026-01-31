import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Alert,
} from '@mantine/core';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '@/features/auth/login/model/login';
import { useUserError } from '@/entities/user/model/user.selectors';
import classes from './LoginForm.module.css';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useLogin();
  const error = useUserError();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    if (!email || !password) {
      setValidationError('Please fill in all fields');
      return;
    }
    
    const result = await login({ email, password });
    
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>

      <Text className={classes.subtitle}>
        Do not have an account yet? <Anchor component={Link} to="/register">Create account</Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          {(error || validationError) && (
            <Alert color="red" mb="md" title="Error">
              {error || validationError}
            </Alert>
          )}
          
          <TextInput 
            label="Email" 
            placeholder="you@example.com" 
            required 
            radius="md"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          <PasswordInput 
            label="Password" 
            placeholder="Your password" 
            required 
            mt="md" 
            radius="md"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          <Button 
            fullWidth 
            mt="xl" 
            radius="md" 
            type="submit"
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
