import VotingGallery from 'src/components/VotingGallery'

export default async function Page({
  searchParams,
}: {
  searchParams: URLSearchParams
}) {
  return (
    <main className="flex flex-col items-center justify-center gap-4">
      {/* @ts-expect-error Server Component */}
      <VotingGallery currentFixtureIndex={searchParams?.fixture ?? 0} />
    </main>
  )
}
