import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import Styles from "./Home.module.scss";
import ReactLogo from "./ReactLogo.svg";

// Add an untyped version of the RouteComponentProps to the HomeProps which contains the history object we can use to
// redirect to different routes.
type HomeProps = RouteComponentProps;

// Notice the name of this class, we want to export the Home component AFTER we inject the react-router into it, so
// this component is merely a base for what we're going to export.
const HomeBase = (props: HomeProps) => {
    // Destructure the props and get the history object used to redirect the client.
    const { history } = props;

    // This is an inline event handler for the click event of the button.
    const onClickButton = () => {
        // Just redirect to the /users route by pushing it to the history.
        history.push("/users");
    };

    return (
        <div className={Styles.home}>
            <header className={Styles.homeHeader}>
                <img src={ReactLogo} className={Styles.homeLogo} alt="React Logo!" />
                <p>Edit any component files and save to reload</p>
                <button onClick={onClickButton}>Go to UserList</button>
            </header>
        </div>
    );
};

// Take the HomeBase component and inject the react-router props using the higher order function withRouter and export
// the result that we name Home right away.
export const Home = withRouter(HomeBase);
