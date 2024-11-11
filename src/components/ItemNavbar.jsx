import React from 'react'
import ItemAlbums from './ItemAlbums'
import ItemArtists from './ItemArtists'
import ItemPlaylists from './ItemPlaylists'

const ItemNavbar = ({ selectedItem }) => {

    return (
        <div>
            {selectedItem === 'all' && (
                <>
                    <ItemPlaylists />
                    <ItemArtists />
                    <ItemAlbums />
                </>
            )}
            {selectedItem === 'playlists' && <ItemPlaylists />}
            {selectedItem === 'artists' && <ItemArtists />}
            {selectedItem === 'album' && <ItemAlbums />}
        </div>
    )
}

export default ItemNavbar
