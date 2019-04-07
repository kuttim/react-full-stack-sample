import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { appRoutes } from "../../Routes";

// The App component hosts all components of our application. It does so by rendering the BrowserRouter component at
// its very root which is automatically populated by the appRoutes defined in Routes.ts.
export const App = () => (
    <BrowserRouter>
        <Switch>
            {appRoutes.map((routeProps, i) => (
                <Route {...routeProps} key={i} />
            ))}
        </Switch>
    </BrowserRouter>
);
