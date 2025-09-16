import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledGridContainer = styled.div`
  margin: 0 -15px !important;
  width: unset;
  display: flex;
  flex-wrap: wrap;
`;

export default function GridContainer(props) {
  const { children, ...rest } = props;
  return (
    <StyledGridContainer {...rest}>
      {children}
    </StyledGridContainer>
  );
}

GridContainer.propTypes = {
  children: PropTypes.node,
};
