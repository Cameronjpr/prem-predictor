import { Fixture } from '@prisma/client'
import Link from 'next/link'
import type { SlimFixture } from 'src/lib/types'

export default function VotingStepIndicator({
  currentFixtureIndex,
  fixtures,
}: {
  currentFixtureIndex: number
  fixtures: SlimFixture[]
}) {
  console.log('currentFixtureIndex', currentFixtureIndex)

  return (
    <div className="flex flex-row justify-center gap-4">
      {fixtures.map((fixture, index) => {
        return (
          <Link key={fixture.id} href={`/play?fixture=${index + 1}`}>
            <div
              className={`w-3 h-3 rounded-full transition-all ${
                index + 1 == currentFixtureIndex
                  ? 'bg-amber-500'
                  : index < currentFixtureIndex
                  ? 'bg-slate-500'
                  : 'bg-slate-200'
              }`}
            >
              <span className="sr-only">Go to fixture {index + 1}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
