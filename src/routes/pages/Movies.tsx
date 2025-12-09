import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function Movies() {
  const [inputText, setInputText] = useState('')
  const [searchText, setSearchText] = useState('')

  const { data: movies } = useQuery({
    queryKey: ['movies', searchText],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://omdbapi.com?apikey=7035c60c&s=${searchText}`
      )
      return data.Search
    },
    staleTime: 1000 * 60 * 60 * 24, // ms
    enabled: Boolean(searchText)
    // enabled: !!searchText
  })

  function searchMovies() {
    setSearchText(inputText)
  }

  return (
    <>
      <input
        type="text"
        value={inputText}
        onChange={e => setInputText(e.target.value)}
      />
      <button onClick={searchMovies}>검색!</button>

      <ul>
        {movies?.map(movie => {
          return <li key={movie.imdbID}>{movie.Title}</li>
        })}
      </ul>
    </>
  )
}
