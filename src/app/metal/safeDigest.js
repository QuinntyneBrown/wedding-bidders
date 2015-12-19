(function () {

    function safeDigest(scope) {
        if (!scope.$$phase && !scope.$root.$$phase)
            scope.$digest();
    }


    angular.module("app").value("safeDigest", safeDigest);
})();