import Hero from './hero'
import HowItWorks from './how-it-works'
import Partnership from './how-it-works/partnership'
import SuccessStories from './success-stories'

export default function Homepage() {
  return (
    <div>
      <Hero />
      <Partnership />
      <HowItWorks />
      <SuccessStories />
    </div>
  )
}
