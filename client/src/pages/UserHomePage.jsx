import { useState, useEffect, useCallback } from 'react';
import { UserCircleIcon, PaperAirplaneIcon, InboxIcon, TrashIcon } from '@heroicons/react/24/outline';
import AppLayout from '../layouts/AppLayout';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import useAuthCheck from '../hooks/useAuthCheck';
import Snackbar from '../components/Snackbar';

const apiUrl = import.meta.env.VITE_API_URL;

export default function UserHomePage() {
  useAuthCheck();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [content, setContent] = useState('');
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const token = localStorage.getItem('token');

  // 👤 ユーザー情報取得
  const fetchUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load user info.');
    }
  }, [token]);

  // 💬 アイテム取得
  const fetchItems = useCallback(async () => {
    if (!token) return;
    setFetching(true);
    try {
      const res = await fetch(`${apiUrl}/entries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data);
      setHasLoaded(true);
    } catch (err) {
      console.error(err);
      setError('Failed to load items.');
    } finally {
      setFetching(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
    fetchItems();
  }, [fetchUser, fetchItems]);

  // ✉️ 投稿
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!content.trim()) {
      setSnackbarMessage('Message cannot be empty.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Submit error: ${res.status}`);
      }
      const data = await res.json();
      setContent('');
      setSnackbarMessage(`Submitted: ${data.content}`);
      fetchItems(); // 更新
    } catch (err) {
      console.error(err);
      setSnackbarMessage(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // 🗑 削除
  const confirmDelete = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`${apiUrl}/entries/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Delete error: ${res.status}`);
      }
      const data = await res.json();
      setSnackbarMessage(data.message);
      fetchItems(); // 更新
    } catch (err) {
      console.error(err);
      setSnackbarMessage('Deletion failed.');
    }
  };

  // 🔚 ログアウト
  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppLayout>
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md border border-gray-200 relative">

        {/* ヘッダー */}
        <div className='h-[60px] px-4 flex items-center justify-between'>
          <button onClick={handleLogout}>Logout</button>
          <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
          <div className='flex items-center justify-center'>
            <span className='pe-2'>{user.username}</span>
            <UserCircleIcon className='w-8 h-8' />
          </div>
        </div>

        {/* 入力フォーム */}
        <form onSubmit={handleSubmit} className="h-[60px] mx-2 grid items-center">
          <div className="flex">
            <div className="relative flex-grow">
              <InboxIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Message"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={submitting}
                className="w-full pl-10 pr-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center bg-cyan-400 hover:bg-cyan-500 text-white px-4 rounded-r-md transition disabled:opacity-50"
            >
              {submitting ? (
                <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>

        {/* メッセージリスト */}
        <div className="relative">
          {/* 🔄 Loadingオーバーレイ */}
          {fetching && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}

          {!hasLoaded ? (
            <p className="text-center text-gray-500 py-4">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No entries yet.</p>
          ) : (
            <ul className="max-h-[calc(100dvh-140px)] overflow-auto divide-y px-5">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`p-2 rounded-lg mb-4 shadow-md ${
                    item.user.username === user.username ? 'bg-cyan-100 ms-20' : 'bg-gray-100 me-20'
                  }`}
                >
                  <div>
                    <span className="text-gray-800">{item.content}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <div>
                      <span className="text-sm text-gray-500">
                        ({new Date(item.created_at).toLocaleString()})
                      </span>
                    </div>
                    {item.user.username === user.username ? (
                      <button
                        onClick={() => {
                          setDeleteId(item.id);
                          setShowModal(true);
                        }}
                        className="text-cyan-500 hover:text-cyan-700 p-1 rounded transition"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500">{item.user.username}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 削除確認モーダル */}
        <ConfirmModal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
        >
          <h2>Are you sure you want to delete this entry?</h2>
        </ConfirmModal>

        {/* 🔔 WhatsApp風通知 */}
        <Snackbar
          message={snackbarMessage}
          onClose={() => setSnackbarMessage('')}
          duration={3000}
        />
      </div>
    </AppLayout>
  );
}
