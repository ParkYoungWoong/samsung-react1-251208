import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'

interface Todo {
  id: string // 할 일 ID
  order: number // 할 일 순서
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  createdAt: string // 할 일 생성일
  updatedAt: string // 할 일 수정일
}

const api = axios.create({
  baseURL: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
  headers: {
    'content-type': 'application/json',
    apikey: 'KDT8_bcAWVpD8',
    username: 'KDT8_ParkYoungWoong'
  }
})

export default function Todos() {
  const queryClient = useQueryClient()
  const [inputText, setInputText] = useState('')
  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data: todos } = await api.get('/')
      return todos
    }
  })
  const { mutateAsync } = useMutation({
    mutationFn: async ({ title }: { title: string }) => {
      const { data: todo } = await api.post('/', {
        title
      })
      return todo
    },
    onMutate: ({ title }) => {
      queryClient.getQueryData([])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: () => {},
    onSettled: () => {}
  })

  return (
    <>
      <div>
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => {
            if (e.nativeEvent.isComposing) return
            if (e.key === 'Enter') {
              mutateAsync({ title: inputText })
            }
          }}
        />
        <button onClick={() => mutateAsync({ title: inputText })}>추가!</button>
      </div>
      <ul>
        {todos?.map(todo => {
          return <li key={todo.id}>{todo.title}</li>
        })}
      </ul>
    </>
  )
}
