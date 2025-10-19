import sqlUtil from "../lib/sqlUtil";

const diary = {

  diaryAdd: async function(client:any , text: string){
    try{
      /*
      const linesArray = text.split('\n');
      let target = "";
      linesArray.forEach((element, idx) => {
        if(idx >= 1){
          target += element;
        }
      });
      */
      const item = {
        text: text
      }
      const now = new Date().toISOString();
      const sql_str = `INSERT INTO mcp_diary (data) VALUES(?);`;
      console.log("sql=", sql_str);
      const data_str = JSON.stringify(item);

      await client.execute({
        sql: sql_str,
        args: [data_str],
      });
    }catch(e){
      console.log(e);
      throw new Error("error, diaryAdd");
    }
  },

  diaryList: async function(client: any){
    try{
      const now = new Date().toISOString();
      const sql = `SELECT id, data , created_at
      FROM mcp_diary ORDER BY created_at DESC LIMIT 5
      `;
      const resp = await client.execute(sql);
      let out = "";
      resp.rows.forEach((element) => {
        let target = JSON.parse(element.data)
        //let row = `* ID: ${element.id}\n${target.text}\n`;
        let row = `* ID: ${element.id}\n${target.text}\n`;
        //console.log(row)
        out += row;
      });
      return out
    }catch(e){
      console.log(e);
      throw new Error("error, diaryList");
    }
  },


  diaryShowone: async function(client:any , id: number){
    try{
      const now = new Date().toISOString();
      const sql_str = `SELECT * FROM mcp_diary WHERE id = ?;`;
      console.log("sql=", sql_str);
      //const data_str = JSON.stringify(item);

      const resp =  await client.execute({
        sql: sql_str,
        args: [id],
      });
      let out = "";
      console.log(resp.rows)
      if(resp.rows[0]){
        const target = resp.rows[0];
        const data = JSON.parse(target.data)
        out = `* ID: ${target.id} ${target.created_at}\n` + `${data.text}\n`;
      }
      return out;
    }catch(e){
      console.log(e);
      throw new Error("error, diaryShowone");
    }
  },

}
export default  diary;