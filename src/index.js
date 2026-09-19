const express = require('express');
const { randomUUID } = require('crypto');

const app = express();
const port = 3000;

app.use(express.json());

let memos = []

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean)
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  return []
}

app.get('/api/memos', (req, res) => {
  res.json(memos)
})

app.post('/api/memos', (req, res) => {
  const { title, body, completed, tags } = req.body

  if (!title || !body) {
    return res.status(400).json({ error: 'title and body are required' })
  }

  const newMemo = {
    id: randomUUID(),
    title: title.trim(),
    body: body.trim(),
    completed: typeof completed === 'boolean' ? completed : false,
    tags: normalizeTags(tags),
  }

  memos.push(newMemo)
  res.status(201).json(newMemo)
})

app.put('/api/memos/:id', (req, res) => {
  const { id } = req.params
  const { title, body, completed, tags } = req.body
  const memo = memos.find((item) => item.id === id)

  if (!memo) {
    return res.status(404).json({ error: 'memo not found' })
  }

  if (!title || !body) {
    return res.status(400).json({ error: 'title and body are required' })
  }

  memo.title = title.trim()
  memo.body = body.trim()
  memo.completed = typeof completed === 'boolean' ? completed : memo.completed
  memo.tags = Array.isArray(tags) || typeof tags === 'string'
    ? normalizeTags(tags)
    : memo.tags || []

  res.json(memo)
})

app.delete('/api/memos/:id', (req, res) => {
  const { id } = req.params
  const originalLength = memos.length

  memos = memos.filter((memo) => memo.id !== id)

  if (memos.length === originalLength) {
    return res.status(404).json({ error: 'memo not found' })
  }

  res.status(204).send()
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
