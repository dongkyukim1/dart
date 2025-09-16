import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledCardBody = styled.div`
  padding: 0.9375rem 1.875rem;
  flex: 1 1 auto;
  -webkit-box-flex: 1;
  position: relative;

  & h4 {
    font-weight: 600;
    line-height: 1.4em;
    color: #2d3748;
    margin-top: 0px;
    margin-bottom: 8px;
    font-family: 'Pretendard-SemiBold', 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-size: 1.1rem;
  }

  & p {
    color: #4a5568;
    margin: 0;
    font-size: 0.875rem;
    margin-top: 0;
    padding-top: 12px;
    margin-bottom: 0;
    line-height: 1.6;
    font-family: 'Pretendard-Regular', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  }
`;

export default function CardBody(props) {
  const { children, ...rest } = props;
  return (
    <StyledCardBody {...rest}>
      {children}
    </StyledCardBody>
  );
}

CardBody.propTypes = {
  children: PropTypes.node,
};
