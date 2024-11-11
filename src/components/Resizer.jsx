import React from 'react';
import styled from 'styled-components';

const Resizer = ({ direction, onMouseDown }) => {
      return (
            <ResizerDiv direction={direction} onMouseDown={onMouseDown}></ResizerDiv>
      );
};

export default Resizer;

const ResizerDiv = styled.div`
    position: absolute;
    cursor: pointer;
    ${(props) =>
            props.direction === 'top' && 'cursor: ns-resize; top: -5px; left: 0; width: 100%; height: 10px;'}
    ${(props) =>
            props.direction === 'bottom' && 'cursor: ns-resize; bottom: -5px; left: 0; width: 100%; height: 10px;'}
    ${(props) =>
            props.direction === 'left' && 'cursor: ew-resize; top: 0; left: -5px; width: 10px; height: 100%;'}
    ${(props) =>
            props.direction === 'right' && 'cursor: ew-resize; top: 0; right: -5px; width: 10px; height: 100%;'}
`;
