import type { RawFixture } from 'src/lib/types'

export default function VotingStepIndicator({
  currentFixtureIndex,
  fixtures,
}: {
  currentFixtureIndex: number
  fixtures: RawFixture[]
}) {
  console.log('currentFixtureIndex', currentFixtureIndex)

  return (
    <div className="flex flex-row justify-center gap-4">
      {fixtures.map((fixture, index) => {
        return (
          <div
            key={fixture.code}
            className={`w-3 h-3 rounded-full ${
              index == currentFixtureIndex
                ? 'bg-amber-500'
                : index <= currentFixtureIndex
                ? 'bg-slate-500'
                : 'bg-slate-200'
            }`}
          ></div>
        )
      })}
    </div>
  )
}
