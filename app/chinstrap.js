var Chinstrap;

Chinstrap = (function() {
  function Chinstrap() {}

  Chinstrap.prototype.open = "{{";

  Chinstrap.prototype.close = "}}";

  Chinstrap.prototype.setOpen = function(open) {
    this.open = open;
  };

  Chinstrap.prototype.setClose = function(close) {
    this.close = close;
  };

  Chinstrap.prototype.merge = function(template, data, returnSource) {
    var fn;
    returnSource = typeof returnSource !== 'undefined' && returnSource;
    template = this.render(template);
    fn = new Function("obj", template);
    if (returnSource) {
      return str;
    } else {
      return fn(data);
    }
  };

  Chinstrap.prototype.render = function(str) {
    str = this.stripWhiteSpace(str);
    str = this.replaceOpenChars(str);
    str = str.replace(/((^|\}\})[^\t]*)'/g, "$1\r");
    str = this.replaceQmarkWithIfOpen(str);
    str = str.replace(/\t\s?\@\=(.*?)\}\}/g, "\titerator=$1;\n}}");
    str = str.replace(/\t\s?WHILE(.*?)\}\}/g, "\twhile ($1) {\n}}");
    str = str.replace(/\t\s?\/WHILE(.*?)\}\}/g, "\t}\n}}");
    str = str.replace(/\t\s?FOR(.*?)\}\}/g, "\tfor ($1) {\n}}");
    str = str.replace(/\t\s?%(.*?)\}\}/g, "', this.merge($1), '");
    str = str.replace(/\t\s?\/FOR(.*?)\}\}/g, "\t}\n}}");
    str = str.replace(/\t\s?(IF|\?)(.*?)\}\}/g, "\tif (value($2)) {\n}}");
    str = str.replace(/\t\s?\/(IF|\?)(.*?)\}\}/g, "\t}\n}}");
    str = str.replace(/\t\s?(\-\?|ELSEIF)(.*?)\}\}/g, "\t} else if (value($2)) {\n}}");
    str = str.replace(/\t\s?(\-|ELSE)(.*?)\}\}/g, "\t} else {\n}}");
    str = str.replace(/\@\@/g, "iterator");
    str = str.replace(/\@/g, "iterator.");
    str = str.split("\t").join("');\n");
    str = str.split(this.close).join("p.push('");
    str = str.split("\r").join("\\'");
    return str = "\nvar p=[],iterator = {},print=function(){p.push.apply(p,arguments);},value = function(val){if (typeof val == 'function') {return val.apply(iterator);} else {return val;}};\nwith(config){\np.push('" + str + "');\n}\nreturn p.join('');\n";
  };

  Chinstrap.prototype.stripWhiteSpace = function(str) {
    return str.replace(/[\r\t\n]/g, " ");
  };

  Chinstrap.prototype.replaceOpenChars = function(str) {
    return str.split(this.open).join("\t");
  };

  Chinstrap.prototype.replaceQmarkWithIfOpen = function(str) {
    return str.replace(/\t\s?=(.*?)\}\}/g, "',value($1),'");
  };

  Chinstrap.prototype.compileWhileOpen = function(str) {};

  Chinstrap.prototype.compileWhileClose = function(str) {};

  Chinstrap.prototype.compileForOpen = function(str) {};

  Chinstrap.prototype.compileForClose = function(str) {};

  return Chinstrap;

})();

module.exports = new Chinstrap();
