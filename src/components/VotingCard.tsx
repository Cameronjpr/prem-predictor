'use client'

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { teams } from 'src/lib/teams'
import { RawFixture, SlimFixture } from 'src/lib/types'
import Spinner from './Spinner'
import { Fixture } from '@prisma/client'

type VotingCardProps = {
  fixture: SlimFixture
  currentFixtureIndex: number
  children: React.ReactNode
}

export default function VotingCard(props: VotingCardProps) {
  const { fixture, currentFixtureIndex, children } = props

  const router = useRouter()
  dayjs().format()
  dayjs.extend(advancedFormat)

  const [cardActive, setCardActive] = useState(false)
  const [originX, setOriginX] = useState(0)
  const [deltaX, setDeltaX] = useState(0)
  const [probableVote, setProbableVote] = useState<number | null>(null)
  const [voteLoading, setVoteLoading] = useState(false)

  let homeTeam = teams[fixture.home - 1].shortName
  let awayTeam = teams[fixture.away - 1].shortName

  useEffect(() => {
    if (deltaX < 0) {
      setProbableVote(fixture.home)
    } else if (deltaX > 0) {
      setProbableVote(fixture.away)
    } else {
      setProbableVote(null)
    }
  }, [deltaX, fixture])

  async function handleVote(team: number) {
    setVoteLoading(true)
    router.prefetch('/play?fixture=' + (Number(currentFixtureIndex) + 1))

    const res = await fetch('/api/votes', {
      method: 'POST',
      body: JSON.stringify({
        fixture: fixture.id,
        picked: team,
      }),
    })

    if (res.ok) {
      console.log('Voted for ' + team)
      router.push('/play?fixture=' + (Number(currentFixtureIndex) + 1))
    }
  }

  function handleActivate(e: React.MouseEvent) {
    setCardActive(true)
    setOriginX(e.clientX)
  }

  function handleDeactivate() {
    setCardActive(false)

    if (deltaX < -100) {
      handleVote(fixture.home)
    }

    if (deltaX > 100) {
      handleVote(fixture.away)
    }

    setDeltaX(0)
  }

  function handleTouchActivate(e: React.TouchEvent) {
    setCardActive(true)
    setOriginX(e.touches[0].clientX)
  }

  return (
    <article
      className={`w-full md:w-96 h-96 border-2 z-10 text-center row-[1] col-[1] bg-white shadow-sm p-4 rounded-lg flex flex-col justify-between place-self-center align-middle select-none transform-gpu`}
      onTouchStart={(e) => handleTouchActivate(e)}
      onTouchMove={(e) =>
        cardActive && setDeltaX(e.touches[0].clientX - originX)
      }
      onTouchEnd={() => handleDeactivate()}
      onMouseDown={(e) => handleActivate(e)}
      onMouseUp={() => handleDeactivate()}
      onMouseMove={(e) => cardActive && setDeltaX(e.clientX - originX)}
      style={{
        transform: `rotate(${deltaX / 50}deg) translateX(${deltaX}px)`,
        transition: cardActive ? 'none' : 'transform 0.3s ease',
        boxShadow: cardActive ? '0 0 0.5rem 0.5rem rgba(0, 0, 0, 0.1)' : 'none',
        borderColor:
          probableVote === fixture.home
            ? teams[fixture.home - 1].primaryColor
            : probableVote === fixture.away
            ? teams[fixture.away - 1].primaryColor
            : 'white',
      }}
    >
      {voteLoading ? (
        <div className="w-full h-full flex flex-col gap-4 justify-center items-center opacity-25">
          <Spinner />
        </div>
      ) : (
        <>
          <time className="p-4 text-slate-600 ">
            {dayjs(fixture.kickoffTime).format('dddd Do MMMM, h:mma')}
          </time>

          <section className="flex flex-grow flex-row text-lg">
            <div className="flex-grow">
              <h3 className="font-semibold">{homeTeam}</h3>
            </div>
            <span className="text-slate-400">vs</span>
            <div className="flex-grow">
              <h3 className="font-semibold">{awayTeam}</h3>
            </div>
          </section>

          {children}
        </>
      )}
    </article>
  )
}
