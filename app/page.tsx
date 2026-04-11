import Homepage from './components/hompage'
import { PostAuthHandler } from './components/post-auth-handler'

export default function Home() {
  return (
    <div>
      <PostAuthHandler />
      <Homepage />
    </div>
  )
}
