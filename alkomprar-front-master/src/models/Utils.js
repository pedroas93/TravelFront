class Utils {

  static jsonConcat(o1, o2) {
    for (let key in o2) {
      o1[key] = o2[key];
    }
    return o1;
  }

  static convertToReadableDate = date_string => {
    // format yyyy-mm-dd
    let year = date_string.split('-')[0];
    let month = parseInt(date_string.split('-')[1]);
    let day = date_string.split('-')[2];

    const months = {
      1: "ENERO",
      2: "FEBRERO",
      3: "MARZO",
      4: "ABRIL",
      5: "MAYO",
      6: "JUNIO",
      7: "JULIO",
      8: "AGOSTO",
      9: "SEPTIEMBRE",
      10: "OCTUBRE",
      11: "NOVIEMBRE",
      12: "DICIEMBRE",
    };
    return `${day} de ${months[month]} del ${year}`;
  }

}

export default Utils;
