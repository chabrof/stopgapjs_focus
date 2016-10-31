
import SgjFocusable from "focusable"

let locConsoleStrategy :Console

export class SgjFocusMgr extends SgjFocusable {

  public _console : Console
  private _focusables :SgjFocusable[]
  private _curUniqueIdx :number
  private _curFocusedFocusable :SgjFocusable
  private _defaultFocusable :SgjFocusable
  protected _logPrefix :string
  public uIdx :number = 0

  protected _init() {
    this._curUniqueIdx = 1
    this.uIdx = 0
    this._focusables = []
    this._curFocusedFocusable = null
    this._defaultFocusable = this
    this._focusMgr = this // mandatory (the children find focurMgr with this attrib)
    this._logPrefix = "SgjFocusMgr :"
    this._console = (locConsoleStrategy ? locConsoleStrategy : console) // by default we use console of browser to log
  }

  /**
   * @setter consoleStrategy
   *  by default logs are displayed using global browser object : console
   *  You can override it with you own implementation
   *  You need to implement [log], [warn], [error], [group] and [assert] methods
   */
  public setConsoleStrategy(pConsole :Console) {
    this._console = pConsole
  }

  /**
   * @method addFocusable
   * @param {Focusable} focusable
   */
  public addFocusable(focusable :SgjFocusable) {
    focusable.uIdx = this._curUniqueIdx++
    this._focusables[focusable.uIdx] = focusable

    if ((! this._defaultFocusable) && focusable.focusable) {
      this._defaultFocusable = focusable
    }

    this.dispatchEvent(new CustomEvent('addedElement', { "detail" : {"elt" : focusable } }));
  }

  /**
   * @method removeFocusable
   * @param {Focusable} focusable
   */
  public removeFocusable(focusable :SgjFocusable) {

    this._console.log(this._logPrefix, 'remove focusable:', focusable.uIdx);
    if (! this._focusables[focusable.uIdx])
      throw "The element you try to remove does not exist"

    this._focusables[focusable.uIdx].clear()
    delete(this._focusables[focusable.uIdx])

    if (focusable.focused) {
      this.manageFocus()
    }
  }

  /**
   * This method returns null (no focusable focusable over the manager)
   * @method getParent
   * @return null
   */
  public getParent() {
    return null
  }

  /**
   * When we call focus() on a Widget, the method of the Meta Class Widget use this
   * @method manageFocus
   * @param {} widget
   * @return
   */
  public manageFocus(focusable :SgjFocusable = null) {
    this._console.log(this._logPrefix, 'Mgr : give focus to', focusable.debugName)

    if (! focusable) {
      return false
    }

    // the focusable which had focus, looses it
    if (this._curFocusedFocusable) {
      this.dispatchFocusableEvent('blur')
    }
    // the new element has the focus
    this._curFocusedFocusable = focusable
    // dispath a focus event
    this.dispatchFocusableEvent('focus')
    return true
  }

  /**
   * Dispathes an event according to the focuse management
   * @method dispatchFocusableEvent
   * @param {CustomEvent} event
   * @return boolean
   */
  public dispatchFocusableEvent(event :any, elt? :SgjFocusable) {
    elt = (elt ? elt : this._curFocusedFocusable)
    if (typeof event === 'string') {
      event = new CustomEvent(event, { 'detail' : { 'elt' : elt } })
    }
    if (elt) {
      this._console.log(this._logPrefix, 'Dispatch (event: ' + event.type + ') =>', elt.debugName)
      return this._bubbleFocusableEvent(event, elt)
    }
    return false
  }

  private _bubbleFocusableEvent(event, focusable :SgjFocusable) {
    let bubbleFlg
    if (typeof focusable['on_' + event.type] === 'function') {
      bubbleFlg = focusable['on_' + event.type].call(focusable, event);
    }
    else {
      bubbleFlg = true;
    }
    let parentElement = focusable.getParent()
    if (bubbleFlg && parentElement) {
      this._console.log(this._logPrefix, 'Bubble (event: ' + event.type + ') =>', parentElement.debugName)
      bubbleFlg = this._bubbleFocusableEvent(event, parentElement);
    }
    return bubbleFlg
  };

  public attachedCallback() {
    this._init()
  }

  public detachedCallback() {
  }

  public attributeChangedCallback(attrName/*, oldVal, newVal*/) {
    this._console.log(this._logPrefix, 'attrib', attrName);
  }
}

export function register(markup :string, consoleStrategy :Console) {
  locConsoleStrategy = consoleStrategy ? consoleStrategy : console

  locConsoleStrategy.assert(markup.length > 0, 'markup must be a non null string')
  ; (document as any).registerElement(markup, { prototype: SgjFocusMgr.prototype })
}
