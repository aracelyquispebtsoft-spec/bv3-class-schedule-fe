import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'

import { Avatar, Button } from '@mui/material'

import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'

import { getMe } from '../services/user.service'
import { removeToken } from '../utils/token'

const menuItems = [
  {
    label: 'Inicio',
    path: '/',
    icon: <HomeOutlinedIcon />,
  },
  {
    label: 'Docentes',
    path: '/teachers',
    icon: <PeopleOutlinedIcon />,
  },
  {
    label: 'Aulas',
    path: '/classrooms',
    icon: <MeetingRoomOutlinedIcon />,
  },
  {
    label: 'Cursos',
    path: '/courses',
    icon: <LayersOutlinedIcon />,
  },
  {
    label: 'Materias',
    path: '/subjects',
    icon: <MenuBookOutlinedIcon />,
  },
  {
    label: 'Horario',
    path: '/schedule',
    icon: <CalendarMonthOutlinedIcon />,
  },
  {
    label: 'Avance',
    path: '/progress',
    icon: <BarChartOutlinedIcon />,
  },
]

function Layout() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  const handleLogout = () => {
    removeToken()
    navigate('/login', { replace: true })
  }

  const userName = user
    ? `${user.firstname} ${user.lastname}`
    : 'Usuario'

  const initials = user
    ? `${user.firstname?.[0] ?? ''}${user.lastname?.[0] ?? ''}`.toUpperCase()
    : 'U'

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white">
        <div className="px-6 py-7">
          <h1 className="text-lg font-bold text-slate-900">
            Horario de clases
          </h1>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 transition ${
                  isActive
                    ? 'bg-slate-100 font-semibold text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 items-center justify-end gap-5 border-b border-slate-200 bg-white px-6">
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-slate-50"
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                fontSize: 14,
              }}
            >
              {initials}
            </Avatar>

            <div>
              <p className="font-medium text-slate-900">{userName}</p>
              <p className="text-sm text-slate-600 underline">Mi perfil</p>
            </div>
          </Link>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<LogoutOutlinedIcon />}
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout