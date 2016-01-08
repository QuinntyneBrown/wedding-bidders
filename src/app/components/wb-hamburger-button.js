(function () {

    "use strict";

    ngX.Component({
        selector: "wb-hamburger-button",
        component: function HamburgerButtonComponent($compile, $location, $q, $scope, appendToBodyAsync, extendCssAsync, profileStore, PROFILE_TYPE, removeElement, securityStore, setOpacityAsync) {
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
            self.profileStore = profileStore;
            self.PROFILE_TYPE = PROFILE_TYPE;

            self.isOpen = false;

            self.onInit = function () { }

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


            self.navigateToWeddings = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/weddings");
                });
            }

            self.navigateToBids = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/bids");
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

            self.navigateToMyMessages = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/messages");
                });
            }

            self.navigateToReportAnIssue = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/reportanissue");
                });
            }

            self.navigateToCreateAccount = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/customer/register");
                });
            }

            self.navigateToSubmitWedding = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/wedding/create");
                });
            }

            self.navigateToCreateBidderAccount = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/bidder/register");
                });
            }

            self.isCustomer = function () {
                return self.profileStore.currentProfile
                    && self.profileStore.currentProfile.profileType === self.PROFILE_TYPE.CUSTOMER;
            }

            self.isInternal = function () {
                return self.profileStore.currentProfile
                    && self.profileStore.currentProfile.profileType === self.PROFILE_TYPE.INTERNAL;
            }

            self.isBidder = function () {
                return self.profileStore.currentProfile
                    && self.profileStore.currentProfile.profileType !== self.PROFILE_TYPE.CUSTOMER
                    && self.profileStore.currentProfile.profileType !== self.PROFILE_TYPE.INTERNAL;
            }

            self.customerMenuHTML = [
                "<div class='wbHamburgerMenu' data-ng-click='vm.onClick()'>",
                "   <div class='wbHamburgerMenu-container'>",
                "       <div class='wbHamburgerMenu-links'>",
                "           <div><a data-ng-click='vm.navigateToSubmitWedding()'>Submit Wedding</a><div>",
                "           <div><a data-ng-click='vm.navigateToMyProfile()'>My Profile</a><div>",
                "           <div><a data-ng-click='vm.navigateToMyMessages()'>My Messages</a><div>",
                "           <div><a data-ng-click='vm.navigateToReportAnIssue()'>Report an Issue</a><div>",
                "           <div><a data-ng-click='vm.navigateToLogin()'>Logout</a><div>",                
                "       </div>",
                "   </div>",
                "</div>"
            ].join(" ");

            self.bidderMenuHTML = [
            "<div class='wbHamburgerMenu' data-ng-click='vm.onClick()'>",
            "   <div class='wbHamburgerMenu-container'>",
            "       <div class='wbHamburgerMenu-links'>",
            "           <div><a data-ng-click='vm.navigateToWeddings()'>Weddings</a><div>",
            "           <div><a data-ng-click='vm.navigateToBids()'>My Bids</a><div>",
            "           <div><a data-ng-click='vm.navigateToMyProfile()'>My Profile</a><div>",
            "           <div><a data-ng-click='vm.navigateToMyMessages()'>My Messages</a><div>",
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
                "           <div><a data-ng-click='vm.navigateToCreateBidderAccount()'>Create Bidder Account</a><div>",
                "       </div>",
                "   </div>",
                "</div>"
            ].join(" ");

            self.internalMenuHTML = [
                "<div class='wbHamburgerMenu' data-ng-click='vm.onClick()'>",
                "   <div class='wbHamburgerMenu-container'>",
                "       <div class='wbHamburgerMenu-links'>",
                "           <div><a data-ng-click='vm.navigateToMyProfile()'>Dashboard</a><div>",
                "           <div><a data-ng-click='vm.navigateToLogin()'>Logout</a><div>",
                "       </div>",
                "   </div>",
                "</div>"
            ].join(" ");

            self.initializeAsync = function() {
                var deferred = self.$q.defer();
                var html = self.getMenuHtml();
                self.augmentedJQuery = self.$compile(angular.element(html))(self.$scope);
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

            self.getMenuHtml = function () {
                if (!securityStore.token)
                    return self.anonymousMenuHtml;

                if (self.isCustomer())
                    return self.customerMenuHTML;

                if (self.isBidder())
                    return self.bidderMenuHTML;

                if (self.isInternal())
                    return self.internalMenuHTML;
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
        ],
        providers: ["$compile","$location","$q", "$scope", "appendToBodyAsync", "extendCssAsync", "profileStore", "PROFILE_TYPE", "removeElement", "securityStore", "setOpacityAsync"],
        template: [
            "<div class='wbHamburgerButton' data-ng-click='vm.onClick()'>",
            "<div></div>",
            "<div></div>",
            "<div></div>",
            "</div>"
        ]
    });
})();