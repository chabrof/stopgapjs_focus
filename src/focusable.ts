/// <reference path='focusable.d.ts' />

let Mustache;
export let EltPrototype :SgjFocusable = <SgjFocusable>Object.create(HTMLElement.prototype);

EltPrototype._init = function(config) {
  this._focusMgr = null

  console.assert(this._focusMgr)

  this.focused = false
  this.config = config ? config : {}

  this._focusMgr = this._findFocusMgr()
  this._shown = true

  this._eventListeners = {}
  if (this.focusable === undefined) {
    this.focusable = true
  }

  this._focusMgr.addFocusable(this) // add to mgr and get the uIdx
  this._domId = ((config && config.domId) ? config.domId : this.uIdx)
  this.setAttribute('id', this._domId)
}

EltPrototype._findFocusMgr = function() :SgjFocusMgr {

  let curElt :SgjFocusable = this
  while (curElt = curElt.parentElement as SgjFocusable) { // '=' because assign
    if (curElt._focusMgr) {
      console.log('curElt' , curElt)
      return curElt._focusMgr
    }
  }
  return null;
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
