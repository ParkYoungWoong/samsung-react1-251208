import axios from 'axios'
// import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'

export interface Movie {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Rating[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}
export interface Rating {
  Source: string
  Value: string
}

export default function MovieDetails() {
  const { movieId } = useParams() // http://localhost:5174/movies/tt1234567

  const { data: movie, isFetching } = useQuery<Movie>({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      const { data: movie } = await axios.get(
        `https://omdbapi.com?apikey=7035c60c&i=${movieId}`
      )
      return movie
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    select: movie => {
      // 'https://m.media-amazon.com/images/M/cGc@._V1_SX300.jpg'
      movie.Poster
      return {
        ...movie,
        Title: movie.Title.toUpperCase(),
        Poster: movie.Poster.replace('SX300', 'SX11000')
      }
    }
  })

  return (
    <>
      {isFetching && <div>Loading...</div>}
      <h1>{movie?.Title}</h1>
      <img
        src={movie?.Poster}
        alt=""
      />
    </>
  )
}
