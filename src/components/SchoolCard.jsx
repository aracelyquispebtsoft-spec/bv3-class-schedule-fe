function SchoolCard({ school }) {
  if (!school) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p>Todavia no registraste tu colegio.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-xl font-semibold text-slate-900">{school.name}</h2>
    </div>
  )
}

export default SchoolCard
