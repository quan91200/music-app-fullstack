import React, { useState } from 'react'
import styled from 'styled-components'
import { usePanelResize } from '../context/PanelResizeContext'

const ResizablePanel = ({ children }) => {
  const [panel1Content, panel2Content, panel3Content] = React.Children.toArray(children)

  const {
    panel1Width,
    panel3Width,
    updatePanel1Width,
    updatePanel3Width,
    panel1MinWidth,
    panel1MaxWidth,
    panel3MinWidth,
    panel3MaxWidth,
  } = usePanelResize() // Lấy dữ liệu từ context

  const [isResizingPanel1, setIsResizingPanel1] = useState(false)
  const [isResizingPanel3, setIsResizingPanel3] = useState(false)
  const [startX, setStartX] = useState(0)

  const handleMouseDownPanel1 = (e) => {
    setIsResizingPanel1(true)
    setStartX(e.clientX)
  }

  const handleMouseDownPanel3 = (e) => {
    setIsResizingPanel3(true)
    setStartX(e.clientX)
  }

  const handleMouseMove = (e) => {
    if (isResizingPanel1) {
      let newPanel1Width = panel1Width + (e.clientX - startX)
      if (newPanel1Width < panel1MinWidth) newPanel1Width = panel1MinWidth
      else if (newPanel1Width > panel1MaxWidth) newPanel1Width = panel1MaxWidth

      updatePanel1Width(newPanel1Width)
      setStartX(e.clientX)
    }

    if (isResizingPanel3) {
      let newPanel3Width = panel3Width - (e.clientX - startX) // Đảo chiều thay đổi
      if (newPanel3Width < panel3MinWidth) newPanel3Width = panel3MinWidth
      else if (newPanel3Width > panel3MaxWidth) newPanel3Width = panel3MaxWidth

      updatePanel3Width(newPanel3Width)
      setStartX(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsResizingPanel1(false)
    setIsResizingPanel3(false)
  }

  // Điều kiện hiển thị panel3 khi panel1Width nhỏ hơn 60% chiều rộng
  const showPanel3 = panel1Width < panel1MaxWidth
  const panel2Width = showPanel3
    ? `calc(100% - ${panel1Width}px - ${panel3Width}px)`
    : `calc(100% - ${panel1Width}px)`

  return (
    <Container onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <Panel style={{ width: panel1Width }}>
        {panel1Content}
      </Panel>
      <Resizer onMouseDown={handleMouseDownPanel1} />
      <Panel style={{ width: panel2Width }}>
        {panel2Content}
      </Panel>
      {showPanel3 && (
        <>
          <Resizer onMouseDown={handleMouseDownPanel3} />
          <Panel style={{ width: panel3Width }}>
            {panel3Content}
          </Panel>
        </>
      )}
    </Container>
  )
}

export default ResizablePanel;


const Container = styled.div`
  display: flex;
  height: calc(100vh - 8rem);
  overflow: hidden;
  margin: 0 1rem;
`

const Panel = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.panel};
  border-radius: 1.2rem;
  overflow: auto;
`

const Resizer = styled.div`
  width: 2px;
  margin: 1rem 0.2rem;
  cursor: ew-resize;
  background-color: ${({ theme }) => theme.resizer};
  &:hover, &:active {
    background-color: ${({ theme }) => theme.resizeHover};
  }
`