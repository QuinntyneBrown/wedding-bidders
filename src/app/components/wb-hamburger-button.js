(function () {

    "use strict";

    ngX.Component({
        selector: "wb-hamburger-button",
        component: function HamburgerButtonComponent($q, appendToBodyAsync, extendCssAsync, removeElement, setOpacityAsync) {
            var self = this;
            self.$q = $q;
            self.appendToBodyAsync = appendToBodyAsync;
            self.extendCssAsync = extendCssAsync;
            self.removeElement = removeElement;
            self.setOpacityAsync = setOpacityAsync;

            self.isOpen = false;

            self.onInit = function () {

            }

            self.onClick = function () {
                if (self.isMenuVisible) {
                    self.closeAsync();
                } else {
                    self.openAsync();
                }
            }

            self.openAsync = function () {
                var deferred = self.$q.defer();
                self.initializeAsync()
                    .then(self.appendBackDropToBodyAsync)
                    .then(self.showAsync)
                    .then(() => {
                        self.isOpen = true;
                        deferred.resolve();

                    });
                return deferred.promise;
            }

            self.closeAsync = function () {
                var deferred = self.$q.defer();
                self.hideAsync().then((results) => {
                    self.dispose();
                    self.isOpen = false;
                    deferred.resolve();
                });
                return deferred.promise;
            }

            self.initializeAsync = function() {
                var deferred = self.$q.defer();

                self.augmentedJQuery = angular.element("<div></div>");

                self.extendCssAsync({
                nativeHTMLElement: self.nativeHTMLElement,
                cssObject: {
                    "-webkit-transition": "opacity 300ms ease-in-out",
                    "-o-transition": "opacity 300ms ease-in-out",
                    "transition": "opacity 300ms ease-in-out",
                    "opacity": "0",
                    "position": "fixed",
                    "top": "0",
                    "left": "0",
                    "height": "100%",
                    "width": "100%",
                    "background-color":"rgba(0, 0, 0, .25)",
                    "display": "block"
                }
                }).then(function () {
                    deferred.resolve();
                });

                return deferred.promise;
            }

            self.showAsync = function() {
                return this.setOpacityAsync({ nativeHtmlElement: this.nativeHTMLElement, opacity: 25 });
            }
    
            self.appendBackDropToBodyAsync = function() {
                return this.appendToBodyAsync({ nativeElement: this.nativeHTMLElement });
            }

            self.hideAsync = function() {
                return this.setOpacityAsync({ nativeHtmlElement: this.nativeHTMLElement, opacity: 0 });
            }

            self.dispose = function() {
                this.removeElement({ nativeHTMLElement: this.nativeHTMLElement });
                this.augmentedJQuery = null;
            }

            self.nativeHTMLElement; 

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

            " .wbHamburgerButton div { ",
            "     width: 20px; ",
            "     height: 3px; ",
            "     background: #333; ",
            "     margin: 4px 0; ",
            "     border-radius: 2px; ",
            " } "

        ].join(" \n "),
        providers: ["$q","appendToBodyAsync", "extendCssAsync", "removeElement", "setOpacityAsync"],
        template: [
            "<div class='wbHamburgerButton' data-ng-click='vm.onClick()'>",
            "<div></div>",
            "<div></div>",
            "<div></div>",
            "</div>"
        ].join(" ")
    });


})();