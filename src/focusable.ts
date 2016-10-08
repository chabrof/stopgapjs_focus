/// <reference path='focusable.d.ts' />

let Mustache;
export let EltPrototype :SgjFocusable = <SgjFocusable>Object.create(HTMLElement.prototype);

EltPrototype._init = function(config) {
  this._focusMgr = this._findFocusMgr()
  this.focused = false
  this.config = config ? config : {}
  //this.oneChildFocused = false;
  this._domId = ((config && config.domId) ? config.domId : this.uIdx)
  this._shown = true

  this._eventListeners = {}
  if (this.focusable === undefined) {
    this.focusable = true
  }

  this._focusMgr.addFocusable(this)
}

EltPrototype._findFocusMgr = function() :SgjFocusMgr {


}

EltPrototype.getFocusMgr = function() {
  return this._focusMgr
}

EltPrototype.attachedCallback = function() {
  console.log('attach')
  this._init();
}

EltPrototype.detachedCallback = function() {
}

EltPrototype.attributeChangedCallback = function(attrName/*, oldVal, newVal*/) {
  console.error('attrib', attrName);
}
/*
export function register(mustache) {
  Mustache = mustache
  document.registerFocusable('sgj-svg', { prototype: EltPrototype });
}*/
