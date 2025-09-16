import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledCard = styled.div`
  border: 0;
  margin-bottom: 20px;
  margin-top: 10px;
  border-radius: 6px;
  color: rgba(0, 0, 0, 0.87);
  background: #ffffff;
  width: 100%;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  font-size: 0.875rem;

  ${props => props.plain && `
    background: transparent;
    box-shadow: none;
  `}

  ${props => props.profile && `
    margin-top: 30px;
    text-align: center;
  `}

  ${props => props.chart && `
    & p {
      margin-top: 0px;
      padding-top: 0px;
    }
  `}
`;

export default function Card(props) {
  const { children, plain, profile, chart, ...rest } = props;
  return (
    <StyledCard plain={plain} profile={profile} chart={chart} {...rest}>
      {children}
    </StyledCard>
  );
}

Card.propTypes = {
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  chart: PropTypes.bool,
  children: PropTypes.node,
};
