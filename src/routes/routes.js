import Home from '../pages/Home'
import Profile from '../pages/Profile'
import Login from '../pages/Login'

import Contact from '../pages/Contact'
import About from '../pages/About'

export const publicRoutes = [
    { path: '/', element: <Home />, layout: 'default' },
    { path: '/login', element: <Login /> },
    { path: '/contact', element: <Contact />, layout: 'default' },
    { path: '/about', element: <About />, layout: 'default' }
]

export const privateRoutes = [
    { path: '/profile', element: <Profile />, layout: 'default' },
    { path: '/', element: <Home />, layout: 'default' },
    { path: '/contact', element: <Contact />, layout: 'default' },
    { path: '/about', element: <About />, layout: 'default' }
]