import axios from "axios";
import { UserDto } from "backend";
import * as httpStatusCodes from "http-status-codes";
import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { UsersRouteParams } from "../../Routes";
import Styles from "./UserList.module.scss";

// In contrast to the Home component we are using the generic version of the RouteComponentProps and attach our
// previously defined UsersRouteParams type to it. This allows us to get typed route parameters.
type UserListProps = RouteComponentProps<UsersRouteParams>;
type UserListState = {
    users: UserDto[];
};

class UserListBase extends Component<UserListProps, UserListState> {
    public readonly state: UserListState = {
        // By manually setting the default value of the users state object to the empty array rather than undefined we
        // are able to handle even an empty array in the render method without some weird checks for undefined.
        users: [],
    };

    // Perform API GET calls in componentDidMount and store the results in the state of the component.
    public componentDidMount() {
        // Check the route parameters and decide whether we'll display an entire list of all available users or just
        // one specific user. In order to do so, withRouter is injecting a match object which contains all request
        // parameters and further data.
        const { match } = this.props;
        const { params } = match;
        // Alternatively the two lines above can be shortened to the following one:
        //  const { match: { params } } = this.props;

        if (params.id === undefined) {
            // Fetch the entire list of users.

            // Use axios' get/post/... methods to interact with the backend. Furthermore you might want to encapsulate
            // the hardcoded url and possibly the entire call into a wrapper class.
            axios
                .get<UserDto[]>("http://localhost:4000/users")
                .then((response) => {
                    // response is an AxiosResponse which not only holds the returned data, but the previously sent
                    // request, status information as well as headers you might want to retrieve sometimes.
                    if (response.status === httpStatusCodes.OK) {
                        // We were able to fetch some data, let's store it in the state of this component.
                        this.setState({ users: response.data });
                    } else {
                        // This is not your typical exception - the request was in fact sent to the server but the
                        // server itself did not answer with an OK status. Handle this appropriately.
                        console.error(`Unexpected server response status code ${response.status}`);
                    }
                })
                .catch((error) => {
                    // This branch is reached when the actual response was missing entirely. This might indicate that
                    // the server is offline, or the request got stuck because you never sent anything back. Usually
                    // this is NOT the place to catch INTERNAL SERVER ERRORS as they are in fact a response that will
                    // be handled in the then block.
                    console.error(error);
                });
        } else {
            // Fetch a specific user.

            // Notice the different type in the get brackets? UserDto instead of UserDto[]!
            axios
                .get<UserDto>(`http://localhost:4000/users/${params.id}`)
                .then((response) => {
                    if (response.status === httpStatusCodes.OK) {
                        // Since our state variable users is supposed to be an array we're cheating on this one and
                        // just creating an array out of the single result we just got.
                        this.setState({ users: [response.data] });
                    } else {
                        console.error(`Unexpected server response status code ${response.status}`);
                    }
                })
                .catch(console.error);
        }
    }

    public render() {
        // Obtain the request parameter id via some fancy destructuring.
        const {
            match: {
                params: { id },
            },
        } = this.props;
        const { users } = this.state;

        // Display a different headline text depending on the list mode of this component.
        const headlineText =
            id === undefined
                ? "This is a list of all available users delivered by the API"
                : "This is just a single user delivered by the API";

        // Create an array of li elements holding all users from the API. Furthermore notice the different notation for
        // the id property of the user "id: userId". This will destructure id out of the object and rename it to userId
        // since we already have a variable called id.
        const usersComponent = users.map(({ id: userId, name, username, email }, i) => (
            <li key={i}>
                <a href={`/users/${userId}`}>
                    {id === undefined ? username : `${name} (${username}) with the email ${email}`}
                </a>
            </li>
        ));

        return (
            <div className={Styles.userList}>
                <header className={Styles.userListHeader}>
                    <p>{headlineText}</p>
                    <ul>{usersComponent}</ul>
                </header>
            </div>
        );
    }
}

export const UserList = withRouter(UserListBase);
