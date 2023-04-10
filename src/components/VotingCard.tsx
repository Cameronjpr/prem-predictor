'use client'

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { teams } from 'src/lib/teams'
import { RawFixture, Team } from 'src/lib/types'

type VotingCardProps = {
  currentFixture: RawFixture
  currentFixtureIndex: number
  children: React.ReactNode
  // setCurrentFixtureIndex: (index: number) => void
  // setProbableVote: (vote: number | null) => void
}

export default function VotingCard(props: VotingCardProps) {
  const { currentFixture, currentFixtureIndex, children } = props

  const router = useRouter()
  dayjs().format()
  dayjs.extend(advancedFormat)

  const [cardActive, setCardActive] = useState(false)
  const [originX, setOriginX] = useState(0)
  const [deltaX, setDeltaX] = useState(0)
  const [probableVote, setProbableVote] = useState<number | null>(null)

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
  }, [deltaX, currentFixture])

  async function handleVote(team: number) {
    const res = await fetch('/api/votes', {
      method: 'POST',
      body: JSON.stringify({
        fixture: currentFixture.id,
        picked: team,
        count: 1,
      }),
    })

    if (res.status === 200) {
      // setCurrentFixtureIndex(currentFixtureIndex + 1)
      console.log('Voted for ' + team)
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

      {children}
    </article>
  )
}
