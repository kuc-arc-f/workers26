import ReactDOM from 'react-dom/client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { z } from 'zod';
import Head from "../components/Head";

// Zod バリデーションスキーマ
const todoSchema = z.object({
  title: z.string().min(1, { message: 'タイトルは必須です' }),
});

let API_URL=""


const Page: React.FC = () => {
  return (
  <div className="text-3xl"><h1>Home</h1> 
    <hr />
    <span><a href="/about">[ about ]</a>
    </span>
  </div>
  );
};
ReactDOM.createRoot(document.getElementById('app')).render(
  <div>
    <Head />
    <Page />
  </div>
);
