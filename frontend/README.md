# Trader README

---

## Installation

1. Clone this repository
2. In `/backend`, rename `.env.example` to `.env`, and copy these values:
   ```js
   MONGODB_USERNAME=traderserver
   MONGODB_PASSWORD=t6GomRjw6FKBie1g
   IMAGE_HOSTING_API_KEY=6d207e02198a847aa98d0a2a901485a5
   ```
3. Run `npm install` and `node index.js` to start the server
4. In `/frontend`, rename `.env.example` to `.env`, and copy these values:
   ```js
   REACT_APP_AUTH0_DOMAIN=dev-qr7i7gjzrb1swjit.eu.auth0.com
   REACT_APP_AUTH0_CLIENT_ID=foxOh3Rdy2Pev0zrpXmwSOeqzrK7gu7e
   ```
5. Run `npm install` and `npm start` to start the React application

---

## Idea

The idea of the application is 'Tinder for trading items'.
You can register with your e-mail, Google, or GitHub, and proceed to add items to your account.
Each item has a picture, name, and description. For each item individually, you can swipe other items and get matches. You can also edit and delete items.

---

## Team

- Daniel Diaz
- Brenden Grace
- Tim Willaert
