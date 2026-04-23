import { useState } from 'react'

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Read a book', done: false },
    { id: 2, text: 'Go for a walk', done: true },
    { id: 3, text: 'Write some code', done: false },
  ])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [lastEnterTime, setLastEnterTime] = useState(0)

  const startEditing = (todo) => {
    setEditingId(todo.id)
    setEditingText(todo.text)
  }
const handleTodoKeyDown = (e, todo) => {
  if (e.key !== 'Enter') return

  // If this todo is currently being edited, do NOT treat Enter as a toggle or double-enter
  if (editingId === todo.id) return

  const now = Date.now()
  const delta = now - lastEnterTime

  if (delta < 300) {
    startEditing(todo)
  } else {
    toggleTodo(todo.id)
  }

  setLastEnterTime(now)
}


  const saveEditing = () => {
    const text = editingText.trim()

    if (text === '') {
      // empty → delete
      setTodos(todos.filter((t) => t.id !== editingId))
    } else {
      // save
      setTodos(
        todos.map((t) =>
          t.id === editingId ? { ...t, text } : t
        )
      )
    }

    setEditingId(null)
    setEditingText('')
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingText('')
  }

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos([...todos, { id: Date.now(), text, done: false }])
    setInput('')
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id))

  const clearCompleted = () => setTodos(todos.filter((t) => !t.done))

  const visible = todos.filter((t) =>
    filter === 'active' ? !t.done : filter === 'completed' ? t.done : true,
  )

  const remaining = todos.filter((t) => !t.done).length
  const completed = todos.length - remaining

  const tabClass = (name) =>
    `px-3 py-1 rounded-md text-sm font-medium transition ${filter === name
      ? 'bg-indigo-600 text-white'
      : 'text-slate-600 hover:bg-slate-200'
    }`

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Todo List</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs doing?"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setFilter('all')} className={tabClass('all')}>
            All
          </button>
          <button onClick={() => setFilter('active')} className={tabClass('active')}>
            Active
          </button>
          <button onClick={() => setFilter('completed')} className={tabClass('completed')}>
            Completed
          </button>
        </div>

        <ul className="space-y-2">
          {visible.map((todo) => (
            <li
              key={todo.id}
              tabIndex={0}
              onDoubleClick={() => startEditing(todo)}
              onKeyDown={(e) => handleTodoKeyDown(e, todo)}
              className="flex items-center gap-3 px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500"
            >
              {editingId === todo.id ? (
                <input
                  autoFocus
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={saveEditing}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEditing()
                    if (e.key === 'Escape') cancelEditing()
                  }}
                  className="flex-1 px-2 py-1 border border-slate-300 rounded"
                />
              ) : (
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-1 text-left ${todo.done ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                >
                  {todo.text}
                </button>
              )}

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-slate-400 hover:text-red-500 text-lg font-bold px-2"
                aria-label="Delete todo"
              >
                ×
              </button>
            </li>
          ))}
          {visible.length === 0 && (
            <li className="text-center text-slate-400 py-4 text-sm">
              Nothing here.
            </li>
          )}
        </ul>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>
            {remaining} {remaining === 1 ? 'item' : 'items'} left
          </span>
          <button
            onClick={clearCompleted}
            disabled={completed === 0}
            className="rounded-md px-3 py-1 font-medium text-slate-600 transition enabled:hover:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            Clear completed
          </button>
        </div>
      </div>
    </div>
  )
}
