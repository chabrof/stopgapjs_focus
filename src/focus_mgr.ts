/// <reference path='focusable.d.ts' />

let EltPrototype :SgjFocusMgr = <SgjFocusMgr>Object.create(HTMLElement.prototype);

EltPrototype._init = function() {
  this.curUniqueIdx = 1
  this.uIdx = 0
  this._focusables = []
  this._initAttributesMgmt()
  this._curFocusedFocusable = null
  this._defaultFocusable = this
  this._focusMgr = this; // mandatory (the children find focurMgr with this attrib)
  (window as any).mg = this
}

EltPrototype._initAttributesMgmt = function() {

}

/**
 * @method addFocusable
 * @param {Focusable} focusable
 */
EltPrototype.addFocusable = function(focusable :SgjFocusable) {
  focusable.uIdx = this.curUniqueIdx++
  this._focusables[focusable.uIdx] = focusable

  if ((! this._defaultFocusable) && focusable.focusable) {
    this._defaultFocusable = focusable
  }
}

/**
 * @method removeFocusable
 * @param {Focusable} focusable
 */
EltPrototype.removeFocusable = function(focusable :SgjFocusable) {
  if (focusable.focused) {
    this.manageFocus();
  }
  console.log('remove focusable:', focusable.uIdx);
  if (! this._focusables[focusable.uIdx])
    throw "The element you try to remove does not exist"

  this._focusables[focusable.uIdx].clear();
  delete(this._focusables[focusable.uIdx]);
};

/**
 * @method removeFocusable
 * Defines the focusable which will have the focus at the beginning
 * @param {Focusable} focusable
 */
EltPrototype.setDefaultFocusable = function(focusable :SgjFocusable) :boolean {
  if (focusable.focusable) {
    this._defaultFocusElt = focusable
    return true;
  }
  return false;
}

/**
 * This method returns null (no focusable focusable over the manager)
 * @method getParent
 * @return null
 */
EltPrototype.getParent = function() {
  return null;
}

/**
 * When we call focus() on a Widget, the method of the Meta Class Widget use this
 * @method manageFocus
 * @param {} widget
 * @return
 */
EltPrototype.manageFocus = function(focusable :SgjFocusable) {
  // pre

  console.log('Mgr : give focus to', focusable)

  if (! focusable) {
    let locWidget = this._findFirstFocusable();
    return locWidget ? locWidget.focus() : null;
  }

  // the focusable which had focus, looses it
  if (this._curFocusedFocusable) {
    this.dispatchFocusableEvent('blur');
  }
  // the new element has the focus
  this._curFocusedFocusable = focusable;
  // dispath a focus event
  this.dispatchFocusableEvent('focus');
};

/**
 * Find the first focusable near to the root which is focusable
 * @method _findFirstFocusableWidget
 * @private
 * @return  {Focusable}
 */
EltPrototype._findFirstFocusable = function() {
  //console.assert(this._defaultFocusableWidget, 'firstFocusableWidget does not exist');
  return this._defaultFocusableWidget
}

/**
 * Dispathes an event according to the focuse management
 * @method dispatchFocusableEvent
 * @param {CustomEvent} event
 * @return boolean
 */
EltPrototype.dispatchFocusableEvent = function(event :any, elt? :SgjFocusable) {
  elt = (elt ? elt : this._curFocusedFocusable)
  if (typeof event === 'string') {
    event = new CustomEvent(event, { 'detail' : { 'elt' : elt } })
  }
  if (elt) {
    return this._bubbleFocusableEvent(event, elt)
  }
  return false
}

EltPrototype._bubbleFocusableEvent = function(event, focusable :SgjFocusable) {
  let returnFlg
  if (typeof focusable['on_' + event.type] === 'function') {
    returnFlg = focusable['on_' + event.type].call(focusable, event);
  }
  else {
    returnFlg = false;
  }
  if (!returnFlg && focusable.parentElement) {
    console.log('Bubble =>', (focusable.parentElement as SgjFocusable).uIdx);
    returnFlg = this._bubbleFocusableEvent(event, focusable.parentElement);
  }
  return returnFlg
};

/**
 * Get all the SgjFocusable elements managed by this manager
 * @method getFocusables
 * @return {SgjFocusable[]}
 */
EltPrototype.getFocusables = function() :SgjFocusable[] {
  return this._widgets
};


EltPrototype.attachedCallback = function() {
  this._init()
}

EltPrototype.detachedCallback = function() {
}

EltPrototype.attributeChangedCallback = function(attrName/*, oldVal, newVal*/) {
  console.log('attrib', attrName);
}

export function register(markup :string) {
  console.assert(markup.length > 0, 'markup must be a non null string')
  document.registerElement(markup, { prototype: EltPrototype });
}
