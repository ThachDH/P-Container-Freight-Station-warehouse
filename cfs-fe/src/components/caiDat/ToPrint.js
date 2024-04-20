import React from 'react'
import ReactToPrint from "react-to-print";

class ToPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  test(posArr, fileName) {
    return (
      <ReactToPrint
        content={fileName}
        documentTitle="Test"
        removeAfterPrint
        trigger={posArr} />
    );
  }
}

export default ToPrint;