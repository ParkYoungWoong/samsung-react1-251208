const result = await axios.get(
  `https://omdbapi.com?apikey=7035c60c&i=${movieId}`
)

result // Promise
result.data // X
// 1)
result.then(res => res.data)
// 2)
const res = await result
res.data

// 대기(pending), 이행(fulfilled), 거부(rejected)

/**
 * TanStack React Query
 * 1) useQuery
 *    - GET(조회)
 * 2) useMutation
 *    - POST(생성), PUT/PATCH(수정), DELETE(삭제)
 */
