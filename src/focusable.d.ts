interface SgjFocusMgr extends SgjFocusable {
  _init(),
  _initAttributesMgmt(),
  addFocusable(focusable :SgjFocusable) :void,
  removeFocusable(focusable :SgjFocusable) :void,
  setDefaultFocusable(focusable :SgjFocusable) :boolean,
  manageFocus(focusable :SgjFocusable) :boolean,
  _findFirstFocusable() : SgjFocusable,
  dispatchFocusableEvent(event :any) : void,
  _bubbleEventOnFocus(event :any, args :any, focusable :SgjFocusable) : void,
  getFocusables() :SgjFocusable[]
}

interface SgjFocusable extends HTMLElement {
  uIdx :number,
  focusable :boolean,
  focused :boolean,
  focusableEvtCbks :(event :any) => boolean[],
  _focusMgr :SgjFocusMgr,
  _init(config :any) :void,
  _focus() :void,
  _blur() :void,
  _findFocusMgr() :SgjFocusMgr,
  getParent() :SgjFocusable,
  getFocusMgr() :SgjFocusMgr,
  createdCallback(),
  attachedCallback(),
  detachedCallback(),
  attributeChangedCallback(attrName :string, attrValue :any)
}

interface Document {
  registerElement(markup :string, proro :any)
}
