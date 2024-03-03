export const githubConfig = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_APP_GITHUB_ACCESS_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
  },
}
