define(["require", "exports"], function (require, exports) {
    "use strict";
    var Mustache;
    var EltPrototype = Object.create(HTMLElement.prototype);
    EltPrototype._init = function () {
        this.curUniqueIdx = 1;
        this.uIdx = 0;
        this._focusables = [];
        this._initAttributesMgmt();
        this._curFocusedFocusable = null;
        this._defaultFocusable = this;
        this._focusMgr = this;
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
        this.log('info wid:' + focusable.uIdx);
        if (!this._widgets[focusable.uIdx])
            this.log(this._widgets);
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
        if (!focusable) {
            var locWidget = this._findFirstFocusable();
            return locWidget.focus();
        }
        var oldAncestors;
        var newAncestors;
        if (this._curFocusedFocusable) {
            this._curFocusedFocusable._blur();
            oldAncestors = this.getAncestors(this._curFocusedFocusable);
        }
    };
    EltPrototype._findFirstFocusable = function () {
        return this._defaultFocusableWidget;
    };
    EltPrototype.dispatchFocusableEvent = function (event) {
        if (this._curFocusedWidget) {
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            return this._bubbleEvent(event, args, this._curFocusedWidget);
        }
        return false;
    };
    EltPrototype._bubbleEventOnFocus = function (event, args, focusable) {
        var returnFlg;
        if (typeof focusable.focusableEvtCbks['on_' + event] === 'function') {
            returnFlg = focusable.focusableEvtCbks['on_' + event].apply(focusable, args);
        }
        else {
            returnFlg = false;
        }
        if (!returnFlg && focusable.getParent()) {
            returnFlg = this._bubbleEventOnFocus(event, args, focusable.getParent());
        }
        return returnFlg;
    };
    EltPrototype.getFocusables = function () {
        return this._widgets;
    };
    EltPrototype.attachedCallback = function () {
        console.log('attach');
        this._init();
    };
    EltPrototype.detachedCallback = function () {
    };
    EltPrototype.attributeChangedCallback = function (attrName) {
        console.error('attrib', attrName);
    };
    function register(mustache) {
        Mustache = mustache;
        document.registerFocusable('sgj-focusmgr', { prototype: EltPrototype });
    }
    exports.register = register;
});
//# sourceMappingURL=focus_mgr.js.map