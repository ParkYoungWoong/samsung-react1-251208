import { Link } from 'react-router'

export default function Home() {
  return <>
    <h1>Home Page!</h1>
    <Link to="/signin">Sign In</Link>
    <Link to="/movies/tt0848228">Avengers</Link>
    <Link to="/movies/tt1877830">Batman</Link>
  </>
}