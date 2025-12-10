import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Todo {
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

export function useFetchTodos() {
  return useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data: todos } = await api.get('/')
      return todos
    }
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ title }: { title: string }) => {
      const { data: todo } = await api.post('/', {
        title
      })
      return todo
    },
    onMutate: ({ title }) => {
      const prevTodos = queryClient.getQueryData<Todo[]>(['todos'])
      if (prevTodos) {
        queryClient.setQueryData(
          ['todos'],
          [
            {
              id: Math.random().toString(),
              title
            },
            ...prevTodos
          ]
        )
      }
      return prevTodos
    },
    onSuccess: (newTodo, _payload, prevTodos) => {
      if (prevTodos) {
        queryClient.setQueryData(['todos'], [newTodo, ...prevTodos])
      }
      // queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (_error, _payload, prevTodos) => {
      if (prevTodos) {
        queryClient.setQueryData(['todos'], prevTodos)
      }
    },
    onSettled: () => {}
  })
}
