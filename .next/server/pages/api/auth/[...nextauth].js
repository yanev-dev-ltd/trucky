"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/auth/[...nextauth]";
exports.ids = ["pages/api/auth/[...nextauth]"];
exports.modules = {

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "next-auth":
/*!****************************!*\
  !*** external "next-auth" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ "(api)/./src/pages/api/auth/[...nextauth].ts":
/*!*********************************************!*\
  !*** ./src/pages/api/auth/[...nextauth].ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"authOptions\": () => (/* binding */ authOptions),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dotenv */ \"dotenv\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_1__);\n\n// import { FirestoreAdapter } from '@next-auth/firebase-adapter'\n\ndotenv__WEBPACK_IMPORTED_MODULE_1__.config();\nconst authOptions = {\n    // Include user.id on session\n    callbacks: {\n        session ({ session , user  }) {\n            if (session.user) {\n                session.user.id = user.id;\n            }\n            return session;\n        }\n    },\n    // Configure one or more authentication providers\n    providers: []\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (next_auth__WEBPACK_IMPORTED_MODULE_0___default()(authOptions));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBMEQ7QUFDMUQsaUVBQWlFO0FBQ2pDO0FBQ2hDQywwQ0FBYTtBQUVOLE1BQU1FLGNBQStCO0lBQzFDLDZCQUE2QjtJQUM3QkMsV0FBVztRQUNUQyxTQUFRLEVBQUVBLFFBQU8sRUFBRUMsS0FBSSxFQUFFLEVBQUU7WUFDekIsSUFBSUQsUUFBUUMsSUFBSSxFQUFFO2dCQUNoQkQsUUFBUUMsSUFBSSxDQUFDQyxFQUFFLEdBQUdELEtBQUtDLEVBQUU7WUFDM0IsQ0FBQztZQUNELE9BQU9GO1FBQ1Q7SUFDRjtJQUNBLGlEQUFpRDtJQUNqREcsV0FBVyxFQUVWO0FBWUgsRUFBRTtBQUVGLGlFQUFlUixnREFBUUEsQ0FBQ0csWUFBWUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RydWNreS8uL3NyYy9wYWdlcy9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdLnRzPzUwYTEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE5leHRBdXRoLCB7IHR5cGUgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSAnbmV4dC1hdXRoJ1xuLy8gaW1wb3J0IHsgRmlyZXN0b3JlQWRhcHRlciB9IGZyb20gJ0BuZXh0LWF1dGgvZmlyZWJhc2UtYWRhcHRlcidcbmltcG9ydCAqIGFzIGRvdGVudiBmcm9tICdkb3RlbnYnXG5kb3RlbnYuY29uZmlnKClcblxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zOiBOZXh0QXV0aE9wdGlvbnMgPSB7XG4gIC8vIEluY2x1ZGUgdXNlci5pZCBvbiBzZXNzaW9uXG4gIGNhbGxiYWNrczoge1xuICAgIHNlc3Npb24oeyBzZXNzaW9uLCB1c2VyIH0pIHtcbiAgICAgIGlmIChzZXNzaW9uLnVzZXIpIHtcbiAgICAgICAgc2Vzc2lvbi51c2VyLmlkID0gdXNlci5pZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZXNzaW9uO1xuICAgIH0sXG4gIH0sXG4gIC8vIENvbmZpZ3VyZSBvbmUgb3IgbW9yZSBhdXRoZW50aWNhdGlvbiBwcm92aWRlcnNcbiAgcHJvdmlkZXJzOiBbXG5cbiAgXSxcbiAgLy8gYWRhcHRlcjogRmlyZXN0b3JlQWRhcHRlcih7XG4gIC8vICAgYXBpS2V5OiBwcm9jZXNzLmVudi5GSVJFQkFTRV9BUElfS0VZLFxuICAvLyAgIGFwcElkOiBwcm9jZXNzLmVudi5GSVJFQkFTRV9BUFBfSUQsXG4gIC8vICAgYXV0aERvbWFpbjogcHJvY2Vzcy5lbnYuRklSRUJBU0VfQVVUSF9ET01BSU4sXG4gIC8vICAgZGF0YWJhc2VVUkw6IHByb2Nlc3MuZW52LkZJUkVCQVNFX0RBVEFCQVNFX1VSTCxcbiAgLy8gICBwcm9qZWN0SWQ6IHByb2Nlc3MuZW52LkZJUkVCQVNFX1BST0pFQ1RfSUQsXG4gIC8vICAgc3RvcmFnZUJ1Y2tldDogcHJvY2Vzcy5lbnYuRklSRUJBU0VfU1RPUkFHRV9CVUNLRVQsXG4gIC8vICAgbWVzc2FnaW5nU2VuZGVySWQ6IHByb2Nlc3MuZW52LkZJUkVCQVNFX01FU1NBR0lOR19TRU5ERVJfSUQsXG4gIC8vICAgLy8gT3B0aW9uYWwgZW11bGF0b3IgY29uZmlnIChzZWUgYmVsb3cgZm9yIG9wdGlvbnMpXG4gIC8vICAgZW11bGF0b3I6IHt9LFxuICAvLyB9KSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE5leHRBdXRoKGF1dGhPcHRpb25zKTtcbiJdLCJuYW1lcyI6WyJOZXh0QXV0aCIsImRvdGVudiIsImNvbmZpZyIsImF1dGhPcHRpb25zIiwiY2FsbGJhY2tzIiwic2Vzc2lvbiIsInVzZXIiLCJpZCIsInByb3ZpZGVycyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/auth/[...nextauth].ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/auth/[...nextauth].ts"));
module.exports = __webpack_exports__;

})();