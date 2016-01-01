angular.module("app").value("PROFILE_TYPE", {
    CUSTOMER: 0,
    CATERER: 1,
    PHOTOGRAPHER: 2,
    MAKE_UP_ARTIST: 3,
    EVENT_PLANNER: 4,
    INTERNAL: 5
});

angular.module("app").value("MESSAGE_TYPE", {
    NORMAL: 0,
    ISSUE: 1
});

angular.module("app").value("ACCOUNT_STATUS", {
    FREE: 0,
    PAID: 1,
    UPDAID: 2
});