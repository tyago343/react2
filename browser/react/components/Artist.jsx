import React from 'react'
import {Link} from 'react-router-dom'

export default class Artists extends React.Component{
    
componentDidMount(){
    this.props.selectArtist(this.props.artistId)
    
}   
render(){
    const { selectedArtist } = this.props;
    return (
        
      <div>
        <h3>{ selectedArtist.name }</h3>
        <ul className="nav nav-tabs">
          <li><Link to=>ALBUMS</Link></li>
          <li><Link to=>SONGS</Link></li>
        </ul>
        {/* Aquí vamos a armar nuestras rutas*/}
      </div>
      )
}