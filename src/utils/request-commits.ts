import { Dispatch, SetStateAction } from 'react'

import { Commit } from '../types/commit'
import { ErrorMessage } from '../types/ErrorMessage'
import { Repository } from '../types/repository'
import { fetcher } from './fetcher'
import { githubConfig } from './github-config'

export const requestCommits = async (
  repo: Repository,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  setCommits: Dispatch<
    React.SetStateAction<{
      [key: string]: string
    }>
  >,
) => {
  const commits =
    (await fetcher<Commit[]>({
      apiUrl: `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits`,
      options: githubConfig,
      setError: setErrorMessage,
      errorMessage: ErrorMessage.FAILED_TO_FETCH_COMMITS,
    })) || []

  if (commits.length) {
    setCommits((prevCommits) => ({
      ...prevCommits,
      [repo.name]: commits[0]['sha'],
    }))
  }
}
