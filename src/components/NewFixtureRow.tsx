'use client'

import { useState } from 'react'
import { teams } from 'src/lib/teams'
import { RawFixture } from 'src/lib/types'
import { useRouter } from 'next/navigation'

type NewFixtureRowProps = {
  fixture: RawFixture
}

export default function NewFixtureRow(props: NewFixtureRowProps) {
  const { fixture } = props
  const router = useRouter()

  const home = teams[fixture.team_h - 1]
  const away = teams[fixture.team_a - 1]
  const kickoffTime = new Date(fixture.kickoff_time)

  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  async function createFixture(data: {
    code: number
    homeTeam: number
    awayTeam: number
    kickoff: string
  }) {
    setIsLoading(true)
    const res = await fetch('/api/fixture', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    console.log(res)

    if (res.ok) {
      router.refresh()
    }

    setIsLoading(false)

    return res
  }

  return (
    <>
      {!isAdded ? (
        <div
          key={fixture.code}
          className="flex flex-row border-b-2 p-3 items-center justify-between"
        >
          <span>{home.shortName}</span>
          <span>{away.shortName}</span>
          <span>{kickoffTime.toLocaleString()}</span>
          <button
            type="submit"
            className="p-2 bg-amber-300 rounded-md w-48"
            onClick={() =>
              createFixture({
                code: fixture.code,
                homeTeam: fixture.team_h,
                awayTeam: fixture.team_a,
                kickoff: fixture.kickoff_time,
              })
            }
          >
            {isLoading ? 'Loading...' : 'Add fixture'}
          </button>
        </div>
      ) : null}
    </>
  )
}
