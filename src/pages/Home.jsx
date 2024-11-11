import React from 'react';
import styled from 'styled-components';

const Home = () => {
    return (
        <Wrapper>
            Home
        </Wrapper>
    );
}

export default Home;

const Wrapper = styled.div`
    height: 100%;
    
    /* Tùy chỉnh scrollbar */
    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background-color: ${({ theme }) => theme.scrollTrack};
    }

    ::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.scrollThumb};
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: ${({ theme }) => theme.scrollThumbHover};
    }
`;
