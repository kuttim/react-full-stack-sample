import React from "react";
import ReactDOM from "react-dom";
import { UserList } from "./UserList";

describe("UserList component", () => {
    it("renders without crashing", () => {
        const div = document.createElement("div");
        ReactDOM.render(<UserList />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
