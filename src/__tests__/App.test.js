import { render } from '@testing-library/react';
import App from "../App.js";

test("app renders without crashing", () => {
    render(<App />);
});