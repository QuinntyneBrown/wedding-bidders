(function () {

    "use strict";

    function convertCameCaseToTitleCase(value) {
        var result = value.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    angular.module("app").value("convertCamelCaseToTitleCase", convertCameCaseToTitleCase);

})();