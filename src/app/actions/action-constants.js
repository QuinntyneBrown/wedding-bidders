﻿angular.module("app").value("WEDDING_ACTIONS", {
    ADD_WEDDING: "ADD_WEDDING",
    UPDATE_ALL_WEDDINGS: "UPDATE_ALL_WEDDINGS",
    UPDATE_BY_ID: "UPDATE_WEDDING_BY_ID",
    UPDATE_BY_PROFILE: "UPDATE_WEDDING_BY_PROFILE"
});

angular.module("app").value("MESSAGE_ACTIONS", {
    ADD: "ADD_MESSAGE",
    UPDATE_ALL_CURRENT_PROFILE_MESSAGES: "UPDATE_ALL_CURRENT_PROFILE_MESSAGES"
});

angular.module("app").value("ACCOUNT_ACTIONS", {
    UPDATE_CURRENT_ACCOUNT: "UPDATE_CURRENT_ACCOUNT",
    UPDATE_BILLING: "UPDATE_BILLING",
});


angular.module("app").value("SECURITY_ACTIONS", {
    LOGIN: "LOGIN",
    LOGIN_FAIL: "LOGIN_FAIL"
});

angular.module("app").value("BIDDER_ACTIONS", {
    ADD: "ADD_BIDDER",
    UPDATE_ALL: "UPDATE_ALL_BIDDERS",
    UPDATE_BY_ID: "UPDATE_BIDDER_BY_ID",
    UPDATE_TYPES: "UPDATE_BIDDER_TYPES"
});

angular.module("app").value("CUSTOMER_ACTIONS", {
    ADD_CUSTOMER: "ADD_CUSTOMER",
});

angular.module("app").value("BID_ACTIONS", {
    ADD_BID: "ADD_BID",
    GET_ALL_BY_PROFILE_ID: "GET_ALL_BY_CURRENT_PROFILE",
    UPDATE_BY_PROFILE: "UPDATE_BIDS_BY_PROFILE"
});

angular.module("app").value("PROFILE_ACTIONS", {
    UPDATE_CURRENT_PROFILE: "UPDATE_CURRENT_PROFILE",
    UPDATE_IS_PERSONALIZED_FLAG: "UPDATE_IS_PERSONALIZED_FLAG"
});

angular.module("app").value("SUBSCRIPTION_ACTIONS", {
    CHARGE: "CHARGE",
    CHARGE_SUCCESS: "CHARGE_SUCCESS",
    CHARGE_FAILED: "CHARGE_FAILED"
});