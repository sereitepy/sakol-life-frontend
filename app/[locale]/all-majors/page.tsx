import { fetchAllMajors } from '@/lib/view/view-all'
import MajorsBrowseClient from './majors-browse-client'

export const metadata = {
  title: 'All Majors',
  description: 'Browse all available majors',
}

export default async function MajorsPage() {
  const majors = await fetchAllMajors()
  return <MajorsBrowseClient majors={majors} />
}
