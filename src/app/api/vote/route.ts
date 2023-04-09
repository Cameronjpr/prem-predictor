import { auth } from '@clerk/nextjs/app-beta'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const res = await request.json()

  const { picked, count, fixture } = res

  console.log(userId, picked, count, fixture)
  const newVote = await prisma.vote.create({
    data: {
      playerId: userId,
      picked: picked,
      count: count,
      fixture: fixture,
    },
  })

  console.log(newVote)

  return new Response(JSON.stringify(newVote), {
    status: 200,
  })
}
