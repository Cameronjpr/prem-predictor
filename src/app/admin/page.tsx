import { teams } from 'src/lib/teams'
import { getThisWeeksExpectedGames } from 'src/lib/utils'
import { RawFixture } from 'src/lib/types'
import NewFixtureForm from 'src/components/NewFixtureForm'
import prisma from 'src/lib/db'
import NewFixtureRow from 'src/components/NewFixtureRow'

async function getData() {
  const res = await fetch(`https://fantasy.premierleague.com/api/fixtures`, {
    headers: {
      'Access-Control-Allow-Origin': 'https://fantasy.premierleague.com',
    },
  })

  const data = await res.json()

  const fixtures = getThisWeeksExpectedGames(data as RawFixture[])

  const existingFixtures = await prisma.fixture.findMany()

  return {
    fixtures,
    existingFixtures: existingFixtures,
  }
}

export default async function Page() {
  const { fixtures, existingFixtures } = await getData()

  return (
    <main className="flex flex-col items-center justify-center gap-4">
      <h1>Admin panel</h1>

      <h2>Predicted fixtures</h2>

      <section className="w-full flex flex-col items-left justify-between gap-2">
        {fixtures.map((fixture, idx) => {
          if (existingFixtures.find((f) => f.code === fixture.code)) {
            return null
          }

          return <NewFixtureRow key={idx} fixture={fixture} />
        })}
      </section>
    </main>
  )
}
