import React, { useState, FormEvent } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
    const [query, setQuery] = useState(initialQuery);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    // 検索クエリがクリアされたときに全件表示に戻すための処理
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        // 入力が空になったら即座に検索を実行（全件表示に戻す）
        // 送信ボタンを押したときのみ検索したい場合はこの行を削除
        if (newQuery.trim() === '') {
            onSearch('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
            <input
                type="text"
                placeholder="Search by title..."
                value={query}
                onChange={handleInputChange}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
                Search
            </button>
             {/* 検索クエリがある場合、クリアボタンを表示 */}
            {query && (
                <button
                    type="button"
                    onClick={() => {
                        setQuery('');
                        onSearch(''); // クリア時も検索を実行
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                    Clear
                </button>
            )}
        </form>
    );
};

export default SearchBar;