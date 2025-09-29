
export async function todoRouter(
  request: any, env: any, Response:any  
): Promise<Response>
{
  
    const url = new URL(request.url);
    const path = url.pathname;
//console.log("url=", url);
//console.log("path=", path);

    // TODOの一覧取得
    if (path === '/api/todos/list' && request.method === 'POST') {
      const todos = await env.DB.prepare('SELECT * FROM mcp_todos ORDER BY created_at DESC').all();
      //console.log(todos);
      return new Response(
        JSON.stringify({data: JSON.stringify(todos.results)}), {
        headers: {'Content-Type': 'application/json' },
        status: 200
      });
    }

    // TODOの追加
    if (path === '/api/todos/create' && request.method === 'POST') {
      const body = await request.json();
      console.log(body);
      const title = body.title;
      const description = "";
      const now = new Date().toISOString();

      const result = await env.DB.prepare(
        `INSERT INTO mcp_todos (title, description, completed, created_at, updated_at) 
         VALUES (?, ?, 0, ?, ?)`
      )
        .bind(title, description, now, now)
        .run();
      return new Response(
        JSON.stringify({title: body.title}), {
        headers: {'Content-Type': 'application/json' },
        status: 200
      });
    }

    // TODOの更新
    if (path.match(/^\/api\/todos\/\d+$/) && request.method === 'PUT') {
      const id = parseInt(path.split('/').pop()!);
      const { title, description, completed } = await request.json();
      const now = new Date().toISOString();

      await env.DB.prepare(
        `UPDATE mcp_todos 
         SET title = ?, description = ?, completed = ?, updated_at = ? 
         WHERE id = ?`
      )
        .bind(title, description, completed ? 1 : 0, now, id)
        .run();
      return { data: null, status: 204, ret: true}
    }

    // TODOの削除
    if (path.match(/^\/api\/todos\/\d+$/) && request.method === 'DELETE') {
      const id = parseInt(path.split('/').pop()!);
      
      await env.DB.prepare('DELETE FROM mcp_todos WHERE id = ?')
        .bind(id)
        .run();
      return { data: null, status: 204, ret: true}
    }
    return { data: null, status: 0, ret: false };

} 