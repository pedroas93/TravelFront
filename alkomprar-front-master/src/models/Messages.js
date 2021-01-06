export const BackMessages = {
  userAlreadyExists: "User already exists.",
  emailAlreadyExists: "Email already exists.",
  invalidPassword: "Invalid password.",
  blacklistedEmail: "Email Blacklisted.",
  blacklistedPhone: "Phone Blacklisted.",
  inactiveUser: "Inactive user.",
  userDoesNotRegister: "User does not exists.",
  userWithUncompletedRegister: "The user needs to finish the registration.",
  successChangePassword: "Successful change password.",
  successResetPassword: "Successful password reset.",
  invalidCaptcha: "Invalid captcha token.",
  otpDoesNotExists: "Invalid OTP. Does not exits.",
  invalidOTP: "Invalid OTP. Try again.",
  invalidFormatOTP: "OTP with invalid format.",
  expiredOTP: "Expired OTP. Try again with new OTP.",
  exceededAttemptsOTP: "Invalid OTP and exceeds number of OTP attempts.Try again with new OTP.",
};

export const Messages = {
  userDoesNotExists:
    "Te informamos que tu cédula no se encuentra registrada en nuestra base de datos como cliente de crédito 20 minutos." +
    "Te recordamos que puedes adquirir un crédito en cualquiera de nuestras tiendas.",
  userAlreadyExists: "El usuario ya se encuentra registrado.",
  incorrectEmail: "Por favor digita un correo válido",
  incorrectPhone: "Por favor digita un teléfono válido",
  emailAlreadyExists: "El email ya se encuentra registrado con otro usuario.",
  blacklistedEmail: "Email bloqueado.",
  errorTryLater: "Ha ocurrido un problema, por favor intenta mas tarde.",
  minNumberOfFiscalNumber: "Asegúrate de que la cédula tenga mínimo cinco (5) dígitos",
  errorTryAgain: "Ha ocurrido un error al cargar los datos, por favor recarga nuevamente.",
  userDoesNotRegister: "El usuario no se encuentra registrado.",
  invalidPassword: "Contraseña incorrecta, verifica nuevamente.",
  userRegisterSuccessfully: "Terminaste tu registo correctamente. Ya puedes iniciar sesión.",
  passwordsDoesNotMatch: "Las contraseñas deben ser iguales.",
  passwordLenght: "La contraseña debe tener minimo 8 caracteres.",
  requiredValues: "Debes ingresar los datos requeridos.",
  successUpdate: "Datos actualizados correctamente, gracias por registrar tus datos.",
  successDelete: "Datos eliminados correctamente",
  successChangePassword: "Contraseña actualizada correctamente. Por favor inicia sesión nuevamente.",
  successResetPassword: "Contraseña actualizada correctamente. Por favor inicia sesión.",
  errorInPay: "Encontramos que ya se realizó recaudo a la factura, el día de mañana estará disponible para nuevos pagos.",
  OTPMailAndPhone: (mail, phone) => (
    `Digita el código de confirmación que te fue enviado al correo ${mail} y al teléfono ${phone}.`
  ),
  OTPMail: phone => (
    `Digita el código de confirmación que te fue enviado al correo ${phone}.`
  ),
  OTPPhone: phone => (
    `Digita el código de confirmación que te fue enviado al teléfono ${phone}.`
  ),
  sessionExpired: "Sesión expirada. Inicia sesión nuevamente.",
  userWithBalanceInWallet: "El cliente presenta saldo en cartera.",
  userWithoutOpenInvoices: "Usted no cuenta con facturas abiertas.",
  loadingDocument: "Descargando documento, por favor espera...",
  invalidDate: "Fecha invalida, por favor verifica que sea correcta.",
  inactiveUser: "Tu usuario se encuentra inactivo, para más detalles comuníquese a nuestra línea Medellín: " +
    "(034) 604 2323 - Línea Gratuita Nacional: 018000 94 6000.",
  userWithUncompletedRegister: "Usuario con registro incompleto, favor de finalizar su registro.",
  infoCertPeaceSalve: "Te recordamos que el paz y salvo solo se podrá generar dos días después de haber realizado el " +
    " pago total de tu crédito.",
  invalidCaptcha: "El captcha que validaste, acaba de expirar, reitenta por favor.",
  otpDoesNotExists: "No solicistaste el código de confirmación, por favor intenta nuevamente.",
  invalidOTP: "Código de confirmación incorrecto, intenta nuevamente.",
  invalidFormatOTP: "Código de confirmación con formato incorrecto, intenta nuevamente.",
  expiredOTP: "Código de confirmación expirado. Por favor genera uno nuevamente.",
  exceededAttemptsOTP: "Excediste la cantidad de intentos. Por favor genera un nuevo código de confirmación.",
  confirmSaveData: "¿Estás seguro de guardar cambios?",
  confirmDeleteData: "¿Estás seguro de eliminar este elemento?",
};

export const translateTransaction = (status, response_gateway) => {
  const translate = {
    Init: 'Iniciada',
    Approved: 'Aprobada',
    Fail: 'Fallida',
    Cancelled: 'Cancelada',
    Pending: 'Pendiente',
    Error: 'Error',
    Rejected: 'Rechazada',
  };

  if (status === 'Fail' && response_gateway === 'NOT_AUTHORIZED') {
    return translate.Rejected;
  }

  return translate[status];
};

export const translatePSEResponse = message => {
  if (message === 'FAIL_EXCEEDEDLIMIT') {
    return 'El monto de la transacción excede los límites establecidos en PSE para la empresa, por favor comuníquese' +
      ' a nuestra línea Medellín: (034) 604 2323 - Línea Gratuita Nacional: 018000 94 6000.'
  } else {
    return 'No se pudo crear la transacción, por favor intente más tarde o comuníquese a nuestra línea Medellín:' +
      ' (034) 604 2323 - Línea Gratuita Nacional: 018000 94 6000.'
  }
};

export const translateDetails = message => {
  let translate = Messages.errorTryLater;
  switch (message) {
    case "Some invoice has a pending / approved payment today.":
      translate = "Encontramos que ya se realizó recaudo a la factura, el día de mañana estará disponible para nuevos pagos.";
      break;

    case BackMessages.userDoesNotRegister:
      translate = Messages.userDoesNotRegister;
      break;

    case "User does not have this certificate.":
      translate = "El usuario no tiene este certificado.";
      break;

    case "Client without open invoices.":
      translate = "Cliente sin facturas abiertas.";
      break;

    case "Client has balance in wallet.":
      translate = "El cliente tiene saldo en la cartera.";
      break;

    case "Invoice without payment plan or does not exists.":
      translate = "Factura sin plan de pago o no existe.";
      break;

    case "Front module deleted successfully.":
      translate = "Front module eliminado con éxito.";
      break;

    case "User was activated successfully.":
      translate = "El usuario fue activado exitosamente.";
      break;

    case "User was deactivated successfully.":
      translate = "El usuario fue desactivado exitosamente.";
      break;

    case "User does not have invoices.":
      translate = "El usuario no tiene facturas.";
      break;

    case BackMessages.emailAlreadyExists:
      translate = Messages.emailAlreadyExists;
      break;

    case BackMessages.blacklistedEmail:
      translate = Messages.incorrectEmail;
      break;

    case BackMessages.blacklistedPhone:
      translate = Messages.incorrectPhone;
      break;

    case BackMessages.inactiveUser:
      translate = Messages.inactiveUser;
      break;

    case BackMessages.invalidPassword:
      translate = Messages.invalidPassword;
      break;

    case BackMessages.userWithUncompletedRegister:
      translate = Messages.userWithUncompletedRegister;
      break;

    case BackMessages.successChangePassword:
      translate = Messages.successChangePassword;
      break;

    case BackMessages.successResetPassword:
      translate = Messages.successResetPassword;
      break;

    case BackMessages.invalidCaptcha:
      translate = Messages.invalidCaptcha;
      break;

    case BackMessages.otpDoesNotExists:
      translate = Messages.otpDoesNotExists;
      break;

    case BackMessages.invalidOTP:
      translate = Messages.invalidOTP;
      break;

    case BackMessages.invalidFormatOTP:
      translate = Messages.invalidFormatOTP;
      break;

    case BackMessages.expiredOTP:
      translate = Messages.expiredOTP;
      break;

    case BackMessages.exceededAttemptsOTP:
      translate = Messages.exceededAttemptsOTP;
      break;

    default:
      translate = Messages.errorTryLater;
      break;
  }
  return translate
};

