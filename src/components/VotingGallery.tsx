import VotingCard from './VotingCard'
import VotingSplit from './VotingSplit'
import { Suspense } from 'react'
import { getThisWeeksGames } from 'src/lib/utils'
import Link from 'next/link'
import VotingStepIndicator from './VotingStepIndicator'
import Spinner from './Spinner'
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

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

export default async function VotingGallery({
  currentFixtureIndex,
}: {
  currentFixtureIndex: number
}) {
  const fixtures = await getFixtures()

  return (
    <div className="w-full flex flex-col align-middle overscroll-x-none  ">
      {currentFixtureIndex < fixtures?.length ? (
        <>
          <h1 className="text-center py-6">Swipe to vote</h1>
          <Suspense
            fallback={
              <article className=" w-full md:w-80 h-96 border-2 z-10 text-center  bg-slate-100 shadow-xl p-4 rounded-lg flex flex-col justify-between place-self-center align-middle select-none transform-gpu"></article>
            }
          >
            <VotingCard
              currentFixture={fixtures[currentFixtureIndex]}
              currentFixtureIndex={currentFixtureIndex}
            >
              <Suspense
                fallback={
                  <section className="h-12 rounded-md bg-slate-200 flex flex-row justify-center text-lg animate-pulse"></section>
                }
              >
                {/* @ts-expect-error Server Component */}
                <VotingSplit currentFixture={fixtures[currentFixtureIndex]} />
              </Suspense>
            </VotingCard>
          </Suspense>

          <footer className="w-full text-center pt-8 text-slate-600">
            <VotingStepIndicator
              currentFixtureIndex={currentFixtureIndex}
              fixtures={fixtures}
            />
          </footer>
        </>
      ) : (
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-center py-6">You’re all set!</h1>
          <h1 className="text-2xl text-center"></h1>
          <h2 className="text-xl text-center">
            <Link href="/play/summary">See your summary</Link>
          </h2>
        </div>
      )}
    </div>
  )
}
