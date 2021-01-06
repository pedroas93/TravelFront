import React, {Component} from "react";
import HeaderPrivate from "../PrivateViews/HeaderPrivate";
import MenuList from "../PrivateViews/MenuList";
import Footer from "../PublicViews/Footer";
import Logger from "../../models/Logger";
import Auth from "../../models/Auth";
import PublicHeader from "../PublicViews/PublicHeader";
import settings from '../../settings';
import {GoogleApiWrapper, InfoWindow, Map, Marker} from 'google-maps-react';
import FetchResponses from "../../models/FetchResponses";
// redux
import {connect} from 'react-redux';
import {SetMenuCss} from '../PrivateViews/Menu_Actions';


class Puntos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      mapArray: [],
      nameindex: [],
      search: 'Todas',
      searchArray: [],
      nameDep: [],
      zoom: 6,
      lat: 6.217,
      lng: -75.567,
      searchObject: {},
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      logued: Auth.isAuthenticated(),
      point_name: '',
    };

    this.cities_coordenates = {
      "Todas": {zoom: 6, lat: 6.217, lng: -75.567},
      "Apartadó": {zoom: 13, lat: 7.8813863, lng: -76.6248323},
      "Barranca": {zoom: 13, lat: 7.0623954, lng: -73.8517241},
      "Barrancabermeja": {zoom: 13, lat: 7.056175, lng: -73.8481316},
      "Barranquilla": {zoom: 12, lat: 10.9856106, lng: -74.8058149},
      "Bogotá": {zoom: 10, lat: 4.6328987, lng: -74.1016272},
      "Bucaramanga": {zoom: 12, lat: 7.1159696, lng: -73.1292014},
      "Cali": {zoom: 12, lat: 3.4175123, lng: -76.5287539},
      "Cúcuta": {zoom: 12, lat: 7.90876, lng: -72.5044205},
      "Envigado": {zoom: 13, lat: 6.1886217, lng: -75.5795162},
      "Ibagué": {zoom: 11, lat: 4.4249712, lng: -75.1938255},
      "Ipiales": {zoom: 13, lat: 0.8199147, lng: -77.6376972},
      "Medellín": {zoom: 11, lat: 6.177551, lng: -75.5881523},
      "Montería": {zoom: 13, lat: 8.7433204, lng: -75.8771643},
      "Neiva": {zoom: 13, lat: 2.9267363, lng: -75.2773671},
      "Pasto": {zoom: 13, lat: 1.1878677, lng: -77.2782525},
      "Pereira": {zoom: 12, lat: 4.7919451, lng: -75.7127315},
      "Pie de Cuesta": {zoom: 14, lat: 6.9814466, lng: -73.0521962},
      "Rionegro": {zoom: 14, lat: 6.1414661, lng: -75.3776604},
      "Sincelejo": {zoom: 13, lat: 9.2907514, lng: -75.3963743},
      "Túquerres": {zoom: 14, lat: 1.0829505, lng: -77.6184694},
      "Valledupar": {zoom: 13, lat: 10.4584403, lng: -73.2534822},
      "Villavicencio": {zoom: 12, lat: 4.1280106, lng: -73.6255395},
      "Yopal": {zoom: 14, lat: 5.3293343, lng: -72.3933185},
    };


    Logger.setLogger(this.constructor.name);
  }

  componentDidMount() {
    //Cambia el estado del menu
    this.props.SetMenuCss(["", "", "", "", "submit", ""]);
    localStorage.setItem("menu", JSON.stringify(["", "", "", "", "submit", ""]));


    fetch(settings.backend.maps_data, {
      method: "GET",
      headers: settings.headers_super_auth
    })
      .then(FetchResponses.processResponse)
      .then(this.successDataResponse)
      .catch(this.failureDataResponse);
  }

  successDataResponse = (data) => {
    data.stores.forEach(element => {
      if (this.state.searchArray.indexOf(element.city) === -1 && element.city !== "") {
        this.setState({
          searchArray: [...this.state.searchArray, element.city]
        })
      }

      if (this.state.nameindex.indexOf(element.name) === -1 && element.name !== "") {
        this.setState({
          mapArray: [...this.state.mapArray, element],
          nameindex: [...this.state.nameindex, element.name]
        })
      }
    });

    let sort = this.state.searchArray.sort();
    this.setState({
      searchArray: ["Todas", ...sort],
    })
  };

  failureDataResponse = (error) => {
    Logger.error(error)
  };

  tableMarkerClick = (event, marker) => {
    event.preventDefault();
    if (typeof marker == 'string') {
      if (marker === 'Todos') {
        let data = this.cities_coordenates[this.state.search];
        this.setState({
          lat: data.lat,
          lng: data.lng,
          zoom: data.zoom,
        });
        return;
      } else {
        this.state.mapArray.forEach(store => {
          if (store.name === marker) {
            marker = store;
          }
        });
      }
    }

    if (this.state.zoom !== 15.9) {
      this.setState({
        lat: marker.latitude,
        lng: marker.longitude,
        zoom: 15.9
      })
    } else {
      this.setState({
        lat: marker.latitude,
        lng: marker.longitude,
        zoom: 16
      })
    }
  };

  onMarkerClick = (props, marker, e) => {
    if (this.state.zoom !== 15.9) {
      this.setState({
        lat: props.position.lat,
        lng: props.position.lng,
        zoom: 15.9,
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      })
    } else {
      this.setState({
        lat: props.position.lat,
        lng: props.position.lng,
        zoom: 16,
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      })
    }
  };

  onSearch = (event) => {
    let city = event.target.value;
    let data = this.cities_coordenates[city];
    if (data) {
      this.setState({
        lat: data.lat,
        lng: data.lng,
        zoom: data.zoom,
      });
    }
    this.setState({
      search: event.target.value,
    });
  };

  header = () => {
    if (this.state.logued) {
      return (
        <div className="sidebar">
          <MenuList disabled={this.state.loading}/>
        </div>
      );
    } else {
      return <PublicHeader/>;
    }
  };

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  element = () => (
    <div className={this.state.logued ? "container-fluid" : ""}>
      {this.header()}
      <div className="row justify-content-center">
        <div className="col-lg-12 col-xl-10 private-wrapper">
          {this.state.logued ? <HeaderPrivate menu_list={this.state.loading}/> : null}
          <div className={this.state.logued ? "wrapper" : ""}>
            <div className="row justify-content-center">
              <div className="col-11">
                <h1>
                  <span className="icon dripicons-location"/>
                  Puntos
                </h1>
              </div>
            </div>
            <div className="row justify-content-center">


              {/* Show cities in mobile*/}
              <div className="d-lg-none col-12">
                <div className="panel">

                  {/*Cities in mobile*/}
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text min-width-historial">Ciudad</span>
                    </div>
                    <select className="form-control" value={this.state.search} onChange={this.onSearch}>
                      {this.state.searchArray.map(city => {
                        return <option key={Math.random()}> {city}</option>
                      })}
                    </select>
                  </div>

                  {/*Points in mobile*/}
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text min-width-historial">Puntos</span>
                    </div>
                    <select className="form-control" id="point_name" value={this.state.point_name}
                            onChange={(event) => {
                              this.tableMarkerClick(event, event.target.value);
                              this.handleChange(event);
                            }}>
                      <option key={Math.random()} value="Todos">Todos</option>
                      ;
                      {this.state.mapArray.map(marker => {
                        if (this.state.search !== "Todas") {
                          if (this.state.search === marker.city) {
                            return <option
                              key={Math.random()}
                              value={marker.name}>{marker.name}</option>;
                          }
                        } else {
                          return <option
                            key={Math.random()}
                            value={marker.name}>{marker.name}</option>;
                        }
                      })}
                    </select>
                  </div>

                </div>
              </div>

              <div className="d-none d-lg-block col-lg-6 scroll" style={{height: (window.innerHeight * .9)}}>
                <div className="list-group">
                  <div className="list-group-item list-group-item-action flex-column align-items-start">
                    <h3>Selecciona una ciudad</h3>
                    <select className="form-control" value={this.state.search} onChange={this.onSearch}>
                      {this.state.searchArray.map(marker => {
                        return <option key={Math.random()}> {marker}</option>
                      })}
                    </select>
                  </div>

                  {this.state.mapArray.map(marker => {
                    if (this.state.search !== "Todas") {
                      if (this.state.search === marker.city) {
                        return <button className="list-group-item list-group-item-action flex-column align-items-start"
                                       key={Math.random()}
                                       onClick={(event) => {
                                         this.tableMarkerClick(event, marker);
                                       }}>
                          <div className="justify-content-between">
                            <small>{marker.city}</small>
                            <h5 className="mb-1">
                              {marker.name}
                            </h5>
                          </div>
                          <p className="mb-1">
                            {marker.address}
                          </p>
                        </button>
                      }
                    } else {
                      return <button
                        key={Math.random()}
                        className="list-group-item list-group-item-action flex-column align-items-start "
                        onClick={(event) => {
                          this.tableMarkerClick(event, marker)
                        }}
                      >
                        <div className="justify-content-between">
                          <small>{marker.city}</small>
                          <h5 className="mb-1">
                            {marker.name}
                          </h5>
                        </div>
                        <p className="mb-1">
                          {marker.address}
                        </p>
                      </button>
                    }
                  })}
                </div>
              </div>

              <div className="col-11 col-lg-8" style={{height: (window.innerHeight * .9)}}>
                <Map google={this.props.google}
                     className="custom-map"
                     center={{
                       lat: this.state.lat,
                       lng: this.state.lng
                     }}
                     initialCenter={{
                       lat: this.state.lat,
                       lng: this.state.lng
                     }}
                     zoom={this.state.zoom}>
                  {this.state.mapArray.map(marker => {
                    if (this.state.search !== "Todas") {
                      if (this.state.search === marker.city) {
                        return <Marker
                          key={Math.random()}
                          icon={marker.image_icon}
                          address={marker.address}
                          onClick={this.onMarkerClick}
                          position={{
                            lat: marker.latitude,
                            lng: marker.longitude
                          }}
                          name={marker.name}
                        />
                      }
                    } else {
                      return <Marker
                        key={Math.random()}
                        icon={marker.image_icon}
                        address={marker.address}
                        onClick={this.onMarkerClick}
                        position={{
                          lat: marker.latitude,
                          lng: marker.longitude
                        }}
                        name={marker.name}
                      />
                    }

                  })}

                  <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div>
                      <h3>{this.state.selectedPlace.name}</h3>
                    </div>
                    <div>
                      <p>Dirección: {this.state.selectedPlace.address}</p>
                    </div>
                  </InfoWindow>

                </Map>

              </div>
            </div>
          </div>
          <Footer/>
        </div>
      </div>
    </div>
  );

  render() {
    return this.element();
  }
}

const mapStateToProps = state => ({
  menu: state.menu.menu
});

export default connect(mapStateToProps, {SetMenuCss})(GoogleApiWrapper({
  apiKey: (settings.maps.google_maps_key)
})(Puntos));