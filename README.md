# CrimeScope

**Real-Time Crime Visualization Platform**

Search, filter, and explore live crime incident data across major U.S. cities on an interactive map.

[Explore the code »](https://github.com/LightAnd2/CrimeScope)

[View Demo](https://crime-scope.vercel.app) · [Report Bug](https://github.com/LightAnd2/CrimeScope/issues) · [Request Feature](https://github.com/LightAnd2/CrimeScope/issues)

---

## Table of Contents

- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## About The Project

CrimeScope is a front-end crime data visualization app that pulls live incident records from public city data portals and renders them on an interactive map. Switch between cities, filter by crime type and time of day, and view breakdowns by neighborhood and hour — all in a dark-themed, fast interface with no backend required.

![CrimeScope preview](public/images/previewCrimeScope.png)

**Why I built it**

- Public crime data exists but the city portals that host it are slow, hard to filter, and not visual
- Comparing crime patterns across cities — or understanding what a neighborhood's data actually looks like — takes too much manual work
- This project puts that data on a map with real filtering, so it's actually usable

**Features**

- Interactive Leaflet map with cluster and heatmap view modes
- Live data from Chicago, Detroit, New York, Los Angeles, San Francisco, Kansas City, Seattle, Dallas, Oakland, Baton Rouge, Denver, and Washington, DC
- Severity-based color system — incidents grouped into Violent, Property, Narcotics, Quality of Life, and Other, each with a distinct color on pins and clusters
- Cluster circles colored by dominant severity in that area
- City-aware date anchoring — portals that lag months behind auto-adjust so filters always work
- Filter by severity category, drill into specific crime types via accordion dropdown, and filter by hour of day with a visual time range bar and quick presets (All / AM / PM / Night)
- Click any map pin to open an incident detail card; click anywhere on the map to dismiss it
- Collapsible sidebar with hamburger toggle — hides on demand to maximize map space
- Full mobile layout: sidebar slides in as an overlay drawer, city selector and date range move into the Filters tab, navbar shows only the logo and live incident count
- Sidebar Stats tab with total count, crime type breakdown, and top neighborhoods
- Sidebar Chart tab with a bar chart of incidents by type
- Stale data indicator when a city portal is behind real time

---

## Built With

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Recharts](https://recharts.org/)
- [date-fns](https://date-fns.org/)
- [Socrata SODA API](https://dev.socrata.com/) (Chicago, NYC, LA, SF, Kansas City, Seattle, Dallas, Oakland, Baton Rouge)
- [ArcGIS FeatureServer](https://developers.arcgis.com/) (Detroit, Denver, Washington, DC)

---

## Getting Started

No backend or API key required. All data comes from free public city portals.

### Prerequisites

- Node.js 18+

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/LightAnd2/CrimeScope.git
   cd CrimeScope
   ```

2. Install dependencies
   ```sh
   npm install
   ```

3. Start the dev server
   ```sh
   npm run dev
   ```

4. Open the app
   ```
   http://localhost:5173
   ```

---

## Usage

- Select a city from the navbar (desktop) or the Filters tab (mobile)
- Use the **14d / 30d / 60d** presets to control the date window
- Toggle **Heatmap** mode at the bottom of the sidebar
- Filter by severity (Violent / Property / Narcotics / Quality of Life / Other) — click the arrow on any category to drill into specific crime types
- Drag the **Hour of Day** sliders or tap a quick preset (All / AM / PM / Night) to filter by time
- Click any map pin to open the incident detail card; click the map background to close it
- The **Stats** tab shows total count, crime type breakdown, and top neighborhoods
- The **Chart** tab shows a ranked bar chart of incidents by type

**Notes**

- Data freshness varies by city — NYC and LA portals run several months behind real time; the app detects this automatically and shows an orange "Data as of [date]" indicator
- Up to 50,000 records are fetched per city and filtered client-side for speed
- Detroit, Denver, and Washington, DC use ArcGIS endpoints; the other cities use the Socrata SODA API

---

## Project Structure

```
CrimeScope/
├── public/
├── src/
│   ├── components/
│   │   ├── CrimeDetail/       # Incident popup card
│   │   ├── Map/               # MapView, markers, heatmap, clusters
│   │   ├── Navbar/            # City search, date presets, incident count
│   │   ├── Sidebar/           # Filters, charts, summary stats
│   │   └── UI/                # Shared small components
│   ├── constants/
│   │   ├── cities.js          # City registry (endpoints, center, zoom, field mapping)
│   │   ├── crimeTypes.js      # Category definitions and colors
│   │   └── chicagoAreas.js    # Chicago community area lookup
│   ├── hooks/
│   │   ├── useCrimeData.js    # Fetch, cache, and re-filter logic
│   │   └── useMapBounds.js    # Visible bounds tracking
│   ├── services/
│   │   ├── soda.js            # Generic Socrata SODA fetcher
│   │   ├── detroit.js         # ArcGIS FeatureServer fetcher
│   │   └── chicago.js         # Chicago-specific overrides
│   ├── store/
│   │   └── crimeStore.js      # Zustand global state
│   ├── utils/
│   │   ├── normalize.js       # Raw API → standard incident shape
│   │   ├── filters.js         # Client-side filtering by date, type, hour
│   │   └── formatDate.js      # Date display helpers
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

---

## Contact

Andrew Koja

- GitHub: [LightAnd2](https://github.com/LightAnd2)
- LinkedIn: [linkedin.com/in/andrewkoja](https://linkedin.com/in/andrewkoja)
- Project: [github.com/LightAnd2/CrimeScope](https://github.com/LightAnd2/CrimeScope)

---

## Acknowledgments

- [Best README Template](https://github.com/othneildrew/Best-README-Template) by othneildrew
- [Leaflet](https://leafletjs.com/)
- [Chicago Data Portal](https://data.cityofchicago.org/)
- [NYC Open Data](https://opendata.cityofnewyork.us/)
- [LA Open Data](https://data.lacity.org/)
- [SF Open Data](https://data.sfgov.org/)
- [Kansas City Open Data](https://data.kcmo.org/)
- [Seattle Open Data](https://data.seattle.gov/)
- [Dallas Open Data](https://www.dallasopendata.com/)
- [Oakland Open Data](https://data.oaklandca.gov/)
- [Baton Rouge Open Data](https://data.brla.gov/)
- [Detroit Open Data](https://data.detroitmi.gov/)
- [Denver Crime Information](https://www.denvergov.org/Public-Safety/Police-Department/Crime-Information)
- [DC Open Data](https://opendata.dc.gov/)
- [Vite](https://vitejs.dev/)
