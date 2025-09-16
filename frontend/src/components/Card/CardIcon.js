import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const colors = {
  warning: "#e53e3e",    // 차분한 빨간색
  success: "#38a169",    // 차분한 초록색
  danger: "#e53e3e",     // 경고용 빨간색
  info: "#3182ce",       // 차분한 파란색
  primary: "#2d3748",    // 다크 그레이
  rose: "#805ad5"        // 차분한 보라색
};

const StyledCardIcon = styled.div`
  background: ${props => colors[props.color] || colors.primary};
  border-radius: 4px;
  padding: 18px;
  margin-top: -20px;
  margin-right: 15px;
  margin-left: 15px;
  height: 70px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
    border-radius: 4px;
    pointer-events: none;
  }
  
  & .material-icons,
  & svg {
    width: 28px;
    height: 28px;
    color: #ffffff;
    font-size: 28px;
    z-index: 1;
    position: relative;
  }
`;

export default function CardIcon(props) {
  const { children, color, ...rest } = props;
  return (
    <StyledCardIcon color={color} {...rest}>
      {children}
    </StyledCardIcon>
  );
}

CardIcon.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(["warning", "success", "danger", "info", "primary", "rose"]),
};
