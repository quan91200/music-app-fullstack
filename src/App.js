import React, { useContext, useMemo } from 'react'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import GlobalStyles from './themes/GlobalStyles'
import { lightTheme, darkTheme } from './themes/Themes'
import { DarkModeContext, DarkModeProvider } from './context/DarkModeContext'
import { AuthProvider } from './context/AuthContext'
import { privateRoutes, publicRoutes } from './routes/routes'
import LayoutWrapper from './layouts/LayoutWrapper'

const App = () => {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
};

const AppContent = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  // Sử dụng useMemo để tối ưu hóa việc render các route
  const routes = useMemo(() => [
    ...publicRoutes,
    ...privateRoutes,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [publicRoutes, privateRoutes])

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <AuthProvider>
        <Router>
          <Routes>
            {routes.map(({ path, element, layout }, index) => (
              <Route
                key={index}
                path={path}
                element={layout ? <LayoutWrapper element={element} layout={layout} /> : element}
              />
            ))}
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App