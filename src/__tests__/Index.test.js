import React from "react";
import ReactDOM from "react-dom";
import App from "../App.js";

jest.mock("react-dom");

test("application root should render without crashing", () => {
    ReactDOM.createRoot.mockReturnThis();
    ReactDOM.render.mockReturnThis();
    require("../index.js");
    expect(ReactDOM.render).toHaveBeenCalledWith(<React.StrictMode><App /></React.StrictMode>);
});



