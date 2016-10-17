interface SgjFocusMgr extends SgjFocusable {
  _init()
  _initAttributesMgmt()
  addFocusable(focusable :SgjFocusable) :void
  removeFocusable(focusable :SgjFocusable) :void
  setDefaultFocusable(focusable :SgjFocusable) :boolean
  manageFocus(focusable :SgjFocusable) :boolean
  _findFirstFocusable() : SgjFocusable
  dispatchFocusableEvent(event :any) : void
  _bubbleFocusableEvent(event :any, args :any, focusable :SgjFocusable) : void
  getFocusables() :SgjFocusable[]
}

interface SgjFocusable extends HTMLElement {
  uIdx :number
  focusable :boolean
  focused :boolean
  focusableEvtCbks :(event :any) => boolean[]
  _focusMgr :SgjFocusMgr
  sgjFocusable :boolean
  _init(config :any) :void
  on_focus(event :CustomEvent) :boolean
  on_blur(event :CustomEvent) :boolean
  on_select(event :CustomEvent) :boolean
  on_unSelect(event :CustomEvent) :boolean
  on_left(event :CustomEvent) :boolean
  on_right(event :CustomEvent) :boolean
  on_up(event :CustomEvent) :boolean
  on_down(event :CustomEvent) :boolean
  clear() :void
  _findFocusMgr() :SgjFocusMgr
  getParent() :SgjFocusable
  getFocusMgr() :SgjFocusMgr
  createdCallback()
  attachedCallback()
  detachedCallback()
  attributeChangedCallback(attrName :string, attrValue :any, oldVal, newVal)
}

interface SgjFocusableCollection extends SgjFocusable {
  _focusableChildren :SgjFocusable[]
  _selectedElement :SgjFocusable
  selectElement(element :SgjFocusable) :number
  selectNextElement(element :SgjFocusable) :number
  selectPrevElement(element :SgjFocusable) :number
  unSelectElement(element :SgjFocusable) :boolean
  on_oneChildFocused(event :CustomEvent) :boolean
  getSelectedElement() :SgjFocusable
  _giveFocusToSelected(event :CustomEvent) :void
  _observeChildrenChanges() :void
  _initSgjFocusableChildren() :SgjFocusable[]
  _listenFromChildren(children :SgjFocusable[]) :void
}

interface Document {
  registerElement(markup :string, proro :any)
}
