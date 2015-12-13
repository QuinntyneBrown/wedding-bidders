﻿angular.module("app").value("WEDDING_ACTIONS", {
    ADD_WEDDING: "ADD_WEDDING",
    UPDATE_ALL_WEDDINGS: "UPDATE_ALL_WEDDINGS",
    UPDATE_BY_ID: "UPDATE_WEDDING_BY_ID"
});

angular.module("app").value("MESSAGE_ACTIONS", {
    ADD: "ADD_MESSAGE",
    UPDATE_ALL_CURRENT_PROFILE_MESSAGES: "UPDATE_ALL_CURRENT_PROFILE_MESSAGES"
});

angular.module("app").value("SECURITY_ACTIONS", {
    LOGIN: "LOGIN",
});

angular.module("app").value("BIDDER_ACTIONS", {
    ADD: "ADD_BIDDER",
    UPDATE_ALL: "UPDATE_ALL_BIDDERS",
    UPDATE_BY_ID: "UPDATE_BIDDER_BY_ID"
});

angular.module("app").value("CUSTOMER_ACTIONS", {
    ADD_CUSTOMER: "ADD_CUSTOMER",
});

angular.module("app").value("BID_ACTIONS", {
    ADD_BID: "ADD_BID",
    GET_ALL_BY_PROFILE_ID: "GET_ALL_BY_CURRENT_PROFILE"
});

angular.module("app").value("PROFILE_ACTIONS", {
    UPDATE_CURRENT_PROFILE: "UPDATE_CURRENT_PROFILE"
});