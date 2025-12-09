import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function Todos() {
  useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      axios.get()
    }
  })

  return <></>
}
