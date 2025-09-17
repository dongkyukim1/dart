import React from 'react';
import styled from 'styled-components';

const GridItemWrapper = styled.div`
  ${({ xs }) => xs && `grid-column: span ${xs};`}
  
  @media (min-width: 576px) {
    ${({ sm }) => sm && `grid-column: span ${sm};`}
  }
  
  @media (min-width: 768px) {
    ${({ md }) => md && `grid-column: span ${md};`}
  }
  
  @media (min-width: 992px) {
    ${({ lg }) => lg && `grid-column: span ${lg};`}
  }
  
  @media (min-width: 1200px) {
    ${({ xl }) => xl && `grid-column: span ${xl};`}
  }

  @media (max-width: 575px) {
    grid-column: span 12;
  }
`;

const GridItem = ({ children, xs, sm, md, lg, xl, ...props }) => {
  return (
    <GridItemWrapper 
      xs={xs} 
      sm={sm} 
      md={md} 
      lg={lg} 
      xl={xl} 
      {...props}
    >
      {children}
    </GridItemWrapper>
  );
};

export default GridItem;