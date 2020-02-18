import React from 'react';

import LoadSpinner from './Spinner';

const WithSpinner = WrappedComponent => ({ isLoading, isLoadingSecond = false, ...otherProps }) => {
    console.log(isLoading, isLoadingSecond);
    return (isLoading || isLoadingSecond) ? (
        <LoadSpinner />
    ) : (
            <WrappedComponent {...otherProps} />
        )
}

export default WithSpinner;