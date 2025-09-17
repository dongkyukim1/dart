import React from 'react';
import styled from 'styled-components';

const getBackgroundByColor = (color) => {
  const colors = {
    warning: 'linear-gradient(60deg, #ffa726, #fb8c00)',
    success: 'linear-gradient(60deg, #66bb6a, #43a047)',
    danger: 'linear-gradient(60deg, #ef5350, #e53935)',
    info: 'linear-gradient(60deg, #26c6da, #00acc1)',
    primary: 'linear-gradient(60deg, #ab47bc, #8e24aa)',
    rose: 'linear-gradient(60deg, #ec407a, #d81b60)',
  };
  return colors[color] || colors.primary;
};

const CardIconWrapper = styled.div`
  background: ${({ color }) => getBackgroundByColor(color)};
  width: 60px;
  height: 60px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 24px;
  box-shadow: 0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(${({ color }) => 
    color === 'warning' ? '255, 152, 0' : 
    color === 'success' ? '76, 175, 80' : 
    color === 'danger' ? '244, 67, 54' : 
    color === 'info' ? '0, 188, 212' : 
    '156, 39, 176'}, 0.4);
  margin-right: 15px;
  margin-top: -30px;
  position: absolute;
  left: 15px;
  float: left;
`;

const CardIcon = ({ children, color, ...props }) => {
  return (
    <CardIconWrapper color={color} {...props}>
      {children}
    </CardIconWrapper>
  );
};

export default CardIcon;