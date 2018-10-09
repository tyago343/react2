import React from 'react';
import Songs from './Songs';


export default class SingleAlbum extends React.Component{ 
  constructor(props){
    super(props)
    
  }
  componentDidMount() {
    this.props.selectAlbum(this.props.albumId)
  }
  render(){
    const {album, albumId, start, selectedSong} = this.props
    return(<div className="album">
    {console.log(this.props)}
    <div>
      <h3>{album.name}</h3>
      <img src={`/api/albums/${albumId}/image`} className="img-thumbnail" />
    </div>
    <Songs 
      songs={album.songs}
      start={start}
      selectedSong={selectedSong}
    />
  </div>)
  
  }
};

