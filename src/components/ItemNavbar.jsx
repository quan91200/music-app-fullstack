import React from 'react'

const ItemNavbar = ({ onItemClick }) => {
    return (
        <div>
            <ul>
                <li onClick={onItemClick}>All</li>
                <li onClick={onItemClick}>Playlists</li>
                <li onClick={onItemClick}>Artists</li>
                <li onClick={onItemClick}>Albums</li>
            </ul>
        </div>
    )
}

export default ItemNavbar