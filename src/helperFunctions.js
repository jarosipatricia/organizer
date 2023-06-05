import {act} from '@testing-library/react';

export const getToday = () => {
    var today = `${new Date().getFullYear()}-${new Date().getMonth()+1<10?`0${new Date().getMonth()+1}`:`${new Date().getMonth()+1}`}-${new Date().getDate()<10?`0${new Date().getDate()}`:`${new Date().getDate()}`}`;
    return today;
}

export const getTomorrow = () => {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    var tomorrow = `${currentDate.getFullYear()}-${currentDate.getMonth()+1<10?`0${currentDate.getMonth()+1}`:`${currentDate.getMonth()+1}`}-${currentDate.getDate()<10?`0${currentDate.getDate()}`:`${currentDate.getDate()}`}`;
    return tomorrow;
}

export const firstDayOfLastYear = () => {
    return `${new Date().getFullYear()-1}-01-01`;
}

export const firstDayOfNextYear = () => {
    return `${new Date().getFullYear()+1}-01-01`;
}

export const invalidDate = () => {
    return `${new Date().getFullYear()}-13-01`;
}

export const advanceTimersByNTimes = (n, time) => {
    for (let i = 0; i < n; i++) {
      act(() => {
        jest.advanceTimersByTime(time * 1);
      });
    }
  };