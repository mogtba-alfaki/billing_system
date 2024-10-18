# Billing System Task

This project is a Cloudflare Worker that handles billing-related tasks. It uses Cloudflare KV for key-value storage and Cloudflare D1 for database operations. The worker is configured to run scheduled tasks at specified intervals.

## Configuration

### 

wrangler.toml



The 

wrangler.toml

 file is the configuration file for the Cloudflare Worker. Below is the configuration used in this project:

```toml
#:schema node_modules/wrangler/config-schema.json
name = "billing-system-task"
main = "src/index.ts"
compatibility_date = "2024-10-11"

# Bind a KV Namespace. Use KV as persistent storage for small key-value pairs.
# Docs: https://developers.cloudflare.com/workers/wrangler/configuration/#kv-namespaces
[[kv_namespaces]]
binding = "BILLING_KV"
id = "cd89fd2da48a4000b12ff0dd52989cee"

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "billing_system"
database_id = "aa58161b-6b6f-4fe3-ae21-3807990e5339"

[triggers]
crons = ["0 * * * *", "*/30 * * * *"]  # First cron runs every hour, second cron runs every 30 minutes
```

### Configuration Details

- **name**: The name of the Cloudflare Worker.
- **main**: The entry point of the Worker script.
- **compatibility_date**: The date for compatibility checks.
- **kv_namespaces**: Configuration for Cloudflare KV Namespace.
  - **binding**: The variable name used in the Worker script to access the KV Namespace.
  - **id**: The ID of the KV Namespace.
- **d1_databases**: Configuration for Cloudflare D1 Database.
  - **binding**: The variable name used in the Worker script to access the D1 Database.
  - **database_name**: The name of the D1 Database.
  - **database_id**: The ID of the D1 Database.
- **triggers**: Configuration for scheduled tasks (cron jobs).
  - **crons**: An array of cron expressions specifying when the scheduled tasks should run.

## Setting Up

### Prerequisites

- Node.js and npm installed
- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)

### Steps

1. **Clone the Repository**

   ```sh
   git clone https://github.com/your-repo/billing-system-task.git
   cd billing-system-task
   ```

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Configure Wrangler**

   Ensure you are authenticated with Cloudflare:

   ```sh
   wrangler login
   ```

4. **Update 

wrangler.toml

**

   Make sure the 

wrangler.toml

 file is correctly configured with your KV Namespace ID and D1 Database ID.

5. **Publish the Worker**

   ```sh
   wrangler publish
   ```

## Running the Worker Locally

# Api requests collection is proviced in the repository, filename -> (billing_system_api_collection.json)
To run the worker locally for testing purposes, use the following command:

```sh
wrangler dev
```

## Configuring D1 Database

To configure the D1 Database, follow these steps:

1. **Create a D1 Database**

   Go to the Cloudflare dashboard and create a new D1 Database. Note the database name and ID.

2. **Update 

wrangler.toml

**

   Update the `[[d1_databases]]` section in 

wrangler.toml

 with the database name and ID.

## Configuring KV Store

To configure the KV Store, follow these steps:

1. **Create a KV Namespace**

   Go to the Cloudflare dashboard and create a new KV Namespace. Note the namespace ID.

2. **Update 

wrangler.toml

**

   Update the `[[kv_namespaces]]` section in 

wrangler.toml

 with the namespace ID.

## Scheduled Tasks

The worker is configured to run scheduled tasks at specified intervals using cron expressions:

- `0 * * * *`: Runs every hour.
- `*/30 * * * *`: Runs every 30 minutes.

These tasks are defined in the `scheduled` function in the Worker script.