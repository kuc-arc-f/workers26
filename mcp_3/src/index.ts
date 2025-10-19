/**
 * Cloudflare Workers - MCP Server with JSON-RPC 2.0
 * Model Context Protocol Remote Server Implementation
 */
import { createClient } from "@libsql/client";
import purchase from "./routes/purchase";
import diary from "./routes/diary";

export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      });
    }

    try {
      const authError = checkAuth(request, env);
      //console.log("authError=", authError);
      if (!authError) {
        return new Response(
          JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32001, message: "Unauthorized" },
          }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      const body = await request.json();
      const response = await handleJsonRpc(body, env);
      
      return new Response(JSON.stringify(response), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32700,
          message: 'Parse error',
          data: error.message
        },
        id: null
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};
// ---------------------------
// 認証チェック関数
// ---------------------------
function checkAuth(request: Request, env: Env): boolean {
  let ret = false;
  const authHeader = request.headers.get("Authorization");
  const expected = env.API_KEY?.trim();
  console.log("authHeader=", authHeader);

  if (authHeader !== expected) {
    return ret;
  }
  return true;
}

/**
 * Handle JSON-RPC 2.0 requests
 */
async function handleJsonRpc(request, env) {
  // Validate JSON-RPC 2.0 request
  if (request.jsonrpc !== '2.0') {
    return {
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message: 'Invalid Request'
      },
      id: request.id || null
    };
  }

  const { method, params, id } = request;

  try {
    let result;

    switch (method) {
      case 'initialize':
        result = await handleInitialize(params);
        break;
      
      case 'tools/list':
        result = await handleToolsList(params);
        break;
      
      case 'tools/call':
        result = await handleToolsCall(params, env);
        break;
      
      case 'resources/list':
        result = await handleResourcesList(params);
        break;
      
      case 'resources/read':
        result = await handleResourcesRead(params, env);
        break;
      
      case 'prompts/list':
        result = await handlePromptsList(params);
        break;
      
      case 'prompts/get':
        result = await handlePromptsGet(params);
        break;
      
      default:
        return {
          jsonrpc: '2.0',
          error: {
            code: -32601,
            message: 'Method not found',
            data: { method }
          },
          id
        };
    }

    return {
      jsonrpc: '2.0',
      result,
      id
    };
  } catch (error) {
    return {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message
      },
      id
    };
  }
}

/**
 * MCP Protocol Handlers
 */

async function handleInitialize(params) {
  return {
    protocolVersion: '2024-11-05',
    capabilities: {
      tools: {},
      resources: {},
      prompts: {}
    },
    serverInfo: {
      name: 'cloudflare-mcp-server',
      version: '1.0.0'
    }
  };
}

/**
*
* @param
*
* @return
*/
async function handleToolsList(params) {
  return {
    tools: [
      {
        name: 'get_time',
        description: 'Get current server time',
        inputSchema: {
          type: 'object',
          properties: {
            timezone: {
              type: 'string',
              description: 'Timezone (optional)',
              default: 'UTC'
            }
          }
        }
      },
      {
        name: 'fetch_data',
        description: 'Fetch data from external API',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to fetch'
            }
          },
          required: ['url']
        }
      },
      {
        name: 'purchase_add',
        description: '品名と価格を受け取り、値をAPIに送信します。',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '購入する品名'
            },
            price: {
              type: 'number',
              description: '価格'
            }
          },
          required: ['name', 'price']
        }
      },     
      {
        name: 'purchase_list',
        description: '購入品リストを、表示します。',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },  
      {
        name: 'diary_add',
        description: '2行面以降の 日記の記事、メモ を取得して。APIに送信します。',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: '日記の記事'
            },
          },
          required: ['text']
        }
      },
      {
        name: 'diary_list',
        description: '日記 記事リストを、表示します。',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },  
       {
        name: 'diary_showone',
        description: "指定ID 値を受け取り、日記 記事データを表示します。",
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'id'
            },
          },
          required: ['id']
        }
      },

    ]
  };
}

/**
*
* @param
*
* @return
*/
async function handleToolsCall(params, env) {
  const { name, arguments: args } = params;

  switch (name) {
    case 'get_time':
      return {
        content: [
          {
            type: 'text',
            text: `Current time: ${new Date().toISOString()}`
          }
        ]
      };
    
    case 'fetch_data':
      try {
        const response = await fetch(args.url);
        const data = await response.text();
        return {
          content: [
            {
              type: 'text',
              text: data
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching data: ${error.message}`
            }
          ],
          isError: true
        };
      };
    case 'purchase_add':
      try {
        const client = buildLibsqlClient(env);
        const resp = await purchase.addPurchase(client, args.name, args.price);
        return {
          content: [
            {
              type: 'text',
              text: `${args.name} ${args.price} 円 購入登録しました。`,
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching data: ${error.message}`
            }
          ],
          isError: true
        };
      }      
    case 'purchase_list':
      try {
        const client = buildLibsqlClient(env);
        const resp = await purchase.listPurchase(client);
        return {
          content: [
            {
              type: 'text',
              text: resp,
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching data: ${error.message}`
            }
          ],
          isError: true
        };
      } 
    case 'diary_add':
      try {
        const client = buildLibsqlClient(env);
        const resp = await diary.diaryAdd(client, args.text);
        console.log( "text=", args.text)
        return {
          content: [
            {
              type: 'text',
              text: `登録しました。`,
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching data: ${error.message}`
            }
          ],
          isError: true
        };
      }

    case 'diary_list':
      try {
        const client = buildLibsqlClient(env);
        const resp = await diary.diaryList(client);
        return {
          content: [
            {
              type: 'text',
              text: resp,
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching data: ${error.message}`
            }
          ],
          isError: true
        };
      }             

    case 'diary_showone':
      try {
        const client = buildLibsqlClient(env);
        const resp = await diary.diaryShowone(client, args.id);
        console.log( "text=", resp)
        return {
          content: [
            {
              type: 'text',
              text: resp,
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching data: ${error.message}`
            }
          ],
          isError: true
        };
      }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

/**
*
* @param
*
* @return
*/
async function handleResourcesList(params) {
  return {
    resources: [
      {
        uri: 'cloudflare://worker/info',
        name: 'Worker Information',
        description: 'Information about this Cloudflare Worker',
        mimeType: 'application/json'
      }
    ]
  };
}

async function handleResourcesRead(params, env) {
  const { uri } = params;

  if (uri === 'cloudflare://worker/info') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            name: 'Cloudflare MCP Server',
            runtime: 'Cloudflare Workers',
            version: '1.0.0'
          }, null, 2)
        }
      ]
    };
  }

  throw new Error(`Resource not found: ${uri}`);
}

async function handlePromptsList(params) {
  return {
    prompts: [
      {
        name: 'greeting',
        description: 'Generate a greeting message',
        arguments: [
          {
            name: 'name',
            description: 'Name to greet',
            required: true
          }
        ]
      }
    ]
  };
}

async function handlePromptsGet(params) {
  const { name, arguments: args } = params;

  if (name === 'greeting') {
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Hello, ${args?.name || 'World'}!`
          }
        }
      ]
    };
  }

  throw new Error(`Prompt not found: ${name}`);
}

/**
*
* @param
*
* @return
*/
function buildLibsqlClient(env: Env) {
  const url = env.TURSO_DATABASE_URL?.trim();
  if (url === undefined) {
    throw new Error("TURSO_DATABASE_URL env var is not defined");
  }

  const authToken = env.TURSO_AUTH_TOKEN?.trim();
  if (authToken == undefined) {
    throw new Error("TURSO_AUTH_TOKEN env var is not defined");
  }

  return createClient({ url, authToken })
}
