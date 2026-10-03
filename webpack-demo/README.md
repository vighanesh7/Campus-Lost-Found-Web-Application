# Webpack demo (CSA-301 syllabus)
The real application uses **Vite** (`../frontend`). Webpack is included only to show the syllabus topic.

    npm install
    npm run build        # creates dist/bundle.js
    node dist/bundle.js  # prints the sample output

Concepts: entry -> module graph -> loaders/plugins -> output bundle. Vite does the same job but uses native ES modules in development (instant start) and Rollup for production builds.
