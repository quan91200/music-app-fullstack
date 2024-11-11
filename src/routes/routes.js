import Home from '../pages/Home'
import Profile from '../pages/Profile'
import Login from '../pages/Login'

import DefaultLayout from '../layouts/DefaultLayout'
import Contact from '../pages/Contact'
import About from '../pages/About'

export const publicRoutes = [
    { path: '/', element: <Home />, layout: DefaultLayout },
    { path: '/login', element: <Login /> },
    { path: '/contact', element: <Contact />, layout: DefaultLayout },
    { path: '/about', element: <About />, layout: DefaultLayout }
]

export const privateRoutes = [
    { path: '/profile', element: <Profile /> },
    { path: '/', element: <Home />, layout: DefaultLayout },
    { path: '/contact', element: <Contact />, layout: DefaultLayout },
    { path: '/about', element: <About />, layout: DefaultLayout }
]