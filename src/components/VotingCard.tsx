'use client'

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { teams } from 'src/lib/teams'
import { RawFixture, Team } from 'src/lib/types'

type VotingCardProps = {
  currentFixture: RawFixture
  currentFixtureIndex: number

  setCurrentFixtureIndex: (index: number) => void
  setProbableVote: (vote: number | null) => void
}

export default function VotingCard(props: VotingCardProps) {
  const {
    currentFixture,
    currentFixtureIndex,
    setCurrentFixtureIndex,
    setProbableVote,
  } = props

  const router = useRouter()
  dayjs().format()
  dayjs.extend(advancedFormat)

  const [cardActive, setCardActive] = useState(false)
  const [originX, setOriginX] = useState(0)
  let vote: number | null = null
  const [deltaX, setDeltaX] = useState(0)

  let homeTeam = teams[currentFixture.team_h - 1].shortName
  let awayTeam = teams[currentFixture.team_a - 1].shortName

  useEffect(() => {
    if (deltaX < 0) {
      setProbableVote(currentFixture.team_h)
    } else if (deltaX > 0) {
      setProbableVote(currentFixture.team_a)
    } else {
      setProbableVote(null)
    }
  }, [deltaX, currentFixture, setProbableVote])

  console.log(currentFixture)

  async function handleVote(team: number) {
    const res = await fetch('/api/vote', {
      method: 'POST',
      body: JSON.stringify({
        fixture: currentFixture.id,
        picked: team,
        count: 1,
      }),
    })

    if (res.status === 200) {
      setCurrentFixtureIndex(currentFixtureIndex + 1)
    }
  }

  function handleActivate(e: React.MouseEvent) {
    setCardActive(true)
    setOriginX(e.clientX)
  }

  function handleDeactivate() {
    setCardActive(false)

    if (deltaX < -100) {
      handleVote(currentFixture.team_h)
    }

    if (deltaX > 100) {
      handleVote(currentFixture.team_a)
    }

    setDeltaX(0)
  }

  function handleTouchActivate(e: React.TouchEvent) {
    setCardActive(true)
    setOriginX(e.touches[0].clientX)
  }

  return (
    <article
      className="w-full md:w-80 h-96 border-2 z-10 text-center  bg-white shadow-xl p-4 rounded-lg flex flex-col justify-between place-self-center align-middle select-none transform-gpu"
      onTouchStart={(e) => handleTouchActivate(e)}
      onTouchMove={(e) =>
        cardActive && setDeltaX(e.touches[0].clientX - originX)
      }
      onTouchEnd={() => handleDeactivate()}
      onMouseDown={(e) => handleActivate(e)}
      onMouseUp={() => handleDeactivate()}
      onMouseMove={(e) => cardActive && setDeltaX(e.clientX - originX)}
      style={{
        transform: `rotate(${deltaX / 50}deg) translateX(${deltaX}px) scale(${
          cardActive ? 1.02 : 1
        })`,
        transition: cardActive ? 'none' : 'transform 0.3s ease',
      }}
    >
      <time className="p-4 text-slate-600 ">
        {dayjs(currentFixture.kickoff_time).format('dddd Do MMMM, h:mma')}
      </time>
      <section className="flex flex-grow flex-row text-lg">
        <div className="flex-grow">
          <h2 className="font-semibold">{homeTeam}</h2>
        </div>
        <span className="text-slate-400">vs</span>
        <div className="flex-grow">
          <h2 className="font-semibold">{awayTeam}</h2>
        </div>
      </section>

      <VotingSplit
        currentFixture={currentFixture}
        homeColor={teams[currentFixture.team_h - 1].primaryColor}
        awayColor={teams[currentFixture.team_a - 1].primaryColor}
      />
    </article>
  )
}

type VotingSplitProps = {
  currentFixture: RawFixture
  homeColor: string
  awayColor: string
}

function VotingSplit(props: VotingSplitProps) {
  const { currentFixture, homeColor, awayColor } = props

  const [homePercentage, setHomePercentage] = useState<number | null>(null)
  const [awayPercentage, setAwayPercentage] = useState<number | null>(null)

  useEffect(() => {
    getVotes(
      currentFixture.id,
      currentFixture.team_h,
      currentFixture.team_a
    ).then((data) => {
      console.log(data)
      setHomePercentage(data.homePercentage)
      setAwayPercentage(data.awayPercentage)
    })
  }, [currentFixture])

  return (
    <section className="flex flex-col text-lg gap-2">
      <h2>Prediction split</h2>
      <div className="flex flex-row justify-between gap-0.5 text-xl">
        <div
          className="p-2 overflow-hidden rounded-l-md"
          style={{
            backgroundColor: `${homeColor}`,
            width: `${homePercentage ?? 50}%`,
          }}
        >
          <span className="invert">{homePercentage}%</span>
        </div>

        <div
          className="p-2 overflow-hidden rounded-r-md"
          style={{
            backgroundColor: `${awayColor}`,
            width: `${awayPercentage ?? 50}%`,
          }}
        >
          <span className="invert">{awayPercentage}%</span>
        </div>
      </div>
    </section>
  )
}

async function getVotes(
  fixtureId: number,
  homeTeam: number,
  awayTeam: number
): Promise<{
  homePercentage: number
  awayPercentage: number
}> {
  const homeVotes = await fetch(`/api/vote/${fixtureId}/${homeTeam}`)
  const awayVotes = await fetch(`/api/vote/${fixtureId}/${awayTeam}`)

  const homeData = await homeVotes.json()
  const awayData = await awayVotes.json()

  const totalVotes = homeData + awayData

  const homePercentage = Math.round((homeData / totalVotes) * 100)
  const awayPercentage = Math.round((awayData / totalVotes) * 100)

  return {
    homePercentage,
    awayPercentage,
  }
}
