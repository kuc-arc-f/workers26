  import { Client as LibsqlClient, createClient } from "@libsql/client/web";

  export interface Env {
    TURSO_DATABASE_URL?: string;
    TURSO_AUTH_TOKEN?: string;
  }

export async function dataRouter(
  request: any, env: any, Response:any  
): Promise<Response>
{
    const url = new URL(request.url);
    const path = url.pathname;
//console.log("url=", url);
console.log("path=", path);

    // TODOの一覧取得
    if (path === '/api/data/list' && request.method === 'GET') {
      const client = buildLibsqlClient(env);
      const params = url.searchParams;
      // 3. get()メソッドを使用して特定のクエリパラメータの値を取得
      const content = params.get('content');    
      const order_str = params.get('order');    
      console.log("content=", content);
      let order_sql = "";
      if(order_str === "desc"){
        order_sql = "  ORDER BY created_at DESC";
      }else{
        order_sql = "  ORDER BY created_at ASC";
      }

      const sql = `SELECT * FROM ${content} ${order_sql}`;
      const res = await client.execute(sql);
      //console.log(res.rows)
      return new Response(
        JSON.stringify({data: res.rows}), {
        headers: {'Content-Type': 'application/json' },
        status: 200
      });
    }

    // TODOの追加
    if (path === '/api/data/create' && request.method === 'POST') {
      const client = buildLibsqlClient(env);
      const body = await request.json();
      console.log(body);
      const content = body.content;
      const data = body.data;
      const now = new Date().toISOString();
      const sql_str = `INSERT INTO ${content} (data) VALUES(?);`;
      console.log("sql=", sql_str);

      await client.execute({
        sql: sql_str,
        args: [data],
      });
      return new Response(
        JSON.stringify({}), {
        headers: {'Content-Type': 'application/json' },
        status: 200
      });
    }

    // TODO update
    if (path === '/api/data/update' && request.method === 'POST') {
      const client = buildLibsqlClient(env);
      const { content, data , id } = await request.json();
      const now = new Date().toISOString();

      const sql_str = `UPDATE ${content} SET data = ? WHERE id = ?;`;
      console.log("sql=", sql_str);

      await client.execute({
        sql: sql_str,
        args: [data , id],
      });      
      return new Response(
        JSON.stringify({}), {
        headers: {'Content-Type': 'application/json' },
        status: 200
      });
    }

    // TODOの delete
    if (path === '/api/data/delete' && request.method === 'POST') {
      const client = buildLibsqlClient(env);
      const body = await request.json();
      console.log(body);
      const content = body.content;

      const sql_str = `DELETE FROM ${body.content} WHERE id =?;`;
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
