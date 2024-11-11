import React from 'react'
import DefaultLayout from './DefaultLayout'

const LayoutWrapper = ({ element, layout }) => {
    // Kiểm tra layout để áp dụng
    if (layout === 'default') {
        return <DefaultLayout>{element}</DefaultLayout>
    }

    return element  // Nếu không có layout, trả về element bình thường
}

export default LayoutWrapper