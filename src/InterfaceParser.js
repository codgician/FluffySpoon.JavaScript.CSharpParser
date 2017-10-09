"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var MethodParser_1 = require("./MethodParser");
var PropertyParser_1 = require("./PropertyParser");
var AttributeParser_1 = require("./AttributeParser");
var InterfaceParser = (function () {
    function InterfaceParser(typeParser) {
        this.typeParser = typeParser;
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.propertyParser = new PropertyParser_1.PropertyParser();
        this.attributeParser = new AttributeParser_1.AttributeParser();
        this.methodParser = new MethodParser_1.MethodParser(typeParser);
    }
    InterfaceParser.prototype.parseInterfaces = function (content) {
        var interfaces = new Array();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var matches = this.regexHelper.getMatches(scope.prefix, /\s*((?:\[.*\]\s*?)*)?\s*((?:\w+\s)*)interface\s+(\w+?)(?:\s*<\s*([<>.\w,\s]+)\s*>)?\s*(?:\:\s*(\w+?(?:\s*<\s*(([<>.\w,\s]+)+)\s*>)?))?(?:\s*where\s*(\w+?)\s*(?:<\s*(([<>.\w,\s]+)+)\s*>)?\s*\:\s*([\w()]+?(?:\s*<\s*(([<>.\w,\s]+)+)\s*>)?))?\s*{/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var interfaceObject = new Models_1.CSharpInterface(match[2]);
                interfaceObject.innerScopeText = scope.content;
                interfaceObject.genericParameters = this.typeParser.parseTypesFromGenericParameters(match[3]);
                interfaceObject.isPublic = (match[1] || "").indexOf("public") > -1;
                interfaceObject.attributes = this.attributeParser.parseAttributes(match[0]);
                if (match[2]) {
                    interfaceObject.inheritsFrom = this.typeParser.parseType(match[4]);
                }
                var properties = this.propertyParser.parseProperties(scope.content);
                for (var _b = 0, properties_1 = properties; _b < properties_1.length; _b++) {
                    var property = properties_1[_b];
                    property.parent = interfaceObject;
                    interfaceObject.properties.push(property);
                }
                var methods = this.methodParser.parseMethods(scope.content, interfaceObject);
                for (var _c = 0, methods_1 = methods; _c < methods_1.length; _c++) {
                    var method = methods_1[_c];
                    method.parent = interfaceObject;
                    interfaceObject.methods.push(method);
                }
                interfaces.push(interfaceObject);
                console.log("Detected interface", interfaceObject);
            }
        }
        return interfaces;
    };
    return InterfaceParser;
}());
exports.InterfaceParser = InterfaceParser;
//# sourceMappingURL=InterfaceParser.js.map