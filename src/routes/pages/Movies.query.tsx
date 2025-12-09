import { useState } from 'react'
import { useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import axios from 'axios'
import Loader from '@/components/Loader'

export interface ReponseValue {
  Search: SimpleMovie[]
  totalResults: string
  Response: string
}
export interface SimpleMovie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export default function Movies() {
  const [inputText, setInputText] = useState('')
  const [searchText, setSearchText] = useState('')
  const queryClient = useQueryClient()

  const options = queryOptions<SimpleMovie[]>({
    queryKey: ['movies', searchText],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://omdbapi.com?apikey=7035c60c&s=${searchText}`
      )
      return data.Search
    },
    staleTime: 1000 * 5, // 5 seconds
    enabled: Boolean(searchText),
    select: movies => {
      return movies.filter((movie, index, self) => {
        return self.findIndex(m => m.imdbID === movie.imdbID) === index
      })
    },
    placeholderData: prev => prev
  })

  const { data: movies, isFetching, refetch } = useQuery(options)

  function searchMovies() {
    setSearchText(inputText)
  }
  function fetchQuery() {
    // 캐시된 데이터가 있으면 그 데이터를 사용하고, 없으면 새로 요청
    queryClient.fetchQuery(options)
    // queryClient.getQueryData(options.queryKey)
    // queryClient.setQueryData(options.queryKey, [])
    // queryClient.removeQueries({ queryKey: options.queryKey })
    // queryClient.invalidateQueries({ queryKey: options.queryKey })
  }

  return (
    <>
      <input
        type="text"
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        onKeyDown={e => {
          if (e.nativeEvent.isComposing) return
          if (e.key === 'Enter') {
            searchMovies()
          }
        }}
      />
      <button onClick={searchMovies}>검색!</button>
      <button onClick={() => refetch()}>다시 검색!</button>
      <button onClick={fetchQuery}>캐시 검색!</button>

      {isFetching && (
        <Loader
          size={50}
          color="royalblue"
        />
      )}
      <ul>
        {movies?.map(movie => {
          return <li key={movie.imdbID}>{movie.Title}</li>
        })}
      </ul>
    </>
  )
}
