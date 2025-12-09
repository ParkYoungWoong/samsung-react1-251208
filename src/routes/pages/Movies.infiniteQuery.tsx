import { useState } from 'react'
import {
  useInfiniteQuery,
  useQueryClient,
  infiniteQueryOptions
} from '@tanstack/react-query'
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

  const options = infiniteQueryOptions<ReponseValue>({
    queryKey: ['movies', searchText],
    queryFn: async ({ pageParam }) => {
      const { data: page } = await axios.get(
        `https://omdbapi.com?apikey=7035c60c&s=${searchText}&page=${pageParam}`
      )
      return page
    },
    staleTime: 1000 * 5, // 5 seconds
    enabled: Boolean(searchText),
    // select: movies => {
    //   return movies.filter((movie, index, self) => {
    //     return self.findIndex(m => m.imdbID === movie.imdbID) === index
    //   })
    // },
    placeholderData: prev => prev,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const maxPage = Math.ceil(Number(lastPage.totalResults) / 10) // 검색 결과 => '632' => 632 => 63.2
      return allPages.length < maxPage ? allPages.length + 1 : null
    }
  })

  const { data, isFetching, fetchNextPage } = useInfiniteQuery(options)

  function searchMovies() {
    setSearchText(inputText)
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

      {isFetching && (
        <Loader
          size={50}
          color="royalblue"
        />
      )}
      <ul>
        {data?.pages.map(page => {
          return page.Search.map(movie => {
            return <li key={movie.imdbID}>{movie.Title}</li>
          })
        })}
      </ul>
      <button onClick={() => fetchNextPage()}>다음 페이지</button>
    </>
  )
}
