import { auth } from '@clerk/nextjs/app-beta'
import { PrismaClient } from '@prisma/client'

export async function POST(request: Request) {
  const prisma = new PrismaClient()
  const { userId } = auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const res = await request.json()

  const { picked, fixture }: { picked: number; fixture: number } = res

  const player = await prisma.player.findUnique({
    where: {
      uuid: userId,
    },
  })

  if (player === null) {
    const newPlayer = await prisma.player.create({
      data: {
        uuid: userId,
        username: 'Anonymous',
      },
    })
  }

  const existingVote = await prisma.vote.findUnique({
    where: {
      playerFixtureUnique: {
        playerId: userId,
        fixture: fixture,
      },
    },
  })

  if (existingVote !== null) {
    console.log('existing vote', existingVote)
    const updatedVote = await prisma.vote.update({
      where: {
        playerFixtureUnique: {
          playerId: userId,
          fixture: fixture,
        },
      },
      data: {
        picked: picked,
      },
    })
    return new Response(JSON.stringify(updatedVote), {
      status: 201,
    })
  } else {
    console.log('new vote')
    const newVote = await prisma.vote.create({
      data: {
        playerId: userId,
        picked: picked,
        fixture: fixture,
      },
    })

    return new Response(JSON.stringify(newVote), {
      status: 201,
    })
  }
}
