import { useEffect, Fragment } from 'react'
import Loader from '@/components/Loader'
import { useInView } from 'react-intersection-observer'
import { useFetchMovies } from '@/hooks/movie'

export default function Movies() {
  const { ref, inView } = useInView({
    rootMargin: '0px 0px 500px 0px'
  })
  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    inputText,
    setInputText,
    searchText,
    setSearchText
  } = useFetchMovies()

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

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
        {data?.pages.map((page, index) => {
          return (
            <Fragment key={index}>
              <li>----------- {index + 1} -----------</li>
              {page.Search?.map(movie => {
                return <li key={movie.imdbID}>{movie.Title}</li>
              })}
            </Fragment>
          )
        })}
      </ul>
      <button
        ref={ref}
        style={{
          display: isFetching || !searchText || !hasNextPage ? 'none' : 'block'
        }}>
        다음 페이지
      </button>
    </>
  )
}
