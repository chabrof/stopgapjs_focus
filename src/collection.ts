/// <reference path='focusable.d.ts' />
import SgjFocusable from "focusable"

export let EltPrototype :SgjFocusableCollection = <SgjFocusableCollection>Object.create(SgjFocusable)
export default EltPrototype

EltPrototype._init = function(config) {
  SgjFocusable._init.call(this, config)

  this._initSgjFocusableChildren()
  this._selectedElement = this.getSelectedElement()
  this._observeChildrenChanges()
}

EltPrototype._initSgjFocusableChildren = function() :SgjFocusable[] {
  console.log('reinit children', this.children.length + 0)
  this._children = []
  this._uIdxToChildrenIdx = {}
  for (let ct = 0; ct < this.children.length; ct++) {
    let element = this.children[ct]
    if (element.customType === 'sgjFocusable') {
      this._children.push(element)
      this._uIdxToChildrenIdx[element.uIdx] = ct
    }
  }
  console.log('children', this._children)
  return this._children
}

EltPrototype.on_focus = function(event :CustomEvent) {

  if (event.detail && event.detail.elt && event.detail.elt.uIdx === this.uIdx) {
    // the focus is given to the collection
    // we check the children (thanks to mutation observer wich does NOT fire on HTML parsing and children discovering)
    console.log('me collection, focus', event);
    this._initSgjFocusableChildren()
    this._giveFocusToSelected()
  }
  else {
    // the focus is given to one child of the collection we throw an UI event to ourselves
    console.log('me collection my child is focused', event);
    this._focusMgr.dispatchFocusableEvent('focusedChild', this)
  }
  return false;
}

EltPrototype._giveFocusToSelected = function(event :CustomEvent) {
  let selectedElement = this.getSelectedElement()
  if (selectedElement !== null && selectedElement !== undefined) {
    this._focusMgr.manageFocus(selectedElement)
  }
  else {
    console.warn('No child to give focus to')
  }
}

EltPrototype.on_oneChildFocused = function(event :CustomEvent) {
  this.selectElement(event.detail.elt)
  return false;
}

EltPrototype.getSelectedElement = function() :SgjFocusable{
  if (this._selectedElement) {
    return this._selectedElement
  }
  else {
    // No element already selected => maybe we select the first element
    this.selectElement()
    return  this._selectedElement
  }
}

EltPrototype.selectNextElement  = function() :number{
  // pre
  console.assert( this._selectedIdx !== null && this._selectedIdx !== undefined,
                  "No element previously selected on collection")

  let selectIdx = this._selectedIdx + 1
  if (this._children.length > selectIdx) {
    this.selectElement(this._children[selectIdx])
    return selectIdx
  }

  return null
}

EltPrototype.selectPrevElement = function() :number{
  // pre
  console.assert( this._selectedIdx !== null && this._selectedIdx !== undefined,
                  "No element previously selected on collection")
  let selectIdx = this._selectedIdx - 1
  if (selectIdx >= 0) {
    this.selectElement(this._children[selectIdx])
    return selectIdx
  }
  return null
}


EltPrototype.selectElement = function(element :SgjFocusable) :number {
  this._initSgjFocusableChildren();
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
      this._focusMgr.manageFocus(tempElement)

    console.log('Select :', tempElement)
    return tempIdx
  }
  return null;
}

EltPrototype.unSelectElement = function(element :SgjFocusable) :boolean {
  // pre
  console.assert(element !== undefined && element !== null, 'element must be given')
  this._selectedElement = null
  this._focusMgr.dispatchFocusableEvent(new CustomEvent('unSelect', {
    'detail' : {
      'elt' : element,
      'container' : this
    }} ), element)
  return true
}


EltPrototype._observeChildrenChanges = function() :void {
  let self = this
  let mutatObserver = new MutationObserver(function(mutations) {
      mutations.forEach(
        function(mutation) {
          console.log('Mutation', mutation)
          self._initSgjFocusableChildren();
          /*
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            let element = mutation.addedNodes[i]  as SgjFocusable
            if (element.focusable) {
              self._children.push(element)
              self._uIdxToChildrenIdx[element.uIdx] = element
              console.log('CHILD added :', mutation.addedNodes[i])
            }
          }
          for (let i = 0; i < mutation.removedNodes.length; i++) {
            let element = mutation.addedNodes[i] as SgjFocusable
            if ((element).focusable) {
              let idx = self._children.indexOf(element);
              if (idx > -1) {
                self._children.splice(idx, 1);
                delete(self._uIdxToChildrenIdx[element.uIdx])
                console.log('CHILD removed :', mutation.addedNodes[i])
              }
              else {
                throw "Try to remove an inexistant element from collection";
              }
            }
          }*/
        } )
    } )
  mutatObserver.observe(this, { childList: true })
}
