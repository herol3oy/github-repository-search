import { useState } from 'react'

import { Branch } from '../../types/branch'
import { Repository } from '../../types/repository'
import styles from './RepoCard.module.scss'

interface RepoCardProps {
  repo: Repository
  commit: string
  branches: Branch[]
  displayBranches: (repo: Repository) => Promise<void>
}

export function RepoCard(props: RepoCardProps) {
  const [isVisible, setIsVisible] = useState(false)

  const toggleBranches = () => {
    props.displayBranches(props.repo)
    setIsVisible((isVisible) => !isVisible)
  }

  return (
    <div key={props.repo.id} className={styles.repoCard}>
      <div className={styles.header}>
        <div className={styles.nameContainer}>
          <img
            className={styles.githubLogo}
            src="/github-mark-white.svg"
            alt="github-log"
          />
          <a
            className={styles.repoName}
            href={props.repo.html_url}
            target="_blank"
            rel="noreferrer"
          >
            {props.repo.name}
          </a>
        </div>
        <p className={styles.userName}>{props.repo.owner.login}</p>
      </div>
      <small className={styles.lastCommit}>
        last commit: <b data-testid="last-commit">{props.commit}</b>
      </small>
      <div onClick={toggleBranches} className={styles.branchesContainer}>
        <u>
          {isVisible ? 'hide' : 'show'} branches
          {isVisible ? (
            <span className={styles.arrow}>&uarr;</span>
          ) : (
            <span className={styles.arrow}>&darr;</span>
          )}
        </u>
      </div>

      {isVisible && props.branches && (
        <ul className={styles.branchesNamesContainer}>
          {props.branches.map((branch) => (
            <li key={branch.commit.sha} className={styles.branchesNames}>
              <p>{branch.name}</p>
              <span>{branch.commit.sha}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
