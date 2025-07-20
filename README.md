# Asset Management Dashboard

This is a simple, file-based asset management dashboard built with Next.js and Bootstrap. It allows you to track the value of various assets over time, visualize your portfolio, and record historical snapshots.

## Features

- **Asset Tracking**: Add, edit, and delete assets with details like name, category, value, and currency.
- **Multi-Currency Support**: Track assets in different currencies (e.g., TWD, USD, CNY, BTC).
- **Dynamic Exchange Rates**: View and edit exchange rates. The application supports a mixed-rate system where some currencies are priced against USD and others against TWD.
- **Total Value Calculation**: See your total portfolio value, with the ability to switch the display currency between TWD and USD.
- **Historical Snapshots**: Record the value of your portfolio at any given date.
- **Data Visualization**:
  - A pie chart shows the current distribution of your assets by category.
  - A line chart displays the historical performance of your total portfolio and allows filtering by individual asset categories.
- **Dynamic Tables**: All tables are generated dynamically based on your data.

## Data Storage

This application uses a local, file-based storage system. All your data is stored in JSON files within the `/public/data/` directory.

- `assets.json`: Stores your current list of assets.
- `historical-data.json`: Stores the snapshots you record.
- `exchange-rates.json`: Stores the exchange rates.

**Note**: Because the data is stored in local files, this setup is intended for personal, single-user use.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your data (Optional):**
    The application will work out-of-the-box. If you want to start with your own data, you can edit the JSON files in `/public/data/`. If these files don't exist, the application may create them with default values upon certain actions.

### Running the Development Server

To run the application locally, use the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- [Next.js](https://nextjs.org/) - React Framework
- [React](https://reactjs.org/) - JavaScript Library
- [Bootstrap](https://getbootstrap.com/) - CSS Framework
- [Chart.js](https://www.chartjs.org/) - Data Visualization
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
