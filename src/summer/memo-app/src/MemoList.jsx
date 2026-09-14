import { useState } from 'react'

export default function MemoList() {
  const [memos, setMemos] = useState([
    { title: '朝の予定', body: 'TODOリストを整理する' },
    { title: '買い物', body: 'パンと牛乳を買う' },
  ])

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

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
            <h3>{memo.title}</h3>
            <p>{memo.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
