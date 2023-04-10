import dayjs from 'dayjs'
import type { RawFixture } from './types'
import { Fixture } from '@prisma/client'
dayjs.locale('en-gb')
dayjs().format()

export function getLowerTimeBound() {
  return dayjs().endOf('week').subtract(2, 'day').add(12, 'hour').format()
}

export function getUpperTimeBound() {
  return dayjs().endOf('week').add(5, 'day').add(12, 'hour').format()
}

export function getThisWeeksGames(
  fixtures: Array<Pick<Fixture, 'kickoffTime' | 'home' | 'away' | 'id'>>
) {
  if (!fixtures?.length) return []

  return fixtures
    ?.filter((fixture) => {
      return (
        dayjs(fixture.kickoffTime).isAfter(getLowerTimeBound()) &&
        dayjs(fixture.kickoffTime).isBefore(getUpperTimeBound())
      )
    })
    .map((f) => ({
      ...f,
      kickoffTime: f.kickoffTime.toLocaleDateString(),
    }))
}

export function getThisWeeksExpectedGames(fixtures: Array<RawFixture>) {
  if (!fixtures?.length) return []

  return fixtures?.filter((fixture) => {
    return (
      dayjs(fixture.kickoff_time).isAfter(getLowerTimeBound()) &&
      dayjs(fixture.kickoff_time).isBefore(getUpperTimeBound())
    )
  })
}
