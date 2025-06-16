import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const res = await fetch('http://localhost:4000/api/test');
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:4000/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    setResult(data);
    setName('');
    fetchItems();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📬 Test Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">送信</button>
      </form>

      {result && (
        <div style={{ marginTop: '1rem' }}>
          <strong>✅ 送信成功: {result.name}</strong>
        </div>
      )}

      <hr style={{ margin: '2rem 0' }} />
      <h2>📋 データ一覧</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} <small style={{ color: '#666' }}>({new Date(item.createdAt).toLocaleString()})</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
