# chat

 Version: 0.9.1

 Author  :

 date    : 2025/09/27

 update  : 2025/09/28

***
### Summary

Turuso database +  workers , chat UI example

***
* dev-start

```
npm run build
npm run dev
```

***
### Setting

* wrangler.jsonc
* TURSO_DATABASE_URL , TURSO_AUTH_TOKEN set

```
/**
 * For more details on how to configure Wrangler, refer to:
 * https://developers.cloudflare.com/workers/wrangler/configuration/
 */
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "workers26",
  "main": "src/index.ts",
  "compatibility_date": "2025-04-10",
  "observability": {
    "enabled": true
  },

	/**
	 * Environment Variables
	 * https://developers.cloudflare.com/workers/wrangler/configuration/#environment-variables
	 */
  "vars": { 
    "MY_VARIABLE": "production_value" ,
    "USER_NAME": "your-name@example.com",
    "PASSWORD": "123",
    "TURSO_DATABASE_URL" :"",
    "TURSO_AUTH_TOKEN" : ""
  },
	/**
	 * Static Assets
	 * https://developers.cloudflare.com/workers/static-assets/binding/
	 */
	//"assets": { "directory": "./public/", "binding": "ASSETS" },
  "assets": {
    "directory": "./public/"
  },
}


```
***
* table : schema.sql

***
### blog 

***

