import * as React from 'react'

export default function Counter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = React.useState(initialCount)
  const increment = () => setCount(count + 1)

  return (
    <div>
      Current value: {count}
      <button onClick={increment}>Increment</button>
    </div>
  )
}
