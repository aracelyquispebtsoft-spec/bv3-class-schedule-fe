function UserCard({ user }) {
  return (
    <div className="card">
      <h2>
        {user.firstname} {user.lastname}
      </h2>
      <p>{user.email}</p>
    </div>
  )
}

export default UserCard
