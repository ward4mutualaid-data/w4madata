import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import React, { useState, useRef, useCallback } from 'react'
import MapGL from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'

const MAPBOX_TOKEN = 'pk.eyJ1Ijoid2FyZDRtdXR1YWxhaWQtZGF0YSIsImEiOiJja2ltNDFhbzIwNm55Mnp0aHlpODdjYTZlIn0.FZJAKSl2apYg6a2CfIWYMQ'

const CustomGeocoder = () => {
  const [viewport, setViewport] = useState({
    latitude: 38.955178,
    longitude: -77.024145,
    zoom: 13,
  });
  const geocoderContainerRef = useRef();
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );
  const onSelected = (viewport, item) => {
    this.setState({
      viewport
    })
  }

  return (
    <div style={{ height: "70vh" }}>
      <div
        ref={geocoderContainerRef}
        style={{ position: "absolute", top: 20, left: 20, zIndex: 1}}

      />
      <MapGL
        ref={mapRef}
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={handleViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle={"mapbox://styles/mapbox/streets-v11"}
      >
      {/* bbox format: [minY, minX, maxY, maxX]*/}
      {/* allowed geocode types https://docs.mapbox.com/api/search/geocoding/#data-types */}
        <Geocoder
          mapRef={mapRef}
          countries={"US"}
          bbox={[-77.16041564941406, 38.78941577989049, -76.89880371093749, 39.015449238175414]}
          zoom={13}
          type={"address"}
          marker={true}
          value={""}
          onSelected={onSelected}
          hideOnSelect={false}
          containerRef={geocoderContainerRef}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position="top-left"
        />
      </MapGL>
    </div>
  );
};


export default CustomGeocoder
