import { fetchAllUniversities } from '@/lib/view/view-all'
import UniversitiesBrowseClient from './universities-browse-client'

export const metadata = {
  title: 'All Universities',
  description: 'Browse all universities',
}

export default async function UniversitiesPage() {
  const universities = await fetchAllUniversities()

  return <UniversitiesBrowseClient universities={universities} />
}
