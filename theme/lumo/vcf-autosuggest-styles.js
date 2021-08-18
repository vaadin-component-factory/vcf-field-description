import '@vaadin/vaadin-lumo-styles/style';

const theme = document.createElement('dom-module');
theme.id = 'vcf-autosuggest-lumo';
theme.setAttribute('theme-for', 'vcf-autosuggest');
theme.innerHTML = `
    <template>
      <style>
        :host {}
      </style>
    </template>
  `;
theme.register(theme.id);

const overlayTheme = document.createElement('dom-module');
overlayTheme.id = 'vcf-autosuggest-overlay-lumo';
overlayTheme.setAttribute('theme-for', 'vcf-autosuggest-overlay');
overlayTheme.innerHTML = `
    <template>
      <style>
        :host [part='options-container'] {
            margin-left: 0.5em;
            margin-right: 0.5em;
            min-width: var(--vcf-autosuggest-options-width);
        }
        :host [part="options-container"] vaadin-item::before {
          content: none;
        }
        :host [part="dropdown-end-slot"] {
          border-top: 1px solid var(--lumo-contrast-40pct);
        }
      </style>
    </template>
  `;
  overlayTheme.register(overlayTheme.id);
