import SgjFocusable from 'focusable'

export default class SgjCollection extends SgjFocusable {

  protected _selectedElement :SgjFocusable
  protected _children :SgjFocusable[]
  private   _uIdxToChildrenIdx :any
  protected _selectedIdx :number

  protected _init() {
    this._children = []
    super._init()

    this._initSgjFocusableChildren()

    // listening from new element added to the main focus mgr in order to maintain the children list
    // because ... the HTML5 Mutation observer does not do the job (it triggers when child is added in the Dom except during the html parsing !)
    this._focusMgr.addEventListener('addedElement', (e :CustomEvent) => this.onAddedElement(e))
  }

  public onAddedElement(e :CustomEvent) {
    if (e.detail.elt.parentNode === this) {
      this._console.log(this._logPrefix, this.debugName + ' : one element was added to it', this._children.length)
      this._initSgjFocusableChildren()
    }
  }

  protected _initSgjFocusableChildren() {
    this._console.log(this._logPrefix, 'Reinit children', this._children.length)
    let selectFlag = false
    if (this._children.length === 0) {
      selectFlag = true
    }
    this._children = []
    this._uIdxToChildrenIdx = {}
    for (let ct = 0; ct < this.children.length; ct++) { // it is really "._children" without "_" (HTML5 api)
      let element = <SgjFocusable> this.children[ct]
      if (element.customType === this.customType) {
        this._children.push(element)
        this._uIdxToChildrenIdx[element.uIdx] = ct
      }
    }

    if (selectFlag && this._children.length > 0 && this._children[0].isEnabled()) {
      // if we have children for the first time we select the first one
      this.selectElement(this._children[0])
    }
  }

  public setEnableFlag(enableFlag :boolean, displayStyle :string = '') {
    super.setEnableFlag(enableFlag, displayStyle)
    this._children.forEach((elt) => elt.setEnableFlag(enableFlag))
  }

  public on_focus(event :CustomEvent) {
    if (event.detail && event.detail.elt && event.detail.elt.uIdx === this.uIdx) {
      // the focus is given to the collection
      this._console.log(this._logPrefix, this.debugName + ' has now focus !');
      // we propagate focus to our selected child
      if (! this._giveFocusToSelected()) {
        // no child to give focus to, we keep focus
        this.focused = true
      }
    }
    else {
      this.focusedChild = true
    }
    return true
  }

  public getChildren() :SgjFocusable[] {
    return this._children
  }

  private _giveFocusToSelected(event :CustomEvent = null) :boolean {
    let selectedElement = this.getSelectedElement()
    if (selectedElement !== null && selectedElement !== undefined) {
      this._focusMgr.manageFocus(selectedElement)
      return true;
    }
    this._console.warn(this._logPrefix, this.debugName + ' : no child to give focus to')
    return false
  }

  public getSelectedElement() :SgjFocusable {
    if (this._selectedElement) {
      return this._selectedElement
    }
    return null
  }

  public selectNextElement() :number {
    // pre
    this._console.assert( this._selectedIdx !== null && this._selectedIdx !== undefined,
                          this._logPrefix + " No element previously selected on collection " + this.debugName)

    for (let selectIdx = this._selectedIdx + 1; selectIdx < this._children.length; selectIdx++) {
      if (this._children[selectIdx].isEnabled()) {
        this.selectElement(this._children[selectIdx])
        return selectIdx
      }
    }

    return null
  }

  public selectPrevElement() :number {
    // pre
    this._console.assert( this._selectedIdx !== null && this._selectedIdx !== undefined,
                          this._logPrefix + "No element previously selected on collection " + this.debugName)

    for (let selectIdx = this._selectedIdx - 1; selectIdx >= 0; selectIdx--) {
      if (this._children[selectIdx].isEnabled()) {
        this.selectElement(this._children[selectIdx])
        return selectIdx
      }
    }
    return null
  }


  public selectElement(element :SgjFocusable) :number {
    // pre
    this._console.assert(element !== null && element !== undefined, this._logPrefix, this.debugName, 'Element is undefined')
    // this._console.assert(element.isEnabled(), this._logPrefix, this.debugName, 'can not select a disable element')

    let tempElement :SgjFocusable
    let oldElement = this._selectedElement
    let tempIdx :number

    if (element && this._uIdxToChildrenIdx[element.uIdx]) {
      tempIdx = this._uIdxToChildrenIdx[element.uIdx]
      tempElement = element;
    }
    else if (this._children.length > 0) {
      tempIdx = 0
      tempElement = this._children[0]
    }

    if (tempElement) {
      if (oldElement) {
        this.unSelectElement(oldElement)
      }

      this._selectedElement = tempElement
      this._selectedIdx = tempIdx
      this._focusMgr.dispatchFocusableEvent(new CustomEvent('select', {
        'detail' : {
          'elt' : tempElement,
          'container' : this
        }} ), tempElement)

      // if the collection has focus OR on of its child has, we give focus to the new selected child
      if (this.focused || this.focusedChild) {
        this._focusMgr.manageFocus(tempElement)
      }

      this._console.log(this._logPrefix, this.debugName + ' selects :', tempElement)
      return tempIdx
    }
    return null;
  }

  public unSelectElement(element :SgjFocusable) :boolean {
    // pre
    this._console.assert(element !== undefined && element !== null, this._logPrefix + ' element must be given')

    this._selectedElement = null
    this._focusMgr.dispatchFocusableEvent(new CustomEvent('unSelect', {
      'detail' : {
        'elt' : element,
        'container' : this
      }} ), element)
    return false
  }
}
