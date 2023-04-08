export type RawFixture = {
  code: number
  event: number
  finished: boolean
  finished_provisional: boolean
  id: number
  kickoff_time: string
  pulse_id: number
  started: boolean
  stats: any
  team_a: number
  team_a_difficulty: number
  team_a_score: number | null
  team_h: number
  team_h_difficulty: number
  team_h_score: number | null
}

export type FormattedFixture = {
  code: number
  event: number
  finished: boolean
  finished_provisional: boolean
  id: number
  kickoff_time: string
  pulse_id: number
  started: boolean
  stats: any
}

export type Team = {
  id: number
  name: string
  shortName: string
  primaryColor: string
  secondaryColor: string | null
}

export type Selection = {
  created_at: string
  id: number
  fixture: number
  gameweek: number
  selection: number
  selector: string
}
