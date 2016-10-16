define(["require", "exports"], function (require, exports) {
    "use strict";
    var EltPrototype = Object.create(HTMLElement.prototype);
    EltPrototype._init = function () {
        this.curUniqueIdx = 1;
        this.uIdx = 0;
        this._focusables = [];
        this._initAttributesMgmt();
        this._curFocusedFocusable = null;
        this._defaultFocusable = this;
        this._focusMgr = this;
        window.mg = this;
    };
    EltPrototype._initAttributesMgmt = function () {
    };
    EltPrototype.addFocusable = function (focusable) {
        focusable.uIdx = this.curUniqueIdx++;
        this._focusables[focusable.uIdx] = focusable;
        if ((!this._defaultFocusable) && focusable.focusable) {
            this._defaultFocusable = focusable;
        }
    };
    EltPrototype.removeFocusable = function (focusable) {
        if (focusable.focused) {
            this.manageFocus();
        }
        console.log('remove focusable:', focusable.uIdx);
        if (!this._focusables[focusable.uIdx])
            throw "The element you try to remove does not exist";
        this._focusables[focusable.uIdx].clear();
        delete (this._focusables[focusable.uIdx]);
    };
    EltPrototype.setDefaultFocusable = function (focusable) {
        if (focusable.focusable) {
            this._defaultFocusElt = focusable;
            return true;
        }
        return false;
    };
    EltPrototype.getParent = function () {
        return null;
    };
    EltPrototype.manageFocus = function (focusable) {
        console.log('Mgr : give focus to', focusable);
        if (!focusable) {
            var locWidget = this._findFirstFocusable();
            return locWidget ? locWidget.focus() : null;
        }
        if (this._curFocusedFocusable) {
            this.dispatchFocusableEvent('blur');
        }
        this._curFocusedFocusable = focusable;
        this.dispatchFocusableEvent('focus');
    };
    EltPrototype._findFirstFocusable = function () {
        return this._defaultFocusableWidget;
    };
    EltPrototype.dispatchFocusableEvent = function (event, elt) {
        elt = (elt ? elt : this._curFocusedFocusable);
        if (typeof event === 'string') {
            event = new CustomEvent(event, { 'detail': { 'elt': elt } });
        }
        if (elt) {
            return this._bubbleFocusableEvent(event, elt);
        }
        return false;
    };
    EltPrototype._bubbleFocusableEvent = function (event, focusable) {
        var returnFlg;
        if (typeof focusable['on_' + event.type] === 'function') {
            returnFlg = focusable['on_' + event.type].call(focusable, event);
        }
        else {
            returnFlg = false;
        }
        if (!returnFlg && focusable.parentElement) {
            console.log('Bubble =>', focusable.parentElement.uIdx);
            returnFlg = this._bubbleFocusableEvent(event, focusable.parentElement);
        }
        return returnFlg;
    };
    EltPrototype.getFocusables = function () {
        return this._widgets;
    };
    EltPrototype.attachedCallback = function () {
        this._init();
    };
    EltPrototype.detachedCallback = function () {
    };
    EltPrototype.attributeChangedCallback = function (attrName) {
        console.log('attrib', attrName);
    };
    function register(markup) {
        console.assert(markup.length > 0, 'markup must be a non null string');
        document.registerElement(markup, { prototype: EltPrototype });
    }
    exports.register = register;
});
//# sourceMappingURL=focus_mgr.js.map