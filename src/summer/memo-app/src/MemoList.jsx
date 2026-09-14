import { useEffect, useState } from 'react'

const API_URL = '/api/memos'

export default function MemoList() {
  const [memos, setMemos] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((items) => setMemos(items))
      .catch(() => setMemos([]))
  }, [])

  const addMemo = async (event) => {
    event.preventDefault()

    if (!title.trim() || !body.trim()) {
      return
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), body: body.trim() }),
    })

    if (!response.ok) {
      return
    }

    const createdMemo = await response.json()
    setMemos((currentMemos) => [...currentMemos, createdMemo])
    setTitle('')
    setBody('')
  }

  const startEdit = (memo) => {
    setEditingId(memo.id)
    setEditTitle(memo.title)
    setEditBody(memo.body)
    setSelectedId(memo.id)
  }

  const saveEdit = async (event) => {
    event.preventDefault()

    if (!editingId || !editTitle.trim() || !editBody.trim()) {
      return
    }

    const response = await fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle.trim(), body: editBody.trim() }),
    })

    if (!response.ok) {
      return
    }

    const updatedMemo = await response.json()
    setMemos((currentMemos) =>
      currentMemos.map((memo) => (memo.id === updatedMemo.id ? updatedMemo : memo))
    )

    setEditingId(null)
    setEditTitle('')
    setEditBody('')
  }

  const deleteMemo = async (memoId) => {
    const response = await fetch(`${API_URL}/${memoId}`, { method: 'DELETE' })

    if (!response.ok) {
      return
    }

    setMemos((currentMemos) => currentMemos.filter((memo) => memo.id !== memoId))

    if (selectedId === memoId) {
      setSelectedId(null)
    }

    if (editingId === memoId) {
      setEditingId(null)
      setEditTitle('')
      setEditBody('')
    }
  }

  return (
    <section>
      <h2>メモ一覧</h2>

      <form onSubmit={addMemo}>
        <div>
          <label htmlFor="title">タイトル</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="body">本文</label>
          <textarea
            id="body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </div>

        <button type="submit">追加</button>
      </form>

      <ul>
        {memos.map((memo) => (
          <li key={memo.id}>
            <button type="button" onClick={() => setSelectedId(memo.id)}>
              <h3>{memo.title}</h3>
              {selectedId === memo.id && <p>{memo.body}</p>}
            </button>
            <button type="button" onClick={() => startEdit(memo)}>
              編集
            </button>
            <button type="button" onClick={() => deleteMemo(memo.id)}>
              削除
            </button>

            {editingId === memo.id && (
              <form onSubmit={saveEdit}>
                <div>
                  <label htmlFor="edit-title">タイトル</label>
                  <input
                    id="edit-title"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="edit-body">本文</label>
                  <textarea
                    id="edit-body"
                    value={editBody}
                    onChange={(event) => setEditBody(event.target.value)}
                  />
                </div>
                <button type="submit">保存</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
