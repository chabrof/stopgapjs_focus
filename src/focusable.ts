import {SgjFocusMgr} from "focus_mgr"

export default class SgjFocusable extends HTMLElement {

  public    sgjFocusable :boolean
  protected _focusMgr :SgjFocusMgr
  public    focused :boolean
  public    focusedChild :boolean
  protected _logPrefix :string
  protected _console :Console
  public    debugName :string
  protected _shown :boolean
  public    focusable :boolean
  protected _eventListeners :any
  public    customType :string
  public    uIdx :number
  protected _enable :boolean

  protected _init() {
    this.sgjFocusable = true;
    this._focusMgr = null

    this.focused = false
    this.focusedChild = false

    this._focusMgr = this._findFocusMgr()
    this._logPrefix = "SgjFocusable :"
    this._console = this._focusMgr._console
    this._shown = true
    this.debugName = this.nodeName.toLowerCase() + ' (' + (this.getAttribute('id') ? this.getAttribute('id') + ' ,' : '') + '/*uidx not set for the moment*/' + ')'
    this._eventListeners = {}
    if (this.focusable === undefined) {
      this.focusable = true
    }
    else {
      this.focusable = false
    }
    this.customType = 'SgjFocusable'

    // attributes management
    let enableFlag = (this.getAttribute('data-enable') === 'false' ||  this.getAttribute('data-enable') === '0') ? false : true
    this.setEnableFlag(enableFlag)

    // at the end of _init we add ourselves to the manager
    this._focusMgr.addFocusable(this) // add to mgr and get the uIdx
    this.setAttribute('uIdx', this.uIdx.toString())

    // update the debugName with the uIdx set
    this.debugName = this.nodeName.toLowerCase() + ' (' + (this.getAttribute('id') ? this.getAttribute('id') + ' ,' : '') + this.uIdx + ')' // to update after adding

    this._console.log(this._logPrefix, 'Init :', this, this.uIdx)
  }

  public setEnableFlag(enableFlag :boolean, displayStyle :string = '') {
    this._enable = enableFlag

    if (! this._enable) {
      this.style.display = "none"
      this.setAttribute('data-enable', 'false')
    }
    else {
      this.style.display = displayStyle
      this.setAttribute('data-enable', 'true')
    }
  }

  public isEnabled() :boolean {
    return this._enable
  }

  public getParent(elt = null) :SgjFocusable {
    let parentElement :SgjFocusable = (elt ? elt.parentElement : this.parentElement);

    if (! parentElement) {
      return null
    }

    return parentElement.focusable ? parentElement : this.getParent(parentElement) // if parent is not a focusable element (such as a std HTML markup) we go upper recursively
  }

  protected _findFocusMgr() :SgjFocusMgr {

    let curElt :SgjFocusable = this
    while (curElt = curElt.parentElement as SgjFocusable) { // '=' because assign
      if (curElt._focusMgr) {
        return curElt._focusMgr
      }
    }
    return null;
  }

  public getFocusMgr() {
    return this._focusMgr
  }

  public clear() {
    this.innerHTML = ''
  }

  public on_focus(event :CustomEvent) :boolean {
    if (event.detail.elt.uIdx === this.uIdx) { // this test is necessary because the "focus" event is bubbled
      this._console.log(this._logPrefix, this.debugName + ' has focus !')
      this.focused = true;
      this.setAttribute('data-focus', 'true');
    }
    else {
      this.focusedChild = true
    }
    return true // we bubble the event in order to inform my ancestor that I have the focus
  }

  public on_blur(event :CustomEvent) :boolean {
    if (event.detail.elt.uIdx === this.uIdx) { // this test is necessary because the "focus" event is bubbled
      this._console.log(this._logPrefix, this.debugName + ' is now blurred !')
      this.focused = false;
      this.removeAttribute('data-focus');
    }
    else {
      this.focusedChild = false
    }
    return true // we bubble the event in order to inform my ancestor that I have the focus
  }

  public on_select(event :CustomEvent) :boolean {
    if (event.detail.elt.uIdx === this.uIdx) {
      this._console.log(this._logPrefix, this.debugName + ' is now selected !')
    }
    return false // we do not bubble
  }

  public attachedCallback() {
    this._init();
  }


  public detachedCallback() {
  }

  public attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'data-enable') {
      let enableFlag = (newVal === 'false' ||  newVal === '0') ? false : true
      this.setEnableFlag(enableFlag)
    }
  }
}
