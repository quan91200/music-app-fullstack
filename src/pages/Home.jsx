import React from 'react';
import styled from 'styled-components';

const Home = () => {
  return (
    <HomeWrapper>
      <MainContent>
        <h1>Main Content</h1>
      </MainContent>
    </HomeWrapper>
  );
};

export default Home;

const HomeWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
`;
