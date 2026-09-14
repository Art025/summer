import { useEffect, useState } from 'react'

const API_URL = '/api/memos'

export default function MemoList() {
  const [memos, setMemos] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('')
  const [searchText, setSearchText] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [editTags, setEditTags] = useState('')

  const filteredMemos = memos.filter((memo) => {
    const term = searchText.trim().toLowerCase()
    const tagTerm = tagFilter.trim().toLowerCase()

    const matchesText = !term || memo.title.toLowerCase().includes(term) || memo.body.toLowerCase().includes(term)
    const matchesTag = !tagTerm || (memo.tags || []).some((memoTag) => memoTag.toLowerCase().includes(tagTerm))

    return matchesText && matchesTag
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
      const parsedTags = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: cleanTitle, body: cleanBody, tags: parsedTags }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'failed to add memo' }))
        throw new Error(errorData.error || 'failed to add memo')
      }

      const createdMemo = await response.json()
      setMemos((currentMemos) => [...currentMemos, createdMemo])
      setTitle('')
      setBody('')
      setTags('')
    } catch (error) {
      console.error(error)
    }
  }

  const startEdit = (memo) => {
    setEditingId(memo.id)
    setEditTitle(memo.title)
    setEditBody(memo.body)
    setEditTags((memo.tags || []).join(', '))
    setSelectedId(memo.id)
  }

  const saveEdit = async (event) => {
    event.preventDefault()

    if (!editingId || !editTitle.trim() || !editBody.trim()) {
      return
    }

    const memo = memos.find((item) => item.id === editingId)
    const parsedTags = editTags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    const response = await fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editTitle.trim(),
        body: editBody.trim(),
        completed: memo ? memo.completed : false,
        tags: parsedTags,
      }),
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
    setEditTags('')
  }

  const toggleComplete = async (memo) => {
    const nextCompleted = !memo.completed

    const response = await fetch(`${API_URL}/${memo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: memo.title,
        body: memo.body,
        completed: nextCompleted,
        tags: memo.tags || [],
      }),
    })

    if (!response.ok) {
      return
    }

    const updatedMemo = await response.json()
    setMemos((currentMemos) =>
      currentMemos.map((item) => (item.id === updatedMemo.id ? updatedMemo : item))
    )
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

          <div className="memo-form-group">
            <label className="memo-form-label" htmlFor="tags">タグ</label>
            <input
              className="memo-form-input"
              id="tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="仕事, 家"
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

        <div className="memo-search-group">
          <label className="memo-form-label" htmlFor="tag-filter">タグ絞り込み</label>
          <input
            className="memo-form-input memo-search-input"
            id="tag-filter"
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
            placeholder="タグを入力"
          />
        </div>

        <ul className="memo-list">
          {filteredMemos.map((memo) => (
            <li key={memo.id}>
              <div className="memo-row">
                <input
                  className="memo-complete-checkbox"
                  type="checkbox"
                  checked={memo.completed}
                  onChange={() => toggleComplete(memo)}
                  aria-label={memo.completed ? '未完了に戻す' : '完了にする'}
                />
                <button type="button" onClick={() => setSelectedId(memo.id)}>
                  <h3 className={memo.completed ? 'memo-completed-title' : ''}>{memo.title}</h3>
                  {selectedId === memo.id && (
                    <p className={memo.completed ? 'memo-completed-body' : ''}>{memo.body}</p>
                  )}
                  <span className="memo-tag-list">
                    {(memo.tags || []).map((tag) => (
                      <span className="memo-tag" key={tag}>{tag}</span>
                    ))}
                  </span>
                </button>
                <button type="button" onClick={() => startEdit(memo)}>
                  編集
                </button>
                <button type="button" onClick={() => deleteMemo(memo.id)}>
                  削除
                </button>
              </div>

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
                  <div className="memo-form-group">
                    <label className="memo-form-label" htmlFor="edit-tags">タグ</label>
                    <input
                      className="memo-form-input"
                      id="edit-tags"
                      value={editTags}
                      onChange={(event) => setEditTags(event.target.value)}
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
