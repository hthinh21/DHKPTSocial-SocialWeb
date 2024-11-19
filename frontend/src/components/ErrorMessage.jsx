import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Alert } from "react-bootstrap";

const ErrorMessage = ({ variant = "info", children }) => {
  return (
    <Alert variant={variant} style={{ fontSize: 20 }}>
      <strong>{children}</strong>
    </Alert>
  );
};

ErrorMessage.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node.isRequired, 
};


export default ErrorMessage;
