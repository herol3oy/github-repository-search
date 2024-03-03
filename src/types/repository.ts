import { Owner } from './owner'

export interface Repository {
  id: number
  name: string
  html_url: string
  fork: boolean
  owner: Owner
}
