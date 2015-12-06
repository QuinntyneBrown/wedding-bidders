angular.module("app").value("WEDDING_ACTIONS", {
    ADD_WEDDING: "ADD_WEDDING",
    UPDATE_ALL_WEDDINGS: "UPDATE_ALL_WEDDINGS",
    UPDATE_BY_ID: "UPDATE_WEDDING_BY_ID"
});

angular.module("app").value("MESSAGE_ACTIONS", {
    ADD: "ADD_MESSAGE",
});

angular.module("app").value("SECURITY_ACTIONS", {
    LOGIN: "LOGIN",
});

angular.module("app").value("CATERER_ACTIONS", {
    ADD_CATERER: "ADD_CATERER",
    UPDATE_ALL_CATERERS: "UPDATE_ALL_CATERERS",
    UPDATE_BY_ID: "UPDATE_BY_ID"
});

angular.module("app").value("CUSTOMER_ACTIONS", {
    ADD_CUSTOMER: "ADD_CUSTOMER",
});

angular.module("app").value("BID_ACTIONS", {
    ADD_BID: "ADD_BID",
});

angular.module("app").value("PROFILE_ACTIONS", {
    UPDATE_CURRENT_PROFILE: "UPDATE_CURRENT_PROFILE"
});