# RSS Reader Backend

## Running The Service

1. Copy `.env.example` into `.env` and use the examples to set up your environment.

2. run `npm run setup:repo` to set up all the necessary document and edge collections with required indexes.

3. run `npm run live` to start the nodemon server.

## Available Scripts

- `npm run live` - start nodemon server
- `npm run setup:repo` - sets up all the necessary document and edge collections with required indexes.
- `npm run teardown:repo` - truncates all the existing non-system document/edge collections.
- `npm run reset:repo` - tears down the db then sets it up.

## API Documentation
You can check out the Docs [here](https://squash.consulting/rss-docs/backend/globals.html)
