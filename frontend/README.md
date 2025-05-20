# Angi Frontend

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg)](https://vitejs.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.24-0170FE.svg)](https://ant.design/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, responsive restaurant review and rating application built with React, TypeScript, and Ant Design. This frontend provides an intuitive interface for discovering restaurants, exploring cuisines, and finding dining options nearby.

## Features

- **Restaurant Discovery**

  - Browse restaurants by location, cuisine, and ratings
  - View detailed restaurant information with reviews
  - Location-based recommendations

- **Cuisine Exploration**

  - Browse restaurants by cuisine type
  - Discover popular cuisines

- **Search & Filter**

  - Search restaurants by name
  - Filter by ratings, cuisine, and distance
  - View restaurants on a map

- **User Experience**
  - Clean and intuitive interface
  - Responsive design for all devices
  - Modern UI components with Ant Design

## Tech Stack

- React 19
- TypeScript 5.7
- Vite 6.2
- Ant Design 5.24
- React Router 7
- TailwindCSS 4.1
- React Query
- Axios

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/angi.git
cd angi/frontend
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

4. Update the `.env` file with your API endpoint:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Development

To start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
yarn build
```

To preview the production build:

```bash
yarn preview
```

### Linting

To run the linter:

```bash
yarn lint
```

## Project Structure

```
src/
├── components/     # React components
├── constants/      # Constants and configuration
├── contexts/       # React contexts
├── hooks/          # Custom React hooks
├── routes/         # Application routes/pages
├── services/       # API services
└── types/          # TypeScript types and interfaces
```

## Environment Variables

| Variable          | Description     | Default                      |
| ----------------- | --------------- | ---------------------------- |
| VITE_API_BASE_URL | Backend API URL | http://localhost:8080/api/v1 |

## License

This project is licensed under the MIT License.
