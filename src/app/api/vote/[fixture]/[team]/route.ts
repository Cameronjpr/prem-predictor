import { auth } from '@clerk/nextjs/app-beta'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { fixture: string; team: string } }
) {
  const { fixture, team } = params
  const { userId } = auth()

  console.log(userId, fixture, team)

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const voteCount = await prisma.vote.findMany({
    where: {
      fixture: Number(fixture),
      picked: Number(team),
    },
  })

  return new Response(JSON.stringify(voteCount?.length), {
    status: 200,
  })
}
