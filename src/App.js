import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { AuthProvider } from './context/AuthContext'
import { privateRoutes, publicRoutes } from "./routes/routes"
import LayoutWrapper from "./layouts/LayoutWrapper"

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {publicRoutes.map(({ path, element, layout }, index) => (
            <Route
              key={index}
              path={path}
              element={<LayoutWrapper element={element} layout={layout} />}
            />
          ))}
          {privateRoutes.map(({ path, element, layout }, index) => (
            <Route
              key={index}
              path={path}
              element={<LayoutWrapper element={element} layout={layout} />}
            />
          ))}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
