(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("test/collections/stats_test", function(exports, require, module) {
var States;

States = require('collections/states');

describe('State collection', function() {
  beforeEach(function() {
    return this.states = new States();
  });
  afterEach(function() {
    return localStorage.clear();
  });
  it('should check for initialized localstorage', function() {
    return expect(typeof this.states.localStorage).to.equal('object');
  });
  it('should return current state', function() {
    var state;
    state = this.states.getCurrentState();
    return (expect(this.states.length)).to.equal(1);
  });
  it('should not create multi-states', function() {
    var state;
    state = this.states.getCurrentState();
    state = this.states.getCurrentState();
    return (expect(this.states.length)).to.equal(1);
  });
  it('should set state-name', function() {
    var name;
    name = 'hoge';
    this.states.setCurrentStateName(name);
    return (expect(this.states.models[0].get('name'))).to.equal(name);
  });
  return it('should set current-state-name', function() {
    var name;
    name = 'hoge';
    this.states.setCurrentStateName(name);
    return (expect(this.states.getCurrentStateName())).to.equal(name);
  });
});

});

require.register("test/models/column_test", function(exports, require, module) {
var Column;

Column = require('models/column');

describe('Column Model', function() {
  beforeEach(function() {
    return this.column = new Column();
  });
  it('should set defaults', function() {
    return (expect(this.column.get('title'))).to.equal('new');
  });
  return it('should be clear', function() {
    var view;
    view = {
      remove: function() {
        return true;
      }
    };
    this.column.view = view;
    return this.column.clear();
  });
});

});

require.register("test/models/note_test", function(exports, require, module) {
var Note;

Note = require('models/note');

describe('Note Model', function() {
  beforeEach(function() {
    return this.note = new Note();
  });
  it('should set defaults', function() {
    (expect(this.note.get('content'))).to.equal('click here to write');
    (expect(this.note.get('w'))).to.equal(100);
    (expect(this.note.get('h'))).to.equal(80);
    (expect(this.note.get('x'))).to.equal(40);
    return (expect(this.note.get('y'))).to.equal(40);
  });
  return it('should be clear', function() {
    var view;
    view = {
      remove: function() {
        return true;
      }
    };
    this.note.view = view;
    return this.note.clear();
  });
});

});

require.register("test/models/timer_config_test", function(exports, require, module) {
var TimerConfig;

TimerConfig = require('models/timer_config');

describe('TimerConfig Model', function() {
  beforeEach(function() {
    localStorage.clear();
    return this.timerConfig = new TimerConfig();
  });
  it('should set defaults', function() {
    (expect(this.timerConfig.get('pomodoroDuration'))).to.equal(25);
    (expect(this.timerConfig.get('shortBreakDuration'))).to.equal(5);
    return (expect(this.timerConfig.get('longBreakDuration'))).to.equal(15);
  });
  return it('should update', function() {
    var data;
    data = {
      pomodoroDuration: 100,
      shortBreakDuration: 110,
      longBreakDuration: 120
    };
    this.timerConfig.update(data);
    (expect(this.timerConfig.get('pomodoroDuration'))).to.equal(100);
    (expect(this.timerConfig.get('shortBreakDuration'))).to.equal(110);
    return (expect(this.timerConfig.get('longBreakDuration'))).to.equal(120);
  });
});

});

require.register("test/spec", function(exports, require, module) {


});

;require.register("test/test-helpers", function(exports, require, module) {
var Helper, chai, sinonChai;

chai = require('chai');

sinonChai = require('sinon-chai');

chai.use(sinonChai);

Helper = (function() {
  function Helper() {}

  Helper.prototype.keydown = function(keyCode, selector) {
    var e;
    e = $.Event("keypress");
    e.keyCode = keyCode;
    return $(selector).trigger('focus').trigger(e);
  };

  return Helper;

})();

module.exports = {
  expect: chai.expect,
  sinon: require('sinon')
};

});

require.register("test/views/column_view_test", function(exports, require, module) {
var Column, ColumnView, ColumnViewTest,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('models/column');

ColumnView = require('views/column_view');

ColumnViewTest = (function(_super) {
  __extends(ColumnViewTest, _super);

  function ColumnViewTest() {
    return ColumnViewTest.__super__.constructor.apply(this, arguments);
  }

  ColumnViewTest.prototype.renderTimes = 0;

  ColumnViewTest.prototype.render = function() {
    ColumnViewTest.__super__.render.apply(this, arguments);
    return this.renderTimes += 1;
  };

  return ColumnViewTest;

})(ColumnView);

describe('ColumnView', function() {
  beforeEach(function() {
    this.model = new Column();
    return this.view = new ColumnView({
      model: this.model
    });
  });
  return it('should addClass when editing', function() {
    this.view.edit();
    return (expect(this.view.$el.hasClass('editing'))).to.be.ok;
  });
});

});

require.register("test/views/columns_view_test", function(exports, require, module) {


});

;require.register("test/views/home_view_test", function(exports, require, module) {


});

;require.register("test/views/new_column_view_test", function(exports, require, module) {


});

;require.register("test/views/note_view_test", function(exports, require, module) {


});

;require.register("test/views/notes_view_test", function(exports, require, module) {


});

;require.register("test/views/resting_view_test", function(exports, require, module) {


});

;require.register("test/views/working_view_test", function(exports, require, module) {


});

;
//# sourceMappingURL=test.js.map