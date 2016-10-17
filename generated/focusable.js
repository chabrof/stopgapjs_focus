define(["require", "exports"], function (require, exports) {
    "use strict";
    var Mustache;
    exports.EltPrototype = Object.create(HTMLElement.prototype);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exports.EltPrototype;
    exports.EltPrototype._init = function (config) {
        this.sgjFocusable = true;
        this._focusMgr = null;
        this.focused = false;
        this.config = config ? config : {};
        this._focusMgr = this._findFocusMgr();
        this._shown = true;
        this._eventListeners = {};
        if (this.focusable === undefined) {
            this.focusable = true;
        }
        else {
            this.focusable = false;
        }
        this.customType = 'sgjFocusable';
        this._focusMgr.addFocusable(this);
        this.setAttribute('_uIdx', this.uIdx);
        console.log('INIT :', this, this.uIdx);
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
    exports.EltPrototype.clear = function () {
        this.innerHTML = '';
    };
    exports.EltPrototype.on_focus = function (event) {
        if (event.detail.elt.uIdx === this.uIdx) {
            console.log('Me (' + this.uIdx + '), I have the focus !');
        }
        return false;
    };
    exports.EltPrototype.on_blur = function (event) {
        if (event.detail.elt.uIdx === this.uIdx) {
            console.log('Me (' + this.uIdx + '), I was blurred !');
        }
        return false;
    };
    exports.EltPrototype.on_select = function (event) {
        if (event.detail.elt.uIdx === this.uIdx) {
            console.log('Me (' + this.uIdx + '), I was selected !');
        }
        return true;
    };
    exports.EltPrototype.attachedCallback = function () {
        this._init();
    };
    exports.EltPrototype.detachedCallback = function () {
    };
    exports.EltPrototype.attributeChangedCallback = function (attrName) {
    };
});
//# sourceMappingURL=focusable.js.map