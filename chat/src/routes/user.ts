import bcrypt from "bcryptjs";


const router = {
  /**
  * 
  * @param
  *
  * @return
  */
  create: async function (request: any, res: any, env: any): Promise<Response>
  {
    const req = await request.json();
console.log(req);
    const retObj = {ret: 500, data: [], message: ''}
    try{
      if (req) {
        if (!req.email) {
          return new Response('email is required', { status: 400 });
        }
        if (!req.password) {
          return new Response('password is required', { status: 400 });
        }
        if (!req.username) {
          return new Response('username is required', { status: 400 });
        }
        const saltRounds = 10;
        // パスワードをハッシュ化
        const hashedPassword = await bcrypt.hash(req.password, saltRounds);
        console.log("hashedPassword=", hashedPassword);

        const sql = `
        INSERT INTO User ( name, email, password, updatedAt)
        VALUES('${req.username}', '${req.email}', '${hashedPassword}',
        CURRENT_TIMESTAMP
        );
        `;
console.log(sql);
        const resulte = await env.DB.prepare(sql).run();
        if(resulte.success !== true) {
          console.error("Error, /create");
          throw new Error('Error , create');
        }
console.log(resulte);
        const sql_id = "SELECT last_insert_rowid() AS id;";
        const resultId = await env.DB.prepare(sql_id).all();
        if(resultId.results.length < 1) {
          console.error("Error, resultId.length < 1");
          throw new Error('Error , create, SELECT last_insert_rowid');
        }
        const item_id = resultId.results[0].id;
console.log("item_id=", item_id);
        req.id = item_id;
//console.log(resultId);
      }            
      return { data:JSON.stringify(req), status: 200, ret: true}
    } catch (e) {
      console.error(e);
      return retObj;
    } 
  }, 
  /**
  *
  * @param
  *
  * @return
  */ 
  delete: async function (req: any, res: any, env: any): Promise<Response>
  {
console.log(req);
    const retObj = {ret: "NG", data: [], message: ''}
    try{
      if (req) {
        const sql = `
        DELETE FROM todos WHERE id = ${req.id}
        `;
console.log(sql);
        const resulte = await env.DB.prepare(sql).run();
//console.log(resulte);
        if(resulte.success !== true) {
          console.error("Error, delete");
          throw new Error('Error , delete');
        }      
      }
      return Response.json({ret: "OK", data: req});
    } catch (e) {
      console.error(e);
      return Response.json(retObj);
    } 
  },
  /**
  *
  * @param
  *
  * @return
  */ 
  update: async function (req: any, res: any, env: any): Promise<Response>
  {
console.log(req);
    const retObj = {ret: "NG", data: [], message: ''}
    try{
      if (req) {
        const sql = `
        UPDATE todos 
        SET title = '${req.title}', content='${req.content}',
        completed = '${req.completed}'
        WHERE id = ${req.id}
        `;
        console.log(sql);
        const resulte = await env.DB.prepare(sql).run();
        if(resulte.success !== true) {
          console.error("Error, update");
          throw new Error('Error , update');
        }           
      }                
      return Response.json({ret: "OK", data: req});
    } catch (e) {
      console.error(e);
      return Response.json(retObj);
    } 
  },
  /**
  *
  * @param
  *
  * @return
  */
  get: async function (req: any, res: any, env: any): Promise<Response>
  {
//    console.log(req);
    let item = {};
    let result: any = {}; 
    const retObj = {ret: "NG", data: [], message: ''}
    try{
      if (req) {
        const sql = `
        SELECT * FROM User
        WHERE email = '${req.email}'
        `;     
console.log(sql);   
        result = await env.DB.prepare(sql).all();
//console.log(result.results);
        if(result.results.length < 1) {
          console.error("Error, results.length < 1");
          throw new Error('Error , get');
        }
        item = result.results[0];
      }      
      return Response.json({ret: "OK", data: item});
    } catch (e) {
      console.error(e);
      return Response.json(retObj);
    } 
  }, 

  login: async function (request: any , res: any, env: any): any
  {
    const body = await request.json();
    console.log(body);
    let item = {};
    let result: any = {}; 
    let ret = false;
    const retObj = {ret: 500, data: [], message: ''}
    try{

      if (body) {
        const sql = `
        SELECT * FROM User
        WHERE email = '${body.email}'
        `;     
console.log(sql);   
        result = await env.DB.prepare(sql).all();
        //console.log(result.results);
        if(result.results.length < 1) {
          console.error("Error, results.length < 1");
          return { data: null, status: 400, ret: false}
        }
        item = result.results[0];
        //console.log("item.password=", item.password);
        const isMatch = await bcrypt.compare(body.password, item.password);
        console.log("isMatch=", isMatch);
        if(!isMatch){
          return { data: null, status: 400, ret: false}
        }
        return { data:JSON.stringify(body), status: 200, ret: true}
      }      
    } catch (e) {
      console.error(e);
      return retObj;
    } 
  },

  getUserId: async function (request: any , res: any ,env: any): any
  {
    const body = await request.json();
    console.log(body);
    const retObj = {ret: 500, data: [], message: ''}
    let item = {};
    let result: any = {}; 
    let ret = false;
    try{
      if (body) {
        const sql = `
        SELECT * FROM User
        WHERE email = '${body.email}'
        `;     
console.log(sql);   
        result = await env.DB.prepare(sql).all();
        //console.log(result.results);
        if(result.results.length < 1) {
          console.error("Error, results.length < 1");
          return { data: null, status: 400, ret: false}
        }
        item = result.results[0];
      }      
      return { data:JSON.stringify(item), status: 200, ret: true}
    } catch (e) {
      console.error(e);
      return retObj;
    } 
  },
}
export default router;
