import CarList from '@/components/CarList'

export default function AutoPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary-900">Auto Usate</h1>
        <p className="text-lg text-gray-600">
          Scopri il nostro parco auto dell'usato in Sardegna
        </p>
      </div>
      <CarList initialFilters={searchParams} />
    </div>
  )
}

