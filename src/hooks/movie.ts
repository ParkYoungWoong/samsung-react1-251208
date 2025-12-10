import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

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

export const useMovieStore = create(
  combine(
    {
      inputText: '',
      searchText: ''
    },
    set => ({
      setInputText: (inputText: string) => set({ inputText }),
      setSearchText: (searchText: string) => set({ searchText })
    })
  )
)

export function useFetchMovies() {
  const inputText = useMovieStore(s => s.inputText)
  const setInputText = useMovieStore(s => s.setInputText)
  const searchText = useMovieStore(s => s.searchText)
  const setSearchText = useMovieStore(s => s.setSearchText)
  const result = useInfiniteQuery<ReponseValue>({
    queryKey: ['movies', searchText],
    queryFn: async ({ pageParam }) => {
      const { data: page } = await axios.get(
        `https://omdbapi.com?apikey=7035c60c&s=${searchText}&page=${pageParam}`
      )
      return page
    },
    staleTime: 1000 * 60 * 5, // 5 seconds
    enabled: Boolean(searchText),
    select: data => ({
      ...data,
      pages: data.pages.map(page => ({
        ...page,
        Search: page.Search.filter((movie, index, self) => {
          return self.findIndex(m => m.imdbID === movie.imdbID) === index
        })
      }))
    }),
    placeholderData: prev => prev,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const maxPage = Math.ceil(Number(lastPage.totalResults) / 10) // 검색 결과 => '632' => 632 => 63.2
      return allPages.length < maxPage ? allPages.length + 1 : null
    }
  })
  return {
    ...result,
    inputText,
    setInputText,
    searchText,
    setSearchText
  }
}
