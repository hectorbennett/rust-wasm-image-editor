import React from "react";
import KeyboardShortcut from "./KeyboardShortcut";

describe("<KeyboardShortcut />", () => {
    it("renders", () => {
    // see: https://on.cypress.io/mounting-react
        cy.mount(<KeyboardShortcut />);
    });
});
