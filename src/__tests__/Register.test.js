import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from '../components/Register';
import * as firebase from 'firebase/auth';

jest.mock('firebase/auth');

beforeEach(() => {
  render(<Router><Register/></Router>);
});

test('after click on create createUserWithEmailAndPassword is called with given email and password', async () => {
  firebase.createUserWithEmailAndPassword.mockResolvedValue();

  userEvent.type(screen.getByLabelText('Email'), 'user@gmail.com');
  userEvent.type(screen.getByLabelText('Password'), 'password123');
  userEvent.click(screen.getByRole('button', {name: 'Create'}));

  await waitFor(() => {
    expect(firebase.createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(firebase.createUserWithEmailAndPassword.mock.calls[0][1]).toBe('user@gmail.com');
    expect(firebase.createUserWithEmailAndPassword.mock.calls[0][2]).toBe('password123');
  });
});

test('by default no error message should be present', () => {
  const errorMessage = screen.queryByTestId('errorContainer');
  expect(errorMessage).toBe(null);
});

test('if account creation is unsuccessfull error message appears', async() => {
  firebase.createUserWithEmailAndPassword.mockRejectedValue(new Error('Fake error'));
  const createButton = screen.getByRole('button', {name: 'Create'})

  userEvent.click(createButton);

  var messageContainer;
  await waitFor(() => messageContainer = screen.getByText('Fake error'));
  expect(messageContainer).toBeInTheDocument();
});

test('successfull account creation navigates to homepage', async () => {
  firebase.createUserWithEmailAndPassword.mockResolvedValue("");

  userEvent.click(screen.getByRole('button', {name: 'Create'}));
  
  await waitFor(() => expect(global.window.location.href).toContain('/home'));
});

test('navigate to login is successful', () => {
  const loginButton = screen.getByText('Log in!');
  userEvent.click(loginButton);
  expect(location.pathname).toBe('/');
});