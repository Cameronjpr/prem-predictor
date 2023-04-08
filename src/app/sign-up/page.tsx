import { SignUp } from '@clerk/nextjs/app-beta'

export default function Page() {
  return (
    <div className="mx-auto py-10 flex align-middle justify-center">
      <SignUp signInUrl="/sign-in" />
    </div>
  )
}
