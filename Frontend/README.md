## Getting Started with the CareCoord UI

### Prerequisites

Before you begin using the app, you'll need to make sure you have the [current version of Node.js](https://nodejs.org/en/download/) installed, as well as [Git](https://git-scm.com/).

You also will need to install the [Expo Go application](https://expo.dev/client) on your mobile device.

### Step 1: Clone the Repository & Enter the Frontend

If you haven't cloned the CareCoord repo, do so now by entering the following command in your terminal:

`git clone https://capstone-cs.eng.utah.edu/caretechers/caretechers.git`

Then, enter the directory that the mobile application's frontend is located in:

`cd caretechers/Frontend`

### Step 2: Install dependencies

Again, make sure you have Node.js installed (see Prerequisites section above).

Install dependencies by entering the following command in your terminal:

`npm install`

### Step 3: Login to Expo

In order for the Google Auth to work in CareCoord, you must log in to expo in your terminal (make sure you
are in the Frontend directory) by entering this command:

`npx expo login`

Email/Username: `caretecher`

Password: `4$CareTechers`

Once you have logged in, Google Auth should work.

### Step 4: Start the UI development server

To start the development server, just type the singular command in your terminal below

`npm start`

This will generate a QR code that you can scan using the iOS camera app. Assuming you have installed
the Expo Go app on your iPhone, the UI should automatically load once the QR Code is scanned.

Note: These instructions are specifically for iPhone users, as this project is tailored for the iPhone. Instructions may
differ for Android users. If you are an Android user, we recommend visiting [these React Native docs](https://reactnative.dev/docs/environment-setup) for more information.

### Optional - Configuring backend address

If you want the frontend to use your locally-running backend, navigate to the `config.js` file in the `Frontend/constants/` directory.
Then, set the value of the `local_ip` variable to be your computer's IP address. Then, change the value of `ip` to be equal to `local_ip`
rather than `aws_ip`.
