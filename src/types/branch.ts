import { Commit } from './commit'

export interface Branch {
  name: string
  commit: Commit
}
