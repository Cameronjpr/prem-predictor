import type { RawFixture } from 'src/lib/types'
import { useState, useEffect } from 'react'
import { PrismaClient } from '@prisma/client'
import { teams } from 'src/lib/teams'

type VotingSplitProps = {
  currentFixture: RawFixture
}

async function getVotes(fixture: RawFixture) {
  const prisma = new PrismaClient()
  const votes = await prisma.vote.findMany({
    where: {
      fixture: fixture.code,
    },
  })

  const grouped = votes.reduce(
    (acc, vote) => {
      return {
        ...acc,
        [vote.picked]: acc[vote.picked] + 1,
      }
    },
    { [fixture.team_h]: 0, [fixture.team_a]: 0 }
  )

  return grouped
}

export default async function VotingSplit(props: VotingSplitProps) {
  const { currentFixture } = props

  const votes = await getVotes(currentFixture)

  console.log(votes)

  const totalVotes = votes[currentFixture.team_h] + votes[currentFixture.team_a]
  const homePercentage = Math.round(
    (votes[currentFixture.team_h] / totalVotes) * 100
  )
  const awayPercentage = Math.round(
    (votes[currentFixture.team_a] / totalVotes) * 100
  )

  const homeColor = teams[currentFixture.team_h - 1].primaryColor
  const awayColor = teams[currentFixture.team_a - 1].primaryColor

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
