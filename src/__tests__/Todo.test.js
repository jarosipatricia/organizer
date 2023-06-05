import { render, screen, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import Todo from '../components/Todo';
import * as firebaseDatabase from 'firebase/database';
import * as firebaseAuth from '../components/CurrentUser';
import * as uidUtility from 'uid';

jest.mock('firebase/database');
jest.mock('../components/CurrentUser');
jest.mock('uid');
jest.useFakeTimers();

const fakeTodoList = {
  todo1: {
    todo: 'fakeTodo',
    isImportant: false,
    todoId: 'fakeTodoId',
  }
}
const fakeSnapshot = {val: () => fakeTodoList};

//avoid real database connection by mocking its functions and using controlled fake return values
beforeEach(() => {
  firebaseAuth.useAuth.mockReturnValue({uid: 'fakeuid'});
  firebaseDatabase.ref.mockReturnValue('fakeReference');
  firebaseDatabase.set.mockReturnValue();
  firebaseDatabase.remove.mockReturnValue();
  firebaseDatabase.update.mockReturnValue();
  firebaseDatabase.onValue.mockImplementationOnce(jest.fn((event, callback) => callback(fakeSnapshot)));
  uidUtility.uid.mockReturnValue('007');
  render(<Router><Todo/></Router>);
 });

describe('click on add button', () => {
  var addButton, todoInputField;
  beforeEach(() => {
    todoInputField = screen.getByLabelText('Add a todo:');
    addButton = screen.getByRole('button', { name: '✓' });
    userEvent.type(todoInputField, "Some todo");
    userEvent.click(addButton);
   });
   test('will call ref with correct params', () => {
    expect(firebaseDatabase.ref.mock.calls[1][1]).toBe('/fakeuid/todos/007');
  });
   test('will call set function once with correct params', () => {  
    expect(firebaseDatabase.set).toHaveBeenCalledTimes(1);
    expect(firebaseDatabase.set.mock.calls[0][1].isImportant).toBe(false);
    expect(firebaseDatabase.set.mock.calls[0][1].todo).toBe('Some todo');
    expect(firebaseDatabase.set.mock.calls[0][1].todoId).toBe('007');
  });
  test('todo inputfield clears', () => {
    expect(todoInputField).toHaveDisplayValue("");
  });
});

describe('click on star button', () => {
  beforeEach(() => {
    var starButton = screen.getByAltText('star');
    userEvent.click(starButton);
   });
  test('will call ref function with correct params', () => {
    expect(firebaseDatabase.ref).toHaveBeenCalled();
    expect(firebaseDatabase.ref.mock.calls[1][1]).toBe('/fakeuid/todos/fakeTodoId');
  });
  test('will call update function with correct params', () => {
    expect(firebaseDatabase.update).toHaveBeenCalledTimes(1);
    expect(firebaseDatabase.update.mock.calls[0][1]).toStrictEqual( { isImportant: true } );
  });
});

describe('click on delete button', () => {
  beforeEach(() => {
    var deleteButton = screen.getByAltText('delete');
    userEvent.click(deleteButton);
   });
  test('will call ref function with the correct params', () => {
    expect(firebaseDatabase.ref.mock.calls[1][1]).toBe('/fakeuid/todos/fakeTodoId');
  });
   test('will call remove function with the correct reference to the db', () => {
    expect(firebaseDatabase.remove).toHaveBeenCalledTimes(1);
    expect(firebaseDatabase.remove.mock.calls).toEqual([ [ 'fakeReference' ] ]);
  });
  test('will show congrats message', () => {
    const message = screen.getByText('Congrats! You are one step closer to empty your todo list!');
    expect(message).toBeInTheDocument;
  });
  test('after 5 sec congrats message disappears', () => {
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    const message = screen.queryByText('Congrats! You are one step closer to empty your todo list!');
    expect(message).toBe(null);
  });
});

test('after component renders, the saved todos of currently logged user is shown', () => {
  var mockedDatabaseReference = firebaseDatabase.ref.mock.calls[0][1];
  var todoCont = screen.getByText('fakeTodo');
  expect(mockedDatabaseReference).toBe('/fakeuid/todos');
  expect(todoCont).toBeInTheDocument();
});

test('if user has no todo items then todoList is empty', () => {
  cleanup();

  var fakeEmptySnap = { val: () => null };
  firebaseDatabase.onValue.mockImplementation(jest.fn((event, callback) => callback(fakeEmptySnap)));

  render(<Router><Todo /></Router>);

  var messageContainer = screen.queryByTestId('todoContainer');
  expect(messageContainer).toBe(null);
});

test('if no user is logged in, todolist is empty', () => {
  cleanup();

  firebaseAuth.useAuth.mockReturnValue(null);
  render(<Router><Todo/></Router>);

  var messageContainer = screen.queryByTestId('todoContainer');
  expect(messageContainer).toBe(null);
});