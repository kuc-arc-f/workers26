import React from 'react';
import { Item } from '../types';

interface ItemListProps {
    items: Item[];
    onEdit: (item: Item) => void;
    onDelete: (id: number) => void; // IDのみを受け取る
}

const ItemList: React.FC<ItemListProps> = ({ items, onEdit, onDelete }) => {
    if (!items || items.length === 0) {
        return <p className="text-gray-500 italic mt-4">No items found.</p>;
    }

    return (
        <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created At
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.price ?? '-'} {/* null の場合はハイフン表示 */}
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(item.created_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              {/*
                                <button
                                    onClick={() => onEdit(item)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Edit
                                </button>
                              */}
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemList;