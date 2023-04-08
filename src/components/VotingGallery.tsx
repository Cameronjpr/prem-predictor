'use client'

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'

import { teams } from 'src/lib/teams'
import { RawFixture } from 'src/lib/types'

export default function VotingGallery(props: { fixture: RawFixture }) {
  const { fixture } = props
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

  console.log(probableVote)
  const { isLoaded, userId, sessionId, getToken } = useAuth()
  console.log(isLoaded, userId, sessionId, getToken)

  useEffect(() => {
    if (deltaX < 0) {
      setProbableVote(fixture.team_h)
    } else if (deltaX > 0) {
      setProbableVote(fixture.team_a)
    } else {
      setProbableVote(null)
    }
  }, [deltaX, fixture])

  function handleVote() {
    console.log('handle vote', vote)
    if (vote !== null) {
      console.log('voted for', vote)
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
      console.log('no vote')
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
        className="w-72 border-2 z-10 text-center h-96 bg-slate-100 shadow-xl rounded-lg flex flex-col justify-between align-middle select-none transform-gpu"
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
          </div>
          <div className="flex-grow">
            <h2>{awayTeam}</h2>
          </div>
        </section>
      </article>
    </div>
  )
}
