import { useState } from 'react'
import { useFetchTodos, useCreateTodo } from '@/hooks/todo'

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
          return <li key={todo.id}>{todo.title}</li>
        })}
      </ul>
    </>
  )
}
