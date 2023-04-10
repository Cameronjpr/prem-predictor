import { teams } from 'src/lib/teams'
import { useForm } from 'react-hook-form'
import { getThisWeeksExpectedGames } from 'src/lib/utils'
import { RawFixture } from 'src/lib/types'
import NewFixtureForm from 'src/components/NewFixtureForm'

async function getData() {
  const res = await fetch(`https://fantasy.premierleague.com/api/fixtures`, {
    headers: {
      'Access-Control-Allow-Origin': 'https://fantasy.premierleague.com',
    },
  })

  const data = await res.json()

  const fixtures = getThisWeeksExpectedGames(data as RawFixture[])

  return fixtures
}

export default async function Page() {
  const fixtures = await getData()

  console.log(fixtures)

  return (
    <main className="flex flex-col items-center justify-center gap-4">
      <h1>Admin panel</h1>

      <h2>Predicted fixtures</h2>
      <section className="w-full flex flex-col items-left justify-between gap-2">
        {fixtures.map((fixture, idx) => {
          const home = teams[fixture.team_h - 1]
          const away = teams[fixture.team_a - 1]
          const kickoffTime = new Date(fixture.kickoff_time)

          return (
            <div key={idx} className="grid grid-cols-3 justify-between">
              <span>{home.shortName}</span>
              <span>{away.shortName}</span>
              <span>{kickoffTime.toLocaleString()}</span>
            </div>
          )
        })}
      </section>
      <NewFixtureForm />
    </main>
  )
}
