import type { CSSProperties } from 'react'

interface LoaderProps {
  size?: number
  color?: string
  weight?: number
  duration?: number
  className?: string
}

export default function Loader({
  size = 20,
  color = '#0374FF',
  weight = 3,
  duration = 1,
  className = ''
}: LoaderProps) {
  const loaderStyle: CSSProperties = {
    width: size,
    height: size,
    borderWidth: weight,
    borderStyle: 'solid',
    borderColor: color,
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: `loader ${duration}s infinite linear`
  }

  return (
    <>
      <style>
        {`
          @keyframes loader {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div
        style={loaderStyle}
        className={`absolute top-0 right-0 bottom-0 left-0 m-auto ${className}`}
      />
    </>
  )
}
