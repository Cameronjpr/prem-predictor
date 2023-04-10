import VotingCard from './VotingCard'
import VotingSplit from './VotingSplit'
import { Suspense } from 'react'
import { getThisWeeksGames } from 'src/lib/utils'
import Link from 'next/link'

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

export default async function VotingGallery({
  currentFixtureIndex,
}: {
  currentFixtureIndex: number
}) {
  const fixtures = await getFixtures()

  return (
    <div className="w-full flex flex-col align-middle overscroll-x-none">
      {currentFixtureIndex < fixtures?.length ? (
        <>
          <h1 className="text-2xl text-center p-8">
            Swipe left or right to vote
          </h1>
          <Suspense
            fallback={
              <article className="w-full md:w-80 h-96 border-2 z-10 text-center  bg-slate-100 shadow-xl p-4 rounded-lg flex flex-col justify-between place-self-center align-middle select-none transform-gpu"></article>
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
            {Number(currentFixtureIndex) + 1} of {fixtures.length}
          </footer>
        </>
      ) : (
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-2xl text-center">
            That’s all the fixtures for this week!
          </h1>
          <h2 className="text-xl text-center">
            <Link href="/play/summary">See your summary</Link>
          </h2>
        </div>
      )}
    </div>
  )
}
