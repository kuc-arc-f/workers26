import { todoRouter } from './routes/todo';
import { dataRouter } from './routes/data';
import { chatThreadRouter } from './routes/chat_thread';
import { taskItemRouter } from './routes/task_item';

import Top from './pages/App';
import About from './pages/about';
import Sort from './pages/Sort';
import Table from './pages/Table';
import Table2 from './pages/Table2';
import Todo2 from './pages/Todo2';
import Todo13 from './pages/Todo13';
import Chat from './pages/Chat';
import TaskItem from './pages/TaskItem';
import TaskProject from './pages/TaskProject';
import Test from './pages/Test';

import Login from './pages/login';
import UsePrice from './pages/use_price';
import renderMove from './pages/renderMove';

const COOKIE_NAME = "workers26auth"; // Cookie名

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
    const path = url.pathname;
    console.log("path=", path);
    const method = request.method;
    console.log("method=", method);
    //console.log("USER_NAME=", env.USER_NAME);
    //console.log("PASSWORD=", env.PASSWORD);
		let response = null;
		try{
      /*
			if (path === "/test") {
				const currentTime = new Date().toISOString();
				return new Response(
					JSON.stringify({msg: currentTime}), {
					headers: {'Content-Type': 'application/json' },
					status: 200
				});
			}
      */
      
      if (path.startsWith("/api/todos/")) {
        response = await todoRouter(request, env, Response);
        return response;
      }
      if (path.startsWith("/api/data/")) {
        response = await dataRouter(request, env, Response);
        return response;
      }
      if (path.startsWith("/api/chat_thread/")) {
        response = await chatThreadRouter(request, env, Response);
        return response;
      }
      if (path.startsWith("/api/task_item/")) {
        response = await taskItemRouter(request, env, Response);
        return response;
      }


			// ログイン処理
			if (url.pathname === "/login" && request.method === "POST") {
        return handleLogin(request, env);
      }
      if (url.pathname !== "/login" && request.method === "GET") {
        const resAuth = await handleProtectedPage(request, env);
        console.log("resAuth=", resAuth);
        if(!resAuth){
          const htm = renderMove({path : '/login'});
          return new Response(htm, {headers: {"Content-Type": "text/html"}});
        }      
      }
			//MPA
			if (path === "/login") {
				const htm = Login({});
				return new Response(htm, { headers: {"Content-Type": "text/html"} });
			}
			if (path === "/about") {
				const htm = About({});
				return new Response(htm, { headers: {"Content-Type": "text/html"} });
			}
			if (path === "/sort") {
				const htm = Sort({});
				return new Response(htm, { headers: {"Content-Type": "text/html"} });
			}
			if (path === "/table") {
				const htm = Table({});
				return new Response(htm, { headers: {"Content-Type": "text/html"} });
			}
			if (path === "/table2") {
				const htm = Table2({});
				return new Response(htm, { headers: {"Content-Type": "text/html"} });
			}
			if (path === "/todo2") {
				const htm = Todo2({});
				return new Response(htm, { headers: {"Content-Type": "text/html"} });
			}
			if (path === "/todo13") {
				const htm = Todo13({});
				return new Response(htm, { headers: {"Content-Type": "text/html"} });
			}
			if (path === "/chat") {
				const htm = Chat({});
				return new Response(htm, { headers: {"Content-Type": "text/html"} });
			}
			if (path === "/task_item") {
				const htm = TaskItem({});
				return new Response(htm, { headers: {"Content-Type": "text/html"} });
			}
			if (path === "/task_project") {
				const htm = TaskProject({});
				return new Response(htm, { headers: {"Content-Type": "text/html"} });
			}
			if (path === "/test") {
				const htm = Test({});
				return new Response(htm, { headers: {"Content-Type": "text/html"} });
			}


			if (path === "/") {
				const htm = Top({});
				return new Response(htm, {
					headers: {"Content-Type": "text/html"}
				});
			}
			return new Response('404 Not found', {
        status: 404,
      });

		}catch(e){
			console.log(e)
			return new Response('Internal Server Error', {
        status: 500,
      });
		}

	},
} satisfies ExportedHandler<Env>;


// ログイン処理
async function handleLogin(request: any, env: any) {
  const body = await request.json();
  const { username, password } = body;
  console.log(body);
  // 認証チェック (例: 固定ユーザー)
  if (username === env.USER_NAME && password === env.PASSWORD) {
    // トークンを生成 (簡易例: 暗号化)
    const token = btoa(`${username}:${Date.now()}:SECRET_KEY`);
    // Cookieを設定
    return new Response("Login successful", {
      headers: {
        "Set-Cookie": `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Secure`,
        "Content-Type": "text/plain",
      },
    });
  }

  return new Response("Invalid credentials", { status: 401 });
}

// 認証が必要なページ
// * @return true: sucsess
async function handleProtectedPage(request, env) : boolean
{
  let ret = false;
  if(!env.USER_NAME && !env.PASSWORD){
    return true;
  }
  const cookies = parseCookies(request);
  //console.log(cookies);
  if (cookies[COOKIE_NAME]) {
    const token = cookies[COOKIE_NAME];
    return true;
  }
  return ret;
}
// Cookieを解析
function parseCookies(request) {
  const cookieHeader = request.headers.get("Cookie") || "";
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...v] = c.trim().split("=");
      return [key, decodeURIComponent(v.join("="))];
    })
  );
}
