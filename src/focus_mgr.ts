/// <reference path='focusable.d.ts' />

let Mustache
let EltPrototype :SgjFocusMgr = <SgjFocusMgr>Object.create(HTMLElement.prototype);

EltPrototype._init = function() {
  this.curUniqueIdx = 1
  this.uIdx = 0
  this._focusables = []
  this._initAttributesMgmt()
  this._curFocusedFocusable = null
  this._defaultFocusable = this;
  this._focusMgr = this // mandatory (the children find focurMgr with this attrib)
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
  this.log('info wid:' + focusable.uIdx);
  if (! this._widgets[focusable.uIdx]) this.log(this._widgets);

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
  if (! focusable) {
    let locWidget = this._findFirstFocusable();
    return locWidget.focus();
  }

  let oldAncestors :SgjFocusable[];
  let newAncestors :SgjFocusable[];

  // the focusable which had focus, looses it
  if (this._curFocusedFocusable) {
    this._curFocusedFocusable._blur();
    oldAncestors = this.getAncestors(this._curFocusedFocusable);
  }
/*
  // the new focusable has now the focus
  this._curFocusedFocusable = focusable;
  if (this._curFocusedWidget) {
    newAncestors = this.getAncestors(this._curFocusedFocusable);
  }

  // we throw an event "childHasFocus" to ancestors
  this._throwChildHasFocusEvent(oldAncestors, newAncestors);
  */
};

/**
 * Find the first focusable near to the root which is focusable
 * @method _findFirstFocusableWidget
 * @private
 * @return  {Focusable}
 */
EltPrototype._findFirstFocusable = function() {
  //console.assert(this._defaultFocusableWidget, 'firstFocusableWidget does not exist');
  return this._defaultFocusableWidget;
}

/**
 * Dispathes an event according to the focuse management
 * @method dispatchFocusableEvent
 * @param {} event
 * @param {} args
 * @return boolean
 */
EltPrototype.dispatchFocusableEvent = function(event) {
  if (this._curFocusedWidget) {
    let args = Array.prototype.slice.call(arguments)
    args.shift();
    return this._bubbleEvent(event, args, this._curFocusedWidget)
  }
  return false;
}

EltPrototype._bubbleEventOnFocus = function(event, args, focusable :SgjFocusable) {
  let returnFlg;
  if (typeof focusable.focusableEvtCbks['on_' + event] === 'function') {
    returnFlg = focusable.focusableEvtCbks['on_' + event].apply(focusable, args);
  }
  else {
    returnFlg = false;
  }
  if (!returnFlg && focusable.getParent()) {
		//this.log('Bubble =>', widget.getParent().id);
    returnFlg = this._bubbleEventOnFocus(event, args, focusable.getParent());
  }
  return returnFlg;
};

/**
 * Get all the SgjFocusable elements managed by this manager
 * @method getFocusables
 * @return {Array of SgjFocusable}
 */
EltPrototype.getFocusables = function() :SgjFocusable[] {
  return this._widgets;
};


EltPrototype.attachedCallback = function() {
  console.log('attach');
  this._init();
}

EltPrototype.detachedCallback = function() {
}

EltPrototype.attributeChangedCallback = function(attrName/*, oldVal, newVal*/) {
  console.error('attrib', attrName);
}

export function register(mustache) {
  Mustache = mustache
  document.registerFocusable('sgj-focusmgr', { prototype: EltPrototype });
}
