import VotingGallery from 'src/components/VoteCard'
import { getThisWeeksGames } from 'src/lib/utils'

export default async function PlayPage() {
  const res = await fetch(`https://fantasy.premierleague.com/api/fixtures`, {
    headers: {
      'Access-Control-Allow-Origin': 'https://fantasy.premierleague.com',
    },
  })

  const data = await res.json()

  console.log(data)

  const thisWeeksFixtures = getThisWeeksGames(data)
  const currentFixture = thisWeeksFixtures[0]

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4">
      <VotingGallery key={currentFixture.code} fixture={currentFixture} />
    </main>
  )
}
