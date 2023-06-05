import { render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import Menu from '../components/Menu';
import * as firebase from 'firebase/auth';

jest.mock('firebase/auth');

beforeEach(() => {
  render(<Router><Menu/></Router>);
 });

test('home button leads to homepage', () => {
  const linkEl = screen.getByRole('link', { name: 'Home' });
  expect(linkEl).toHaveAttribute('href', '/home');
});

test('timer button leads to timerpage', () => {
  const linkEl = screen.getByRole('link', { name: 'Time manager' });
  expect(linkEl).toHaveAttribute('href', '/pomodoro');
});

test('todo button leads to todopage', () => {
  const linkEl = screen.getByRole('link', { name: 'Todo list' });
  expect(linkEl).toHaveAttribute('href', '/todo');
});

test('epxense tracker button leads to expensetracker page', () => {
  const linkEl = screen.getByRole('link', { name: 'Expense tracker' });
  expect(linkEl).toHaveAttribute('href', '/expensetracker');
});

test('calendar button leads to calendar', () => {
  const linkEl = screen.getByRole('link', { name: 'Calendar' });
  expect(linkEl).toHaveAttribute('href', '/calendarpage');
});

test('successfull logout leads to login page', async () => {
  firebase.signOut.mockResolvedValue("");
  const signOutButton = screen.getByRole('button', { name: 'Logout' });
  userEvent.click(signOutButton);
  await waitFor(() => { expect(firebase.signOut).toHaveBeenCalledTimes(1);});
  expect(location.pathname).toBe('/');
});

test('failed logout leads to displaying error message', async() => {
  const expectedError = new Error('Here is a fake error');
  const signOutButton = screen.getByRole('button', { name: 'Logout' });
  firebase.signOut.mockRejectedValue(expectedError);

  userEvent.click(signOutButton);
  
  await waitFor(() => expect(screen.getByText('Here is a fake error')).toBeInTheDocument());
});