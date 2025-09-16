import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledGridItem = styled.div`
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  flex-basis: ${props => {
    if (props.xs) return `${(props.xs / 12) * 100}%`;
    return "auto";
  }};
  max-width: ${props => {
    if (props.xs) return `${(props.xs / 12) * 100}%`;
    return "100%";
  }};

  @media (min-width: 576px) {
    flex-basis: ${props => {
      if (props.sm) return `${(props.sm / 12) * 100}%`;
      if (props.xs) return `${(props.xs / 12) * 100}%`;
      return "auto";
    }};
    max-width: ${props => {
      if (props.sm) return `${(props.sm / 12) * 100}%`;
      if (props.xs) return `${(props.xs / 12) * 100}%`;
      return "100%";
    }};
  }

  @media (min-width: 768px) {
    flex-basis: ${props => {
      if (props.md) return `${(props.md / 12) * 100}%`;
      if (props.sm) return `${(props.sm / 12) * 100}%`;
      if (props.xs) return `${(props.xs / 12) * 100}%`;
      return "auto";
    }};
    max-width: ${props => {
      if (props.md) return `${(props.md / 12) * 100}%`;
      if (props.sm) return `${(props.sm / 12) * 100}%`;
      if (props.xs) return `${(props.xs / 12) * 100}%`;
      return "100%";
    }};
  }

  @media (min-width: 992px) {
    flex-basis: ${props => {
      if (props.lg) return `${(props.lg / 12) * 100}%`;
      if (props.md) return `${(props.md / 12) * 100}%`;
      if (props.sm) return `${(props.sm / 12) * 100}%`;
      if (props.xs) return `${(props.xs / 12) * 100}%`;
      return "auto";
    }};
    max-width: ${props => {
      if (props.lg) return `${(props.lg / 12) * 100}%`;
      if (props.md) return `${(props.md / 12) * 100}%`;
      if (props.sm) return `${(props.sm / 12) * 100}%`;
      if (props.xs) return `${(props.xs / 12) * 100}%`;
      return "100%";
    }};
  }
`;

export default function GridItem(props) {
  const { children, ...rest } = props;
  return (
    <StyledGridItem {...rest}>
      {children}
    </StyledGridItem>
  );
}

GridItem.propTypes = {
  children: PropTypes.node,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
};
