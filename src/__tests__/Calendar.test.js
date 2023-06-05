import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import CalendarPage from '../components/Calendar';
import { getToday, getTomorrow, invalidDate } from '../helperFunctions';
import * as firebaseDatabase from 'firebase/database';
import * as firebaseAuth from '../components/CurrentUser';
import * as uidUtility from 'uid';

jest.mock('firebase/database');
jest.mock('../components/CurrentUser');
jest.mock('uid');

const fakeCalendarEvent = {
  event: {
      title: "fake event",
      start: new Date(getToday()),
      end: new Date(getToday()),
      eventId: "fakeid"
  }
}

const fakeSnapshot = { val: () => fakeCalendarEvent };

//avoid real database connection by mocking its functions and using controlled fake return values
beforeEach(() => {
  firebaseAuth.useAuth.mockReturnValue({uid: 'fakeuid'});
  firebaseDatabase.ref.mockReturnValue('fakeReference');
  firebaseDatabase.set.mockReturnValue();
  firebaseDatabase.remove.mockReturnValue();
  firebaseDatabase.onValue.mockImplementation(jest.fn((event, callback) => callback(fakeSnapshot)));
  uidUtility.uid.mockReturnValue('007');

  render(<Router><CalendarPage/></Router>);
 });

test('start date field ignores invalid dates', () => {
  const startDateInputField = screen.getByLabelText('Start date');
  userEvent.type(startDateInputField, invalidDate());
  expect(startDateInputField).toHaveDisplayValue('');
});

test('end date field ignores invalid dates', () => {
  const startDateInputField = screen.getByLabelText('End date');
  userEvent.type(startDateInputField, invalidDate());
  expect(startDateInputField).toHaveDisplayValue('');
});

describe('add button disableness', () => {
  var desc, startDate, endDate, addButton;
  beforeEach(() => {
    desc = screen.getByLabelText('Description');
    startDate = screen.getByLabelText('Start date');
    endDate = screen.getByLabelText('End date');
    addButton = screen.getByRole('button', { name: 'Add' });
   });
  test('is disabled if there is no desc, startDate, endDate added', () => {
    expect(addButton).toBeDisabled();
  });
  test('is disabled if only endDate is added', () => {
    userEvent.type(endDate, getToday());
    expect(addButton).toBeDisabled();
  });
  test('is disabled if only startDate is added', () => {
    userEvent.type(startDate, getToday());
    expect(addButton).toBeDisabled();
  });
  test('is disabled if only description is added', () => {
    userEvent.type(desc, "someDesc");
    expect(addButton).toBeDisabled();
  });
  test('is disabled if description is missing', () => {
    userEvent.type(endDate, getToday());
    userEvent.type(startDate, getToday());
    expect(addButton).toBeDisabled();
  });
  test('is disabled if endDate is missing', () => {
    userEvent.type(desc, "someDesc");
    userEvent.type(startDate, getToday());
    expect(addButton).toBeDisabled();
  });
  test('is disabled if startDate is missing', () => {
    userEvent.type(desc, "someDesc");
    userEvent.type(endDate, getToday());
    expect(addButton).toBeDisabled();
  });
  test('is not disabled if all inputs are filled', () => {
    userEvent.type(desc, "someDesc");
    userEvent.type(startDate, getToday());
    userEvent.type(endDate, getToday());
    expect(addButton).toBeEnabled();
  });
});

describe('add button after click', () => {
  beforeEach(() => {
    userEvent.type(screen.getByLabelText('Description'), "someDesc");
    userEvent.type(screen.getByLabelText('Start date'), getToday());
    userEvent.type(screen.getByLabelText('End date'), getToday());
    userEvent.click(screen.getByRole('button', { name: 'Add' }));
   });
  test('ref function is called with correct params', () => {
    expect(firebaseDatabase.ref.mock.calls[1][1]).toBe('/fakeuid/calendar/007');
  });
  test('set function is called once with correct params', () => {
    expect(firebaseDatabase.set).toHaveBeenCalledTimes(1);
    expect(firebaseDatabase.set.mock.calls[0][1]).toEqual({
      title: 'someDesc',
      start: getToday(),
      end: getToday(),
      eventId: '007'
    });
  });
  test('all fields will be cleared', () => {
    expect(screen.getByLabelText('Description')).toHaveDisplayValue("");
    expect(screen.getByLabelText('Start date')).toHaveDisplayValue("");
    expect(screen.getByLabelText('End date')).toHaveDisplayValue("");
  });
});

test('if endDate is sooner then startDate, the event will not be added to the list', async () => {
  userEvent.type(screen.getByLabelText('Description'), "This is a fake desc");
  userEvent.type(screen.getByLabelText('Start date'), getTomorrow());
  userEvent.type(screen.getByLabelText('End date'), getToday());
  userEvent.click(screen.getByRole('button', { name: 'Add' }));

  var event;
  await waitFor(() => event = screen.queryByText('This is a fake desc'));
  expect(event).toBe(null);
});

test('after the component renders, saved events of currently logged user is shown', () => {
  var mockedDatabaseReference = firebaseDatabase.ref.mock.calls[0][1];
  var savedEvent = screen.getByText('fake event');
  expect(mockedDatabaseReference).toBe('/fakeuid/calendar');
  expect(savedEvent).toBeInTheDocument();
});

describe('window confirm', () => {
  var event;
  test('click on event triggers window confirm', () => {
    window.confirm = jest.fn();
    event = screen.getByText('fake event');
    userEvent.click(event);
    expect(window.confirm).toHaveBeenCalled();
  });
  test('after confirm ref and remove are called with correct params', () => {
    window.confirm = jest.fn(() => true);
    event = screen.getByText('fake event');
    userEvent.click(event);
    expect(firebaseDatabase.ref.mock.calls[1][1]).toBe('/fakeuid/calendar/fakeid');
    expect(firebaseDatabase.remove.mock.calls).toEqual([ [ 'fakeReference' ] ]);
  });
  test('after cancel remove is not called', () => {
    window.confirm = jest.fn(() => false);
    event = screen.getByText('fake event');
    userEvent.click(event);
    expect(firebaseDatabase.remove).not.toHaveBeenCalled();
  });
});

test('if fake data is replaced with null user has no event', () => {
  cleanup();
  var fakeEmptySnap = { val: () => null };
  firebaseDatabase.onValue.mockImplementation(jest.fn((event, callback) => callback(fakeEmptySnap)));

  render(<Router><CalendarPage/></Router>);

  var expenseContainer = screen.queryByText('fake event');
  expect(expenseContainer).toBe(null);
});