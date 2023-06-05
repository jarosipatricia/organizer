import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../components/Login';
import userEvent from '@testing-library/user-event';
import * as firebase from 'firebase/auth';

jest.mock('firebase/auth');

beforeEach(() => {
  render(<Router><Login/></Router>);
 });

test('after click on login signInWithEmailAndPassword is called with given email and password', async () => {
  firebase.signInWithEmailAndPassword.mockResolvedValue();

  const emailInputField = screen.getByLabelText('Email');
  const passwordInputField = screen.getByLabelText('Password');
  const loginButton = screen.getByRole('button', {name: 'Log in'});

  userEvent.type(emailInputField, 'user@gmail.com');
  userEvent.type(passwordInputField, 'password123');
  userEvent.click(loginButton);

  await waitFor(() => {
    expect(firebase.signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(firebase.signInWithEmailAndPassword.mock.calls[0][1]).toBe('user@gmail.com');
    expect(firebase.signInWithEmailAndPassword.mock.calls[0][2]).toBe('password123');
  });
});

test('by default no error message is present', () => {
  const errorMessage = screen.queryByTestId('errorContainer');
  expect(errorMessage).toBe(null);
});

test('if login is unsuccessfull error message appears', async() => {
  firebase.signInWithEmailAndPassword.mockRejectedValue(new Error('Fake error'));
  const loginButton = screen.getByRole('button', {name: 'Log in'})

  userEvent.click(loginButton);

  var errorCont;
  await waitFor(() => errorCont = screen.getByText('Fake error'));

  expect(errorCont).toBeInTheDocument();
});

test('successfull login redirects to homepage', async () => {
  firebase.signInWithEmailAndPassword.mockResolvedValue();
  const loginButton = screen.getByRole('button', {name: 'Log in'});

  userEvent.click(loginButton);

  await waitFor(() => expect(global.window.location.href).toContain('/home'));
});

test('click on create navigates to register page', () => {
  const registerButton = screen.getByText('Create one!');
  userEvent.click(registerButton);
  expect(location.pathname).toContain('/register');
});