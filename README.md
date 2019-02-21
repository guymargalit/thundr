# Thundr for Desktop, [React Native](https://github.com/guymargalit/thundr-react-native), and [Web](https://github.com/guymargalit/thundr-web)

### Table of Contents
- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Deploy](#deploy)


## Introduction

Thundr is an app that lets you visualize your Spotify music with LIFX Wi-Fi LED lights.

A Spotify account is required along with at least one LIFX Wi-Fi LED light. Thundr will sync with the song currently playing and use Spotify's audio analysis to send different colors and effects to your lights. This project is a work in progress and is still being actively developed.

This repository is for the main desktop application and server.

## Getting Started

Several technologies were used in order to develop Thundr:

-   <a href="https://electronjs.org/">Electron.js</a>
-   <a href="https://reactjs.org/">React</a>
-   <a href="https://nodejs.org/">Node.js</a>
-   <a href="https://www.apollographql.com/">Apollo</a>
-   <a href="https://graphql.org/">GraphQL</a>
-   <a href="https://www.prisma.io/">Prisma</a>
-   <a href="https://www.postgresql.org/">PostgreSQL</a>

The architecture of Thundr can be seen below. This describes how each of the technologies are used and implemented with each other.

<p align="center"><img width="100%" alt="thundr-chart" src="https://firebasestorage.googleapis.com/v0/b/thundr-de04a.appspot.com/o/thundr-chart.png?alt=media&token=b9fddaad-72ef-4242-adc6-5cd33f103659"></p>

Electron is used as a framework for the desktop application with Node.js running in the main process. For its renderer process, React is used for the UI of the desktop application with Apollo Client as a wrapper to communicate with the backend server. 

The backend is server is a Node.js server with Apollo Server that communicates with the Spotify API, the application, and the database. By using Apollo, a GraphQL implementation is possible while wrapping the Spotify REST API with GraphQL. Prisma is used as a database tool with GraphQL and essentially acts as an ORM for PostgreSQL.

## Usage

Clone the repository to a local directory. 

```sh
git clone https://github.com/guymargalit/thundr.git  # Clone the repository
```
In this repository, the desktop application and server are provided. Setup the server and run it locally.

```sh
cd server && yarn install # Install dependencies for server

yarn start  # Start the local development server
```
Next, install the app dependencies and run it in development mode.

```sh
cd app && yarn install  # Install dependencies for app

yarn electron-dev # Start the electron application
```

## Deploy

The application is still under active development and not yet ready for deployment to production. However, the server can be deployed through Flightplan and set up with a Prisma server for the database.

