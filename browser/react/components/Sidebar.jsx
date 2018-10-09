import React from 'react';
import {Link} from 'react-router-dom'

export default ({ deselectAlbum }) => (
  <div className="col-xs-2">
      <sidebar>
        <img src="juke.svg" className="logo" />
        <section>
          <h4 className="menu-item active">
            <Link to="/albums" onClick={deselectAlbum}>ALBUMS</Link>
          </h4>
          
          <h4 className="menu-item">
          <Link to='/artists'>ARTISTS</Link>
          </h4>

        </section>
        
      </sidebar>
    </div>
);