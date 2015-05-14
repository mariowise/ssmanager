// AngularDevise
// -------------------
// v1.0.2
//
// Copyright (c)2014 Justin Ridgewell
// Distributed under MIT license
//
// https://github.com/cloudspace/angular_devise

!function(a){"use strict";var b=a.module("Devise",[]);b.provider("AuthIntercept",function(){var a=!1;this.interceptAuth=function(b){return a=!!b||void 0===b,this},this.$get=["$rootScope","$q",function(b,c){return{responseError:function(d){var e=d.config.interceptAuth;if(e=!!e||a&&void 0===e,e&&401===d.status){var f=c.defer();return b.$broadcast("devise:unauthorized",d,f),f.promise}return c.reject(d)}}}]}).config(["$httpProvider",function(a){a.interceptors.push("AuthIntercept")}]),b.provider("Auth",function(){function b(a,b){var c={method:f[a].toLowerCase(),url:e[a]};return b&&(g?(c.data={},c.data[g]=b):c.data=b),c}function c(b,c){a.forEach(b,function(a,d){this[d+c]=function(a){return void 0===a?b[d]:(b[d]=a,this)}},this)}function d(a){return function(){return a}}var e={login:"/users/sign_in.json",logout:"/users/sign_out.json",register:"/users.json"},f={login:"POST",logout:"DELETE",register:"POST"},g="user",h=function(a){return a.data};c.call(this,f,"Method"),c.call(this,e,"Path"),this.resourceName=function(a){return void 0===a?g:(g=a,this)},this.parse=function(a){return"function"!=typeof a?h:(h=a,this)},this.$get=["$q","$http","$rootScope",function(a,c,e){function f(a){return j._currentUser=a,a}function g(){f(null)}function i(a){return function(b){return e.$broadcast("devise:"+a,b),b}}var j={_currentUser:null,parse:h,login:function(a){var d=arguments.length>0,e=j.isAuthenticated();return a=a||{},c(b("login",a)).then(j.parse).then(f).then(function(a){return d&&!e?i("new-session")(a):a}).then(i("login"))},logout:function(){var a=d(j._currentUser);return c(b("logout")).then(g).then(a).then(i("logout"))},register:function(a){return a=a||{},c(b("register",a)).then(j.parse).then(f).then(i("new-registration"))},currentUser:function(){return j.isAuthenticated()?a.when(j._currentUser):j.login()},isAuthenticated:function(){return!!j._currentUser}};return j}]})}(angular);