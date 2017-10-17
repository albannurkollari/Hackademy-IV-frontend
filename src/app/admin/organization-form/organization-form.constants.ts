export const REGEXES = {
    email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    organizationName : /^([A-Za-z0-9]{6})+[-]+([A-Za-z0-9]{4})/,
    city : /^([A-Za-z])/,
    bankAccount : /^([0-9]{4})+[-]+([0-9]{4})+[-]+([0-9]{4})+[-]+([0-9]{4}){"/,
    zipCode: /[0-9]{5}/
};
