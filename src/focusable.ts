/// <reference path='focusable.d.ts' />

let Mustache;
export let EltPrototype :SgjFocusable = <SgjFocusable>Object.create(HTMLElement.prototype);
export default EltPrototype;

EltPrototype._init = function(config) {
  this.sgjFocusable = true;
  this._focusMgr = null

  this.focused = false
  this.config = config ? config : {}

  this._focusMgr = this._findFocusMgr()
  this._shown = true

  this._eventListeners = {}
  if (this.focusable === undefined) {
    this.focusable = true
  }
  else {
    this.focusable = false
  }
  this.customType = 'sgjFocusable'

  this._focusMgr.addFocusable(this) // add to mgr and get the uIdx

  this.setAttribute('_uIdx', this.uIdx)
  console.log('INIT :', this, this.uIdx)
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

EltPrototype.clear = function() {
  this.innerHTML = ''
}

EltPrototype.on_focus = function(event :CustomEvent) :boolean {
  if (event.detail.elt.uIdx === this.uIdx) {
    console.log('Me (' + this.uIdx + '), I have the focus !')
  }
  return false // we buble the event in order to inform my parent that I have the focus
}

EltPrototype.on_blur = function(event :CustomEvent) :boolean {
  if (event.detail.elt.uIdx === this.uIdx) {
    console.log('Me (' + this.uIdx + '), I was blurred !')
  }
  return false // we buble the event in order to inform my parent that I have the focus
}

EltPrototype.on_select = function(event :CustomEvent) :boolean {
  if (event.detail.elt.uIdx === this.uIdx) {
    console.log('Me (' + this.uIdx + '), I was selected !')
  }
  return true // we does not fire
}

EltPrototype.attachedCallback = function() {
  this._init();
}


EltPrototype.detachedCallback = function() {
}

EltPrototype.attributeChangedCallback = function(attrName/*, oldVal, newVal*/) {
}
