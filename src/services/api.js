class Api {
    async _getTravels(url) {
      try {
        const fetchResponse = await fetch('http://localhost:3000/api/travels/');
        const data = await fetchResponse.json();
        return data;
      } catch (e) {
        return e;
      }
    }
  
  }
  
  export default new Api();
  