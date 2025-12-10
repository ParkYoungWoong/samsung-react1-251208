import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export default function Test() {
  const queryClient = useQueryClient()

  const { data: nums } = useQuery({
    queryKey: ['NUMS'],
    queryFn: async () => [1, 2, 3, 4, 5],
    staleTime: 1000 * 60 * 5 // 5분
  })

  const { mutateAsync } = useMutation({
    mutationFn: async (numToAdd: number) => {
      await new Promise(resolve => setTimeout(resolve, 3000))
      const newNum = numToAdd + 1
      return newNum
    },
    onMutate: numToAdd => {
      const prevNums = queryClient.getQueryData<number[]>(['NUMS'])
      if (prevNums) {
        const newNum = numToAdd + 1
        queryClient.setQueryData(['NUMS'], [newNum, ...prevNums])
      }
      return prevNums
    },
    onSuccess: (newNum, _numToAdd, prevNums) => {
      // 1)
      // 장점: 오프라인으로 동작, 네트워크 자원 X
      // 단점: 복잡한 데이터의 경우 갱신 로직을 별도 작성
      if (prevNums) queryClient.setQueryData(['NUMS'], [newNum, ...prevNums])

      // 2)
      // 장점: 복잡한 데이터도 간단하게 새로운 데이터 덮어쓰기
      // 단점: 네트워크 자원 O
      queryClient.invalidateQueries({ queryKey: ['NUMS'] })
    },
    onError: (_error, _numToAdd, prevNums) => {
      if (prevNums) queryClient.setQueryData(['NUMS'], prevNums)
    },
    onSettled: (_newNum, _error, _numToAdd, _prevNums) => {}
  })

  return (
    <>
      {nums?.map(num => (
        <li key={num}>{num}</li>
      ))}
      <button onClick={() => mutateAsync(7)}>클릭!</button>
    </>
  )
}
