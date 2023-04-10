import { auth } from '@clerk/nextjs/app-beta'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { fixture: number } }
) {
  const { fixture } = params
  const { userId } = auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const votes = await prisma.vote.findMany({
    where: {
      fixture: Number(fixture),
    },
  })

  return new Response(JSON.stringify(votes?.length), {
    status: 200,
  })
}
