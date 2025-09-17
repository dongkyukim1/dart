import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #ffffff;
  background-clip: border-box;
  border: 0;
  border-radius: 6px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  margin-bottom: 30px;
  width: 100%;
`;

const Card = ({ children, ...props }) => {
  return (
    <CardWrapper {...props}>
      {children}
    </CardWrapper>
  );
};

export default Card;