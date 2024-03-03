import { render, screen } from '@testing-library/react'

import { DisplayError } from './DisplayError'

const ERR_MSG = 'err msg'

test('renders err msg', () => {
  render(<DisplayError message={ERR_MSG} />)

  const msgEl = screen.getByText(ERR_MSG)

  expect(msgEl).toBeInTheDocument()
  expect(msgEl.textContent).toBe(ERR_MSG)
})

test('renders err icon', () => {
  render(<DisplayError message={ERR_MSG} />)

  const errIcon = screen.getByTestId('error-icon')

  expect(errIcon).toBeInTheDocument()
})
