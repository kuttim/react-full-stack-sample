import { RouteProps } from "react-router-dom";
import { Home } from "./components/Home";
import { UserList } from "./components/UserList";

// This array describes all routes that are exposed to the client and is used to automatically populate the Router
// component in the App component.
export const appRoutes: RouteProps[] = [
    {
        // This is the root path of the entire application accessible right at /.
        path: "/",
        // This property describes which component is being rendered when this route matches.
        component: Home,
        // Match this rule and show the respective component only for an exact match.
        exact: true,
    },
    {
        // Notice that this route contains an optional route parameter (indicated by the question mark) called id.
        path: "/users/:id?",
        // When this route matches, whether or not with an id, renders the UserList component. It can read the provided
        // id route parameter by injecting it into the component.
        component: UserList,
    },
];

// Describes the route parameters for the /users path and is used to inject them into the UserLilst component.
export type UsersRouteParams = {
    id?: string;
};
