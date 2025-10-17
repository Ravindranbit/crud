import React, { useEffect, useState } from 'react';
import './App.css';

const API_ROOT = process.env.REACT_APP_API_ROOT || 'http://localhost:5000';

function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const res = await fetch(`${API_ROOT}/api/items`);
    const data = await res.json();
    setItems(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { title, description };
    if (editingId) {
      const res = await fetch(`${API_ROOT}/api/items/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setEditingId(null);
        fetchItems();
      }
    } else {
      const res = await fetch(`${API_ROOT}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        fetchItems();
      }
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this item?')) return;
    const res = await fetch(`${API_ROOT}/api/items/${id}`, { method: 'DELETE' });
    if (res.ok) fetchItems();
  }

  function startEdit(item) {
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description || '');
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle('');
    setDescription('');
  }

  return (
    <div className="App" style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>Items CRUD</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div>
          <label>Title</label>
          <br />
          <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Description</label>
          <br />
          <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={cancelEdit} style={{ marginLeft: 8 }}>Cancel</button>}
        </div>
      </form>

      <section>
        <h2>All Items</h2>
        {items.length === 0 && <p>No items yet.</p>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map(item => (
            <li key={item._id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{item.title}</strong>
                  <div style={{ fontSize: 12, color: '#555' }}>{new Date(item.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <button onClick={() => startEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item._id)} style={{ marginLeft: 8 }}>Delete</button>
                </div>
              </div>
              {item.description && <p style={{ marginTop: 8 }}>{item.description}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
