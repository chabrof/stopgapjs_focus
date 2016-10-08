define(["require", "exports"], function (require, exports) {
    "use strict";
    var Mustache;
    exports.EltPrototype = Object.create(HTMLElement.prototype);
    exports.EltPrototype._init = function (config) {
        this._focusMgr = null;
        this._focusMgr = this._findFocusMgr();
        console.assert(this._focusMgr);
        this.focused = false;
        this.config = config ? config : {};
        this._domId = ((config && config.domId) ? config.domId : this.uIdx);
        this._shown = true;
        this._eventListeners = {};
        if (this.focusable === undefined) {
            this.focusable = true;
        }
        this._focusMgr.addFocusable(this);
    };
    exports.EltPrototype._findFocusMgr = function () {
        var curElt = this;
        while (curElt = curElt.parentElement) {
            if (curElt._focusMgr) {
                console.log('curElt', curElt);
                return curElt._focusMgr;
            }
        }
        return null;
    };
    exports.EltPrototype.getFocusMgr = function () {
        return this._focusMgr;
    };
    exports.EltPrototype.attachedCallback = function () {
        console.log('attach');
        this._init();
    };
    exports.EltPrototype.detachedCallback = function () {
    };
    exports.EltPrototype.attributeChangedCallback = function (attrName) {
        console.error('attrib', attrName);
    };
});
//# sourceMappingURL=focusable.js.map