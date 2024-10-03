# Learn To Win Web Application (Aegis)

![CI](https://github.com/l2w-official/aegis/actions/workflows/code-check.yml/badge.svg)
![Build](https://github.com/l2w-official/aegis/actions/workflows/build-and-deploy.yml/badge.svg)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

[Aegis](https://www.britannica.com/topic/aegis)

## Setup

This project uses docker to build and run the application. Please refer to the docker-compose.yaml for details.

The default settings are as follows:

- Node 18
- Npm 9

### Transform Figma design tokens to scss variables

To transform figma design tokens, first install

```
npm install token-transformer -g
token-transformer src/tokens/figma-tokens.json src/tokens/figma-tokens.json --expandTypography --expandShadow
```

To convert these to scss variables using style-dictionary

```
npm i style-dictionary -g
style-dictionary build
```

### `docker compose build` or `ltw build`

Builds the container to run the project in development mode.

### `docker compose up -d` or `ltw start`

This will start the server using `npm start` as listed below and listen on port 3000.

### `docker compose down` or `ltw down`

This will shutdown the container and application.

### `docker compose exec -it aegis npm [command]` or `ltw npm [command]`

This will run commands in the container

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

Design token automation from Figma to Storybook: https://matthewrea.com/blog/design-token-automation-from-figma-to-storybook/
