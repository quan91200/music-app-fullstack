import React, { useState } from 'react'

const ItemNavbar = () => {
    const [selectedItem, setSelectedItem] = useState('all')
    return (
        <div>
            <ul className='flex items-center gap-2'>
                <li onClick={() => setSelectedItem('all')}>All</li>
                <li onClick={() => setSelectedItem('playlists')}>Playlists</li>
                <li onClick={() => setSelectedItem('artists')}>Artists</li>
                <li onClick={() => setSelectedItem('albums')}>Albums</li>
            </ul>
        </div>
    )
}

export default ItemNavbar