import { auth } from '@clerk/nextjs/app-beta'
import prisma from 'src/lib/db'
import { teams } from 'src/lib/teams'
import { getThisWeeksGames } from 'src/lib/utils'
import { PrismaClient } from '@prisma/client'

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
  const prisma = new PrismaClient()
  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      kickoffTime: true,
      home: true,
      away: true,
    },
  })

  const fixturesForWeek = getThisWeeksGames(fixtures)

  return fixturesForWeek
}

export default async function Page() {
  const votes = await getData()
  const fixtures = await getFixtures()

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 py-4">
      <h1>Your summary</h1>
      {votes.map((vote) => {
        const fixture = fixtures.find((f) => f.id === vote.fixtureId)

        console.log(fixtures, vote)
        if (!fixture) {
          return null
        }

        const home = teams[fixture.home - 1]
        const away = teams[fixture.away - 1]

        const team = teams[vote.picked]
        const opponent =
          teams[vote.picked === fixture.away ? fixture.home : fixture.away]
        return (
          <div
            key={vote.fixtureId}
            className="w-full flex flex-row text-center gap-2 justify-center"
          >
            <span
              style={{
                textDecoration: fixture.home === vote.picked ? 'underline' : '',
                fontWeight: fixture.home === vote.picked ? 'bold' : '',
              }}
            >
              {home?.shortName}
            </span>
            <span>vs</span>
            <span
              style={{
                textDecoration: fixture.away === vote.picked ? 'underline' : '',
                fontWeight: fixture.away === vote.picked ? 'bold' : '',
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
