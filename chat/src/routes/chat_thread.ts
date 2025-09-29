  import { Client as LibsqlClient, createClient } from "@libsql/client/web";

  export interface Env {
    TURSO_DATABASE_URL?: string;
    TURSO_AUTH_TOKEN?: string;
  }

export async function chatThreadRouter(
  request: any, env: any, Response:any  
): Promise<Response>
{
    const url = new URL(request.url);
    const path = url.pathname;
//console.log("url=", url);
console.log("path=", path);
     //chat_thread
    // TODOの一覧取得
    if (path === '/api/chat_thread/list' && request.method === 'GET') {
      const client = buildLibsqlClient(env);
      const params = url.searchParams;
      // 3. get()メソッドを使用して特定のクエリパラメータの値を取得
      const content = params.get('content');    
      const post_id = params.get('post_id');    
      console.log("content=", content);

      const sql = `SELECT * FROM ${content}
      WHERE post_id=${post_id} ORDER BY created_at ASC`;
      console.log("sql=", sql);
      const res = await client.execute(sql);
      //console.log(res.rows)
      return new Response(
        JSON.stringify({data: res.rows}), {
        headers: {'Content-Type': 'application/json' },
        status: 200
      });
    }

    // TODOの追加
    if (path === '/api/chat_thread/create' && request.method === 'POST') {
      const client = buildLibsqlClient(env);
      const body = await request.json();
      console.log(body);
      const content = body.content;
      const data = body.data;
      const now = new Date().toISOString();
      const sql_str = `INSERT INTO chat_thread (data, post_id) VALUES(?, ?);`;
      console.log("sql=", sql_str);

      await client.execute({
        sql: sql_str,
        args: [data, body.post_id],
      });
      return new Response(
        JSON.stringify({}), {
        headers: {'Content-Type': 'application/json' },
        status: 200
      });
    }

    // TODOの delete
    if (path === '/api/chat_thread/delete' && request.method === 'POST') {
      const client = buildLibsqlClient(env);
      const body = await request.json();
      console.log(body);
      const content = body.content;

      const sql_str = `DELETE FROM chat_thread WHERE id =?;`;
      console.log("sql=", sql_str);
      await client.execute({
        sql: sql_str,
        args: [body.id ],
      });

      return new Response(
        JSON.stringify({}), {
        headers: {'Content-Type': 'application/json' },
        status: 200
      });      
    }
    return { data: null, status: 0, ret: false };

} 

function buildLibsqlClient(env: Env): LibsqlClient {
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
