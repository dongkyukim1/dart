import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledCardBody = styled.div`
  padding: 0.9375rem 1.875rem;
  flex: 1 1 auto;
  -webkit-box-flex: 1;
  position: relative;

  & h4 {
    font-weight: 300;
    line-height: 1.5em;
    color: #3c4858;
    margin-top: 0px;
    margin-bottom: 3px;
    font-family: 'Pretendard-Regular', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  }

  & p {
    color: #999999;
    margin: 0;
    font-size: 14px;
    margin-top: 0;
    padding-top: 10px;
    margin-bottom: 0;
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
