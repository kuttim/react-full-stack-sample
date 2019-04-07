# React Full Stack Sample

> This monorepo contains a complete full stack sample application powered by React as the frontend library and Express combined with TypeORM in the backend. A lot of the code contains sophisticated comments and explanations in the provided sample, especially in the backend, on how to work with Express and TypeORM.

## Requirements

* **Docker** - used to deploy production builds either locally or remotely and run the Postgres server that is necessary for development and deployment alike
* [**Node Version Manager (NVM)**](https://github.com/creationix/nvm) - used to automatically install and run Node 10.15.3 from the supplied `.nvmrc` file
* **Node 10** - self-explanatory
* **Yarn** - this is a monorepo that initially leveraged the features of lerna, but has been taught to use Yarn workspaces for efficient hoisting of packages

> **Note**
>
> It is highly suggested to not install Yarn globally on the system but in combination with NVM as described in the section *Local development*.

* [**Visual Studio Code (VS Code)**](https://code.visualstudio.com/) - it is recommended to develop using VS Code instead of Webstorm or other editor if you happen to be inexperienced since this repository comes with some pre-configured debugging settings that currently work only in VS Code.
* [**Postman**](https://www.getpostman.com/) (*Optional*) - it is highly recommended to use Postman to test the API endpoints exposed by the backend without the need to use `curl` or "debug" via the frontend. A set of sample API calls can be imported from the `API.postman_collection.json` file into Postman.

## Deployment via Docker

> **Note**
>
> This section is still a **work-in-progress** since the deployment settings and configuration aren't finalized. We're still missing some robust handling of detection whether the frontend is running in a container (to adjust endpoint URLs) as well as inclusion of the Let's Encrypt's certification service to enable HTTPS inside Nginx.
>
> For the former point we'll most likely need to adapt the TypeORM configuration to be able to replace the hardcoded `localhost` path with the Docker service name that we're linking to. In the frontend a "basic" `window.location.hostname` might already suffice but that remains to be tested.

### Starting

1. ~~Run `yarn start:docker` in your terminal.~~
2. ~~Get a cup of tea or coffee and give Docker a few minutes to build the containers.~~
3. ~~Once the server reports `🚀 Server is listening on http://localhost:4000` in the terminal you can navigate to your host at port **4000** and you're done.~~

### Stopping

1. ~~Ctrl+C to attempt a graceful stop of the process.~~
2. ~~Run `yarn stop:docker`.~~
3. ~~*Optional*: Follow up with `yarn prune:docker` to remove the built images in order to free up some space as well as dangling references.~~

## Local development

This method runs the backend server and the client in debug mode without production settings and without dockerizing the application apart from the database server.

> **Note**
>
> Since this sample repository will receive some further tweask and hence isn't finalized yet, it is recommended to fork the repository instead of cloning it locally, otherwise you won't receive upstream changes to the configuration etc.

### Initial installation and configuration after cloning the repository

1. Run `nvm use` in order to enable Node 10.15.3 as the current Node version. If you happen to get the error message `N/A: version "10.15.3 -> N/A" is not yet installed` just execute a `nvm install 10.15.3` in order to install the required version.
2. If you haven't installed Yarn for the current Node version run `npm i -g yarn` to associate a fresh installation of Yarn with the current Node version. Even though we're using the `-g` argument Yarn won't be installed system-wide, only for Node 10.15.3 using NVM.
3. In the root folder, run `yarn` and let Yarn install, hoist and link all required packages.
4. Perform the initial configuration of environment variables
    1. Head to the `docker/postgres` folder and copy the `.env.example` file and name it `.env`. Configure your desired `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB` values for the Postgres server.
    2. Similarly, head to the `packages/backend` folder and copy the `.env.example` file to a new file called `.env`. Set the `TYPEORM_USERNAME`, `TYPEORM_PASSWORD` and `TYPEORM_DATABASE` variables to the very same values you just saved to the Postgres environment file. Leave the other variables untouched for the time being.

> **Note**
>
> Make sure to not commit the `.env` files into the repository. (The `.gitignore` file already ignores `.env` files, but you never know...)

### Starting

1. Make sure to have the correct Node version enabled by running `nvm use`.
2. Run `yarn start:db` to boot up the Postgres database server.

> **Note**
>
> In the `docker-compose.yaml` file the `postgres` service is setup to associate a local physical folder called `database` to the container to persist data even through restarts which mimicks the behaviour on a production server. Comment out the `volumes` section and uncomment the `tmpfs` section to enable temporary in-memory storage of the data.

3. Running the backend server:

    - Run **either** `yarn start:backend` in a separate terminal to boot up the backend server;

    - **Or** run `yarn watch:backend` in a VS Code intergrated terminal window which will not only watch file changes and automatically reload the server but enable the debug capabilities of VS Code.

4. Run `yarn start:frontend` in a separate terminal to boot up the React client in the browser and watch for file changes.

### Stopping

1. Just Ctrl+C the `frontend`, `backend` and `postgres` processes.
2. Stop Postgres by executing `yarn stop:db`.
3. *Optional*: Run `yarn reset:db` to delete the `database` folder which persists data through restarts of the Postgres server if you wan to clean up the database.

## Security

Please keep in mind that the Docker containers, especially the Postgres instance, are barely secured. Running them in production environments without a proper setup using an actual password and blocking ports will make you vulnerable. This issue could result in severe security breaches, and we strongly urge you to take immediate action to secure the instances for production environments before actual deployment.

## Architecture

### **React frontend**

For this application the current implementation of the frontend is using [React](https://reactjs.org/) and leverages the capabilities of [axios](https://github.com/axios/axios) as the HTTP client of our choice. Routing is made available via the [React Router](https://reacttraining.com/react-router/web/guides/quick-start) package. In combination with the [typescript-plugin-css-modules](https://github.com/mrmckeb/typescript-plugin-css-modules) TypeScript server plugin VS Code is able to provide code completion for imported SCSS files.

### **Express backend**

The backend is based on the [Express](https://expressjs.com/) web application framework in conjunction with some generic middleware such as [Helmet](https://helmetjs.github.io/) to secure the server, [body-parser](https://github.com/expressjs/body-parser) to parse incoming requests (duh) as well as [cors](https://github.com/expressjs/cors) for CORS configuration. At its very core we're running [TypeORM](https://typeorm.io/) to access the database without the need to write complex SQL queries.

## About the included sample

As you might have seen already, this sample application isn't a boilerplate or "green field" you might have expected in the first place, it includes one set of sample files to show how to work with TypeORM and Express in combination with React.

Currently the "features" include the following:

* The backend stores `UserEntity` (`models/entities/UserEntity.ts`) objects representing users in a database.
* The backend exposes a set of endpoints (`routes/UsersRoute.ts` and `controllers/UsersController.ts`) to manipulate the `UserEntity` objects in the database:
    * `GET /users`: Gets a list of all available users.
    * `POST /users`: Creates a new user with the data specified in the request body.
    * `GET /users/:id`: Get the user with the specified id.
    * `DELETE /users/:id`: Deletes the user with the specified id.
    * `PUT /users/:id`: Replace (update) the data of the user with the specified id using the data in the request body.
* In order to show how to store data on the server that is not exposed to the clients we're using `UserDto` (`models/dtos/UserDto.ts`) objects to represent data that is sent to client. In our sample these hide the `password` field.
* For the frontend there exists a `Routes.ts` file which simplifies the definition of routes as the `App` component (`components/App/App.tsx`) will automatically create a `BrowserRouter` based on the configure routes.
* The `Home` component (`components/Home/Home.tsx`) contains a simple button in order to show how to add routing and redirects to event handlers. This button will redirect to the `/users` page which renders the `UserList` component (`components/UserList/UserList.tsx`).
* Ultimately the `UserList` component will either display a list of all users, fetched from the API, or display information about a single user, depending on the request parameters as its route is defined as `/users/:id?`. This component shows you how to read certain using the React Router functions.

## Remarks

* When installing new dependencies, do **NOT** install them in the root folder. Do so by `cd`-ing into either of the packages and executing `yarn add is-thirteen` or `yarn add -D is-thirteen`.
* Packages that are only required during compilation and for building anything should be installed as `devDependencies` using the `-D` flag. Everything else that has to be accessible during runtime (especially in the container) **MUST** be installed as a proper `dependency` **without** the `-D` flag.
* If VS Code complains about any package not having typings available install them via `yarn add -D @types/is-thirteen`.
* This repository has some opinionated configurations for Prettier and TSLint. Please adjust them at your own leisure by editing `.editorconfig`, `.prettierc` and `packages/tslint.json`. If you want to install custom linter rules such as the [TSLint Config Airbnb](https://github.com/progre/tslint-config-airbnb/), it's recommended to install the new rules for all packages separately and adjust the `extends` and `rulesDirectory` keys in the `packages/tslint.json`.

## Resources

* [TypeORM documentation](https://typeorm.io/) (**you'll definitely need it!**)
* [Express documentation](https://expressjs.com/)
* [React Router documentation](https://reacttraining.com/react-router/web/guides/quick-start)

## License

[MIT](./LICENSE)
