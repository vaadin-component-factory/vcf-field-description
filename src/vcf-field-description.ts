import { LitElement, html, customElement, property } from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

@customElement('vcf-field-description')
export class VcfFieldDescription extends LitElement {
    // --- --- --- Properties --- --- ---

    @property({type: Boolean})
    get expanded() {
        return this._expanded;
    }
    set expanded(expanded: Boolean) {
        if(expanded == null) return;
        const oldValue = this._expanded;
        this._expanded = expanded;
        this.requestUpdate("expanded", oldValue);
    }
    private _expanded: Boolean = false;

    @property({type: String})
    description = "";

    @property({type: Boolean})
    expandButtonIsKbFocusable = false;

    @property({type: String})
    feedbackState: String = 'INFO';

    @property({type: String})
    feedbackContent = "";

    @property({type: Boolean})
    reserveDescriptionHeight = false;

    @property({type: Boolean})
    reserveFeedbackHeight = false;

    @property({type: Boolean}) set renderDescriptionAsHtml(renderDescriptionAsHtml: Boolean) {
        if(renderDescriptionAsHtml == null) return;
        this._renderDescriptionAsHtml = renderDescriptionAsHtml;
    }
    private _renderDescriptionAsHtml: Boolean = false;

    @property({type: Boolean})
    set renderFeedbackAsHtml(renderFeedbackAsHtml: Boolean) {
        if(renderFeedbackAsHtml == null) return;
        else this._renderFeedbackAsHtml = renderFeedbackAsHtml;
    }
    private _renderFeedbackAsHtml: Boolean = false;

    private _objectId: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    private _expanding: Boolean = false;
    private _fieldDescriptionTextMeasuredWidth: number = -1;
    private _fieldDescriptionTextMeasuredHeight: number = -1;
    private _fieldDescriptionFeedbackMeasuredWidth: number = -1;
    private _fieldDescriptionFeedbackMeasuredHeight: number = -1;

    // --- --- --- Lifecycle --- --- ---

    createRenderRoot() {  // Render template without shadow DOM.
        return this;
    }

    render() {
        this.dataset.oid = this._objectId;
        return html`
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
                }

                vcf-field-description .expand-icon-container iron-icon {
                    height: 15px;
                    cursor: pointer;
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
                    ${ this._renderDescription() }
                </div>
                <div class=field-description-feedback-container data-state="${this.feedbackState}">
                    ${ this._renderFeedback() }
                </div>
            </div>`;
    }

    updated() {
        this._placeExpandIcon();
        this._setDoubleClickListener()
        this._takeMeasurementsAndReserveHeights()
    }

    // --- --- --- Methods --- --- ---

    _renderDescription() {
        return html`
            <div class="field-description">
                ${ this._renderDescriptionAsHtml ? unsafeHTML(this.description) : html`<span>${this.description}` }</span>
                <div class="field-description-helper field-description-helper-textmeasurements" aria-hidden="true">
                    ${ this._renderDescriptionAsHtml ? unsafeHTML(this.description) : this.description }
                </div>
            </div>
            <div class="expand-icon-container"></div>`;
    }

    _renderFeedback() {
        if(!this.feedbackContent) return html``;
        return html`
            <div class="field-description-feedback" data-state="${this.feedbackState}" aria-live="assertive">
                <iron-icon icon="vaadin:info"></iron-icon>
                ${ this._renderFeedbackAsHtml ? unsafeHTML(this.feedbackContent) : html`<span>${this.feedbackContent}` }</span>
            </div>
            ${
                this.reserveFeedbackHeight ?
                    html`
                            <div class="field-description-helper field-description-helper-feedbackmeasurements" aria-hidden="true">
                                <iron-icon icon="vaadin:info"></iron-icon>
                                ${ this._renderFeedbackAsHtml ? unsafeHTML(this.feedbackContent) : html`<span>${this.feedbackContent}` }</span>
                            </div>
                    ` : ''
            }

        `;
    }

    _placeExpandIcon() {
        let _this = this;
        setTimeout(() => {
            let ellipsis = false;
            let fieldDescriptionContainerElement = _this.querySelector<HTMLElement>('.field-description');
            if(fieldDescriptionContainerElement != null && fieldDescriptionContainerElement.offsetWidth < fieldDescriptionContainerElement.scrollWidth) ellipsis = true;

            let iconContainerElement = this.querySelector<HTMLElement>('.expand-icon-container');
            if(!iconContainerElement) return;
            iconContainerElement.innerHTML = '';

            let iconElement = document.createElement('iron-icon');
            iconElement.setAttribute('aria-hidden', 'true'); //TODO: should this be set to false when expandbutton is focusable ?
            iconElement.setAttribute('tabindex', this.expandButtonIsKbFocusable ? '0' : '-1');
            iconElement.onclick = function(/* ev */) {
                _this.toggleExpandDescription();
            }
            iconContainerElement.appendChild(iconElement);

            if(ellipsis) {
                iconElement.setAttribute('icon', 'vaadin:info-circle');
            } else {
                if(this._expanded || this._expanding) iconElement.setAttribute('icon', 'vaadin:chevron-circle-up');
            }
        }, 1);
    }

    _setDoubleClickListener() {
        let element = this.querySelector<HTMLElement>('.field-description');
        if(!element) return;
        let _this = this;
        element.ondblclick = function(/* ev */) {
            _this.toggleExpandDescription();
        }
    }

    toggleExpandDescription() {
        this._expanding = true;
        this._expanded = !this._expanded;

        let _this = this;
        setTimeout(() => {
            let ellipsis = false;
            let fieldDescriptionContainerElement = _this.querySelector<HTMLElement>('.field-description');
            if(fieldDescriptionContainerElement != null && fieldDescriptionContainerElement.offsetWidth < fieldDescriptionContainerElement.scrollWidth) ellipsis = true;

            let element = this.querySelector<HTMLElement>('.field-description');
            if(element) {
                if(ellipsis || !this._expanded) {
                    if(this._expanded) {
                        element.style.textOverflow = 'unset';
                        element.style.whiteSpace = 'unset';
                        element.style.maxHeight = this._fieldDescriptionTextMeasuredHeight != -1 ? this._fieldDescriptionTextMeasuredHeight + 'px' : 'none';
                        this._placeExpandIcon();
                        this._expanding = false;
                    } else {
                        element.style.maxHeight = '20px';
                        setTimeout(() => {
                            if(!element) return;
                            element.style.textOverflow = 'ellipsis';
                            element.style.whiteSpace = 'nowrap';
                            this._placeExpandIcon();
                            this._expanding = false;
                        }, 800)
                    }
                }
            }
        }, 1);
    }

    _takeMeasurementsAndReserveHeights() {
        let _this = this;
        setTimeout(() => {
            let ellipsis = false;
            let fieldDescriptionContainerElement = _this.querySelector<HTMLElement>('.field-description');
            if(fieldDescriptionContainerElement != null && fieldDescriptionContainerElement.offsetWidth < fieldDescriptionContainerElement.scrollWidth) ellipsis = true;

            let wrapperElement = _this.querySelector<HTMLElement>('.field-description-component-wrapper');
            let textElement = _this.querySelector<HTMLElement>('.field-description');
            let feedbackElement = _this.querySelector<HTMLElement>('.field-description-feedback');
            let helperElementD = _this.querySelector<HTMLElement>('.field-description-helper-textmeasurements');
            let helperElementF = _this.querySelector<HTMLElement>('.field-description-helper-feedbackmeasurements');

            if(!wrapperElement || !helperElementD) return;
            if(_this.feedbackContent && _this.reserveFeedbackHeight && (!feedbackElement || !helperElementF)) return;

            if(textElement && helperElementD) {
                if(ellipsis || _this._expanded) {
                    _this._fieldDescriptionTextMeasuredWidth = textElement.offsetWidth;
                    helperElementD.style.width = `${this._fieldDescriptionTextMeasuredWidth}px`;
                    _this._fieldDescriptionTextMeasuredHeight = helperElementD.offsetHeight;
                }
            } else {
                _this._fieldDescriptionTextMeasuredWidth = -1;
                _this._fieldDescriptionTextMeasuredHeight = -1;
            }

            if(this.feedbackContent && feedbackElement && helperElementF) {
                _this._fieldDescriptionFeedbackMeasuredWidth = feedbackElement.offsetWidth;
                helperElementF.style.width = `${this._fieldDescriptionFeedbackMeasuredWidth}px`;
                _this._fieldDescriptionFeedbackMeasuredHeight = helperElementF.offsetHeight;
            } else {
                _this._fieldDescriptionFeedbackMeasuredWidth = -1;
                _this._fieldDescriptionFeedbackMeasuredHeight = -1;
            }

            // reserve heights
            let minWrapperHeight = 1;
            if(this.reserveDescriptionHeight && this._fieldDescriptionTextMeasuredHeight > -1) minWrapperHeight = minWrapperHeight + this._fieldDescriptionTextMeasuredHeight;
            if(this.reserveFeedbackHeight && this._fieldDescriptionFeedbackMeasuredHeight > -1) minWrapperHeight = minWrapperHeight + this._fieldDescriptionFeedbackMeasuredHeight + 2;
            wrapperElement.style.minHeight = `${minWrapperHeight}px`
        }, 1);
    }

}