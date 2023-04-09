'use client'

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'

import { teams } from 'src/lib/teams'
import { RawFixture } from 'src/lib/types'
import { useRouter } from 'next/navigation'

export default function VotingGallery(props: { fixture: RawFixture }) {
  const { fixture } = props
  const router = useRouter()
  dayjs().format()
  dayjs.extend(advancedFormat)

  let homeTeam = teams[fixture.team_h - 1].shortName
  let awayTeam = teams[fixture.team_a - 1].shortName

  const [cardActive, setCardActive] = useState(false)
  const [originX, setOriginX] = useState(0)
  let vote: number | null = null
  const [probableVote, setProbableVote] = useState<number | null>(null)
  const [deltaX, setDeltaX] = useState(0)
  let probableVoteTeam = probableVote !== null ? teams[probableVote - 1] : null

  const { isLoaded, userId, sessionId, getToken } = useAuth()

  const [votes, setVotes] = useState({ homeVotes: 0, awayVotes: 0 })

  useEffect(() => {
    async function getVotes() {
      const homeVotesRes = await fetch(
        `/api/vote/${fixture.id}/${fixture.team_h}`
      )
      const awayVotesRes = await fetch(
        `/api/vote/${fixture.id}/${fixture.team_a}`
      )

      const homeVotes = await homeVotesRes.json()
      const awayVotes = await awayVotesRes.json()

      setVotes({ homeVotes, awayVotes })
    }

    getVotes()
  }, [fixture])

  useEffect(() => {
    if (deltaX < 0) {
      setProbableVote(fixture.team_h)
    } else if (deltaX > 0) {
      setProbableVote(fixture.team_a)
    } else {
      setProbableVote(null)
    }
  }, [deltaX, fixture])

  async function handleVote() {
    if (vote !== null) {
      const res = await fetch('/api/vote', {
        method: 'POST',
        body: JSON.stringify({
          fixture: fixture.id,
          picked: vote,
          count: 1,
        }),
      })

      router.refresh()
    }
  }

  function handleActivate(e: React.MouseEvent) {
    setCardActive(true)
    setOriginX(e.clientX)
  }

  function handleDeactivate() {
    setCardActive(false)

    if (deltaX < -100) {
      vote = fixture.team_h
    } else if (deltaX > 100) {
      vote = fixture.team_a
    } else {
      vote = null
    }

    handleVote()
    setDeltaX(0)
  }

  function handleTouchActivate(e: React.TouchEvent) {
    setCardActive(true)
    setOriginX(e.touches[0].clientX)
  }

  return (
    <div className="flex flex-col align-middle">
      <h1 className={`mb-8 text-center`}>
        {probableVote ? (
          <span className="">Voting {probableVoteTeam?.shortName}</span>
        ) : (
          <span className="animate-pulse">Swipe to vote!</span>
        )}
      </h1>

      <article
        className="w-72 border-2 z-10 text-center h-96 bg-white shadow-xl rounded-lg flex flex-col justify-between align-middle select-none transform-gpu"
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
          borderColor: probableVoteTeam?.primaryColor,
          transition: cardActive ? 'none' : 'transform 0.3s ease',
        }}
      >
        <time className="p-4 text-slate-600 ">
          {dayjs(fixture.kickoff_time).format('dddd Do MMMM, h:mma')}
        </time>
        <section className="flex flex-grow flex-row text-lg">
          <div className="flex-grow">
            <h2>{homeTeam}</h2>
            <span>picked {votes?.homeVotes} times</span>
          </div>
          <span className="text-slate-400">vs</span>
          <div className="flex-grow">
            <h2>{awayTeam}</h2>
            <span>picked {votes?.awayVotes} times</span>
          </div>
        </section>
      </article>
    </div>
  )
}
