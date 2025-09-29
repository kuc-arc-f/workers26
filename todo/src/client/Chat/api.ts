import { Item, NewItem } from '../types/Item';

const CONTENT = "chat_post";

export const itemsApi = {
  getAll: async (content: string): Promise<Item[]> => {
    const response = await fetch(`/api/data/list?content=${CONTENT}&order=desc`, {
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

  create: async (item: NewItem): Promise<Item> => {
    console.log(item);
    const send = {
      content : CONTENT,
      data : JSON.stringify(item) 
    }

    const response = await fetch("/api/data/create", {
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
      id: id,
      content : CONTENT,
      data : JSON.stringify(item) 
    }

    const response = await fetch(`/api/data/update`, {
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
    const response = await fetch(`/api/data/delete`, {
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

  threadList: async (content: string, post_id: number): Promise<Item[]> => {
    const response = await fetch(`/api/chat_thread/list?content=${content}&post_id=${post_id}`, {
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
      //console.log(element.data);
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

  threadCreate: async (item: NewItem): Promise<Item> => {
    console.log(item);
    const send = {
      content : "chat_thread",
      post_id: item.post_id,
      data : item.data 
    }

    const response = await fetch("/api/chat_thread/create", {
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

  threadDelete: async (item: NewItem): Promise<Item> => {
    console.log(item);
    const send = {
      content : "chat_thread",
      id: item.id,
    }

    const response = await fetch("/api/chat_thread/delete", {
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

};