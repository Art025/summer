import { useState } from 'react'

export default function MemoList() {
  const [memos, setMemos] = useState([
    { title: '朝の予定', body: 'TODOリストを整理する' },
    { title: '買い物', body: 'パンと牛乳を買う' },
  ])

  return (
    <section>
      <h2>メモ一覧</h2>
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
