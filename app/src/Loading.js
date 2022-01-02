import React from "react";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

const loadingImg = "https://cdn.auth0.com/blog/auth0-react-sample/assets/loading.svg";

const Loading = () => (
  <Row style={{minHeight: '95vh'}} className="justify-content-center align-items-center">
      <Col xs='auto'>
        <div className="spinner">
            <img src={loadingImg} alt="Loading..." />
        </div>
      </Col>
  </Row>
);

export default Loading;