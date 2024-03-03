import { Dispatch, SetStateAction } from 'react'

import { ErrorMessage } from '../types/ErrorMessage'

interface FetcherOptions {
  apiUrl: string
  options: RequestInit
  setError: Dispatch<SetStateAction<string>>
  errorMessage: ErrorMessage
}

export const fetcher = async <T>({
  apiUrl,
  options,
  setError,
  errorMessage,
}: FetcherOptions) => {
  try {
    const response = await fetch(apiUrl, options)

    if (!response.ok) {
      throw new Error(errorMessage)
    }

    const data: T = await response.json()

    return data
  } catch (error) {
    setError((error as Error).message)
  }
}
