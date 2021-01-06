import React, { Component } from 'react';
import MenuList from './MenuList';
import Footer from '../PublicViews/Footer';
import Logger from "../../models/Logger";
import Auth from "../../models/Auth";
import settings from "../../settings";
import HeaderPrivate from '../PrivateViews/HeaderPrivate';
import FetchResponses from "../../models/FetchResponses";
import { translateDetails } from "../../models/Messages";
// import {Messages} from "../../models/Messages";
// import Error from "../PublicViews/Error";
import { Collapse } from "antd";
import Icons from "./IconsModal";
import { Modal } from 'antd';

// redux
import { connect } from 'react-redux';
import Error from '../PublicViews/Error';
import { Messages } from '../../models/Messages';
import { SetMenuManager } from '../PrivateViews/Menu_Actions';

const Panel = Collapse.Panel;

class Manager extends Component {
  confirm = Modal.confirm;

  constructor(props) {
    super(props);
    // let last_user = JSON.parse(Auth.getLastUserData());
    this.state = {
      previewVisible: false,
      previewImage: "",
      fileList: [],
      information: [],
      FAQ: [],
      deleteFilelist: [],
      LandingModule: [],
      carrusel: [],
      create: false,
      contactModule: [],
      disabled: false,
      icon: "",
      open: false,
      iconInex: "",
      loading: false,
      error_message_pop: false
    };
    Logger.setLogger(this.constructor.name);
  }

  componentDidMount() {
    //Cambia el estado del menu
    this.props.SetMenuManager(["submit", "", "", "", "", ""]);
    localStorage.setItem("menu", JSON.stringify(["submit", "", "", "", "", ""]));


    fetch(settings.backend.list_front_modules, {
      method: 'GET',
      headers: settings.headers_auth(Auth.getSessionToken())
    }).then(FetchResponses.processResponse)
      .then(this.successResponse)
      .catch(error => {
        this.handleErrorMessage(Messages.errorTryLater)
      })
  }

  successResponse = (response) => {
    let cont = 0;
    Logger.info(response);
    let frontModules = response.modules;
    let sliders = [], information = [], faq = [], landingModule = [], contacto = [];
    if (frontModules) {
      frontModules.forEach(module => {
        switch (module.module_type) {
          case "Slider":
            module.content = module.content ? module.content : "";
            module.redirect_link = module.redirect_link ? module.redirect_link : "";
            sliders.push(module);
            break
          case "FAQ":
            faq.push(module);
            break
          case "Information":
            module.redirect_link = module.redirect_link ? module.redirect_link : "";
            information.push(module);
            break
        }
      })
      sliders.sort((a, b) => a.extra_properties.position - b.extra_properties.position);
      faq.sort((a, b) => a.extra_properties.position - b.extra_properties.position);
      information.sort((a, b) => a.extra_properties.position - b.extra_properties.position);
    }
    this.setState({
      fileList: sliders,
      FAQ: faq,
      information: information,
    })
    response.modules.forEach(element => {
      let index = element
      if (index.module_type === "LandingModule") {
        let extra_properties = index.extra_properties;
        if (typeof (index.extra_properties) === 'string') {
          extra_properties = JSON.parse(index.extra_properties);
        }
        let objectImage = {
          name: index.name,
          iconStyle: "icon icon " + extra_properties.dripicon + " text-center",
          icon: extra_properties.dripicon,
          button: extra_properties.button,
          content: index.content,
          module_type: index.module_type,
          redirect_link: index.redirect_link,
          title: index.title
        }
        this.setState({
          LandingModule: [...this.state.LandingModule, objectImage],
        })
        cont++;
      }

      if (index.module_type === "Contacto") {
        let objectContact = {
          name: index.name,
          content: index.content,
          module_type: index.module_type,
          title: index.title,
          redirect_link: index.redirect_link,
        }
        this.setState({
          contactModule: [...this.state.contactModule, objectContact],
        })
        cont++;
      }

    });
    Logger.info(this.state);
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {

    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  deleteCarrusel = element => {
    if (element.create && element.create === false) {
      const data = {
        name: element.name,
        image_link: element.image_link,
        content: element.content,
        extra_properties: {},
        module_type: element.module_type,
        redirect_link: element.redirect_link,
        title: element.name
      };
      fetch(settings.backend.front_modules, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: settings.headers_auth(Auth.getSessionToken())
      }).then(FetchResponses.processResponse)
        .then(this.successChangue)
        .catch(error => {
          this.handleErrorMessage(Messages.errorTryLater)
        })
    } else if (element.create && element.create === true) {
      this.state.fileList.splice((this.state.fileList.length - 1), 1);
      this.setState((prevState) => ({ fileList: [...prevState.fileList] }));
    } else {
      const data = {
        name: element.name,
        image_link: element.image_link,
        content: element.content,
        extra_properties: {},
        module_type: element.module_type,
        redirect_link: element.redirect_link,
        title: element.name
      };
      fetch(settings.backend.front_modules, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: settings.headers_auth(Auth.getSessionToken())
      }).then(FetchResponses.processResponse)
        .then(this.successChangue)
        .catch(error => {
          this.handleErrorMessage(Messages.errorTryLater)
        })
    }
  }

  deleteInfo = element => {
    if (element.create && element.create === false) {
      const data = {
        name: element.name,
        image_link: element.image_link,
        content: element.content,
        extra_properties: {},
        module_type: element.module_type,
        redirect_link: element.redirect_link,
        title: element.name
      };
      fetch(settings.backend.front_modules, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: settings.headers_auth(Auth.getSessionToken())
      }).then(FetchResponses.processResponse)
        .then(this.successChangue)
        .catch(error => {
          this.handleErrorMessage(Messages.errorTryLater)
        })
    } else if (element.create && element.create === true) {
      this.state.information.splice((this.state.information.length - 1), 1);
      this.setState((prevState) => ({ information: [...prevState.information] }));

    } else {
      const data = {
        name: element.name,
        image_link: element.image_link,
        content: element.content,
        extra_properties: {},
        module_type: element.module_type,
        redirect_link: element.redirect_link,
        title: element.name
      };
      fetch(settings.backend.front_modules, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: settings.headers_auth(Auth.getSessionToken())
      }).then(FetchResponses.processResponse)
        .then(this.successChangue)
        .catch(error => {
          this.handleErrorMessage(Messages.errorTryLater)
        })
    }
  }

  changueCarrusel = (element) => {
    let content = element.content ? element.content : null;
    let redirect_link = element.redirect_link ? element.redirect_link : null;
    let new_extra_properties = element.extra_properties.position ? parseInt(element.extra_properties.position) : parseInt(this.state.fileList.length - 1);
    let data = {};
    data = {
      name: element.name,
      image_link: element.image_link,
      content: content,
      extra_properties: {
        position: new_extra_properties,
      },
      module_type: "Slider",
      redirect_link: redirect_link,
      title: element.name
    };
    fetch(settings.backend.front_modules, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: settings.headers_auth(Auth.getSessionToken())
    }).then(FetchResponses.processResponse)
      .then(this.successChangue)
      .catch(error => {
        this.handleErrorMessage(Messages.errorTryLater)
      })
  }

  deleteFAQ = element => {
    if (element.create && element.create === true) {
      this.state.FAQ.splice((this.state.FAQ.length - 1), 1);
      this.setState((prevState) => ({ FAQ: [...prevState.FAQ] }));
    } else {

      const data = {
        name: element.name,
        image_link: "https://www.alkomprar.com/",
        content: element.content,
        extra_properties: {},
        module_type: "FAQ",
        redirect_link: "https://www.alkomprar.com/",
        title: element.name
      };

      fetch(settings.backend.front_modules, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: settings.headers_auth(Auth.getSessionToken())
      }).then(FetchResponses.processResponse)
        .then(this.successChangue)
        .catch(error => {
          this.handleErrorMessage(Messages.errorTryLater)
        })
    }
  }

  changueFAQ = element => {
    if (element.title === "" || element.content === "") {
      this.handleErrorMessage("Por favor llene todos los campos")
    } else {
      let new_extra_properties = element.extra_properties.position ? parseInt(element.extra_properties.position) : parseInt(this.state.FAQ.length - 1);
      const data = {
        extra_properties: {},
        ...element,
        module_type: "FAQ",
        image_link: "https://www.alkomprar.com/",
        redirect_link: "https://www.alkomprar.com/",
        extra_properties: {
          position: new_extra_properties,
        },
      };
      fetch(settings.backend.front_modules, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: settings.headers_auth(Auth.getSessionToken())
      }).then(FetchResponses.processResponse)
        .then(this.successChangue)
        .catch(error => {
          this.handleErrorMessage(Messages.errorTryLater)
        })
    }
  }

  changueInfo = element => {
    if (element.title === "" || element.content === "" || element.image_link === "" || element.redirect_link === "") {
      this.handleErrorMessage("Por favor llene todos los campos")
    } else {
      let new_extra_properties = element.extra_properties.position ? parseInt(element.extra_properties.position) : parseInt(this.state.information.length - 1);
      let data = new_extra_properties;
      data = {
        extra_properties: {},
        ...element,
        module_type: "Information"
      };
      fetch(settings.backend.front_modules, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: settings.headers_auth(Auth.getSessionToken())
      }).then(FetchResponses.processResponse)
        .then(this.successChangue)
        .catch(error => {
          this.handleErrorMessage(Messages.errorTryLater)
        })
    }
  }


  changueLanding = element => {
    if (element.button === "" || element.redirect_link === "") {
      this.handleErrorMessage("Por favor llene todos los campos")
    } else {
      let data = {}
      data = {
        extra_properties: { button: element.button, dripicon: element.icon },
        ...element,
        module_type: 'LandingModule',
        redirect_link: element.redirect_link,
      };

      fetch(settings.backend.front_modules, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: settings.headers_auth(Auth.getSessionToken())
      }).then(FetchResponses.processResponse)
        .then(this.successChangue)
        .catch(error => {
          this.handleErrorMessage(Messages.errorTryLater)
        })
    }
  }

  deleteContac = (contact) => {

    this.state.contactModule.forEach(element => {
      if (contact.target.id === element.name) {

        if (element.create && element.create === true) {
          this.state.contactModule.splice((this.state.contactModule.length - 1), 1);
          this.setState((prevState) => ({ contactModule: [...prevState.contactModule] }));
        } else {
          const data = {
            name: element.name,
            image_link: "https://cdn-images-1.medium.com/max/800/1*QoR3rxWIbnf5wmF_IuAHqQ.png",
            content: element.content,
            extra_properties: {},
            module_type: element.module_type,
            redirect_link: element.redirect_link,
            title: element.name
          };

          fetch(settings.backend.front_modules, {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: settings.headers_auth(Auth.getSessionToken())
          }).then(FetchResponses.processResponse)
            .then(this.successChangue)
            .catch(error => {
              this.handleErrorMessage(Messages.errorTryLater)
            })
        }

      }


    });
  }
  deleteLanding = element => {
    if (element.create && element.create === true) {
      this.state.LandingModule.splice((this.state.LandingModule.length - 1), 1);
      this.setState((prevState) => ({ LandingModule: [...prevState.LandingModule] }));
    } else {

      const data = {
        name: element.name,
        image_link: "https://cdn-images-1.medium.com/max/800/1*QoR3rxWIbnf5wmF_IuAHqQ.png",
        content: element.content,
        extra_properties: {},
        module_type: element.module_type,
        redirect_link: element.redirect_link,
        title: element.name
      };

      fetch(settings.backend.front_modules, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: settings.headers_auth(Auth.getSessionToken())
      }).then(FetchResponses.processResponse)
        .then(this.successChangue)
        .catch(error => {
          this.handleErrorMessage(Messages.errorTryLater)
        })
    }
  }

  changueContac = (event) => {

    this.state.contactModule.forEach(element => {
      if (event.target.id === element.name) {
        if (element.title === "" || element.content === "" || element.redirect_link === "") {
          this.handleErrorMessage("Por favor llene todos los campos")
        } else {
          const data = {
            extra_properties: {},
            ...element,
            content: element.content,
            title: element.title,
            redirect_link: element.redirect_link,
            module_type: "Contacto",
            image_link: "https://cdn-images-1.medium.com/max/800/1*QoR3rxWIbnf5wmF_IuAHqQ.png",
          };

          fetch(settings.backend.front_modules, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: settings.headers_auth(Auth.getSessionToken())
          }).then(FetchResponses.processResponse)
            .then(this.successChangue.bind(this))
            .catch(error => {
              this.handleErrorMessage(Messages.errorTryLater)
            })
        }


      }
    });
  }

  successChangue = (data) => {
    if (data.detail) {
      let translate = translateDetails(data.detail);
      this.handleErrorMessage(translate);
      setTimeout(function () {
        window.location.reload();
      }, 3000);

    } else {
      this.handleErrorMessage(Messages.successUpdate);
      setTimeout(function () {
        window.location.reload();
      }, 3000);
    }
  }

  handleChangeInput = (icon) => {

    this.state.LandingModule.forEach(element => {
      if (element.name === this.state.iconInex) {
        element.iconStyle = "icon icon " + icon + " text-center";
        element.icon = icon;
        this.setState({ element: element });
      }
    })
  }

  handleChangeTextLanding = (text) => {

    this.state.LandingModule.forEach(element => {
      if (element.name === text.target.id) {
        element.content = text.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangeTitleLanding = (title) => {

    this.state.LandingModule.forEach(element => {
      if (element.name === title.target.id) {
        element.title = title.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangeUrlLanding = (title) => {

    this.state.LandingModule.forEach(element => {
      if (element.name === title.target.id) {
        element.redirect_link = title.target.value;
        this.setState({ element: element });
      }
    })
  }


  handleChangeButtonLanding = (button) => {
    this.state.LandingModule.forEach(element => {
      if (element.name === button.target.id) {
        element.button = button.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangeTextCarrusel = (carrusel) => {

    this.state.fileList.forEach(element => {
      if (element.name === carrusel.target.id) {
        element.content = carrusel.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangeNameCarrusel = (carrusel) => {
    this.state.fileList.forEach(element => {
      if (element.name === carrusel.target.id) {
        element.name = carrusel.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangeRedirectCarrusel = (carrusel) => {

    this.state.fileList.forEach(element => {
      if (element.name === carrusel.target.id) {
        element.redirect_link = carrusel.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangeImgLinkCarrusel = (carrusel) => {

    this.state.fileList.forEach(element => {
      if (element.name === carrusel.target.id) {
        element.image_link = carrusel.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangeTitleCarrusel = (carrusel) => {
    this.state.fileList.forEach(element => {
      if (element.name === carrusel.target.id) {
        element.title = carrusel.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangeTextInfo = (carrusel) => {

    this.state.information.forEach(element => {
      if (element.name === carrusel.target.id) {
        element.content = carrusel.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangeNameInfo = (carrusel) => {

    this.state.information.forEach(element => {
      if (element.name === carrusel.target.id) {
        element.name = carrusel.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangeRedirectInfo = (carrusel) => {

    this.state.information.forEach(element => {
      if (element.name === carrusel.target.id) {
        element.redirect_link = carrusel.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangeImgLinkInfo = (carrusel) => {

    this.state.information.forEach(element => {
      if (element.name === carrusel.target.id) {
        element.image_link = carrusel.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangeTitleInfo = (carrusel) => {

    this.state.information.forEach(element => {
      if (element.name === carrusel.target.id) {
        element.title = carrusel.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangueQuestion = (question) => {

    this.state.FAQ.forEach(element => {
      if (element.name === question.target.id) {
        element.title = question.target.value;
        this.setState({ element: element });
      }
    })
  }

  handleChangeResponse = (response) => {
    this.state.FAQ.forEach(element => {
      if (element.name === response.target.id) {
        element.content = response.target.value;
        this.setState({ element: element });
      }
    })
  }


  handleChangeTitle = (title) => {

    this.state.contactModule.forEach(element => {
      if (element.name === title.target.id) {
        element.title = title.target.value;
        this.setState({ element: element });
      }
    })

  }

  handleChangeNumber = (number) => {

    this.state.contactModule.forEach(element => {
      if (element.name === number.target.id) {
        element.content = number.target.value;
        this.setState({ element: element });
      }
    })

  }

  handleChangeLinkSocial = (number) => {

    this.state.contactModule.forEach(element => {
      if (element.name === number.target.id) {
        element.redirect_link = number.target.value;
        this.setState({ element: element });
      }
    })

  }
  handleChange = (type) => {

    let data = {
      name: "data" + Math.random(),
      thumbUrl: "https://cdn.pixabay.com/photo/2017/11/10/05/24/upload-2935442_960_720.png",
      content: "",
      module_type: "",
      redirect_link: "",
      image_link: "https://cdn.pixabay.com/photo/2017/11/10/05/24/upload-2935442_960_720.png",
      title: "",
      create: true,
      extra_properties: { position: '' }
    }


    switch (type) {
      case "carrusel":
        this.setState((prevState) => ({ fileList: [...prevState.fileList, data] }));
        break;
      case "informacion":
        this.setState((prevState) => ({ information: [...prevState.information, data] }));
        break;
      case "FAQ":
        this.setState((prevState) => ({ FAQ: [...prevState.FAQ, data] }));
        break;
      case "landing":
        this.setState((prevState) => ({ LandingModule: [...prevState.LandingModule, data] }));
        break;
      case "contact":
        this.setState((prevState) => ({ contactModule: [...prevState.contactModule, data] }));
        break;
    }
  }

  orderCarrusel = (carrusel) => {
    this.state.fileList.forEach(element => {
      if (element.name === carrusel.target.id) {
        element.extra_properties.position = carrusel.target.value;
        this.setState({ element: element });
      }
    })
  }

  orderFaq = (faq) => {
    this.state.FAQ.forEach(element => {
      if (element.name === faq.target.id) {
        element.extra_properties.position = faq.target.value;
        this.setState({ element: element });
      }
    })
  }

  orderInfo = (info) => {
    this.state.information.forEach(element => {
      if (element.name === info.target.id) {
        element.extra_properties.position = info.target.value;
        this.setState({ element: element });
      }
    })
  }

  openIconModal = (icon) => {
    this.setState({ open: true, iconInex: icon.target.id });
  }

  handleErrorMessage = (error_message_pop = "") => {
    this.setState({ error_message_pop: error_message_pop });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  iconSelect = (icon) => {
    this.handleChangeInput(icon);
    this.handleClose();
  }

  // Functions to show confirm dialog Carrusel
  showConfirmSaveCarrusel = event => {
    let id = event.target.id;
    let _this = this;
    this.confirm({
      title: 'Alkomprar te informa.',
      content: Messages.confirmSaveData,
      okText: 'Continuar',
      cancelText: 'Cancelar',
      onCancel: true,
      onOk() {
        _this.state.fileList.forEach(element => {
          if (id === element.name) {
            let invalid_image_redirect = element.image_link.length > 0 && !element.image_link.startsWith("http");
            let invalid_redirect = element.redirect_link.length > 0 && !element.redirect_link.startsWith("http");
            if (invalid_image_redirect || invalid_redirect) {
              _this.handleErrorMessage("Por favor ingresa una url correcta");
            } else {
              _this.changueCarrusel(element);
            }
          }
        });
      },
      onCancel() {
      }
    });
  };

  showConfirmDeleteCarrusel = (event) => {
    let _this = this;
    let id = event.target.id;
    this.confirm({
      title: 'Alkomprar te informa.',
      content: Messages.confirmDeleteData,
      okText: 'Continuar',
      onOk() {
        _this.state.fileList.forEach(element => {
          if (id === element.name) {
            _this.deleteCarrusel(element);
          }
        });
      },
      onCancel() {
      }
    });
  };

  // Functions to show confirm dialog Information
  showConfirmSaveInformation = event => {
    let id = event.target.id;
    let _this = this;
    this.confirm({
      title: 'Alkomprar te informa.',
      content: Messages.confirmSaveData,
      okText: 'Continuar',
      cancelText: 'Cancelar',
      onCancel: true,
      onOk() {
        _this.state.information.forEach(element => {
          if (id === element.name) {
            _this.changueInfo(element);
          }
        });
      },
      onCancel() {
      }
    });
  };

  showConfirmDeleteInformation = (event) => {
    let _this = this;
    let id = event.target.id;
    this.confirm({
      title: 'Alkomprar te informa.',
      content: Messages.confirmDeleteData,
      okText: 'Continuar',
      onOk() {
        _this.state.information.forEach(element => {
          if (id === element.name) {
            _this.deleteInfo(element);
          }
        });
      },
    });
  };

  // Functions to show confirm dialog FAQ
  showConfirmSaveFAQ = event => {
    let id = event.target.id;
    let _this = this;
    this.confirm({
      title: 'Alkomprar te informa.',
      content: Messages.confirmSaveData,
      okText: 'Continuar',
      cancelText: 'Cancelar',
      onCancel: true,
      onOk() {
        _this.state.FAQ.forEach(element => {
          if (id === element.name) {
            _this.changueFAQ(element);
          }
        });
      },
      onCancel() {
      }
    });
  };

  showConfirmDeleteFAQ = (event) => {
    let _this = this;
    let id = event.target.id;
    this.confirm({
      title: 'Alkomprar te informa.',
      content: Messages.confirmDeleteData,
      okText: 'Continuar',
      onOk() {
        _this.state.FAQ.forEach(element => {
          if (id === element.name) {
            _this.deleteFAQ(element);
          }
        });
      },
      onCancel() {
      }
    });
  };


  // Functions to show confirm dialog Landing
  showConfirmSaveLandingModule = event => {
    let id = event.target.id;
    let _this = this;
    this.confirm({
      title: 'Alkomprar te informa.',
      content: Messages.confirmSaveData,
      okText: 'Continuar',
      cancelText: 'Cancelar',
      onCancel: true,
      onOk() {
        _this.state.LandingModule.forEach(element => {
          if (id === element.name) {
            _this.changueLanding(element);
          }
        });
      },
      onCancel() {
      }
    });
  };

  showConfirmDeleteLandingModule = (event) => {
    let _this = this;
    let id = event.target.id;
    this.confirm({
      title: 'Alkomprar te informa.',
      content: Messages.confirmDeleteData,
      okText: 'Continuar',
      onOk() {
        _this.state.LandingModule.forEach(element => {
          if (id === element.name) {
            _this.deleteLanding(element);
          }
        });
      },
      onCancel() {
      }
    });
  };
  // Finish 

  element = () => {

    return (
      <div className="container-fluid ">
        <div className="sidebar ">
          <MenuList disabled={this.state.loading} />
        </div>

        <div className="row">
          <div className="col private-wrapper ">
            <HeaderPrivate menu_list={this.state.loading} />

            <Error
              open={!!this.state.error_message_pop}
              error_message={this.state.error_message_pop}
              handleClose={() => this.handleErrorMessage()}
            />

            <div className="wrapper">
              <div className="row justify-content-center">
                <div className="col-lg-10">

                  {/* Manager del carrusel */}
                  <div className="row">
                    <div className="col col-lg-12">

                      <Collapse bordered={false} defaultActiveKey={[""]}>
                        <Panel header="Carrusel" key="1" className="panel">
                          <div className="">
                            <div>
                              <h3>Carrusel</h3>
                            </div>

                            {this.state.fileList.map(index => (

                              <div key={index.name}>
                                <hr />
                                <div className="row">
                                  <div className="col-md-4 col-sm-12">
                                    <div className="carrusel--subtitle">Imagen</div>
                                    <img src={index.image_link} alt="image_link" className="img-thumbnail"></img>
                                  </div>
                                  <div className="col-md-8 col-sm-12">
                                    <div className="row">
                                      <div className="col-sm-3 hidden carrusel--center">
                                        <span className="carrusel--subtitle">Nombre</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeNameCarrusel}
                                          value={index.name}
                                        />
                                      </div>
                                      {/* <div className="col-sm-6 carrusel--center">
                                        <span className="carrusel--subtitle">Contenido</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeTextCarrusel}
                                          value={index.content}
                                        />
                                      </div> */}
                                      <div className="col-sm-12 carrusel--center">
                                        <span className="carrusel--subtitle">Redirección</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeRedirectCarrusel}
                                          value={index.redirect_link}
                                        />
                                      </div>
                                      <div className="col-sm-9 carrusel--center">
                                        <span className="carrusel--subtitle">Link de la imagen</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeImgLinkCarrusel}
                                          value={index.image_link}
                                        />
                                      </div>
                                      <div className="col-sm-3 carrusel--center">
                                        <span className="carrusel--subtitle">Orden</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.orderCarrusel}
                                          value={index.extra_properties.position}
                                        />
                                        {/* <button className="icon dripicons-chevron-up" id="up" value={index.uid}  onClick={this.order} ></button>
                                        <button className="icon dripicons-chevron-down" id="down" value={index.uid} onClick={this.order}></button> */}
                                      </div>
                                      <div className="col-6 carrusel--center">
                                        <br></br>
                                        {index.create ?
                                          <button id={index.name} className="btn btn-sm btn-success col-12"
                                            onClick={this.showConfirmSaveCarrusel}>Crear</button> :
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.showConfirmSaveCarrusel}>Actualizar</button>}
                                      </div>
                                      <div className="col-6 carrusel--center">
                                        <br></br>
                                        {index.create ?
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.showConfirmDeleteCarrusel}>Cancelar</button> :
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.showConfirmDeleteCarrusel}>Eliminar</button>}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <br></br>
                              </div>
                            ))}

                            <div>
                              <br></br>
                              <button className="btn btn-primary col-12 col-md-4"
                                onClick={(() => (this.handleChange('carrusel')))}>Agregar
                              </button>
                            </div>
                          </div>
                        </Panel>
                      </Collapse>
                    </div>
                  </div>

                  {/* Manager de la informacion */}
                  <div className="row">
                    <div className="col col-lg-12">
                      <Collapse bordered={false} defaultActiveKey={[""]}>
                        <Panel header="Informacion" key="1" className="panel">
                          <div className="">
                            <div>
                              <h3>Información</h3>
                            </div>
                            {this.state.information.map(index => (
                              <div key={index.name}>
                                <hr />
                                <div className="row">
                                  <div className="col-md-4 col-sm-12">
                                    <div className="carrusel--subtitle">Imagen</div>
                                    <img src={index.image_link} alt="image_link" className="img-thumbnail"></img>
                                  </div>
                                  <div className="col-md-8 col-sm-12">
                                    <div className="row">
                                      <div className="col-sm-3 hidden carrusel--center">
                                        <span className="carrusel--subtitle">Nombre</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeNameInfo}
                                          readOnly value={index.name}
                                        />
                                      </div>
                                      <div className="col-sm-3 carrusel--center">
                                        <span className="carrusel--subtitle">Título</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeTitleInfo}
                                          value={index.title}
                                        />
                                      </div>
                                      <div className="col-sm-6 carrusel--center">
                                        <span className="carrusel--subtitle">Contenido</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeTextInfo}
                                          value={index.content}
                                        />
                                      </div>
                                      <div className="col-sm-3 carrusel--center">
                                        <span className="carrusel--subtitle">Orden</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.orderInfo}
                                          value={index.extra_properties.position}
                                        />
                                        {/* <button className="icon dripicons-chevron-up" id="up" value={index.uid}  onClick={this.order} ></button>
                                        <button className="icon dripicons-chevron-down" id="down" value={index.uid} onClick={this.order}></button> */}
                                      </div>
                                      <div className="col-sm-6 carrusel--center">
                                        <span className="carrusel--subtitle">Link de la imagen</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeImgLinkInfo}
                                          value={index.image_link}
                                        />
                                      </div>
                                      <div className="col-sm-6 carrusel--center">
                                        <span className="carrusel--subtitle">Redirección</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeRedirectInfo}
                                          value={index.redirect_link}
                                        />
                                      </div>
                                      <div className="col-6 carrusel--center">
                                        <br></br>
                                        {index.create ?
                                          <button id={index.name} className="btn btn-sm btn-success col-12"
                                            onClick={this.showConfirmSaveInformation}>Crear</button> :
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.showConfirmSaveInformation}>Actualizar</button>}

                                      </div>
                                      <div className="col-6 carrusel--center">
                                        <br></br>
                                        {index.create ?
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.showConfirmDeleteInformation}>Cancelar</button> :
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.showConfirmDeleteInformation}>Eliminar</button>}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <br></br>
                              </div>
                            ))}
                            <div>
                              <br></br>
                              <button className="btn btn-primary col-12 col-md-4"
                                onClick={(() => (this.handleChange('informacion')))}>Agregar
                              </button>
                            </div>
                          </div>
                        </Panel>
                      </Collapse>
                    </div>
                  </div>

                  {/* Manager de la FAQ */}
                  <div className="row">
                    <div className="col col-lg-12">
                      <Collapse bordered={false} defaultActiveKey={[""]}>
                        <Panel header="Preguntas frecuentes" key="1" className="panel">
                          <div className="">
                            <div>
                              <h3>Preguntas frecuentes</h3>
                            </div>
                            {this.state.FAQ.map(index => (
                              <div key={index.name}>
                                <hr />
                                <div className="row">
                                  <div className="col-md-12 col-sm-12">
                                    <div className="row">
                                      <div className="col-sm-6 carrusel--center">
                                        <span className="carrusel--subtitle">Pregunta</span>
                                        <textarea type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangueQuestion}
                                          value={index.title}
                                        />
                                      </div>
                                      <div className="col-sm-6 carrusel--center">
                                        <span className="carrusel--subtitle">Orden</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.orderFaq}
                                          value={index.extra_properties.position}
                                        />
                                      </div>
                                      <div className="col-sm-12 carrusel--center">
                                        <span className="carrusel--subtitle">Respuesta</span>
                                        <textarea type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeResponse}
                                          value={index.content}
                                        />
                                      </div>

                                      <div className="col-6 carrusel--center">
                                        <br></br>
                                        {index.create ?
                                          <button id={index.name} className="btn btn-sm btn-success col-12"
                                            onClick={this.showConfirmSaveFAQ}>Crear</button> :
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.showConfirmSaveFAQ}>Actualizar</button>}

                                      </div>
                                      <div className="col-6 carrusel--center">
                                        <br></br>
                                        {index.create ?
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.showConfirmDeleteFAQ}>Cancelar</button> :
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.showConfirmDeleteFAQ}>Eliminar</button>}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <br></br>
                              </div>
                            ))}
                            <div>
                              <br></br>
                              <button className="btn btn-primary col-12 col-md-4"
                                onClick={(() => (this.handleChange('FAQ')))}>Agregar
                              </button>
                            </div>
                          </div>
                        </Panel>
                      </Collapse>
                    </div>
                  </div>

                  {/* Manager landing */}

                  <div className="row">
                    <div className="col col-lg-12">
                      <Collapse bordered={false} defaultActiveKey={[""]}>
                        <Panel header="Landing" key="1" className="panel">
                          <div className="">
                            <h3>Landing</h3>
                            {this.state.LandingModule.map(index => (
                              <div key={index.name}>
                                <hr />
                                <div className="row">
                                  <div className="col-md-4 col-sm-12">
                                    <div className="col-12">
                                      <div className="carrusel--subtitle">Ícono</div>
                                      <div className={`${index.iconStyle}  carrusel--icono-big`} />
                                    </div>
                                    <button id={index.name} className="btn btn-primary btn-sm col-12"
                                      onClick={this.openIconModal}>Selecciona ícono
                                    </button>
                                    <div className="col-12">
                                      <br></br>
                                    </div>
                                  </div>
                                  <div className="col-md-8 col-sm-12">
                                    <div className="row">

                                      <div className="col-sm-4 carrusel--center">
                                        <div className="carrusel--subtitle">Texto del botón</div>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeButtonLanding}
                                          value={index.button}
                                        />
                                      </div>
                                      <div className="col-sm-4 carrusel--center">
                                        <div className="carrusel--subtitle">Título</div>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeTitleLanding}
                                          value={index.title}
                                        />
                                      </div>
                                      <div className="col-sm-4 carrusel--center">
                                        <div className="carrusel--subtitle">Dirección url</div>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeUrlLanding}
                                          value={index.redirect_link}
                                        />
                                      </div>
                                      <div className="col-sm-12 carrusel--center">
                                        <div className="carrusel--subtitle">Texto del Landing</div>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeTextLanding}
                                          value={index.content}
                                        />
                                      </div>


                                      <div className="col-sm-6 carrusel--center">
                                        <br></br>
                                        {index.create ?
                                          <button id={index.name} className="btn btn-sm btn-success col-12"
                                            onClick={this.showConfirmSaveLandingModule}>Crear</button> :
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.showConfirmSaveLandingModule}>Actualizar</button>}
                                      </div>
                                      <div className="col-sm-6 carrusel--center">
                                        <br></br>
                                        {index.create ?
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.showConfirmDeleteLandingModule}>Cancelar</button> :
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.showConfirmDeleteLandingModule}>Eliminar</button>}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            ))}
                            <div>
                              <br></br>
                              <button className="btn btn-primary col-12 col-md-4"
                                onClick={(() => (this.handleChange('landing')))}>Agregar
                              </button>
                            </div>
                            <Icons
                              open={this.state.open}
                              handleClose={this.handleClose}
                              iconSelect={this.iconSelect}
                            />
                          </div>
                        </Panel>
                      </Collapse>
                    </div>
                  </div>

                  {/*Manager contactenos  */}

                  <div className="row">
                    <div className="col col-lg-12">
                      <Collapse bordered={false} defaultActiveKey={[""]}>
                        <Panel header="Contacto" key="1" className="panel">
                          <div className="scroll">
                            <h3>Contacto</h3>
                            {this.state.contactModule.map(index => (
                              <div key={index.name}>
                                <hr />
                                <div className="row">
                                  <div className="col-md-12 col-sm-12">
                                    <div className="row">
                                      <div className="col-sm-12 carrusel--center">
                                        <span className="carrusel--subtitle">Título</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeTitle}
                                          value={index.title}
                                        />
                                      </div>
                                      <div className="col-sm-6 carrusel--center">
                                        <span className="carrusel--subtitle">Número</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeNumber}
                                          value={index.content}
                                        />
                                      </div>
                                      <div className="col-sm-6 carrusel--center">
                                        <span className="carrusel--subtitle">Link</span>
                                        <input type="text" className="form-control " id={index.name}
                                          onChange={this.handleChangeLinkSocial}
                                          value={index.redirect_link}
                                        />
                                      </div>
                                      <br></br>
                                      <div className="col-6 offset-6 carrusel--center">
                                        <br></br>
                                        {index.create ?
                                          <button id={index.name} className="btn btn-sm btn-success col-12"
                                            onClick={this.changueContac}>Crear</button> :
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.changueContac}>Actualizar</button>}
                                      </div>
                                      {/* <div className="col-6 carrusel--center">
                                        <br></br>
                                        {index.create ?
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.deleteContac}>Cancelar</button> :
                                          <button id={index.name} className="btn btn-sm btn-primary col-12"
                                            onClick={this.deleteContac}>Eliminar</button>}
                                      </div> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {/* <div>
                              <br></br>
                              <button className="btn btn-primary col-12 col-md-4"
                                onClick={(() => (this.handleChange('contact')))}>Agregar
                              </button>
                            </div> */}
                          </div>
                        </Panel>
                      </Collapse>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />

      </div>
    )
  };

  render() {
    return Auth.authenticationRequired(this.element());
  }
}

const mapStateToProps = state => ({
  props: state
})

export default connect(mapStateToProps, { SetMenuManager })(Manager);
