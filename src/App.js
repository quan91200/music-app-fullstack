import React, { useContext } from 'react'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import GlobalStyles from './themes/GlobalStyles';
import { lightTheme, darkTheme } from './themes/Themes'
import { DarkModeContext, DarkModeProvider } from './context/DarkModeContext'
import { AuthProvider } from './context/AuthContext'
import { privateRoutes, publicRoutes } from "./routes/routes"
import LayoutWrapper from "./layouts/LayoutWrapper"

const App = () => {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
};

const AppContent = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <AuthProvider>
        <Router>
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
    </ThemeProvider>
  )
}

export default App