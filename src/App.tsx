import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import styles from './App.module.scss'
import { CardSkeleton } from './components/CardSkeleton'
import { DisplayError } from './components/DisplayError'
import { RepoCard } from './components/RepoCard'
import { Branch } from './types/branch'
import { ErrorMessage } from './types/error-message'
import { Repository } from './types/repository'
import { fetcher } from './utils/fetcher'
import { githubConfig } from './utils/github-config'
import { requestBranches } from './utils/request-branches'
import { requestCommits } from './utils/request-commits'

export function App() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [commits, setCommits] = useState<{ [key: string]: string }>({})
  const [branches, setBranches] = useState<{ [key: string]: Branch[] }>({})
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const hasCurrentInput = !!inputRef?.current?.value

  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const innerEffect = async () => {
      const query = searchParams.get('q')

      if (query && inputRef.current) {
        setIsLoading(true)
        inputRef.current.value = query

        const repos = await fetcher<Repository[] | undefined>({
          apiUrl: `https://api.github.com/users/${inputRef.current.value}/repos`,
          options: githubConfig,
          setError: setErrorMessage,
          errorMessage: ErrorMessage.USER_NOT_FOUND,
        })

        const ownedRepositories =
          repos?.filter((repo: Repository) => !repo.fork) || []

        if (repos && !repos.length) {
          setErrorMessage(ErrorMessage.USER_HAS_NO_REPOSITORY)
        }
        setRepositories(ownedRepositories)
        setIsLoading(false)
      }
    }

    innerEffect()
  }, [searchParams])

  useEffect(() => {
    repositories.length &&
      repositories.forEach((repo) => {
        requestCommits(repo, setErrorMessage, setCommits)
      })
  }, [repositories])

  const handleClearUserInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }

    setSearchParams('')
    setErrorMessage('')
    setRepositories([])
  }

  const handleUserInputChange = () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    const newTimeout = setTimeout(async () => {
      const inputValue = inputRef.current?.value || ''

      setIsLoading(true)
      setErrorMessage('')
      setRepositories([])
      setSearchParams({ q: inputValue }, { replace: true })

      const hasInputLength = inputValue.trim().length

      if (hasInputLength) {
        const data = await fetcher<Repository[] | undefined>({
          apiUrl: `https://api.github.com/users/${inputValue}/repos`,
          options: githubConfig,
          setError: setErrorMessage,
          errorMessage: ErrorMessage.USER_NOT_FOUND,
        })

        const ownedRepos = data?.filter((repo) => !repo.fork) || []

        setRepositories(ownedRepos)

        if (!ownedRepos.length) {
          setErrorMessage(ErrorMessage.USER_HAS_NO_REPOSITORY)
        }

        if (data === undefined) {
          setErrorMessage(ErrorMessage.USER_NOT_FOUND)
        }

        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    }, 500)

    setDebounceTimeout(newTimeout)
  }

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Github Repository Search</h1>
      <section className={styles.userInputContainer}>
        <input
          className={styles.userInput}
          ref={inputRef}
          onChange={handleUserInputChange}
          placeholder="Type a username"
          data-testid="seach-bar"
        />

        {isLoading && <span className={styles.loaderIcon}>&#8634;</span>}

        {hasCurrentInput && !isLoading && (
          <span className={styles.crossIcon} onClick={handleClearUserInput}>
            &#10799;
          </span>
        )}
      </section>
      <section className={styles.repoCardContainer}>
        {errorMessage && <DisplayError message={errorMessage} />}
        {repositories.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            commit={commits[repo.name]}
            branches={branches[repo.name]}
            displayBranches={() =>
              requestBranches(repo, setErrorMessage, setBranches)
            }
          />
        ))}

        {!repositories.length && !errorMessage.length && !isLoading && (
          <img
            className={styles.githubLogo}
            src="/github-mark-white.svg"
            alt="github-logo"
          />
        )}

        {isLoading &&
          !repositories.length &&
          Array.from(Array(5)).map((_, index) => <CardSkeleton key={index} />)}
      </section>
    </main>
  )
}
