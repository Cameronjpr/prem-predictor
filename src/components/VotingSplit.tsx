import type { SlimFixture } from 'src/lib/types'
import { useState, useEffect } from 'react'
import { Fixture, PrismaClient } from '@prisma/client'
import { teams } from 'src/lib/teams'

type VotingSplitProps = {
  currentFixture: SlimFixture
}

async function getVotes(fixture: SlimFixture) {
  const prisma = new PrismaClient()
  const votes = await prisma.vote.findMany({
    where: {
      fixtureId: fixture.id,
    },
  })

  const grouped = votes.reduce(
    (acc, vote) => {
      return {
        ...acc,
        [vote.picked]: acc[vote.picked] + 1,
      }
    },
    { [fixture.home]: 0, [fixture.away]: 0 }
  )

  return grouped
}

export default async function VotingSplit(props: VotingSplitProps) {
  const { currentFixture } = props

  const votes = await getVotes(currentFixture)

  console.log(votes)

  const totalVotes = votes[currentFixture.home] + votes[currentFixture.away]
  const homePercentage = Math.round(
    (votes[currentFixture.home] / totalVotes) * 100
  )
  const awayPercentage = Math.round(
    (votes[currentFixture.away] / totalVotes) * 100
  )

  const homeColor = teams[currentFixture.home - 1].primaryColor
  const awayColor = teams[currentFixture.away - 1].primaryColor

  if (totalVotes === 0) return null

  return (
    <section className="flex flex-col text-lg gap-2">
      <h2>Prediction split</h2>
      <div className="flex flex-row justify-between gap-0.5 text-xl rounded-md overflow-hidden transition-all">
        {homePercentage !== 0 ? (
          <div
            className="p-2 overflow-hidden"
            style={{
              backgroundColor: `${homeColor}`,
              width: `${homePercentage ?? 50}%`,
            }}
          >
            <span className="invert">{homePercentage}%</span>
          </div>
        ) : null}

        {awayPercentage !== 0 ? (
          <div
            className="p-2 overflow-hidden"
            style={{
              backgroundColor: `${awayColor}`,
              width: `${awayPercentage ?? 50}%`,
            }}
          >
            <span className="invert">{awayPercentage}%</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}
