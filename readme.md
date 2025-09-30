TestBranch Node.js Application
==============================

This project is a Node.js/TypeScript application that integrates multiple parts of the TestBranch application. 

The technologies used are:

Node.js: Backend runtime.
TypeScript: Typed JavaScript for better code quality.
Amazon S3: For JSON and image storage and retrieval.


Setup
-----

This setup is required in package.json.

```
npm init -y
npm install express fabric @firebase/app @firebase/firestore qrcode jsdom pdfkit
npm install --save-dev typescript ts-node nodemon
npx tsc --init
```

Run Locally
-----------

Run `npm install` to install the project dependencies.

Ensure Node.js is installed on your system and a correct version selected using "nvm" (v16 or higher).

Run in the project locally execute `nvm use v20.12.2` and then `npm run dev` in VSC.

To start the application from the terminal.

```
npx ts-node src/app.ts
```

Access the application at [http://localhost:3000/](http://localhost:3000/) with your browser to see the result.


Folder Structure
----------------

project/
├── src/
├── public/
│   └── assets/
└── package.json
