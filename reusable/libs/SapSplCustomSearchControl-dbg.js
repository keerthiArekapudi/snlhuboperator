/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("splReusable.exceptions.MissingParametersException");
jQuery.sap.require("splReusable.exceptions.InvalidArrayException");
jQuery.sap.require("splReusable.libs.SapSplModelFormatters");
jQuery.sap.require("splReusable.libs.SapSplEnums");
splReusable.libs.SapSplStyleSheetLoader.loadStyle("./resources/styles/SapSplCustomSearchControl");
jQuery.sap.declare("splReusable.libs.SapSplCustomSearchControl");

/**
 * Constructor
 */

function fnHandleOnAfterRenderingOfTheExpandedSearchList() {
    var iListContainerHeight = $(window).height() - $(".sapUiUfdShellHead").height() + $(".sapSplExpandedSearchListHeader").height() - (2 * $(".sapMFooter-CTX").height()) - $(".sapSplFeedListToolbar").height();
    $(".sapSplExpandedSearchListContainer").css("height", iListContainerHeight + "px");
}

/**
 * Handles the event when you click on the list item
 * @param oEvent
 * @returns void
 * @since 1.0
 */
function fnHandleListItemClick(oEvent) {

    var oClickedListItem = oEvent.getParameters().listItem.getBindingContext().getObject();
    this.oParentControllerInstance.fnSearchToMapInterface("show", [oClickedListItem]);
    //call when item is clicked
}

function getExpandedSearchList(that) {

    that.oExpandedSearchListCloseButton = new sap.m.Button({
        icon: "sap-icon://sys-cancel",
        press: function (oEvent) {
            oEvent.getSource().getParent().getParent().getParent().setVisible(false);
            oEvent.getSource().getParent().getParent().removeSelections();
        }
    });

    that.oExpandedListHeaderLabel = new sap.m.Text();

    return new sap.ui.layout.VerticalLayout().addStyleClass("sapSplExpandedSearchListContainer").addContent(
            new sap.m.List({
                mode: "SingleSelectMaster",
                headerToolbar: new sap.m.Toolbar({
                    content: [that.oExpandedListHeaderLabel,
                              new sap.m.ToolbarSpacer(),
                              that.oExpandedSearchListCloseButton
                              ],
                              design: "Transparent"
                }).addStyleClass("sapSplExpandedSearchListHeader"),
                items: {
                    path: "/",
                    template: new sap.m.CustomListItem({
                        content: [
                                  new sap.m.Toolbar({
                                      visible: true,
                                      content: [
                                                new sap.m.Label({
                                                    text: "{ObjectInfo/Name}"
                                                }).addStyleClass("sapSplSearchListName"),
                                                new sap.m.ToolbarSpacer(),
                                                new sap.m.Label({
                                                    text: {
                                                        path: "ObjectInfo/ObjectType",
                                                        formatter: function (sValue) {
                                                            if (sValue === "Location") {
                                                                return oSapSplUtils.getBundle().getText("LOCATION");
                                                            } else if (sValue === "TrackableObject") {
                                                                return oSapSplUtils.getBundle().getText("TRUCK");
                                                            } else if (sValue === "Message") {
                                                                return oSapSplUtils.getBundle().getText("INCIDENTS_DETAIL_FORM_TITLE");
                                                            } else {
                                                                return "";
                                                            }
                                                        }
                                                    }
                                                }).addStyleClass("sapSplSearchListType")
                                                ]
                                  }).addStyleClass("sapSplSearchListItemTemplate")
                                  ]
                    })
                },
                select: jQuery.proxy(fnHandleListItemClick, that)
            }).setModel(that.oCustomSearchModel).addStyleClass("sapSplExpandedSearchList")).addEventDelegate({
                onAfterRendering: fnHandleOnAfterRenderingOfTheExpandedSearchList
            });
}

/**
 * Handles the event when you type something and press enter
 * @param oEvent
 * @returns void
 * @since 1.0
 */
function fnHandleSearch(oEvent, that) {
    var aSearchedObjects = that.oSearchList.getModel().getData();
    if (oEvent === null) {
        that.oParentControllerInstance.fnSearchToMapInterface("show", aSearchedObjects);
    } else {
        if (!that.oSearchList.getSelectedItem()) {
            if (oEvent.getParameter("query").length !== 0) {
                that.oParentControllerInstance.fnSearchToMapInterface("show", aSearchedObjects);
            }
        } else {
            that.oSearchList.fireSelect({
                listItem: that.oSearchList.getSelectedItem()
            });
        }
    }

}

function fnPrepareSearchPayload(sSearchTerm) {
    var payload = {};
    payload.UserID = oSapSplUtils.getLoggedOnUserDetails().userId;

    payload.ObjectType = ["Location", "TrackableObject", "Message"];
    //    payload.ObjectType = "Location";

    payload.AdditionalCriteria = {
            FilterAssignedVehicles: true
    };
    payload.AdditionalCriteria.MessageObjectType = "M";
    payload.AdditionalCriteria.MessageType = "I";
    payload.AdditionalCriteria.FilterUnsubscribedVehicles = true;
    payload.SearchTerm = sSearchTerm;
    payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
    payload.MaximumNumberOfRecords = SapSplEnums.numberOfRecords;
    payload.ProvideDetails = false;
    payload.SearchInNetwork = true;

    return payload;
}

function fnGetSearchResults(sSearchTerm, that) {

    var oPayload = fnPrepareSearchPayload(sSearchTerm);

    oSapSplAjaxFactory.fireAjaxCall({
        url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/Search.xsjs"),
        method: "POST",
        async: false,
        data: JSON.stringify(oPayload),
        success: function (data, success, messageObject) {
            oSapSplBusyDialog.getBusyDialogInstance().close();
            // CSN FIX : 0120031469 635564     2014
            if ((data.constructor !== Object) && (data.constructor !== Array)) {
                data = JSON.parse(data);
            }
            if (messageObject["status"] === 200) {

                if (data.length === 0) {
                    that.oSearchListPopover.close();
                }

                that.oSearchResults = data;

            } else if (data["Error"] && data["Error"].length > 0) {

                var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload(data)["ufErrorObject"];
                sap.ca.ui.message.showMessageBox({
                    type: sap.ca.ui.message.Type.ERROR,
                    message: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["errorWarningString"],
                    details: errorMessage
                });
            }
        },
        error: function (error) {
            oSapSplBusyDialog.getBusyDialogInstance().close();

            if (error && error["status"] === 500) {
                sap.ca.ui.message.showMessageBox({
                    type: sap.ca.ui.message.Type.ERROR,
                    message: error["status"] + "\t" + error.statusText,
                    details: error.responseText
                });
            } else {
                sap.ca.ui.message.showMessageBox({
                    type: sap.ca.ui.message.Type.ERROR,
                    message: oSapSplUtils.getBundle().getText("INCORRECT_ARGUMENTS_ERROR_MESSAGE"),
                    details: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["ufErrorObject"]
                });
            }
        }
    });
}

/**
 * Handles the event when you start searching
 * @param oEvent
 * @returns void
 * @since 1.0
 */
function fnHandleLiveChange(oEvent, that) {
    var val = "";
    that.oSearchResults = null;


    if (oEvent.getParameter("query")) {
        val = oEvent.getParameter("query");
    } else {
        val = oEvent.getParameter("newValue");
    }

    if (val.length === 0) {
        /* CSNFIX : 0120061532 0001491209 2014 */
        that.oSearchListPopover.close();
        that.oSearchList.getBinding("items").filter([]);
        //        that.oSearchList.setVisible(false);
        that.oCustomSearchModel.setData([]);

        that.oParentControllerInstance.fnSearchToMapInterface("reset");
        that.oCustomSearchLayout.getContent()[1].setVisible(false);
        that.iCounter = 0;

    } else {

        if (val.length >= 3) {

            if (that.iCounter === 0) {
                that.oParentControllerInstance.fnSearchToMapInterface("clear");
            }
            if (that.oSearchList.getItems().length > 0) {
                that.oSearchListPopover.openBy(that.oSearchField);
            }
            that.iCounter++;
            fnGetSearchResults(val, that);
            //            that.oSearchList.setVisible(true);
            that.oCustomSearchModel.setData(that.oSearchResults);
        }
    }
}

splReusable.libs.SapSplCustomSearchControl = function (oCustomSearchControlConfigData) {
    var that = this;
    this.oParentControllerInstance = oCustomSearchControlConfigData["controllerInstance"].getParent().getParent().getController();
    this.iCounter = 0;
    this.iSearchListThreshold = 5;
    // Search field
    this.oSearchField = new sap.m.SearchField({
        showSearchButton: false,
        showMagnifier: false,
        liveChange: function (oEvent) {
            fnHandleLiveChange(oEvent, that);
        },
        search: function (oEvent) {
            fnHandleSearch(oEvent, that);
        },
        width: "20em"
    }).addStyleClass("oSearchField");

    this.oSearchField.attachBrowserEvent("click", function () {
        /* CSNFIX : 0120031469 0000656650 2014 */
        if (that.oSearchList.getItems().length > 0) {
            that.oSearchListPopover.openBy(that.oSearchField);
        }
    });

    this.oSearchField.addEventDelegate({
        onAfterRendering: function (oEvent) {
        		
            oEvent.srcControl.$().keyup(function (oEvent) {
                if (that.oSearchList.getItems().length > 0) {
                    var iSelectedItem = null;
                    if (that.oSearchList.getSelectedItem()) {
                        iSelectedItem = that.oSearchList.indexOfItem(that.oSearchList.getSelectedItem());
                    } else {
                        iSelectedItem = -1;
                    }
                    if (oEvent.keyCode === 40 && iSelectedItem < that.oSearchList.getItems().length - 1) {
                        that.oSearchList.setSelectedItem(that.oSearchList.getItems()[iSelectedItem + 1]);
                    } else if (oEvent.keyCode === 38 && iSelectedItem >= 0) {
                        if (iSelectedItem === 0) {
                            that.oSearchList.removeSelections();
                        } else {
                            that.oSearchList.setSelectedItem(that.oSearchList.getItems()[iSelectedItem - 1]);
                        }
                    } //else if (oEvent.keyCode === 13 && that.oSearchList.getSelectedItem()) {
                        //
                        //                    }
                }
            });
        }
    });

    // The search suggest list.
    this.oSearchList = new sap.m.List({
        showNoData: false,
        select: jQuery.proxy(fnHandleListItemClick, that),
        rememberSelections: false,
        mode: "SingleSelectMaster",
        visible: true
    }).addStyleClass("oSearchList");

    this.oSearchList.bindAggregation("items", "/", function (sId, oObject) {
        var iIndex = parseInt(oObject.sPath.split("/").pop(), 10);
        if (iIndex < that.iSearchListThreshold) {
            return new sap.m.CustomListItem({
                content: [
                          new sap.m.Toolbar({
                              visible: true,
                              content: [
                                        new sap.m.Label({
                                            text: "{ObjectInfo/Name}"
                                        }).addStyleClass("sapSplSearchListName"),
                                        new sap.m.ToolbarSpacer(),
                                        new sap.m.Label({
                                            text: {
                                                path: "ObjectInfo/ObjectType",
                                                formatter: function (sValue) {
                                                    if (sValue === "Location") {
                                                        return oSapSplUtils.getBundle().getText("LOCATION");
                                                    } else if (sValue === "TrackableObject") {
                                                        return oSapSplUtils.getBundle().getText("TRUCK");
                                                    } else if (sValue === "Message") {
                                                        return oSapSplUtils.getBundle().getText("INCIDENTS_DETAIL_FORM_TITLE");
                                                    } else {
                                                        return "";
                                                    }
                                                }
                                            }
                                        }).addStyleClass("sapSplSearchListType")
                                        ]
                          }).addStyleClass("sapSplSearchListItemTemplate")
                          ]
            });
        } else {
            return new sap.m.ObjectListItem({
                visible: false,
                title: "{ObjectInfo/Name}",
                firstStatus: new sap.m.ObjectStatus({
                    text: "{ObjectInfo/ObjectType}",
                    state: "None"
                })
            });
        }
    });

    this.oSearchList.addEventDelegate({
        onAfterRendering: function (oEvent) {
            if (oEvent.srcControl.getItems().length > that.iSearchListThreshold) {
                that.oSearchListFooter.setVisible(true);
                oSapSplUtils.getBundle().getText("VIEW_ALL_SEARCH_ITEMS", [oEvent.srcControl.getItems().length]);
                that.oSearchListFooterText.setText(oSapSplUtils.getBundle().getText("VIEW_ALL_SEARCH_ITEMS", [oEvent.srcControl.getItems().length]));
            } else {
                that.oSearchListFooter.setVisible(false);
            }
        }
    });

    this.oSearchListFooterText = new sap.m.Text();
    this.oSearchListFooterShowAllButton = new sap.m.Button({
        icon: "sap-icon://map-2",
        tooltip: oSapSplUtils.getBundle().getText("VIEW_ALL_SEARCHED_LOCATIONS_ON_MAP_TOOLTIP"),
        press: function () {
            fnHandleSearch(null, that);
        }
    });
    this.oSearchListFooterShowAllAsListButton = new sap.m.Button({
        icon: "sap-icon://list",
        tooltip: oSapSplUtils.getBundle().getText("VIEW_ALL_SEARCHED_LOCATIONS_IN_LIST_TOOLTIP"),
        press: function () {
            that.oExpandedListHeaderLabel.setText(oSapSplUtils.getBundle().getText("EXPANDED_SEARCH_LIST_HEADER_TEXT", [that.oSearchList.getItems().length, that.oSearchField.getValue()]));
            that.oCustomSearchLayout.getContent()[1].setVisible(true);
        }
    });
    this.oSearchListFooter = new sap.m.Toolbar({
        design: "Transparent",
        content: [this.oSearchListFooterText, new sap.m.ToolbarSpacer(), this.oSearchListFooterShowAllButton,
                  this.oSearchListFooterShowAllAsListButton
                  ]
    }).setVisible(false);

    this.oCustomSearchModel = new sap.ui.model.json.JSONModel();
    this.oSearchList.setModel(this.oCustomSearchModel);

    var oExpandCollapseButton = new sap.m.Button({
        icon: "sap-icon://search",
        tooltip: oSapSplUtils.getBundle().getText("SEARCH"),
        press: function () {
            that.oSearchFieldLayout.fnExpandCollapseSearchField("Expand");
        }
    });

    this.oSearchFieldLayout = new sap.ui.layout.HorizontalLayout().addContent(this.oSearchField).addContent(oExpandCollapseButton);

    this.oCustomSearchLayout = new sap.ui.layout.VerticalLayout().addStyleClass("sapSplCustomSearchControlLayout");
    this.oCustomSearchLayout.addContent(this.oSearchFieldLayout).addContent(getExpandedSearchList(this).setVisible(false));
    /* Incident : 1570148093, 1570153678 */
    this.oSearchListPopover = new sap.m.Popover({
        showHeader: false,
        placement: "Bottom",
        content: new sap.ui.layout.VerticalLayout().addContent(this.oSearchList), //.addContent(this.oSearchListFooter),
        modal: false,
        footer: this.oSearchListFooter,
        offsetX: 13,
        offsetY: -10
    }).addStyleClass("oSearchListPopover");

    this.oSearchListPopover.attachAfterOpen(function () {
        jQuery("#" + that.oSearchField.sId + " ." + "sapMSFI").css("z-index", "100");
        jQuery("#" + that.oSearchField.sId + " ." + "sapMSFI").focus();
    });

    this.oSearchFieldLayout.fnExpandCollapseSearchField = function (sMode) {

        var oSearchField = that.oSearchFieldLayout.getContent()[0];
        var oCollapseButton = that.oSearchFieldLayout.getContent()[1];

        if (sMode === "Collapse") {
            oSearchField.setVisible(false);
            oCollapseButton.setVisible(true);
            oCustomSearchControlConfigData["trafficStatusTitleLabel"].setVisible(true);
        } else {
            oSearchField.setVisible(true);
            oCollapseButton.setVisible(false);
            oCustomSearchControlConfigData["trafficStatusTitleLabel"].setVisible(false);
           setTimeout(function(){
        	   oSearchField.focus();
           },500);
           }
        
    };

    /* CSNFIX : 0120031469 630855     2014 */
    if (sap.ui.getCore().getModel("sapSplAppConfigDataModel").getData()["isSearchVisible"] === 0) {
        this.oSearchFieldLayout.setVisible(false);
    } else {
        this.oSearchFieldLayout.setVisible(true);
       
        this.oSearchFieldLayout.focus();
    }

    this.oSearchFieldLayout.fnExpandCollapseSearchField("Collapse");

    this.oCustomSearchLayout.getSearchFieldInstance = function () {
    	
        return that.oSearchFieldLayout;
        
    };

    this.oCustomSearchLayout.getExpandedSearchListCloseButton = function () {
        if (that.oExpandedSearchListCloseButton) {
            return that.oExpandedSearchListCloseButton;
        } else {
            return null;
        }
    };

    return this.oCustomSearchLayout;

};
