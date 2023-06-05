import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../components/Home';

jest.spyOn(window, 'fetch');

const savedLocation = window.location;
const fakeArticles = { "articles" : [{
    title: "Fake title",
    url: "fakeurl",
    description: "Fake description"
 }, {
    title: "Fake title which is longer than 30 characters so need to be cropped after 30",
    url: "fakeurl2",
    description: "Fake description2"
}]};

beforeEach( async () => {
    delete window.location;
    window.location = { assign: jest.fn() };
    window.fetch.mockResolvedValueOnce({ json: () => fakeArticles });

    await act(() => { //wait for all fetched articles to be fully displayed
        render(<Router><Home/></Router>);
      });
});

afterEach(() => {
    window.location = savedLocation;
});

test("after the component renders, articles are displayed as expected", () => {
    const headings = screen.queryAllByTestId('title');
    const descriptions = screen.queryAllByTestId('desc');

    expect(headings[0]).toHaveTextContent('Fake title');
    expect(headings[1]).toHaveTextContent('Fake title which is longer tha...');
    expect(descriptions[0]).toHaveTextContent('Fake description');
    expect(descriptions[1]).toHaveTextContent('Fake description2');
});

test("click on article calls window.location.assign with fake url", () => {
    var firstArticle = screen.queryAllByTestId('articles')[0];
    userEvent.click(firstArticle);
    expect(window.location.assign).toHaveBeenCalledWith(fakeArticles.articles[0].url);
});