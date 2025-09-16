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

const StyledCardHeader = styled.div`
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  position: relative;
  background: ${props => colors[props.color] || 'transparent'};
  border-radius: 3px;

  ${props => props.color && `
    margin: -20px 15px 0;
    padding: 20px;
    color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    border-left: 4px solid rgba(255, 255, 255, 0.3);
  `}

  ${props => props.stats && `
    border-radius: 3px;
    margin-top: -20px;
    padding: 15px;
  `}

  ${props => props.icon && `
    text-align: center;
  `}

  & h4 {
    color: #ffffff;
    margin-top: 0px;
    min-height: auto;
    font-weight: 600;
    font-family: 'Pretendard-SemiBold', 'Roboto', 'Helvetica', 'Arial', sans-serif;
    margin-bottom: 8px;
    text-decoration: none;
    font-size: 1.1rem;
    line-height: 1.3em;
    letter-spacing: -0.025em;
  }

  & p {
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
    font-size: 0.875rem;
    margin-top: 0;
    margin-bottom: 0;
    font-family: 'Pretendard-Medium', 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-weight: 500;
  }
`;

export default function CardHeader(props) {
  const { children, color, stats, icon, ...rest } = props;
  return (
    <StyledCardHeader color={color} stats={stats} icon={icon} {...rest}>
      {children}
    </StyledCardHeader>
  );
}

CardHeader.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(["warning", "success", "danger", "info", "primary", "rose"]),
  stats: PropTypes.bool,
  icon: PropTypes.bool,
};
