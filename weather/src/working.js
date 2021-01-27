import React from 'react';

function GettingData(Component) {
  return function WihLoadingComponent({ isLoading, ...props }) {
    if (!isLoading) return <Component {...props} />;
    return (
      <p style={{ textAlign: 'center', fontSize: '30px' }}>
        Grabbing your forecast, one moment... :)
      </p>
    );
  };
}
export default GettingData;