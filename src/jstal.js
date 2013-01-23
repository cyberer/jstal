/**
 * Created with JetBrains PhpStorm.
 * User: soenke
 * Date: 22.01.13
 * Time: 20:50
 * To change this template use File | Settings | File Templates.
 */

var JstalEngine = function(template){
    this.template = $(template);
    this.nodes = this.template.find("[]s");
    this.repeat = function(){}
    this.execute = function(){
        return this.template;
    }
};


var Jstal = function(template) {
    this._template = template;
    this.execute = function(){
        var engine = new JstalEngine(this._template);
        return engine.execute();
    };
};

$.get("/templates/snippet1.tal", function(data){
    var test = new Jstal(data);
    test["title"] = "Hallo Welt";
    var html = test.execute();
    $("body").html(html);
});

