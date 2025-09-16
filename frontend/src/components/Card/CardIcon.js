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

const StyledCardIcon = styled.div`
  background: ${props => colors[props.color] || colors.primary};
  border-radius: 3px;
  padding: 15px;
  margin-top: -20px;
  margin-right: 15px;
  margin-left: 15px;
  height: 70px;
  box-shadow: 0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(${
    props => {
      const colorMap = {
        'warning': '255, 152, 0',
        'success': '76, 175, 80',
        'danger': '244, 67, 54',
        'info': '0, 188, 212',
        'primary': '156, 39, 176',
        'rose': '233, 30, 99'
      };
      return colorMap[props.color] || '156, 39, 176';
    }
  }, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  
  & .material-icons,
  & svg {
    width: 36px;
    height: 36px;
    color: #ffffff;
    font-size: 36px;
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
