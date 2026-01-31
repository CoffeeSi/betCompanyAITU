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
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { useUserError } from "@/features/auth/hooks/useAuth";
import classes from "./RegisterForm.module.css";

export function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useRegister();
  const error = useUserError();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (
      !fullName ||
      !email ||
      !phone ||
      !dob ||
      !password ||
      !confirmPassword
    ) {
      setValidationError("Please fill in all fields");
      return;
    }

    if (!(/^\p{Lu}\p{Ll}+(?:\s\p{Lu}\p{Ll}+)+$/u.test(fullName))) {
      setValidationError("Please enter your full name");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }

    const age = (new Date() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 18) {
      setValidationError("You must be at least 18 years old to register");
      return;
    }

    const formattedDob = dob.split("T")[0];

    const result = await register({
      full_name: fullName,
      email,
      phone,
      dob: formattedDob,
      password,
      confirm_password: confirmPassword,
    });

    if (result.success === true) {
      navigate("/");
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Create an account
      </Title>

      <Text className={classes.subtitle}>
        Do you have an account?{" "}
        <Anchor component={Link} to="/login">
          Login
        </Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          {(error || validationError) && (
            <Alert color="red" mb="md" title="Error">
              {error || validationError}
            </Alert>
          )}

          <TextInput
            label="Full Name"
            placeholder="Ivan Kuznetsov"
            required
            radius="md"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <TextInput
            label="Email"
            placeholder="241258@astanait.edu.kz"
            required
            radius="md"
            type="email"
            mt="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextInput
            label="Phone"
            placeholder="+77001234567"
            required
            radius="md"
            mt="md"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <DatePickerInput
            label="Date of Birth"
            placeholder="Select your date of birth"
            required
            mt="md"
            radius="md"
            value={dob}
            onChange={setDob}
            maxDate={new Date()}
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

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mt="md"
            radius="md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            fullWidth
            mt="xl"
            radius="md"
            type="submit"
          >
            Sign up
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
