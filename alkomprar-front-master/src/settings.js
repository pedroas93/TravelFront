const base = {
  super_token: process.env.REACT_APP_SUPER_TOKEN,
  host: process.env.REACT_APP_BACKEND_HOST,
  recaptcha_site_key: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
  google_maps_key: process.env.REACT_APP_GOOGLE_MAPS_KEY,
};

const settings = {
  recaptcha: {
    site_key: base.recaptcha_site_key,
    url_render: `https://www.google.com/recaptcha/api.js?render=${base.recaptcha_site_key}`,
  },
  maps: {
    google_maps_key: base.google_maps_key
  },
  headers_without_auth: {
    "Content-Type": "application/json"
  },
  headers_auth: function (token) {
    return {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    }
  },
  headers_super_auth: {
    "Content-Type": "application/json",
    "Authorization": `Token ${base.super_token}`
  },
  backend: {
    consult_user: `${base.host}v1/alk_user/`,
    pre_register: `${base.host}v1/preregister/`,
    register: `${base.host}v1/register/`,
    login: `${base.host}v1/login/`,
    logout: `${base.host}v1/logout/`,
    password_reset: `${base.host}v1/password_reset/`,
    password_reset_confirm: `${base.host}v1/password_reset_confirm/`,
    changePassword: `${base.host}v1/password_change/`,
    dataResponse: `${base.host}v1/user/`,
    summary: `${base.host}v1/summary/`,
    invoices: `${base.host}v1/invoices/`,
    states: `${base.host}v1/states/`,
    cities: (state => {
      return `${base.host}v1/cities/state=${state}`
    }),
    banks: `${base.host}v1/payment/banks/`,
    pay_invoices: `${base.host}v1/payment/pay/`,
    list_transactions: `${base.host}v1/payment/list/`,
    details_transaction: (transaction => {
      return `${base.host}v1/payment/details/${transaction}/`
    }),
    rent_certificate: (year => {
      return `${base.host}v1/alk_rent_cert/${year}/`
    }),
    debt_certificate: `${base.host}v1/alk_debt_cert/`,
    all_invoices: `${base.host}v1/alk_all_invoices/`,
    peace_salve_certificate: `${base.host}v1/alk_peace_salve_cert/`,
    payment_plan_certificate: (invoice => {
      return `${base.host}v1/alk_payment_plan_cert/${invoice}/`
    }),
    maps_data: `${base.host}v1/stores/`,
    list_front_modules: `${base.host}v1/front_modules/list/`,
    front_modules: `${base.host}v1/front_module/`,
    admin_all_invoices: (user => {
      return `${base.host}v1/admin/alk_all_invoices/${user}/`
    }),
    admin_rent_cert: ((user, year) => {
      return `${base.host}v1/admin/alk_rent_cert/${user}/${year}/`
    }),
    admin_debt_cert: (user => {
      return `${base.host}v1/admin/alk_debt_cert/${user}/`
    }),
    admin_peace_salve_cert: (user => {
      return `${base.host}v1/admin/alk_peace_salve_cert/${user}/`
    }),
    admin_payment_plan_cert: ((user, invoice) => {
      return `${base.host}v1/admin/alk_payment_plan_cert/${user}/${invoice}/`
    }),
    enable: `${base.host}v1/admin/deactivate/`,
    list_user: `${base.host}v1/admin/users/`,
    conciliation_file: `${base.host}v1/payment/conciliate/`,
  },
  unauthenticated_user_page: "/",
  authenticated_user_page: "/resumen",
  authenticated_admin_page: "/manager"
};

export default settings;
