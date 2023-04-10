import prisma from 'src/lib/db'

async function getData() {
  const players = await prisma.player.findMany()

  return players
}

export default async function Page() {
  const players = await getData()

  console.log(players)

  return (
    <main className="flex flex-col items-center justify-between gap-4">
      <h1>Leaderboard</h1>
      <section className="w-full flex flex-col items-left justify-between">
        {players.map((player, idx) => {
          return (
            <div key={idx} className="flex flex-row justify-between">
              <span>{player.username}</span>
              <span>points: 0</span>
            </div>
          )
        })}
      </section>
    </main>
  )
}
