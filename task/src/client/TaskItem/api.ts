import { Item, NewItem } from '../types/Item';

const CONTENT = "task_item";
//const API_BASE = ''; 
export const itemsApi = {
  getAll: async (content: string, projectId:number): Promise<Item[]> => {
    const response = await fetch(`/api/task_item/list?content=${CONTENT}&project_id=${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to create item');
    }    
    const json = await response.json();
    //console.log(json);

    let dataValue = {};
    const newItems = [];
    json.data.forEach((element) => {
      //console.log(element);
      try{
        dataValue = JSON.parse(element.data);
        element.data = dataValue;
      }catch(e){
        console.error(e);
      }
      newItems.push(element);
    });    
    //console.log(newItems);    
    return newItems;
  },

  getById: async (id: number): Promise<Item> => {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch item');
    }
    return response.json();
  },

  create: async (project_id: number, item: NewItem): Promise<Item> => {
    console.log(item);
    const send = {
      project_id: project_id,
      content : CONTENT,
      data : JSON.stringify(item) 
    }

    const response = await fetch("/api/task_item/create", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(send),
    });
    if (!response.ok) {
      throw new Error('Failed to create item');
    }

    return response.json();
  },

  update: async (id: number, item: Partial<NewItem>): Promise<Item> => {
    item.id = id;
    const send = {
      id: Number(id),
      content : CONTENT,
      data : JSON.stringify(item) 
    }

    const response = await fetch(`/api/task_item/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(send),
    });
    if (!response.ok) {
      throw new Error('Failed to update item');
    }
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const item = {
      content : CONTENT,
      id: id 
    }
    const response = await fetch(`/api/task_item/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
  },
};