import React from 'react';

import LoadSpinner from './Spinner';

const WithSpinner = WrappedComponent => ({isLoading, ...otherProps}) => {
    return isLoading ? (
      <LoadSpinner /> 
    ) : (
      <WrappedComponent {...otherProps} />
    )
}

export default WithSpinner;