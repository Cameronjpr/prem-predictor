import { auth } from '@clerk/nextjs/app-beta'
import { PrismaClient } from '@prisma/client'

export async function POST(request: Request) {
  const prisma = new PrismaClient()
  const { userId } = auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const res = await request.json()

  const { picked, count, fixture } = res

  const newVote = await prisma.vote.create({
    data: {
      playerId: userId,
      picked: picked,
      count: count,
      fixture: fixture,
    },
  })

  return new Response(JSON.stringify(newVote), {
    status: 200,
  })
}
