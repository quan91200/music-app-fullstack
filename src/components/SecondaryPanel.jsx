import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const SecondaryPanel = ({ width, onResize }) => {

    const panelRef = useRef(null)

    useEffect(() => {
        const handleMouseMove = (e) => onResize(e)
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        const handleMouseDown = (e) => {
            e.preventDefault()
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        const resizeHandle = panelRef.current.querySelector('.resizeHandle')
        resizeHandle.addEventListener('mousedown', handleMouseDown)

        return () => {
            resizeHandle.removeEventListener('mousedown', handleMouseDown)
        }
    }, [onResize])

    return (
        <PanelWrapper ref={panelRef} width={width}>
            <ResizeHandle className="resizeHandle" />
            <PanelContent>
                <h2>Secondary Panel</h2>
                <p>Content goes here...</p>
            </PanelContent>
        </PanelWrapper>
    )
}

export default SecondaryPanel

const PanelWrapper = styled.div`
  width: ${({ width }) => width}%;
  min-width: 15%;
  max-width: 30%;
  height: 100%;
  background: #f0f0f0;
  border-left: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  position: relative;
`

const PanelContent = styled.div`
  padding: 16px;
  overflow: auto;
`

const ResizeHandle = styled.div`
  width: 5px;
  cursor: col-resize;
  background-color: #ddd;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
`