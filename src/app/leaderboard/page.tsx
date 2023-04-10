import prisma from 'src/lib/db'

async function getData() {
  const votes = await prisma.vote.findMany({
    where: {},
  })
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <h1>Leaderboard</h1>
    </main>
  )
}
