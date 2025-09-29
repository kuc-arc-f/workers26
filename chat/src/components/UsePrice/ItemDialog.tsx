import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Item } from '../types';

interface ItemDialogProps {
    isOpen: boolean;
    mode: 'add' | 'edit';
    itemToEdit: Item | null;
    onClose: () => void;
    onSave: (itemData: { title: string; price: string | null }, id?: number) => Promise<void>; // 保存処理は非同期
    errorMessage?: string | null; // 保存時のAPIエラー表示用
}

const ItemDialog: React.FC<ItemDialogProps> = ({ isOpen, mode, itemToEdit, onClose, onSave, errorMessage }) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [titleError, setTitleError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false); // 保存中フラグ

    const dialogRef = useRef<HTMLDialogElement>(null);

    // isOpen prop の変更を監視して dialog 要素の表示/非表示を制御
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            // 編集モードかつitemToEditが存在する場合、フォームに初期値を設定
            if (mode === 'edit' && itemToEdit) {
                setTitle(itemToEdit.title);
                setPrice(itemToEdit.price || ''); // null の場合は空文字に
            } else {
                // 追加モードの場合はフォームをリセット
                setTitle('');
                setPrice('');
            }
            setTitleError(null); // ダイアログを開くときにエラーをリセット
            setIsSaving(false); // 保存中フラグもリセット
            if (typeof dialog.showModal === 'function') {
                dialog.showModal(); // モーダルダイアログとして表示
            } else {
                console.warn("HTMLDialogElement.showModal() is not supported by this browser.");
                dialog.setAttribute("open", ""); // フォールバック
            }
        } else {
            if (typeof dialog.close === 'function') {
                dialog.close(); // ダイアログを閉じる
            } else {
                console.warn("HTMLDialogElement.close() is not supported by this browser.");
                dialog.removeAttribute("open"); // フォールバック
            }
        }
    }, [isOpen, mode, itemToEdit]);

     // ダイアログ外クリックやEscキーで閉じるイベントリスナー (showModalを使う場合は自動で閉じる)
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleCancel = (event: Event) => {
            event.preventDefault(); // デフォルトの閉じる動作をキャンセルする場合
            onClose();
        };

        dialog.addEventListener('cancel', handleCancel); // Escキーで発火

        // showModalを使わない場合のダイアログ外クリック対応 (オプション)
        const handleClickOutside = (event: MouseEvent) => {
             if (event.target === dialog) {
                 onClose();
             }
        };
        // dialog.addEventListener('click', handleClickOutside); // showModal使用時は不要な場合が多い

        return () => {
            dialog.removeEventListener('cancel', handleCancel);
            // dialog.removeEventListener('click', handleClickOutside);
        };
    }, [onClose]);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setTitleError(null); // エラーをリセット

        // バリデーション: titleが空かチェック
        if (!title.trim()) {
            setTitleError('Title is required.');
            return;
        }

        setIsSaving(true); // 保存開始
        try {
            await onSave(
                { title: title.trim(), price: price.trim() || null }, // priceが空ならnull
                mode === 'edit' ? itemToEdit?.id : undefined
            );
            // 成功時はAppコンポーネント側でダイアログを閉じるのでここでは何もしない
            // onClose(); // onSaveが成功したら閉じる (App側で制御する方が良い)
        } catch (error) {
             console.error("Error saving item in dialog:", error);
            // APIエラーは errorMessage prop で表示される
        } finally {
            setIsSaving(false); // 保存終了
        }
    };

    return (
        <dialog ref={dialogRef} className="p-6 rounded-lg shadow-xl backdrop:bg-black/50">
            <h2 className="text-xl font-bold mb-4">
                {mode === 'add' ? 'Add New Item' : 'Edit Item'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                            titleError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        aria-describedby={titleError ? "title-error" : undefined}
                        aria-invalid={!!titleError}
                        disabled={isSaving} // 保存中は無効化
                    />
                    {titleError && (
                        <p id="title-error" className="text-red-500 text-xs mt-1">{titleError}</p>
                    )}
                </div>
                <div className="mb-6">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                    </label>
                    <input
                        type="text" // type="number" も可能だが、空や小数点などの扱いで text が楽な場合も
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        disabled={isSaving} // 保存中は無効化
                    />
                     {/* 必要であれば price のバリデーションも追加 */}
                </div>

                {/* APIエラーメッセージ表示 */}
                 {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errorMessage}
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
                        disabled={isSaving} // 保存中は無効化
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving} // 保存中は無効化 or バリデーションエラー時
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </dialog>
    );
};

export default ItemDialog;