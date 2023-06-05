import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import Expensetracker from '../components/ExpenseTracker';
import { getToday, invalidDate } from '../helperFunctions';
import * as firebaseDatabase from 'firebase/database';
import * as firebaseAuth from '../components/CurrentUser';
import * as uidUtility from 'uid';

jest.mock('../components/CurrentUser');
jest.mock('firebase/database');
jest.mock('uid');

const fakeExpense = {
  expense1: {
    desc: 'some fake desc',
    amount: '3',
    date: getToday(),
    expenseId: 'one',
  },
  expense2: {
    desc: 'amount with minus',
    amount: '-1',
    date: getToday(),
    expenseId: 'two',
  },
  expense3: {
    desc: 'amount with floating point',
    amount: '1.3',
    date: getToday(),
    expenseId: 'three',
  }}

const fakeSnapshot = { val: () => fakeExpense };

//avoid real database connection by mocking its functions and using controlled fake return values
beforeEach(() => {
  firebaseAuth.useAuth.mockReturnValue({uid: 'fakeuid'});
  firebaseDatabase.ref.mockReturnValue('fakeReference');
  firebaseDatabase.set.mockReturnValue();
  firebaseDatabase.remove.mockReturnValue();
  firebaseDatabase.onValue.mockImplementation(jest.fn((event, callback) => callback(fakeSnapshot)));
  uidUtility.uid.mockReturnValue('007');

  render(<Router><Expensetracker/></Router>);
 });

test("price input field content is not rounded", () => {
  const inputElement = screen.getByRole('spinbutton');
  userEvent.type(inputElement, '-1.2');
  expect(inputElement).toHaveDisplayValue('-1.2');
});

test('date field ignores invalid dates', () => {
  const dateInputField = screen.getByLabelText('Date');
  userEvent.type(dateInputField, invalidDate());
  expect(dateInputField).toHaveDisplayValue('');
});

describe('click on add button', () => {
  beforeEach(() => {
    userEvent.type(screen.getByLabelText('Description'), "Some description");
    userEvent.type(screen.getByRole('spinbutton'), "2");
    userEvent.type(screen.getByLabelText('Date'), getToday());
    userEvent.click(screen.getByRole('button', { name: 'Add' }));
   });
  test('calls ref function with correct params', () => {
    expect(firebaseDatabase.ref.mock.calls[1][1]).toBe('/fakeuid/expensetracker/007');
  });
  test('calls set function once with correct params', () => {
    const mockedFunctionParams = firebaseDatabase.set.mock.calls[0][1];
    expect(firebaseDatabase.set).toHaveBeenCalledTimes(1);
    expect(mockedFunctionParams.desc).toBe('Some description');
    expect(mockedFunctionParams.amount).toBe('2');
    expect(mockedFunctionParams.date).toBe(getToday());
    expect(mockedFunctionParams.expenseId).toBe('007');
  });
  test('clears all the fields', () => {
    expect(screen.getByLabelText('Description')).toHaveDisplayValue("");
    expect(screen.getByLabelText('Amount')).toHaveDisplayValue("");
    expect(screen.getByLabelText('Date')).toHaveDisplayValue("");
  });
});

test('after the component renders, the saved expenses of currently logged user is shown', () => {
  var mockedDatabaseReference = firebaseDatabase.ref.mock.calls[0][1];
  var expenseInfo = screen.getByText('some fake desc -')
  expect(mockedDatabaseReference).toBe('/fakeuid/expensetracker');
  expect(expenseInfo).toBeInTheDocument();
});

test('if user has no saved expense then expense list is empty', () => {
  cleanup();
  var fakeEmptySnap = { val: () => null };
  firebaseDatabase.onValue.mockImplementation(jest.fn((event, callback) => callback(fakeEmptySnap)));

  render(<Router><Expensetracker/></Router>);

  var expenseContainer = screen.queryByTestId('expense');
  expect(expenseContainer).toBe(null);
});

test('income has green background color', () => {
  const income = screen.queryAllByTestId('expense')[0];
  expect(income).toHaveStyle("background-color: darkseagreen");
});

test('outcome has red background color', () => {
  const outcome = screen.queryAllByTestId('expense')[1];
  expect(outcome).toHaveStyle("background-color: salmon");
});

test('show the current state of money', () => {
  var totalMoney = screen.getByTestId('totalMoney');
  expect(totalMoney).toHaveTextContent('You currently have 3.3€.');
});

describe('click on delete button', () => {
  beforeEach(() => {
    var deleteButton = screen.queryAllByAltText('delete');
    userEvent.click(deleteButton[0]);
   });
  test('calls ref function with correct params', () => {
    expect(firebaseDatabase.ref.mock.calls[1][1]).toBe('/fakeuid/expensetracker/one');
  });
  test('calls remove function once with correct reference', () => {
    expect(firebaseDatabase.remove).toHaveBeenCalledTimes(1);
    expect(firebaseDatabase.remove.mock.calls).toEqual([ [ 'fakeReference' ] ]);
  });
 });

test('if no user is logged in, expenseList is empty', () => {
  cleanup();

  firebaseAuth.useAuth.mockReturnValue(null);
  render(<Router><Expensetracker/></Router>);

  var messageContainer = screen.queryByTestId('expense');
  expect(messageContainer).toBe(null);
});