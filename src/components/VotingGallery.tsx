import VotingCard from './VotingCard'
import VotingSplit from './VotingSplit'
import { Suspense } from 'react'
import { getThisWeeksGames } from 'src/lib/utils'

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

export default async function VotingGallery() {
  const currentFixtureIndex = 0

  const fixtures = await getFixtures()

  // const [probableVote, setProbableVote] = useState<number | null>(null)
  // let probableVoteTeam = probableVote !== null ? teams[probableVote - 1] : null

  return (
    <div className="w-full flex flex-col align-middle overscroll-x-none">
      {currentFixtureIndex < fixtures?.length ? (
        <>
          <Suspense
            fallback={
              <article className="w-full md:w-80 h-96 border-2 z-10 text-center  bg-slate-900 shadow-xl p-4 rounded-lg flex flex-col justify-between place-self-center align-middle select-none transform-gpu"></article>
            }
          >
            <VotingCard
              currentFixture={fixtures[currentFixtureIndex]}
              currentFixtureIndex={currentFixtureIndex}
            >
              <Suspense
                fallback={<section className="p-4 text-lg">Loading...</section>}
              >
                {/* @ts-expect-error Server Component */}
                <VotingSplit currentFixture={fixtures[currentFixtureIndex]} />
              </Suspense>
            </VotingCard>
          </Suspense>

          <footer className="w-full text-center pt-8 text-slate-600">
            {currentFixtureIndex + 1} of {fixtures.length}
          </footer>
        </>
      ) : (
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-2xl text-center">
            That’s all the fixtures for this week!
          </h1>
          <h2 className="text-xl text-center">
            Check back next week for more fixtures.
          </h2>
        </div>
      )}
    </div>
  )
}
