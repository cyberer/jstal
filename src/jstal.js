/**
 * Created with JetBrains PhpStorm.
 * User: soenke
 * Date: 22.01.13
 * Time: 20:50
 * To change this template use File | Settings | File Templates.
 */
"use strict";
var cont;
/**
 * the Engine and all functional atributes
 * @param tal
 * @constructor
 */
var JstalEngine = function(tal){
    this.config = {
        talAttr: "tal:",
        talSelector: "tal\\3a "
    };
    this.template = new JsTalTemplate(tal.template);
    this._retrieveData = function(data){
        this.data = data;
    };

    /*
    * Here we go.
    * We need this order to have the right calling-order. define needs to be called 1st an so on
    * define takes more assignments, separated via semicolon
    * each assignments starts with the global-keyword, 2nd is the new key, 3rd the old variable
    *
    * */
    this.define = function(node){
        // the semicolon separates assignments
        var values = node.getAttribute("tal:define").split(/;/),
            self = this,
            extract = function(s) {
                var value = s.indexOf("string:")>0 ? s.substr(s.indexOf("string:")) : this.getData(s);
            };
        for (var assignment in values) {
            var parts = assignment.split(/ /);
            if (assignment.indexOf("global")) {

            }
        }
    };
    this.condition = function(){}

    /**
     * How about repeat? should we handle the list as a new subtemplate?
     */
    this.repeat = function(){

    };
    /**
     * the content-function copies the value in the element
     * the attribute-value begins with the structure-keyword, if set, variable is used via innerHTML
     * @param node
     */
    this.content = function(node){
        var value = node.getAttribute("tal:content").split(/ /);
        node[("structure" == value[0] ? "innerHTML" : "innerText")] = this._getData(value[value.length-1]);
    };
    this._getData = function(raw){
        var data = raw.split(/\//),
            piece = this.data;
        for (var i in data){
            if (typeof(piece[data[i]])!="undefined") {
                piece = piece[data[i]];
            } else {
                break;
            }
        }
        return piece;
    };
    this._collect = function() {
        for (var func in this){
            if ("function"==typeof(this[func]) && "_"!=func.substr(0,1)){
                var elements = this.template.selector(false, func);
                for (var i = 0; i<elements.length; i++) {
                    this[func](elements[i]);
                }
            }
        }
    };
    this._execute = function(){
        this._collect();
        return this.template.getTemplate();
    };
    this._retrieveData(tal);
};

if (window.jQuery1) {
    JstalEngine.prototype = {
        _selector: function(context, query){
            return $(context).find(query);
        },
        _setTemplate: function(string){
            return $(string);
        }
    }
}

/**
 * The template itself. And just methods
 * ToDo: recombine engine and template. Engine needs to be part of template.
 * We have to put template in foreground
 *
 * @param template
 * @constructor
 */

var JsTalTemplate = function(template) {

    this.setTemplate = function(string){
        var wrapper= document.createElement('div');
        wrapper.innerHTML = string;
        this.template = wrapper.firstChild;
        console.log(this.template);
        cont = this.template;
    };

    this.selector = function(context, query){
        return (context || this.template).querySelectorAll("[tal\\3a " + query + "]");
    };

    this.getTemplate = function(){
        return this.template;
    };

    this.setTemplate(template);
};

var Jstal = function(template) {
    this.template = template;
    this.execute = function(){
        var engine = new JstalEngine(this);
        return engine._execute();
    };
};
