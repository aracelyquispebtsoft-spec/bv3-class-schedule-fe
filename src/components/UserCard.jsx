function UserCard({ user }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-xl font-semibold text-slate-900">
        {user.firstname} {user.lastname}
      </h2>
      <p>{user.email}</p>
    </div>
  )
}

export default UserCard
