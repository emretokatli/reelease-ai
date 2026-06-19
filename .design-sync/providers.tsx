// Preview provider for design-sync. Some primitives (e.g. Switch via
// useAppDirection) read from the app's Redux store through react-redux's
// useSelector, which throws outside a <Provider>. This supplies a minimal
// read-only store exposing just the slices those primitives read, so previews
// render in isolation. Wired via cfg.extraEntries + cfg.provider.
import * as React from 'react'
import { Provider } from 'react-redux'

const state = {
  layout: { direction: 'ltr' },
}

const store = {
  getState: () => state,
  subscribe: () => () => {},
  dispatch: (action: unknown) => action,
} as never

export function DSProvider({ children }: { children?: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
