'use client'

import { teams } from 'src/lib/teams'
import { useForm } from 'react-hook-form'

async function onSubmit(data: {
  homeTeam: number
  awayTeam: number
  kickoff: string
}) {
  const res = await fetch('/api/fixtures', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (res.ok) {
    console.log('Fixture added')
  }

  return res
}

export default function NewFixtureForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    homeTeam: number
    awayTeam: number
    kickoff: string
  }>()

  return (
    <section className="w-full flex flex-col items-left justify-between">
      <h2>Add a new fixture</h2>
      <form
        className="py-4 flex flex-col gap-4 max-w-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="flex flex-row gap-4">
          <label htmlFor="homeTeam">
            Home team
            <select id="homeTeam" {...register('homeTeam', { required: true })}>
              {teams.map((team, idx) => {
                return (
                  <option key={idx} value={team.id}>
                    {team?.name}
                  </option>
                )
              })}
            </select>
            {errors.homeTeam && <span>This field is required</span>}
          </label>
          <label htmlFor="awayTeam">
            Away team
            <select id="awayTeam" {...register('awayTeam', { required: true })}>
              {teams.map((team, idx) => {
                return (
                  <option key={idx} value={team.id}>
                    {team?.name}
                  </option>
                )
              })}
            </select>
            {errors.awayTeam && <span>This field is required</span>}
          </label>
        </fieldset>
        <label htmlFor="kickoff">
          Date
          <input
            type="datetime-local"
            id="kickoff"
            {...register('kickoff', { required: true })}
          />
          {errors.kickoff && <span>This field is required</span>}
        </label>
        <button className="p-2 bg-amber-300 rounded-md w-48" type="submit">
          Add fixture
        </button>
      </form>
    </section>
  )
}
