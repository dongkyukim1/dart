import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledCardFooter = styled.div`
  padding: 0.75rem 1.25rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.125);

  ${props => props.stats && `
    border-top: none;
    margin-top: 20px;
    padding: 0px 15px 10px;
    position: relative;
    background: transparent;
    
    & .stats {
      color: #999999;
      display: inline-flex;
      font-size: 12px;
      line-height: 22px;
      
      & svg {
        top: 4px;
        width: 16px;
        height: 16px;
        position: relative;
        margin-right: 3px;
        margin-left: 3px;
      }
      
      & .material-icons {
        top: 4px;
        font-size: 16px;
        position: relative;
        margin-right: 3px;
        margin-left: 3px;
      }
    }
  `}

  ${props => props.chart && `
    border-top: none;
    padding: 0px 15px 10px;
    
    & .stats {
      color: #999999;
      display: inline-flex;
      font-size: 12px;
      line-height: 22px;
      
      & svg {
        top: 4px;
        width: 16px;
        height: 16px;
        position: relative;
        margin-right: 3px;
        margin-left: 3px;
      }
    }
  `}
`;

export default function CardFooter(props) {
  const { children, stats, chart, ...rest } = props;
  return (
    <StyledCardFooter stats={stats} chart={chart} {...rest}>
      {children}
    </StyledCardFooter>
  );
}

CardFooter.propTypes = {
  children: PropTypes.node,
  stats: PropTypes.bool,
  chart: PropTypes.bool,
};
