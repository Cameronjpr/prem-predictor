import VotingGallery from 'src/components/VotingGallery'
import { getThisWeeksGames } from 'src/lib/utils'

export default async function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-4">
      {/* @ts-expect-error Server Component */}
      <VotingGallery />
    </main>
  )
}
