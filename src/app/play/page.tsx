import VotingGallery from 'src/components/VotingGallery'
import { getThisWeeksGames } from 'src/lib/utils'

export default async function PlayPage() {
  const res = await fetch(`https://fantasy.premierleague.com/api/fixtures`, {
    headers: {
      'Access-Control-Allow-Origin': 'https://fantasy.premierleague.com',
    },
  })

  const data = await res.json()

  const thisWeeksFixtures = getThisWeeksGames(data)

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-4">
      <VotingGallery fixtures={thisWeeksFixtures} />
    </main>
  )
}
