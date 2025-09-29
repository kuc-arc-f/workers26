import ReactDOM from 'react-dom/client'
import React, { useState, useEffect } from 'react';
import Head from '../components/Head';


interface Item {
  id?: number;
  title: string;
  content: string;
  content_type: string;
  is_public: boolean;
  food_orange: boolean;
  food_apple: boolean;
  food_banana: boolean;
  food_melon: boolean;
  food_grape: boolean;
  pub_date1: string;
  pub_date2: string;
  pub_date3: string;
  pub_date4: string;
  pub_date5: string;
  pub_date6: string;
  qty1: string;
  qty2: string;
  qty3: string;
  qty4: string;
  qty5: string;
  qty6: string;
}

const API_BASE_URL = '';
const CONTENT = "todo13";

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item>({
    title: '',
    content: '',
    content_type: '',
    is_public: "off",
    food_orange: false,
    food_apple: false,
    food_banana: false,
    food_melon: false,
    food_grape: false,
    pub_date1: '',
    pub_date2: '',
    pub_date3: '',
    pub_date4: '',
    pub_date5: '',
    pub_date6: '',
    qty1: '',
    qty2: '',
    qty3: '',
    qty4: '',
    qty5: '',
    qty6: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // データ取得
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/data/list?content=${CONTENT}`);
      const data = await response.json();
      console.log(data);

      let dataValue = {};
      const newItems = [];
      data.data.forEach((element) => {
        try{
          dataValue = JSON.parse(element.data);
          element.data = dataValue;
        }catch(e){
          console.error(e);
        }
        newItems.push(element);
      });    
      console.log(newItems);
      setItems(newItems);
      setIsLoading(false);
    } catch (error) {
      console.error('データ取得エラー:', error);
      setIsLoading(false);
    }
  };

  // フォーム入力ハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    console.log("name=", name);
    console.log("value=", value);
    console.log("type=", type);
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentItem({
        ...currentItem,
        [name]: checked ? true : false
      });
    } else if (type === 'radio') {
      setCurrentItem({
        ...currentItem,
        [name]: value
      });
      console.log(currentItem);
    } else {
      setCurrentItem({
        ...currentItem,
        [name]: value
      });
    }
    
    // エラークリア
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 入力チェック
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!currentItem.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    console.log(currentItem);
    
    try {
      const method = 'POST';
      const url = currentItem.id 
        ? `/api/data/update` 
        : `/api/data/create`;
      
      const send = {
        content: CONTENT,
        data: JSON.stringify(currentItem)
      }
      if(currentItem.id ){
        send.id = currentItem.id;
      }
      await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(send),
      });
      
      closeModal();
      fetchItems();
    } catch (error) {
      console.error('保存エラー:', error);
    }
  };

  // 新規作成
  const handleCreate = () => {
    setCurrentItem({
      title: '',
      content: '',
      content_type: '',
      is_public: "off",
      food_orange: false,
      food_apple: false,
      food_banana: false,
      food_melon: false,
      food_grape: false,
      pub_date1: '',
      pub_date2: '',
      pub_date3: '',
      pub_date4: '',
      pub_date5: '',
      pub_date6: '',
      qty1: '',
      qty2: '',
      qty3: '',
      qty4: '',
      qty5: '',
      qty6: '',
    });
    setErrors({});
    setIsModalOpen(true);
    console.log(currentItem);
  };

  // 編集
  const handleEdit = (item: Item) => {
    console.log(item)
    const target = item;
    target.title = item.data.title;
    target.content = item.data.content;
    target.content_type = item.data.content_type;
    target.is_public = item.data.is_public;
    target.food_orange = item.data.food_orange;
    target.food_apple = item.data.food_apple;
    target.food_banana = item.data.food_banana;
    target.food_melon = item.data.food_melon;
    target.food_grape = item.data.food_grape;
    target.pub_date1 = item.data.pub_date1;
    target.pub_date2 = item.data.pub_date2;
    target.pub_date3 = item.data.pub_date3;
    target.pub_date4 = item.data.pub_date4;
    target.pub_date5 = item.data.pub_date5;
    target.pub_date6 = item.data.pub_date6;
    target.qty1 = item.data.qty1;
    target.qty2 = item.data.qty2;
    target.qty3 = item.data.qty3;
    target.qty4 = item.data.qty4;
    target.qty5 = item.data.qty5;
    target.qty6 = item.data.qty6;
    setCurrentItem({ ...target });
    setErrors({});
    setIsModalOpen(true);
  };

  // 削除
  const handleDelete = async (id?: number) => {
    if (!id || !window.confirm('本当に削除しますか？')) return;
    
    try {
      const target = {
        content: CONTENT,
        id: id
      }
      await fetch(`/api/data/delete`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(target),
      });
      fetchItems();
    } catch (error) {
      console.error('削除エラー:', error);
    }
  };

  // モーダルクローズ
  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  // 日付フィールドのレンダリング
  const renderDateFields = () => {
    return [1, 2, 3, 4, 5, 6].map(num => (
      <div key={num} className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          公開日 {num}
        </label>
        <input
          type="date"
          name={`pub_date${num}`}
          value={currentItem[`pub_date${num}` as keyof Item] as string}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    ));
  };

  // 数量フィールドのレンダリング
  const renderQtyFields = () => {
    return [1, 2, 3, 4, 5, 6].map(num => (
      <div key={num} className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          数量 {num}
        </label>
        <input
          type="text"
          name={`qty${num}`}
          value={currentItem[`qty${num}` as keyof Item] as string}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head />
      <h1 className="text-3xl font-bold text-center mb-8">todo13 アプリケーション</h1>
      
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          新規作成
        </button>
      </div>

      {/* 一覧表示 */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                タイトル
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                コンテンツ
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                公開状態
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{item.data.title}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{item.data.content}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${item.data.is_public ? 'text-green-900' : 'text-red-900'}`}>
                    <span className={`absolute inset-0 opacity-50 rounded-full ${item.is_public ? 'bg-green-200' : 'bg-red-200'}`}></span>
                    <span className="relative">{item.data.is_public === 'on' ? '公開中' : '非公開'}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 編集モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentItem.id ? 'アイテム編集' : '新規作成'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="mt-4">
                {/* 基本情報 */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    タイトル *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={currentItem.title}
                    onChange={handleInputChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.title ? 'border-red-500' : ''}`}
                  />
                  {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    コンテンツ
                  </label>
                  <input
                    type="text"
                    name="content"
                    value={currentItem.content}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    コンテンツタイプ
                  </label>
                  <input
                    type="text"
                    name="content_type"
                    value={currentItem.content_type}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                {/* 公開状態 */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    公開状態
                  </label>
                  <div className="flex items-center">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="is_public"
                        value="off"
                        checked={currentItem.is_public === "off"}
                        onChange={handleInputChange}
                        className="form-radio"
                      />
                      <span className="ml-2">非公開</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        name="is_public"
                        value="on"
                        checked={currentItem.is_public === "on"}
                        onChange={handleInputChange}
                        className="form-radio"
                      />
                      <span className="ml-2">公開</span>
                    </label>
                  </div>
                </div>
                
                {/* フルーツチェックボックス */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    フルーツ
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {[
                      { name: 'food_orange', label: 'オレンジ' },
                      { name: 'food_apple', label: 'りんご' },
                      { name: 'food_banana', label: 'バナナ' },
                      { name: 'food_melon', label: 'メロン' },
                      { name: 'food_grape', label: 'ぶどう' },
                    ].map((fruit) => (
                      <label key={fruit.name} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name={fruit.name}
                          checked={!!currentItem[fruit.name as keyof Item]}
                          onChange={handleInputChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">{fruit.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* 日付フィールド */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderDateFields()}
                </div>
                
                {/* 数量フィールド */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {renderQtyFields()}
                </div>
                
                {/* ボタン */}
                <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 mr-3"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById('app')).render(
  <div>
    <App />
  </div>
);
