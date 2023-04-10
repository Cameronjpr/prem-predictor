import { auth } from '@clerk/nextjs/app-beta'
import prisma from 'src/lib/db'
import { teams } from 'src/lib/teams'
import { getThisWeeksGames } from 'src/lib/utils'

async function getData() {
  const { userId } = auth()

  if (!userId) {
    return []
  }

  const votes = await prisma.vote.findMany({
    where: {
      playerId: userId,
    },
  })

  console.log(votes)

  return votes
}

async function getFixtures() {
  const res = await fetch(`https://fantasy.premierleague.com/api/fixtures`, {
    headers: {
      'Access-Control-Allow-Origin': 'https://fantasy.premierleague.com',
    },
  })

  const data = await res.json()
  const fixtures = getThisWeeksGames(data)

  return fixtures
}

export default async function Page() {
  const votes = await getData()
  const fixtures = await getFixtures()

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 py-4">
      <h1>Your summary</h1>
      {votes.map((vote) => {
        const fixture = fixtures.find((f) => f.code === vote.fixture)

        if (!fixture) {
          return null
        }

        const home = teams[fixture.team_h - 1]
        const away = teams[fixture.team_a - 1]

        const team = teams[vote.picked]
        const opponent =
          teams[
            vote.picked === fixture.team_a ? fixture.team_h : fixture.team_a
          ]
        return (
          <div
            key={vote.fixture}
            className="w-full flex flex-row text-center gap-2 justify-center"
          >
            <span
              style={{
                textDecoration:
                  fixture.team_h === vote.picked ? 'underline' : '',
                fontWeight: fixture.team_h === vote.picked ? 'bold' : '',
              }}
            >
              {home?.shortName}
            </span>
            <span>vs</span>
            <span
              style={{
                textDecoration:
                  fixture.team_a === vote.picked ? 'underline' : '',
                fontWeight: fixture.team_a === vote.picked ? 'bold' : '',
              }}
            >
              {away?.shortName}
            </span>
          </div>
        )
      })}
    </main>
  )
}
