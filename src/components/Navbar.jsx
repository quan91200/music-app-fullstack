// Navbar.jsx
import React, { useState } from 'react'
import styled from 'styled-components'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import ListIcon from '@mui/icons-material/List'
import ItemNavbar from './ItemNavbar'

const Navbar = () => {
  const [selectedItem, setSelectedItem] = useState('all')

  return (
    <NavWrapper>
      <div>
        <div className='flex items-center justify-between font-semibold'>
          <div className='flex gap-2 cursor-pointer hover:opacity-80'>
            <LibraryMusicIcon />
            <div>Your Library</div>
          </div>
          <div className='cursor-pointer hover:opacity-80'>
            <AddIcon />
          </div>
        </div>
        <ul className='flex items-center gap-2'>
          <li onClick={() => setSelectedItem('all')}>All</li>
          <li onClick={() => setSelectedItem('playlists')}>Playlists</li>
          <li onClick={() => setSelectedItem('artists')}>Artists</li>
          <li onClick={() => setSelectedItem('albums')}>Albums</li>
        </ul>
      </div>
      <div>
        <div className='flex items-center justify-between gap-4'>
          <SearchIcon />
          <div className='flex gap-1'>
            Recents
            <ListIcon />
          </div>
        </div>
        <MenuItem>
          <ItemNavbar selectedItem={selectedItem} />
        </MenuItem>
      </div>
    </NavWrapper>
  )
}

export default Navbar

const NavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: 15px 0;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.navbarHoverText};
    }
  }
`

const MenuItem = styled.div`
  
`