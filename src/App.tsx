import type { FC, ReactNode } from 'react'

interface ChildComponent {
  (a: string, b: number): ReactNode
}

const Child = ({
  a,
  b,
  children
}: {
  a: string
  b: number
  children: ReactNode
}) => {
  return <div>App</div>
}

export default function App() {
  return <Child />
}
