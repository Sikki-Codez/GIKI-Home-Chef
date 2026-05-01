# My Kitchen - Home Chef App Prototype

This repository contains the front-end prototypes for "My Kitchen," a localized food delivery platform[cite: 3]. It is designed to connect university students with local home chefs, allowing them to subscribe to weekly meal plans or order daily specials[cite: 3, 4]. The project was developed utilizing an iterative Human-Computer Interaction (HCI) design process to optimize usability and user flow.

## Features
* **Weekly Subscriptions**: Users can browse home chefs and subscribe to 5-day dinner or lunch meal plans[cite: 3, 6].
* **Daily Specials**: Users can order limited-quantity daily specials before a specified cutoff time[cite: 3, 6].
* **Delivery Profile**: Users can save their specific hostel details and custom delivery instructions for the riders[cite: 3, 6].
* **Calendar Management**: A visual "My Week" dashboard allowing users to track their upcoming subscribed meals[cite: 6, 7].

## Iterative Design Process
This repository contains two distinct versions of the prototype to demonstrate the testing and iteration phases:

### Prototype 1 (Initial Build)
* Built using standard card-based e-commerce layouts[cite: 3, 5].
* Utilizes native browser `window.alert()` for payment confirmations and simple text toggles for profile saves[cite: 4].
* Simulates the "Sold Out" error-prevention state using a static 5-second timer[cite: 4].
* Features a stark white and grey color palette[cite: 5].

### Prototype 2 (Revised Build)
* **Dynamic Menus**: Upgraded the chef profiles to dynamically inject full 5-day bulleted menus via JavaScript based on the selected chef, replacing the truncated text from the first version[cite: 6, 7].
* **Toast Notifications**: Replaced jarring browser alerts with native, animated in-app "Toast" notifications for a seamless, immersive mobile experience[cite: 6, 8].
* **Calendar Integration**: Added a "My Week" bottom navigation tab with a calendar grid, allowing users to visually track their meals after purchasing a subscription[cite: 6, 7].
* **Real-Time Error Prevention**: Upgraded the "Sold Out" logic to read the user's actual system clock, automatically disabling the checkout button past 5:00 PM[cite: 7].
* **Aesthetic Overhaul**: Implemented a slate-blue background with warmer pastel colors for the interface to make the app feel more inviting[cite: 8].

## Technology Stack
* **HTML5**[cite: 3, 6]
* **CSS3**[cite: 5, 8]
* **Vanilla JavaScript**[cite: 4, 7]
* *Note: This project uses pure vanilla web technologies. No external libraries or frameworks (e.g., React, Bootstrap) are required.*

## How to Run
1. Clone or download this repository to your local machine.
2. Ensure you have an `images/` directory in the root folder containing the referenced food and chef images.
3. Open `Prototype1.html` or `Prototype2.html` directly in any modern web browser to interact with the builds.