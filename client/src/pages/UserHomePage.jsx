import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { UserCircleIcon, PaperAirplaneIcon, InboxIcon, TrashIcon } from '@heroicons/react/24/outline';
import AppLayout from '../layouts/AppLayout';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal'
import useAuthCheck from '../hooks/useAuthCheck';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;
const socketBaseUrl = import.meta.env.VITE_API_BASE;

export default function UserHomePage() {
  useAuthCheck();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [content, setContent] = useState('');
  // const [resultMessage, setResultMessage] = useState('');
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [user, setUser] = useState('');

  const token = localStorage.getItem('token');

  const socketRef = useRef(null);

  const fetchUser = useCallback(async () => {
    if (!token) return;
    setFetching(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Fetch error: ${res.status}`);
      }
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load items.');
    } finally {
      setFetching(false);
    }
  }, [apiUrl, token]);

  // fetchItems wrapped in useCallback so it can be used in useEffect safely
  const fetchItems = useCallback(async () => {
    if (!token) return;
    setFetching(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/entries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Fetch error: ${res.status}`);
      }
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load items.');
    } finally {
      setFetching(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchItems();

    fetchUser();

    // Socket.IO接続開始
    socketRef.current = io(socketBaseUrl, {
      auth: { token },  // トークン認証したい場合
    });

    // 新しいメッセージが来たらitemsを更新
    socketRef.current.on('newEntry', (newEntry) => {
      setItems((prevItems) => [newEntry, ...prevItems]);
    });

    socketRef.current.on('entryDeleted', (entryId) => {
      setItems((prevItems) => prevItems.filter(item => item._id !== entryId));
    });

    // コンポーネントアンマウント時に切断
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [fetchItems, apiUrl, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setResultMessage('');
    setError('');
    if (!content.trim()) {
      setError('Message cannot be empty.');
      toast.error('Message cannot be empty.');
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
      // setResultMessage(`Submitted: ${data.content}`);
      toast.success(`Submitted: ${data.content}`);
      setContent('');
      fetchItems();
      // socketRef.current.emit('newEntry', data);
    } catch (err) {
      console.error(err);
      setError('Submission failed.');
      toast.error(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/login');
  };

  const openModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

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
      // setResultMessage(data.message);
      toast.success(data.message);
      fetchItems();
      // socketRef.current.emit('entryDeleted', deleteId);
    } catch (err) {
      console.error(err);
      setError('Deletion failed.');
    }
  };

  return (
    <AppLayout>
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md border mx-2 border-gray-200">
        {/* Items list */}
          <div className='h-[60px] px-4 flex items-center justify-between'>
            <button onClick={handleLogout}>
              Logout
            </button>

            <h1 className="text-xl font-semibold text-gray-800">Messages</h1>

            <div className='flex items-center justify-center'>
                <span className='pe-2'>{user.username}</span>
                <UserCircleIcon className='w-8 h-8' />
            </div>
        </div>

        {/* Submission form */}
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
                className={`w-full pl-10 pr-4 py-2 rounded-l-md border 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${error ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center bg-cyan-400 hover:bg-cyan-500 text-white px-4 rounded-r-md transition disabled:opacity-50"
            >
              {submitting ? (
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {fetching ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500">No entries yet.</p>
          ) : (
            <ul className="max-h-[calc(100vh-140px)] overflow-auto divide-y px-5">
              {items.map((item) => (
                <li key={item.id} className={`p-2 rounded-lg mb-4 shadow-md ${item.user.username == user.username ? 'bg-cyan-100 ms-20' : 'bg-gray-100 me-20'}`}>
                  <div>
                    <span className="text-gray-800">{item.content}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <div>
                      <span className="text-sm text-gray-500">
                        ({new Date(item.created_at).toLocaleString()})
                      </span>
                    </div>
                    {item.user.username == user.username ? (
                      <button
                        onClick={() => openModal(item.id)}
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
      </div>

      <ConfirmModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
      >
        <h2>Are you sure you want to delete this entry?</h2>
      </ConfirmModal>
    </AppLayout>
  );
}
