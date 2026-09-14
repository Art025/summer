import { useEffect, useState } from 'react'

const API_URL = '/api/memos'

export default function MemoList() {
  const [memos, setMemos] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [searchText, setSearchText] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  const filteredMemos = memos.filter((memo) => {
    const term = searchText.trim().toLowerCase()

    if (!term) {
      return true
    }

    return (
      memo.title.toLowerCase().includes(term) ||
      memo.body.toLowerCase().includes(term)
    )
  })

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((items) => setMemos(items))
      .catch(() => setMemos([]))
  }, [])

  const addMemo = async (event) => {
    event.preventDefault()

    const cleanTitle = title.trim()
    const cleanBody = body.trim()

    if (!cleanTitle || !cleanBody) {
      return
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: cleanTitle, body: cleanBody }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'failed to add memo' }))
        throw new Error(errorData.error || 'failed to add memo')
      }

      const createdMemo = await response.json()
      setMemos((currentMemos) => [...currentMemos, createdMemo])
      setTitle('')
      setBody('')
    } catch (error) {
      console.error(error)
    }
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
    <section className="memo-layout">
      <section className="memo-form-panel">
        <form className="memo-form" onSubmit={addMemo}>
          <div className="memo-form-group">
            <label className="memo-form-label" htmlFor="title">タイトル</label>
            <input
              className="memo-form-input"
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="memo-form-group">
            <label className="memo-form-label" htmlFor="body">本文</label>
            <textarea
              className="memo-form-textarea"
              id="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </div>

          <button className="memo-form-submit" type="submit">追加</button>
        </form>
      </section>

      <section className="memo-list-panel">
        <h2>メモ一覧</h2>

        <div className="memo-search-group">
          <label className="memo-form-label" htmlFor="search">検索</label>
          <input
            className="memo-form-input memo-search-input"
            id="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="タイトルや本文を検索"
          />
        </div>

        <ul className="memo-list">
          {filteredMemos.map((memo) => (
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
                <form className="memo-form memo-form-edit" onSubmit={saveEdit}>
                  <div className="memo-form-group">
                    <label className="memo-form-label" htmlFor="edit-title">タイトル</label>
                    <input
                      className="memo-form-input"
                      id="edit-title"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                    />
                  </div>
                  <div className="memo-form-group">
                    <label className="memo-form-label" htmlFor="edit-body">本文</label>
                    <textarea
                      className="memo-form-textarea"
                      id="edit-body"
                      value={editBody}
                      onChange={(event) => setEditBody(event.target.value)}
                    />
                  </div>
                  <button className="memo-form-submit" type="submit">保存</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
