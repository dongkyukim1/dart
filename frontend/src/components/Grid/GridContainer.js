import React from 'react';
import styled from 'styled-components';

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 30px;
  width: 100%;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    gap: 15px;
    margin-bottom: 15px;
  }
`;

const GridContainer = ({ children, ...props }) => {
  return (
    <GridWrapper {...props}>
      {children}
    </GridWrapper>
  );
};

export default GridContainer;