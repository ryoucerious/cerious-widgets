'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ngx-cerious-widgets documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/CeriousWidgetsModule.html" data-type="entity-link" >CeriousWidgetsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-CeriousWidgetsModule-152e04e6d3e5e47356b301507a293638e0f011166187d7e66d7059d4490da6dcc121e62516b95c7d3fc12c58df75b0e92a8743a09d984b6a4c0a4cc0bd0bfb80"' : 'data-bs-target="#xs-components-links-module-CeriousWidgetsModule-152e04e6d3e5e47356b301507a293638e0f011166187d7e66d7059d4490da6dcc121e62516b95c7d3fc12c58df75b0e92a8743a09d984b6a4c0a4cc0bd0bfb80"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CeriousWidgetsModule-152e04e6d3e5e47356b301507a293638e0f011166187d7e66d7059d4490da6dcc121e62516b95c7d3fc12c58df75b0e92a8743a09d984b6a4c0a4cc0bd0bfb80"' :
                                            'id="xs-components-links-module-CeriousWidgetsModule-152e04e6d3e5e47356b301507a293638e0f011166187d7e66d7059d4490da6dcc121e62516b95c7d3fc12c58df75b0e92a8743a09d984b6a4c0a4cc0bd0bfb80"' }>
                                            <li class="link">
                                                <a href="components/GridComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-CeriousWidgetsModule-152e04e6d3e5e47356b301507a293638e0f011166187d7e66d7059d4490da6dcc121e62516b95c7d3fc12c58df75b0e92a8743a09d984b6a4c0a4cc0bd0bfb80"' : 'data-bs-target="#xs-directives-links-module-CeriousWidgetsModule-152e04e6d3e5e47356b301507a293638e0f011166187d7e66d7059d4490da6dcc121e62516b95c7d3fc12c58df75b0e92a8743a09d984b6a4c0a4cc0bd0bfb80"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-CeriousWidgetsModule-152e04e6d3e5e47356b301507a293638e0f011166187d7e66d7059d4490da6dcc121e62516b95c7d3fc12c58df75b0e92a8743a09d984b6a4c0a4cc0bd0bfb80"' :
                                        'id="xs-directives-links-module-CeriousWidgetsModule-152e04e6d3e5e47356b301507a293638e0f011166187d7e66d7059d4490da6dcc121e62516b95c7d3fc12c58df75b0e92a8743a09d984b6a4c0a4cc0bd0bfb80"' }>
                                        <li class="link">
                                            <a href="directives/TemplateRegistrarDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TemplateRegistrarDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GridComponentsModule.html" data-type="entity-link" >GridComponentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-GridComponentsModule-51c16634cdf673b2bcfeb3d15625ca23e8728037733edeb13100c54214a150f17bfeb1332ff109478980f50b7ed85b56d51de738152355e314b93b9f558caec7"' : 'data-bs-target="#xs-components-links-module-GridComponentsModule-51c16634cdf673b2bcfeb3d15625ca23e8728037733edeb13100c54214a150f17bfeb1332ff109478980f50b7ed85b56d51de738152355e314b93b9f558caec7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GridComponentsModule-51c16634cdf673b2bcfeb3d15625ca23e8728037733edeb13100c54214a150f17bfeb1332ff109478980f50b7ed85b56d51de738152355e314b93b9f558caec7"' :
                                            'id="xs-components-links-module-GridComponentsModule-51c16634cdf673b2bcfeb3d15625ca23e8728037733edeb13100c54214a150f17bfeb1332ff109478980f50b7ed85b56d51de738152355e314b93b9f558caec7"' }>
                                            <li class="link">
                                                <a href="components/GridBodyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridBodyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridColumnSizerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridColumnSizerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridFillerRowColumnComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridFillerRowColumnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridFillerRowComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridFillerRowComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridFillerRowFeatureColumnComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridFillerRowFeatureColumnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridFooterColumnComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridFooterColumnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridFooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridFooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridFooterFeatureColumnComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridFooterFeatureColumnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridFooterRowComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridFooterRowComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridHeaderColumnComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridHeaderColumnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridHeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridHeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridHeaderFeatureColumnComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridHeaderFeatureColumnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridHeaderRowComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridHeaderRowComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridMenuBarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridMenuBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridNestedRowColumnComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridNestedRowColumnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridNestedRowComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridNestedRowComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridPagerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridPagerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridRowColumnComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridRowColumnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridRowComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridRowComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridRowFeatureColumnComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridRowFeatureColumnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridScrollerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridScrollerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/GridRow.html" data-type="entity-link" >GridRow</a>
                            </li>
                            <li class="link">
                                <a href="classes/MenuOption.html" data-type="entity-link" >MenuOption</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ColumnMenuPlugin.html" data-type="entity-link" >ColumnMenuPlugin</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ColumnVisibilityPlugin.html" data-type="entity-link" >ColumnVisibilityPlugin</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExportToExcelPlugin.html" data-type="entity-link" >ExportToExcelPlugin</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GlobalTextFilterPlugin.html" data-type="entity-link" >GlobalTextFilterPlugin</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GridColumnService.html" data-type="entity-link" >GridColumnService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GridScrollService.html" data-type="entity-link" >GridScrollService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GridService.html" data-type="entity-link" >GridService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MultiSortPlugin.html" data-type="entity-link" >MultiSortPlugin</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PluginManagerService.html" data-type="entity-link" >PluginManagerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SaveGridStatePlugin.html" data-type="entity-link" >SaveGridStatePlugin</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ServerSidePlugin.html" data-type="entity-link" >ServerSidePlugin</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TemplateRegistryService.html" data-type="entity-link" >TemplateRegistryService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CellEvent.html" data-type="entity-link" >CellEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ColumnDef.html" data-type="entity-link" >ColumnDef</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterState.html" data-type="entity-link" >FilterState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GridApi.html" data-type="entity-link" >GridApi</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GridDataRequest.html" data-type="entity-link" >GridDataRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GridDataResponse.html" data-type="entity-link" >GridDataResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GridDataset.html" data-type="entity-link" >GridDataset</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GridDataSource.html" data-type="entity-link" >GridDataSource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GridOptions.html" data-type="entity-link" >GridOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GridPlugin.html" data-type="entity-link" >GridPlugin</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridBodyComponent.html" data-type="entity-link" >IGridBodyComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridColumnService.html" data-type="entity-link" >IGridColumnService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridColumnSizerComponent.html" data-type="entity-link" >IGridColumnSizerComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridComponent.html" data-type="entity-link" >IGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridFillerRowColumnComponent.html" data-type="entity-link" >IGridFillerRowColumnComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridFillerRowComponent.html" data-type="entity-link" >IGridFillerRowComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridFillerRowFeatureColumnComponent.html" data-type="entity-link" >IGridFillerRowFeatureColumnComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridFooterColumnComponent.html" data-type="entity-link" >IGridFooterColumnComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridFooterComponent.html" data-type="entity-link" >IGridFooterComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridFooterFeatureColumnComponent.html" data-type="entity-link" >IGridFooterFeatureColumnComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridFooterRowComponent.html" data-type="entity-link" >IGridFooterRowComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridHeaderColumnComponent.html" data-type="entity-link" >IGridHeaderColumnComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridHeaderComponent.html" data-type="entity-link" >IGridHeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridHeaderFeatureColumnComponent.html" data-type="entity-link" >IGridHeaderFeatureColumnComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridHeaderRowComponent.html" data-type="entity-link" >IGridHeaderRowComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridMenuBarComponent.html" data-type="entity-link" >IGridMenuBarComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridNestedRowColumnComponent.html" data-type="entity-link" >IGridNestedRowColumnComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridNestedRowComponent.html" data-type="entity-link" >IGridNestedRowComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridPagerComponent.html" data-type="entity-link" >IGridPagerComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridRowColumnComponent.html" data-type="entity-link" >IGridRowColumnComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridRowComponent.html" data-type="entity-link" >IGridRowComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridRowFeatureColumnComponent.html" data-type="entity-link" >IGridRowFeatureColumnComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridScrollerComponent.html" data-type="entity-link" >IGridScrollerComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridScrollService.html" data-type="entity-link" >IGridScrollService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGridService.html" data-type="entity-link" >IGridService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PagerInfo.html" data-type="entity-link" >PagerInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PluginOptions.html" data-type="entity-link" >PluginOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RowEvent.html" data-type="entity-link" >RowEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScrollDelta.html" data-type="entity-link" >ScrollDelta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SortState.html" data-type="entity-link" >SortState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetsConfig.html" data-type="entity-link" >WidgetsConfig</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});