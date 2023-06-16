# Troop Backend

## Setting up development enviornment

- Make sure to that the root directory contains a .env.local

- Installing the dependencies

  `npm install`

- Edit the `./src/config.json` file with the correct credentials of the local database

- Running migrations

  `npm run migrate`

- Starting the server

  `npm start`

### Generating a migration

- `npm run generate-migration "<Name the migration>"`

### Undo a migration

- `npm run undo-migration`

### Undo all migrations

- `npm run undo-all-migration`
