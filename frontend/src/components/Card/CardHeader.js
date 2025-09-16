import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const colors = {
  warning: "linear-gradient(60deg, #ffa726, #fb8c00)",
  success: "linear-gradient(60deg, #66bb6a, #43a047)", 
  danger: "linear-gradient(60deg, #ef5350, #e53935)",
  info: "linear-gradient(60deg, #26c6da, #00acc1)",
  primary: "linear-gradient(60deg, #ab47bc, #8e24aa)",
  rose: "linear-gradient(60deg, #ec407a, #d81b60)"
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
    padding: 15px;
    color: #ffffff;
    border-radius: 3px;
    box-shadow: 0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(${
      props.color === 'warning' ? '255, 152, 0' :
      props.color === 'success' ? '76, 175, 80' :
      props.color === 'danger' ? '244, 67, 54' :
      props.color === 'info' ? '0, 188, 212' :
      props.color === 'primary' ? '156, 39, 176' :
      props.color === 'rose' ? '233, 30, 99' : '0, 0, 0'
    }, 0.4);
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
    font-weight: 300;
    font-family: 'Pretendard-Regular', 'Roboto', 'Helvetica', 'Arial', sans-serif;
    margin-bottom: 3px;
    text-decoration: none;
    font-size: 1.3rem;
    line-height: 1.4em;
  }

  & p {
    color: rgba(255, 255, 255, 0.62);
    margin: 0;
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 0;
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
