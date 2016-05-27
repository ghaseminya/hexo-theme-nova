'use strict';

var pathFn = require('path');
var _ = require('lodash');
var util = require('util');

// project layout left nav tree
hexo.extend.helper.register('p_nav', function(options){
  var o = options || {};
  var parent_color = o.hasOwnProperty('parent_color') ? o.parent_color : null;
  var child_color = o.hasOwnProperty('child_color') ? o.child_color : null;
  
  var _self = this;
  
  var paths = this.page.path.split('/');
  var name = this.page.gh? this.page.gh.repo : paths[paths.length - 2];
  var file = paths[paths.length - 1];
  var p = this.site.data.projects[name];
  
  function Node(){ // bootstrap-treeview refer to: http://www.htmleaf.com/jQuery/Menu-Navigation/201502141379.html
    var node = {
      text: "",
      //icon: "glyphicon glyphicon-stop",
      //selectedIcon: "glyphicon glyphicon-stop",
      color: child_color,
      //backColor: "#FFFFFF",
      href: "#",
      selectable: false,
      state: {
        // checked: true,
        disabled: false,
        expanded: false,
        selected: false
      },
      //tags: ['available'],
      //nodes: []
    }
    return node;
  }
  
  function JqNode(){
    var node = {
      
    }
    return node;
  }
  
  function i18n(key){
    var last = key.split('.').pop();
    var i18n = _self.__('project.' + last);
    if (('project.' + last) !== i18n){
      return i18n;
    }
    return _self.__(key);
  }
  
  var data = [];
  var mis = [];
  
  function iterate(item, pnode, pk){
    _.each(item, function(value, key){
      var n = new Node();
      n.text = i18n(pk + "." + key);
      if (_.isString(value)){
        n.selectable = false;
        n.href = value;
        if (file === value) {
          n.state.selected = true;
          //n.state.expanded = true;
          //n.state.disabled = true;
          n.selectable = false;
          if (pnode && pnode.state){
            pnode.state.expanded = true;
          }
        }
        mis.push(value);
      } else {
        n.color = parent_color;
        n.text = '<b>' + n.text + '</b>';
        iterate(value, n, pk + '.' + key);
      }
      if (_.isArray(pnode)){
        pnode.push(n);
      } else {
        if (typeof pnode.nodes === 'undefined') {
          pnode.nodes = [];
        }
        pnode.nodes.push(n);
      }
    });
  }
  
  iterate(p, data, name);
  var i = mis.indexOf(file);
  if (i>0){
    this.page.prev = mis[i-1];
    this.page.prev_link = mis[i-1];
  }
  if (i<mis.length-1){
    this.page.next = mis[i+1];
    this.page.next_link = mis[i+1];
  }
  return JSON.stringify(data);
});

// return github api time
hexo.extend.helper.register('gh_time', function(str, format){
  if (!str){
    return 'invalid date';
  }
  return str.replace(/T.+/,'');
  //var d = new Date(str.replace(/T/, ' ').replace(/Z/, ''));
  //return this.date(d, format);
});

// return github api size in well format
hexo.extend.helper.register('gh_file_size', function(bytes){
  if (bytes >= (1<<20)){
    var f = (bytes/ (1<<20)).toFixed(2);
    return f + " M";
  }
  if (bytes >= (1<<10)){
    var f = (bytes/ (1<<10)).toFixed(2);
    return f + " K";
  }
  return bytes + " B";
});

// console
/*
var vm = require("vm");
hexo.extend.console.register('gh', 'Generate github pages', 
{
  options: [
    {name: '-r, --replace', desc: 'Replace existing files'}
  ]
}, 
function(args){
  var opt = {};
  if (args.r || args.replace){
    opt.replace = true;
  }

  var _self = this;
  return this.load().then(function() {
    var generator = _self.extend.helper.list()['github'];
    
    var locals = {};
    locals.pages = _self.model('Page');
    //generator.call(_self, locals, opt);
    //vm.runInContext();
  });
}
);
*/