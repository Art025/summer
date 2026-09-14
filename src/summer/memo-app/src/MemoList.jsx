import { useState } from 'react'

export default function MemoList() {
  const [memos, setMemos] = useState([
    { title: '朝の予定', body: 'TODOリストを整理する' },
    { title: '買い物', body: 'パンと牛乳を買う' },
  ])

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  const addMemo = (event) => {
    event.preventDefault()

    if (!title.trim() || !body.trim()) {
      return
    }

    setMemos((currentMemos) => [
      ...currentMemos,
      { title: title.trim(), body: body.trim() },
    ])
    setTitle('')
    setBody('')
  }

  const startEdit = (index) => {
    const memo = memos[index]
    setEditingIndex(index)
    setEditTitle(memo.title)
    setEditBody(memo.body)
    setSelectedIndex(index)
  }

  const saveEdit = (event) => {
    event.preventDefault()

    if (editingIndex === null) {
      return
    }

    if (!editTitle.trim() || !editBody.trim()) {
      return
    }

    setMemos((currentMemos) => {
      const nextMemos = [...currentMemos]
      nextMemos[editingIndex] = {
        title: editTitle.trim(),
        body: editBody.trim(),
      }
      return nextMemos
    })

    setEditingIndex(null)
    setEditTitle('')
    setEditBody('')
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
        {memos.map((memo, index) => (
          <li key={index}>
            <button type="button" onClick={() => setSelectedIndex(index)}>
              <h3>{memo.title}</h3>
              {selectedIndex === index && <p>{memo.body}</p>}
            </button>
            <button type="button" onClick={() => startEdit(index)}>
              編集
            </button>

            {editingIndex === index && (
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
