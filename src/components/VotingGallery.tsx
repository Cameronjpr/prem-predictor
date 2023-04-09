'use client'

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { teams } from 'src/lib/teams'
import { RawFixture } from 'src/lib/types'
import VotingCard from './VotingCard'
import { useState } from 'react'

export default function VotingGallery(props: { fixtures: Array<RawFixture> }) {
  const { fixtures } = props
  dayjs().format()
  dayjs.extend(advancedFormat)

  const [currentFixtureIndex, setCurrentFixtureIndex] = useState(0)

  const [probableVote, setProbableVote] = useState<number | null>(null)
  let probableVoteTeam = probableVote !== null ? teams[probableVote - 1] : null

  return (
    <div className="w-full flex flex-col align-middle overscroll-x-none">
      {currentFixtureIndex < fixtures?.length ? (
        <>
          <div className="h-28">
            <h1 className={`mb-8 text-center`}>
              {probableVote ? (
                <span className="">
                  Selecting {probableVoteTeam?.shortName}...
                </span>
              ) : (
                <span className="animate-pulse">Swipe to predict!</span>
              )}
            </h1>
          </div>
          <VotingCard
            currentFixture={fixtures[currentFixtureIndex]}
            currentFixtureIndex={currentFixtureIndex}
            setCurrentFixtureIndex={setCurrentFixtureIndex}
            setProbableVote={setProbableVote}
          />

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
