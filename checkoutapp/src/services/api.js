class Api {
    async _getPostalCodes(code) {
      try {
        console.log('Is entering here?', code)
        const fetchResponse = await fetch('https://blackisp.herokuapp.com/postalCodes/'+code);
        const data = await fetchResponse.json();
        return data;
      } catch (e) {
        return e;
      }
    }

    async _postContact(data) {
      console.log('what is data ',data )
      const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    };
      try {
        const fetchResponse = await fetch(`https://blackisp.herokuapp.com/contact`, settings);
        const data = await fetchResponse.json();
        alert("Los datos fueron guardados correctamente es correcta!.");
        return data;
      } catch (e) {
        alert("Los datos no fueron guardados correctamente!.");
        return e;
      }
    }

    async _getProducts() {
      try {
        const fetchResponse = await fetch('https://blackisp.herokuapp.com/products');
        const data = await fetchResponse.json();
        return data;
      } catch (e) {
        return e;
      }
    }
  }
  
  export default new Api();
  