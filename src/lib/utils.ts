import dayjs from 'dayjs'
import type { RawFixture } from './types'
dayjs.locale('en-gb')
dayjs().format()

export function getLowerTimeBound() {
  return dayjs().endOf('week').subtract(2, 'day').add(12, 'hour').format()
}

export function getUpperTimeBound() {
  return dayjs().endOf('week').add(5, 'day').add(12, 'hour').format()
}

export function getThisWeeksGames(fixtures: Array<RawFixture>) {
  if (!fixtures?.length) return []

  return fixtures?.filter((fixture: RawFixture) => {
    return (
      dayjs(fixture.kickoff_time).isAfter(getLowerTimeBound()) &&
      dayjs(fixture.kickoff_time).isBefore(getUpperTimeBound())
    )
  })
}
