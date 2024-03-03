import { useRef, useState } from 'react'

import { Repository } from './types/repository'

export function App() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleUserInputChange = async () => {
    const inputValue = inputRef.current?.value || ''

    const hasInputLength = inputValue.trim().length

    if (hasInputLength) {
      const response = await fetch(
        `https://api.github.com/users/${inputValue}/repos`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_APP_GITHUB_ACCESS_TOKEN}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      )

      if (!response.ok) {
        throw new Error('error')
      }

      const repos: Repository[] = await response.json()

      const ownedRepos = repos?.filter((repo) => !repo.fork) || []

      setRepositories(ownedRepos)

      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <section>
        <pre>{JSON.stringify(isLoading, null, 2)}</pre>
        <input
          ref={inputRef}
          onChange={handleUserInputChange}
          placeholder="Type a username"
          data-testid="seach-bar"
        />
      </section>
      <section>
        <pre>{JSON.stringify(repositories, null, 2)}</pre>
      </section>
    </main>
  )
}
