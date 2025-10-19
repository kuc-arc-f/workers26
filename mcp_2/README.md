# mcp_2

 Version: 0.9.1

 Author  :

 date    : 2025/10/18

 update  :

***
### Summary

remote MCP Server +  workers , Turuso database 

***
* dev-start

```
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
    "API_KEY" : "123",
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
* settings.json : GEMINI-CLI
```
    "myRemoteServer": {
      "httpUrl": "http://127.0.0.1:8787", 
      "headers": {
        "Authorization": "" 
      },
      "timeout": 5000 
    }    
```


***
* table : schema.sql

***
* prompt
```
お茶 150 円 をAPIに送信して欲しい
```
***
* image

![img1](/image/mcp_2.png)

***
### blog 

https://zenn.dev/knaka0209/scraps/35f4c1dfbe1480

***

