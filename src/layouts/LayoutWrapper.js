import React from 'react';

const LayoutWrapper = ({ layout: Layout, element }) => {
    return <Layout>{element}</Layout>;
};

export default LayoutWrapper;
