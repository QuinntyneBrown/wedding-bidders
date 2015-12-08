(function () {

    "use strict";

    ngX.Component({
        selector: "wb-hamburger-button",
        component: function HamburgerButtonComponent($compile, $location, $q, $scope, appendToBodyAsync, extendCssAsync, removeElement, securityStore, setOpacityAsync) {
            var self = this;
            self.$compile = $compile;
            self.$location = $location;
            self.$q = $q;
            self.$scope = $scope;
            self.appendToBodyAsync = appendToBodyAsync;
            self.extendCssAsync = extendCssAsync;
            self.removeElement = removeElement;
            self.securityStore = securityStore;
            self.setOpacityAsync = setOpacityAsync;


            self.isOpen = false;

            self.onInit = function () {

            }

            self.onClick = function () {
                if (self.isOpen) {
                    self.closeAsync()
                } else {
                    self.openAsync().then(function () {
                        self.isOpen = true;
                    });
                }                
            }

            self.openAsync = function () {
                var deferred = self.$q.defer();
                self.initializeAsync()
                    .then(self.appendMenuToBodyAsync)
                    .then(self.showAsync)
                    .then(function()  {
                        self.isOpen = true;
                        deferred.resolve();

                    });
                return deferred.promise;
            }

            self.closeAsync = function () {
                var deferred = self.$q.defer();
                self.hideAsync().then(function (results) {
                    self.dispose();
                    self.isOpen = false;
                    deferred.resolve();
                });
                return deferred.promise;
            }

            self.navigateToLogin = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/login");
                });
            }

            self.navigateToMyProfile = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/myprofile");
                });
            }

            self.navigateToMyAccount = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/myaccount");
                });
            }

            self.navigateToMyAccount = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/myaccount");
                });
            }

            self.navigateToReportAnIssue = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/reportanissue");
                });
            }

            self.navigateToCreateVendorAccount = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/caterer/register");
                });
            }

            self.menuHTML = [
                "<div class='wbHamburgerMenu' data-ng-click='vm.onClick()'>",
                "   <div class='wbHamburgerMenu-container'>",
                "       <div class='wbHamburgerMenu-links'>",
                "           <div><a data-ng-click='vm.navigateToMyProfile()'>My Profile</a><div>",
                "           <div><a data-ng-click='vm.navigateToMyAccount()'>My Account</a><div>",
                "           <div><a data-ng-click='vm.navigateToReportAnIssue()'>Report an Issue</a><div>",
                "           <div><a data-ng-click='vm.navigateToLogin()'>Logout</a><div>",                
                "       </div>",
                "   </div>",
                "</div>"
            ].join(" ");

            self.anonymousMenuHtml = [
                "<div class='wbHamburgerMenu' data-ng-click='vm.onClick()'>",
                "   <div class='wbHamburgerMenu-container'>",
                "       <div class='wbHamburgerMenu-links'>",
                "           <div><a data-ng-click='vm.navigateToLogin()'>Login</a><div>",
                "           <div><a data-ng-click='vm.navigateToCreateAccount()'>Create Account</a><div>",
                "           <div><a data-ng-click='vm.navigateToCreateVendorAccount()'>Create Vendor Account</a><div>",
                "       </div>",
                "   </div>",
                "</div>"
            ].join(" ");

            self.initializeAsync = function() {
                var deferred = self.$q.defer();

                self.augmentedJQuery = self.$compile(angular.element(securityStore.token ? self.menuHTML : self.anonymousMenuHtml))(self.$scope);
                self.nativeElement = self.augmentedJQuery[0];

                self.extendCssAsync({
                    nativeHTMLElement: self.nativeElement,
                cssObject: {
                    "-webkit-transition": "opacity 25ms ease-in-out",
                    "-o-transition": "opacity 25ms ease-in-out",
                    "transition": "opacity 25ms ease-in-out",
                    "opacity": "0",
                    "position": "fixed",
                    "top": "0",
                    "left": "0",
                    "height": "100%",
                    "width": "100%",
                    "background-color":"rgba(0, 0, 0, .75)",
                    "display": "block",
                    "z-index":"999"
                }
                }).then(function () {
                    deferred.resolve();
                });

                return deferred.promise;
            }

            self.showAsync = function() {
                return self.setOpacityAsync({ nativeHtmlElement: self.nativeElement, opacity: 25 });
            }
    
            self.appendMenuToBodyAsync = function() {
                return self.appendToBodyAsync({ nativeElement: self.nativeElement });
            }

            self.hideAsync = function() {
                return self.setOpacityAsync({ nativeHtmlElement: self.nativeElement, opacity: 0 });
            }

            self.dispose = function () {
                try {
                    self.removeElement({ nativeHTMLElement: self.nativeElement });
                    self.augmentedJQuery = null;
                }
                catch (error) {

                }
            }

            self.nativeElement; 

            self.augmentedJQuery;

            self.isAnimating= false;

            return self;
        },
        styles: [

            " .wbHamburgerButton { ",
            "     width:20px; ",
            "     height:24px; ",
            "     background-color: #FFF; ",
            "     border: #aaaaaa 0px solid; ",
            "     border-radius: 2px; ",
            "     padding: 2px 5px; ",
            "     cursor:pointer; ",
            " } ",

            " .wbHamburgerMenu { ",
            "     width: 100%; ",
            " } ",

            " .wbHamburgerButton div { ",
            "     width: 20px; ",
            "     height: 3px; ",
            "     background: #333; ",
            "     margin: 4px 0; ",
            "     border-radius: 2px; ",
            " } ",

            " .wbHamburgerMenu-container { ",
            "     max-width: 1024px; ",
            "     margin: 0 auto; ",
            " } ",

            " .wbHamburgerMenu a { ",
            "     font-size: 1.75em; ",
            "     line-height: 3.625em; ",
            "     color: #FFF; ",
            "     cursor: pointer; ",
            " } ",

            " .wbHamburgerMenu a:hover { ",
            "     text-decoration: underline; ",
            " } ",

            " .wbHamburgerMenu-links { ",
            "     position: relative; ",
            "     text-align: right; ",
            "     float: right; ",
            "     padding-top: 20px; ",
            "     margin-right: 70px; ",
            " } "


        ].join(" \n "),
        providers: ["$compile","$location","$q", "$scope", "appendToBodyAsync", "extendCssAsync", "removeElement", "securityStore", "setOpacityAsync"],
        template: [
            "<div class='wbHamburgerButton' data-ng-click='vm.onClick()'>",
            "<div></div>",
            "<div></div>",
            "<div></div>",
            "</div>"
        ].join(" ")
    });


})();