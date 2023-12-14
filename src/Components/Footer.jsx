import React from 'react'
import './Footer.css'
import icon from './icon.png'
import twitter from './twitter.svg'
import instagram from './instagram.svg'
import youtube from './youtube.svg'
import facebook from './facebook.png'

const Footer = () => {
  return (
    <div>
      <footer>
        <img src={icon} className='footer'/>
        <p className='footer-p'>Thanks to IMDB for sharing the information with us</p>
        <div className='footer-icons'>
          <a href='https://www.youtube.com/imdb'>
        <img src={youtube} className='youtube'/>
          </a>
          <a href='https://twitter.com/IMDb'>
        <img src={twitter} className='twitter'/>
          </a>
          <a href='https://www.instagram.com/imdb/'>
        <img src={instagram} className='instagram'/>
        </a>
        <a href='https://www.facebook.com/imdb/'>
        <img src={facebook} className='facebook'/>
        </a>
        </div>
      </footer>
    </div>
  )
}


export default Footer