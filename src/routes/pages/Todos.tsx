import { useState, useRef, useEffect } from 'react'
import { useFetchTodos, useCreateTodo } from '@/hooks/todo'
import type { Todo } from '@/hooks/todo'

export default function Todos() {
  const [inputText, setInputText] = useState('')
  const { data: todos, isLoading } = useFetchTodos()
  const { mutateAsync } = useCreateTodo()

  async function createTodo() {
    mutateAsync({ title: inputText })
    setInputText('')
  }

  return (
    <>
      <div>
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => {
            if (e.nativeEvent.isComposing) return
            if (e.key === 'Enter') createTodo()
          }}
        />
        <button onClick={createTodo}>추가!</button>
      </div>
      <ul>
        {todos?.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
            />
          )
        })}
      </ul>
    </>
  )
}

function TodoItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    }
  }, [isEditing])

  function cancelEdit() {
    setTitle(todo.title)
    setIsEditing(false)
  }
  return (
    <>
      <li>
        {isEditing ? (
          <div>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <button onClick={cancelEdit}>취소</button>
            <button>저장</button>
            <button>삭제</button>
          </div>
        ) : (
          <div>
            <span>{todo.title}</span>
            <button onClick={() => setIsEditing(true)}>수정</button>
          </div>
        )}
      </li>
    </>
  )
}
