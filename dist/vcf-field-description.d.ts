import { LitElement } from 'lit-element';
export declare class VcfFieldDescription extends LitElement {
    get expanded(): Boolean;
    set expanded(expanded: Boolean);
    private _expanded;
    description: string;
    expandButtonIsKbFocusable: boolean;
    feedbackState: String;
    feedbackContent: string;
    reserveDescriptionHeight: boolean;
    reserveFeedbackHeight: boolean;
    set renderDescriptionAsHtml(renderDescriptionAsHtml: Boolean);
    private _renderDescriptionAsHtml;
    set renderFeedbackAsHtml(renderFeedbackAsHtml: Boolean);
    private _renderFeedbackAsHtml;
    private _objectId;
    private _expanding;
    private _fieldDescriptionTextMeasuredWidth;
    private _fieldDescriptionTextMeasuredHeight;
    private _fieldDescriptionFeedbackMeasuredWidth;
    private _fieldDescriptionFeedbackMeasuredHeight;
    createRenderRoot(): this;
    render(): import("lit-html").TemplateResult<1>;
    updated(): void;
    _renderDescription(): import("lit-html").TemplateResult<1>;
    _renderFeedback(): import("lit-html").TemplateResult<1>;
    _placeExpandIcon(): void;
    _setDoubleClickListener(): void;
    toggleExpandDescription(): void;
    _takeMeasurementsAndReserveHeights(): void;
}
//# sourceMappingURL=vcf-field-description.d.ts.map