# Learn to Win React Native App

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 18.16.0)
- [Xcode](https://developer.apple.com/xcode/)
- [Android Studio](https://developer.android.com/studio)
- [Expo Go App](https://expo.io/client) (iOS or Android)

### Installation

1. Clone the repo
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the app
   ```sh
    npx expo start
   ```
4. Open the app on your phone using the Expo Go app and scan the QR Code

## Usage

There is a menu to open the site in iOS, Android simulators or web browser.

- Press `a` open Android
- Press `i` open iOS simulator
- Press `w` open web
- Press `j` open debugger
- Press `r` reload app
- Press `m` toggle menu
- Press `?` show all commands

> Note: You should have the simulators running before you select android or iOS.

## Prebuild

You can generate the iOS and Adroid projects with the following commands:

```sh
npm install -g eas-cli
npx expo prebuild
```

You can then build them separately with xcode and Android Studio.

> Note: ensure you follow the steps on Expo to set up the builds properly.

## Building for Production

Building for React Native is finiky. We should use EAS which is a build environment expo recommends. EAS can build &
submit our apps to the app stores.

> This is just a quick guide read the [EAS Documentation](https://docs.expo.dev/build/setup/#run-a-build) for more info.

### Setup

Install EAS

```bash
npm install -g eas-cli
```

Login using the expo account linked to your account.

```bash
eas login
```

### Triggering a build

```bash
eas build --profile production --platform ios
```

### Submit to the store

```bash
eas submit -p ios
```

## References

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.io/)
- [EAS Documentation](https://docs.expo.dev/build/setup/#run-a-build)
- [EAS App version Documentation](https://docs.expo.dev/build-reference/app-versions/)
