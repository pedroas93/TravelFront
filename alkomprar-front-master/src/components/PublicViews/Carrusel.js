import React, { Component } from 'react';
import Logger from "../../models/Logger";
import Auth from "../../models/Auth";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Snow from '../../images/Snow-PNG-Transparent-Image.png';
import { isMobile } from "react-device-detect";
//redux 
import { connect } from "react-redux";


class carrusel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      landing: [],
      stateLanding: false,
      onUpClick: false,
    }
    Logger.setLogger(this.constructor.name)
  };

  shouldComponentUpdate = (next_props, next_state) => {
    if (!this.state.stateLanding) {
      this.setState({
        landing: next_props.landing.landing.landing.modules,
        stateLanding: true
      })
    }
    return true;
  }

  element = (arrImages) => (
    <div id="carouselExampleIndicators" className="" data-ride="carousel">
      <div className="">
        <Carousel 
          showArrows={true}
          showStatus={false}
          showIndicators={true}
          showThumbs={false}
          infiniteLoop={true}
          // useKeyboardArrows={true}
          autoPlay={true}
          swipeable={isMobile}
          emulateTouch={true}>
          {arrImages.map((land) => {
            if (land.module_type === "Slider") {
              let image = {
                'background': 'url(' + land.image_link + ') '
                , 'backgroundSize': 'contain', 'backgroundRepeat': 'no-repeat', 'backgroundPosition': 'center'
              }
              return (
                <div key={Math.random()} className={"" + (land.redirect_link ? "redirect" : "")}>
                  <div style={image} className="image-carousel" onClick={() => {
                    if (land.redirect_link) {
                      window.open(land.redirect_link);
                    }
                  }}
                  >
                    <div className="container">
                      <div className="row">
                        <div className="col col-xs-9 col-lg-6">
                          {/* <div className="logoAlkomprarLog"> */}
                          <h1>{land.content}</h1>
                          {/* </div> */}
                        </div>
                        <div className="col col-xs-3 col-lg-6" />
                        <img src={Snow} width="5px" height="5px" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </Carousel>
      </div>
    </div>

  )


  render() {
    Logger.info("Rendering Landing");
    if (this.state.landing.length > 0) {
      let arrImages = [];
      this.state.landing.forEach(element => {
        if (element.module_type === "Slider") {
          arrImages = [...arrImages, element]
        }
      });
      arrImages.sort(function (a, b) {
        return (a.extra_properties.position - b.extra_properties.position)
      })
      return Auth.notAuthenticationRequired(this.element(arrImages));
    } else {
      return Auth.notAuthenticationRequired(null);
    }
  }
}

const mapStateToProps = state => ({
  landing: state
});
export default connect(mapStateToProps)(carrusel);
