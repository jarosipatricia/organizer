import { render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import Pomodoro from '../components/Pomodoro';
import { advanceTimersByNTimes } from '../helperFunctions';

jest.useFakeTimers();

beforeEach(() => {
  render(<Router><Pomodoro /></Router>);
 });

test('default timer is set to 25min', () => { 
  const timeContainer = screen.getByTestId('tid');
  expect(timeContainer).toHaveTextContent('25:00');
});

describe("custom timers input", () => {
  it.each([
    ['1', '01:00'], ['-1', '00:00'], ['1.1', '01:00'],
    ['1.6', '02:00'], ['01', '01:00'], ['10', '10:00'],
    ['0', '00:00']
  ])("the input '%s' is displayed as '%s'", (expected, result) => {
    const timerInput = screen.getByRole('spinbutton');
    userEvent.clear(timerInput);
    userEvent.type(timerInput, expected);
    expect(screen.getByTestId('tid')).toHaveTextContent(result);
  });
});

test('start button starts the timer', () => {
  const startButton = screen.getByAltText('start');
  const timeContainer = screen.getByTestId('tid');

  userEvent.click(startButton);
  act(() => { jest.advanceTimersByTime(1000) });

  expect(timeContainer).toHaveTextContent('24:59');
});

test('stop button stops the timer', () => {
  const startButton = screen.getByAltText('start');
  const stopButton = screen.getByAltText('stop');
  const timeContainer = screen.getByTestId('tid');

  userEvent.click(startButton);
  advanceTimersByNTimes(3, 1000);
  userEvent.click(stopButton);
  advanceTimersByNTimes(3, 1000);

  expect(timeContainer).toHaveTextContent('24:57');
});

test('reset button sets timer to 00:00', () => {
  const resetButton = screen.getByAltText('reset');
  const timeContainer = screen.getByTestId('tid');

  userEvent.click(resetButton);

  expect(timeContainer).toHaveTextContent('00:00');
});

test('when the time expires, the timer resets to 00:00', () => {
  const startButton = screen.getByAltText('start');
  const timeContainer = screen.getByTestId('tid');

  userEvent.click(startButton);
  advanceTimersByNTimes(1501, 1000); //25x60+1

  expect(timeContainer).toHaveTextContent('00:00');
});