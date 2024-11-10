import Home from '../pages/Home'
import Profile from '../pages/Profile'
import Login from '../pages/Login'

import DefaultLayout from '../layouts/DefaultLayout'
import OnlyHeader from '../layouts/OnlyHeader'

export const publicRoutes = [
    { path: '/', element: <Home />, layout: DefaultLayout },
    { path: '/login', element: <Login /> }
]

export const privateRoutes = [
    { path: '/profile', element: <Profile />, layout: OnlyHeader },
    { path: '/', element: <Home />, layout: DefaultLayout }
]