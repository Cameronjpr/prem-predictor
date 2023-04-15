import { auth } from '@clerk/nextjs/app-beta'
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

export async function POST(request: Request) {
  dayjs().format()
  const prisma = new PrismaClient()
  const { userId } = auth()
  console.log(userId)

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const res = await request.json()

  const {
    code,
    homeTeam,
    awayTeam,
    kickoff,
  }: { code: string; homeTeam: string; awayTeam: string; kickoff: string } = res

  const existingFixture = await prisma.fixture.findUnique({
    where: {
      homeAwayUnique: {
        home: Number(homeTeam),
        away: Number(awayTeam),
      },
    },
  })

  if (existingFixture !== null) {
    return new Response('Fixture already exists', { status: 400 })
  }

  const newFixture = await prisma.fixture.create({
    data: {
      code: Number(code),
      home: Number(homeTeam),
      away: Number(awayTeam),
      kickoffTime: dayjs(kickoff).toDate(),
    },
  })

  console.log(newFixture)
  return new Response(JSON.stringify(newFixture), {
    status: 201,
  })
}
