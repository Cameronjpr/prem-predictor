import { auth } from '@clerk/nextjs/app-beta'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { fixture: number; team: number } }
) {
  const { fixture, team } = params
  const { userId } = auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const voteCount = await prisma.vote.findMany({
    where: {
      AND: {
        fixture: Number(fixture),
        picked: Number(fixture),
      },
    },
  })

  return new Response(JSON.stringify(voteCount?.length), {
    status: 200,
  })
}
