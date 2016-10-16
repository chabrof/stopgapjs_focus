define(["require", "exports", "focusable"], function (require, exports, focusable_1) {
    "use strict";
    exports.EltPrototype = Object.create(focusable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exports.EltPrototype;
    exports.EltPrototype._init = function (config) {
        focusable_1.default._init.call(this, config);
        this._initSgjFocusableChildren();
        this._selectedElement = this.getSelectedElement();
        this._observeChildrenChanges();
    };
    exports.EltPrototype._initSgjFocusableChildren = function () {
        console.log('reinit children', this.children.length + 0);
        this._children = [];
        this._uIdxToChildrenIdx = {};
        for (var ct = 0; ct < this.children.length; ct++) {
            var element = this.children[ct];
            if (element.customType === 'sgjFocusable') {
                this._children.push(element);
                this._uIdxToChildrenIdx[element.uIdx] = ct;
            }
        }
        console.log('children', this._children);
        return this._children;
    };
    exports.EltPrototype.on_focus = function (event) {
        if (event.detail && event.detail.elt && event.detail.elt.uIdx === this.uIdx) {
            console.log('me collection, focus', event);
            this._initSgjFocusableChildren();
            this._giveFocusToSelected();
        }
        else {
            console.log('me collection my child is focused', event);
            this._focusMgr.dispatchFocusableEvent('focusedChild', this);
        }
        return false;
    };
    exports.EltPrototype._giveFocusToSelected = function (event) {
        var selectedElement = this.getSelectedElement();
        if (selectedElement !== null && selectedElement !== undefined) {
            this._focusMgr.manageFocus(selectedElement);
        }
        else {
            console.warn('No child to give focus to');
        }
    };
    exports.EltPrototype.on_oneChildFocused = function (event) {
        this.selectElement(event.detail.elt);
        return false;
    };
    exports.EltPrototype.getSelectedElement = function () {
        if (this._selectedElement) {
            return this._selectedElement;
        }
        else {
            this.selectElement();
            return this._selectedElement;
        }
    };
    exports.EltPrototype.selectNextElement = function () {
        console.assert(this._selectedIdx !== null && this._selectedIdx !== undefined, "No element previously selected on collection");
        if (this._children.length > (this._selectedIdx + 1)) {
            this.selectElement(this._children[this._selectedIdx + 1]);
            return true;
        }
        return false;
    };
    exports.EltPrototype.selectPrevElement = function () {
        console.assert(this._selectedIdx !== null && this._selectedIdx !== undefined, "No element previously selected on collection");
        if ((this._selectedIdx - 1) >= 0) {
            this.selectElement(this._children[this._selectedIdx - 1]);
            return true;
        }
        return false;
    };
    exports.EltPrototype.selectElement = function (element) {
        this._initSgjFocusableChildren();
        var tempElement;
        var oldElement = this._selectedElement;
        var tempIdx;
        if (element && this._uIdxToChildrenIdx[element.uIdx]) {
            tempIdx = this._uIdxToChildrenIdx[element.uIdx];
            tempElement = element;
        }
        else if (this._children.length > 0) {
            tempIdx = 0;
            tempElement = this._children[0];
        }
        if (tempElement) {
            if (oldElement) {
                this.unSelectElement(oldElement);
            }
            this._selectedElement = tempElement;
            this._selectedIdx = tempIdx;
            this._focusMgr.dispatchFocusableEvent(new CustomEvent('select', {
                'detail': {
                    'elt': tempElement,
                    'container': this
                }
            }), tempElement);
            this._focusMgr.manageFocus(tempElement);
            console.log('Select :', tempElement);
            return true;
        }
        return false;
    };
    exports.EltPrototype.unSelectElement = function (element) {
        console.assert(element !== undefined && element !== null, 'element must be given');
        this._selectedElement = null;
        this._focusMgr.dispatchFocusableEvent(new CustomEvent('unSelect', {
            'detail': {
                'elt': element,
                'container': this
            }
        }), element);
        return true;
    };
    exports.EltPrototype._observeChildrenChanges = function () {
        var self = this;
        var mutatObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                console.log('Mutation', mutation);
                self._initSgjFocusableChildren();
            });
        });
        mutatObserver.observe(this, { childList: true });
    };
});
//# sourceMappingURL=collection.js.map