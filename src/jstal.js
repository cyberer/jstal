/**
 * Created with JetBrains PhpStorm.
 * User: soenke
 * Date: 22.01.13
 * Time: 20:50
 * To change this template use File | Settings | File Templates.
 */

var JstalEngine = function(tal){
    this.config = {
      talAttr: "tal:"
    };
    this.template = $(tal._template);
    this.data = tal;
    this.define = function(){}
    this.condition = function(){}
    this.repeat = function(){}
    this.content = function(node){
        var value = node.attr("tal:content").split(/ /);
        node[("structure" == value[0] ? "html" : "text")](this._getData(value[value.length-1]));
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
        var self = this;
        for (var func in this){
            if ("function"==typeof(this[func]) && "_"!=func.substr(0,1)){
                this.template.find('[tal\\:' + func + ']').each(function(){
                    self[func]($(this));
                });
            }
        }
    }
    this._execute = function(){
        this._collect();



        return this.template;
    }
};


var Jstal = function(template) {
    this._template = template;
    this.execute = function(){
        var engine = new JstalEngine(this);
        return engine._execute();
    };
};

$.get("/templates/snippet1.tal", function(data){
    var test = new Jstal(data);
    test["value"] = {
        getContent: "alta, wasn stress"
    };
    test["title"] = "<b>hui</b>";
    var html = test.execute();
    $("body").html(html);
});

JstalEngine.prototype.attributes = function(){}