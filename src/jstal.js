/**
 * Created with JetBrains PhpStorm.
 * User: soenke
 * Date: 22.01.13
 * Time: 20:50
 * To change this template use File | Settings | File Templates.
 */
"use strict";
var cont;
var JstalEngine = function(tal){
    this.config = {
        talAttr: "tal:",
        talSelector: "tal\\3a "
    };
    this._retrieveData = function(data){
        this.data = data;
    };
    this._setTemplate = function(string){
        var wrapper= document.createElement('div');
        wrapper.innerHTML = string;
        this.template = wrapper.firstChild;
        cont = this.template;
    };
    this.define = function(){}
    this._selector = function(context, query){
        return context.querySelectorAll("[tal\\3a " + query + "]");

    };
    this.condition = function(){}
    this.repeat = function(){}
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
                var elements = this._selector(this.template, func);
                for (var i = 0; i<elements.length; i++) {
                    this[func](elements[i]);
                }
            }
        }
    };
    this._execute = function(){
        this._collect();
        return this.template;
    };
    this._setTemplate(tal._template);
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

var Jstal = function(template) {
    this._template = template;
    this.execute = function(){
        var engine = new JstalEngine(this);
        return engine._execute();
    };
};
