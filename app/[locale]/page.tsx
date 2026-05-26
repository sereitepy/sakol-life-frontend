import { Suspense } from 'react'
import { PostAuthHandler } from '../components/post-auth-handler'
import Homepage from '../components/hompage'

export default function Home() {
  return (
    <div>
      <Suspense fallback={null}>
        <PostAuthHandler />
      </Suspense>
      <Homepage />
    </div>
  )
}
