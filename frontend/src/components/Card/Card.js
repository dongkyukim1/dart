import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledCard = styled.div`
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
  margin-top: 12px;
  border-radius: 6px;
  color: #2d3748;
  background: #ffffff;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.06);
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06);
    border-color: #cbd5e0;
  }

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
