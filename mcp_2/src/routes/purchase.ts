import sqlUtil from "../lib/sqlUtil";

const purchase = {

  addPurchase: async function(client:any , name: string, price: number){
    try{
      const item = {
        name: name, price: price
      }
      const now = new Date().toISOString();
      const sql_str = `INSERT INTO item_price (data) VALUES(?);`;
      console.log("sql=", sql_str);
      const data_str = JSON.stringify(item);

      await client.execute({
        sql: sql_str,
        args: [data_str],
      });
    }catch(e){
      console.log(e);
      throw new Error("error, addPurchase");
    }
  },

  listPurchase: async function(client: any){
    try{
      const now = new Date().toISOString();
      const sql = `SELECT * FROM item_price ORDER BY created_at DESC LIMIT 5`;
      const resp = await client.execute(sql);
      //console.log(resp);
      let out = "";
      resp.rows.forEach((element) => {
        let target = JSON.parse(element.data)
        //console.log(target)
        let row = `* name: ${target.name} , prices: ${target.price} 円\n`;
        out += row;
      });
      //console.log(out)
      return out
    }catch(e){
      console.log(e);
      throw new Error("error, listPurchase");
    }
  },

}
export default  purchase;