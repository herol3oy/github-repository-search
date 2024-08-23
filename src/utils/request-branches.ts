import { Dispatch, SetStateAction } from 'react'

import { Branch } from '../types/branch'
import { ErrorMessage } from '../types/error-message'
import { Repository } from '../types/repository'
import { fetcher } from './fetcher'
import { githubConfig } from './github-config'

export const requestBranches = async (
  repo: Repository,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  setBranches: Dispatch<
    React.SetStateAction<{
      [key: string]: Branch[]
    }>
  >,
) => {
  const branches =
    (await fetcher<Branch[]>({
      apiUrl: `https://api.github.com/repos/${repo.owner.login}/${repo.name}/branches`,
      options: githubConfig,
      setError: setErrorMessage,
      errorMessage: ErrorMessage.FAILED_TO_FETCH_BRANCHES,
    })) || []

  if (branches.length) {
    setBranches((prevBranches) => ({
      ...prevBranches,
      [repo.name]: branches,
    }))
  }
}
