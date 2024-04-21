# Vcards_DAD

The objective of this project is to implement a Single Page Application (SPA) for the "vCard" platform. The web client is built with the Vue.js framework, while the backend combines Laravel for a RESTful API and Node.js for a WebSocket server. This platform aims to offer a virtual debit card experience for mobile users, with convenient and flexible features.

# The vCard Concept

A vCard is a virtual debit card linked to a mobile phone. Unlike traditional debit cards, there's no physical card; the card is identified by the mobile phone number. Each mobile phone can only be associated with one vCard, and vCards cannot have a negative balance, ensuring they act as debit cards, not credit cards.

Key Features of vCards
Debit Transactions: vCard owners can use their virtual debit cards for purchases, money transfers to other vCards, or payments to external financial entities like PayPal or bank accounts.
Credit Transactions: While vCard owners cannot directly add funds to their cards, they can receive transfers from other vCards or external entities.
Transaction History: All transactions, whether debit or credit, are automatically logged in the vCard's transaction history.
Transaction Descriptions and Categories: Each transaction can include a free-text description and a classification by debit (expense) or credit (income) category. These are optional and can be customized by the vCard owner.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
### Project Images Examples

#### User
![5](https://github.com/GabrielNeves24/Vcards_DAD/assets/100974974/3d2109a9-ccc1-4454-97f6-32b46516bb41)
![6](https://github.com/GabrielNeves24/Vcards_DAD/assets/100974974/ab62f28a-dbfd-40cd-b65c-40f248436348)

#### Admin
![1](https://github.com/GabrielNeves24/Vcards_DAD/assets/100974974/9924ce9a-bbb2-4340-9fdf-564b16368c1b)
![2](https://github.com/GabrielNeves24/Vcards_DAD/assets/100974974/abe33fe9-c131-4e38-bd17-9924bfa2c035)
![3](https://github.com/GabrielNeves24/Vcards_DAD/assets/100974974/08a54916-46f1-4698-bb0a-dd6aea1b8be2)
![4](https://github.com/GabrielNeves24/Vcards_DAD/assets/100974974/e8435618-d9c6-4fac-92d5-74e2f3f3455b)


