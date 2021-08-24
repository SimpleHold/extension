import * as React from 'react'

type TUpdate<T> = {
  [P in keyof T]?: T[P]
}

const useState = <S>(initialState: S) => {
  const [state, setState] = React.useState<S>(initialState)

  const updateState = (state: TUpdate<S>) => {
    setState((oldState: S) => {
      return {
        ...oldState,
        ...state,
      }
    })
  }

  return {
    state,
    updateState,
  }
}

export default useState
