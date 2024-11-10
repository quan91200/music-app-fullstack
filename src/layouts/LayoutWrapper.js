import React from 'react'

const LayoutWrapper = ({ element, layout: Layout }) => {
    return Layout ? <Layout>{element}</Layout> : element
}

export default LayoutWrapper