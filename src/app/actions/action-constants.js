﻿angular.module("app").value("WEDDING_ACTIONS", {
    ADD_WEDDING: "ADD_WEDDING",
    DELETE: "DELETE_WEDDING",
    UPDATE_ALL_WEDDINGS: "UPDATE_ALL_WEDDINGS",
    UPDATE_BY_ID: "UPDATE_WEDDING_BY_ID",
    UPDATE_BY_PROFILE: "UPDATE_WEDDING_BY_PROFILE",
    UPDATE_CURRENT_WEDDING: "UPDATE_CURRENT_WEDDING"
});

angular.module("app").value("MESSAGE_ACTIONS", {
    ADD: "ADD_MESSAGE",
    UPDATE_ALL_CURRENT_PROFILE_MESSAGES: "UPDATE_ALL_CURRENT_PROFILE_MESSAGES",
    UPDATE_ALL_ISSUES: "UPDATE_ALL_ISSUES"
});

angular.module("app").value("CONVERSATION_ACTIONS", {
    UPDATE_ALL_ISSUE_CONVERSATIONS: "UPDATE_ALL_ISSUE_CONVERSATIONS",
    UPDATE_ALL_INTER_PROFILE_CONVERSATIONS: "UPDATE_ALL_INTER_PROFILE_CONVERSATIONS"
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
    UPDATE_TYPES: "UPDATE_BIDDER_TYPES",
    UPDATE_BY_BID_ID: "UPDATE_BY_BID_ID"
});

angular.module("app").value("CUSTOMER_ACTIONS", {
    ADD_CUSTOMER: "ADD_CUSTOMER",
    UPDATE_ALL: "UPDATE_ALL_CUSTOMERS",
});

angular.module("app").value("BID_ACTIONS", {
    ADD_BID: "ADD_BID",
    GET_ALL_BY_PROFILE_ID: "GET_ALL_BY_CURRENT_PROFILE",
    UPDATE_BY_PROFILE: "UPDATE_BIDS_BY_PROFILE"
});

angular.module("app").value("PROFILE_ACTIONS", {
    UPDATE_CURRENT_PROFILE: "UPDATE_CURRENT_PROFILE",
    UPDATE_IS_PERSONALIZED_FLAG: "UPDATE_IS_PERSONALIZED_FLAG",
    UPDATE_PROFILE_BY_BID: "UPDATE_PROFILE_BY_BID"
});

angular.module("app").value("SUBSCRIPTION_ACTIONS", {
    CHARGE: "CHARGE",
    CHARGE_SUCCESS: "CHARGE_SUCCESS",
    CHARGE_FAILED: "CHARGE_FAILED"
});