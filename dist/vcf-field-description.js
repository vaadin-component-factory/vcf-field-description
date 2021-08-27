var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement, property } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
let VcfFieldDescription = class VcfFieldDescription extends LitElement {
    constructor() {
        // --- --- --- Properties --- --- ---
        super(...arguments);
        this._expanded = false;
        this.description = "";
        this.expandButtonIsKbFocusable = false;
        this.feedbackState = 'INFO';
        this.feedbackContent = "";
        this.reserveDescriptionHeight = false;
        this.reserveFeedbackHeight = false;
        this._renderDescriptionAsHtml = false;
        this._renderFeedbackAsHtml = false;
        this._objectId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this._expanding = false;
        this._fieldDescriptionTextMeasuredWidth = -1;
        this._fieldDescriptionTextMeasuredHeight = -1;
        this._fieldDescriptionFeedbackMeasuredWidth = -1;
        this._fieldDescriptionFeedbackMeasuredHeight = -1;
    }
    get expanded() {
        return this._expanded;
    }
    set expanded(expanded) {
        if (expanded == null)
            return;
        const oldValue = this._expanded;
        this._expanded = expanded;
        this.requestUpdate("expanded", oldValue);
    }
    set renderDescriptionAsHtml(renderDescriptionAsHtml) {
        if (renderDescriptionAsHtml == null)
            return;
        this._renderDescriptionAsHtml = renderDescriptionAsHtml;
    }
    set renderFeedbackAsHtml(renderFeedbackAsHtml) {
        if (renderFeedbackAsHtml == null)
            return;
        else
            this._renderFeedbackAsHtml = renderFeedbackAsHtml;
    }
    // --- --- --- Lifecycle --- --- ---
    createRenderRoot() {
        return this;
    }
    render() {
        this.dataset.oid = this._objectId;
        return html `
            <style>
                :root {
                    --field-description-success-color: var(--lumo-success-text-color);
                    --field-description-info-color: #2a88c7;
                    --field-description-warn-color: #c78f2a;
                    --field-description-error-color: var(--lumo-error-text-color);
                }

                vcf-field-description .field-description-container {
                    display: flex;
                }

                vcf-field-description .field-description {
                    flex-grow: 1;
                    padding-top: 1px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    transition: max-height 0.8s;
                    max-height: 20px;
                }

                vcf-field-description .expand-icon-container {
                    flex-grow: 0;
                    min-width: 20px;
                    cursor: pointer;
                }

                vcf-field-description .expand-icon-container iron-icon {
                    height: 15px;
                }

                vcf-field-description .field-description-helper {
                    position: absolute;
                    left: 0;
                    top: 0;
                    white-space: normal;
                    z-index: -1;
                    visibility: hidden;
                    white-space: normal;
                }

                vcf-field-description .field-description-feedback-container[data-state="SUCCESS"] {
                    color: var(--field-description-success-color);
                }

                vcf-field-description .field-description-feedback-container[data-state="INFO"] {
                    color: var(--field-description-info-color);
                }

                vcf-field-description .field-description-feedback-container[data-state="WARN"] {
                    color: var(--field-description-warn-color);
                }

                vcf-field-description .field-description-feedback-container[data-state="ERROR"] {
                    color: var(--field-description-error-color);
                }

                vcf-field-description .field-description-feedback-container iron-icon {
                    height: 14px;
                    vertical-align: top;
                }

                vcf-field-description .field-description-feedback {
                    margin-top: 18px;
                    display: table;
                }

                vcf-field-description .field-description-feedback > * {
                    display: table-cell;
                }
            </style>

            <div class="field-description-component-wrapper">
                <div class="field-description-container">
                    ${this._renderDescription()}
                </div>
                <div class=field-description-feedback-container data-state="${this.feedbackState}">
                    ${this._renderFeedback()}
                </div>
            </div>`;
    }
    updated() {
        this._placeExpandIcon();
        this._setDoubleClickListener();
        this._takeMeasurementsAndReserveHeights();
    }
    // --- --- --- Methods --- --- ---
    _renderDescription() {
        return html `
            <div class="field-description">
                ${this._renderDescriptionAsHtml ? unsafeHTML(this.description) : html `<span>${this.description}`}</span>
                <div class="field-description-helper field-description-helper-textmeasurements" aria-hidden="true">
                    ${this._renderDescriptionAsHtml ? unsafeHTML(this.description) : this.description}
                </div>
            </div>
            <div class="expand-icon-container"></div>`;
    }
    _renderFeedback() {
        if (!this.feedbackContent)
            return html ``;
        return html `
            <div class="field-description-feedback" data-state="${this.feedbackState}" aria-live="assertive">
                <iron-icon icon="vaadin:info"></iron-icon>
                ${this._renderFeedbackAsHtml ? unsafeHTML(this.feedbackContent) : html `<span>${this.feedbackContent}`}</span>
            </div>
            ${this.reserveFeedbackHeight ?
            html `
                            <div class="field-description-helper field-description-helper-feedbackmeasurements" aria-hidden="true">
                                <iron-icon icon="vaadin:info"></iron-icon>
                                ${this._renderFeedbackAsHtml ? unsafeHTML(this.feedbackContent) : html `<span>${this.feedbackContent}`}</span>
                            </div>
                    ` : ''}

        `;
    }
    _placeExpandIcon() {
        let _this = this;
        setTimeout(() => {
            let ellipsis = false;
            let fieldDescriptionContainerElement = _this.querySelector('.field-description');
            if (fieldDescriptionContainerElement != null && fieldDescriptionContainerElement.offsetWidth < fieldDescriptionContainerElement.scrollWidth)
                ellipsis = true;
            let iconContainerElement = this.querySelector('.expand-icon-container');
            if (!iconContainerElement)
                return;
            iconContainerElement.innerHTML = '';
            let iconElement = document.createElement('iron-icon');
            iconElement.setAttribute('aria-hidden', 'true'); //TODO: should this be set to false when expandbutton is focusable ?
            iconElement.setAttribute('tabindex', this.expandButtonIsKbFocusable ? '0' : '-1');
            iconElement.onclick = function ( /* ev */) {
                _this.toggleExpandDescription();
            };
            iconContainerElement.appendChild(iconElement);
            if (ellipsis) {
                iconElement.setAttribute('icon', 'vaadin:info-circle');
            }
            else {
                if (this._expanded || this._expanding)
                    iconElement.setAttribute('icon', 'vaadin:chevron-circle-up');
            }
        }, 1);
    }
    _setDoubleClickListener() {
        let element = this.querySelector('.field-description');
        if (!element)
            return;
        let _this = this;
        element.ondblclick = function ( /* ev */) {
            _this.toggleExpandDescription();
        };
    }
    toggleExpandDescription() {
        this._expanding = true;
        this._expanded = !this._expanded;
        let _this = this;
        setTimeout(() => {
            let ellipsis = false;
            let fieldDescriptionContainerElement = _this.querySelector('.field-description');
            if (fieldDescriptionContainerElement != null && fieldDescriptionContainerElement.offsetWidth < fieldDescriptionContainerElement.scrollWidth)
                ellipsis = true;
            let element = this.querySelector('.field-description');
            if (element) {
                if (ellipsis || !this._expanded) {
                    if (this._expanded) {
                        element.style.textOverflow = 'unset';
                        element.style.whiteSpace = 'unset';
                        element.style.maxHeight = this._fieldDescriptionTextMeasuredHeight != -1 ? this._fieldDescriptionTextMeasuredHeight + 'px' : 'none';
                        this._placeExpandIcon();
                        this._expanding = false;
                    }
                    else {
                        element.style.maxHeight = '20px';
                        setTimeout(() => {
                            if (!element)
                                return;
                            element.style.textOverflow = 'ellipsis';
                            element.style.whiteSpace = 'nowrap';
                            this._placeExpandIcon();
                            this._expanding = false;
                        }, 800);
                    }
                }
            }
        }, 1);
    }
    _takeMeasurementsAndReserveHeights() {
        let _this = this;
        setTimeout(() => {
            let ellipsis = false;
            let fieldDescriptionContainerElement = _this.querySelector('.field-description');
            if (fieldDescriptionContainerElement != null && fieldDescriptionContainerElement.offsetWidth < fieldDescriptionContainerElement.scrollWidth)
                ellipsis = true;
            let wrapperElement = _this.querySelector('.field-description-component-wrapper');
            let textElement = _this.querySelector('.field-description');
            let feedbackElement = _this.querySelector('.field-description-feedback');
            let helperElementD = _this.querySelector('.field-description-helper-textmeasurements');
            let helperElementF = _this.querySelector('.field-description-helper-feedbackmeasurements');
            if (!wrapperElement || !helperElementD)
                return;
            if (_this.feedbackContent && _this.reserveFeedbackHeight && (!feedbackElement || !helperElementF))
                return;
            if (textElement && helperElementD) {
                if (ellipsis || _this._expanded) {
                    _this._fieldDescriptionTextMeasuredWidth = textElement.offsetWidth;
                    helperElementD.style.width = `${this._fieldDescriptionTextMeasuredWidth}px`;
                    _this._fieldDescriptionTextMeasuredHeight = helperElementD.offsetHeight;
                }
            }
            else {
                _this._fieldDescriptionTextMeasuredWidth = -1;
                _this._fieldDescriptionTextMeasuredHeight = -1;
            }
            if (this.feedbackContent && feedbackElement && helperElementF) {
                _this._fieldDescriptionFeedbackMeasuredWidth = feedbackElement.offsetWidth;
                helperElementF.style.width = `${this._fieldDescriptionFeedbackMeasuredWidth}px`;
                _this._fieldDescriptionFeedbackMeasuredHeight = helperElementF.offsetHeight;
            }
            else {
                _this._fieldDescriptionFeedbackMeasuredWidth = -1;
                _this._fieldDescriptionFeedbackMeasuredHeight = -1;
            }
            // reserve heights
            let minWrapperHeight = 1;
            if (this.reserveDescriptionHeight && this._fieldDescriptionTextMeasuredHeight > -1)
                minWrapperHeight = minWrapperHeight + this._fieldDescriptionTextMeasuredHeight;
            if (this.reserveFeedbackHeight && this._fieldDescriptionFeedbackMeasuredHeight > -1)
                minWrapperHeight = minWrapperHeight + this._fieldDescriptionFeedbackMeasuredHeight + 2;
            wrapperElement.style.minHeight = `${minWrapperHeight}px`;
        }, 1);
    }
};
__decorate([
    property({ type: Boolean })
], VcfFieldDescription.prototype, "expanded", null);
__decorate([
    property({ type: String })
], VcfFieldDescription.prototype, "description", void 0);
__decorate([
    property({ type: Boolean })
], VcfFieldDescription.prototype, "expandButtonIsKbFocusable", void 0);
__decorate([
    property({ type: String })
], VcfFieldDescription.prototype, "feedbackState", void 0);
__decorate([
    property({ type: String })
], VcfFieldDescription.prototype, "feedbackContent", void 0);
__decorate([
    property({ type: Boolean })
], VcfFieldDescription.prototype, "reserveDescriptionHeight", void 0);
__decorate([
    property({ type: Boolean })
], VcfFieldDescription.prototype, "reserveFeedbackHeight", void 0);
__decorate([
    property({ type: Boolean })
], VcfFieldDescription.prototype, "renderDescriptionAsHtml", null);
__decorate([
    property({ type: Boolean })
], VcfFieldDescription.prototype, "renderFeedbackAsHtml", null);
VcfFieldDescription = __decorate([
    customElement('vcf-field-description')
], VcfFieldDescription);
export { VcfFieldDescription };
//# sourceMappingURL=vcf-field-description.js.map