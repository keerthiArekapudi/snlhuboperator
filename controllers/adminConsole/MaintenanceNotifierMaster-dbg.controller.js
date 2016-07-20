/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.adminConsole.MaintenanceNotifierMaster", {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {

        var oSapSplNotificationListModel = null,
        oSapSplNotificationListItemsBinding = null;
        try {

            /*SAPUI5 ODataModel - to be set to MaintenanceNotifierMaster view*/
            oSapSplNotificationListModel = sap.ui.getCore().getModel("UserNotificationListODataModel");

            oSapSplNotificationListModel.setCountSupported(false);

            /*event registered to ensure that the first item is always selected. */
            oSapSplNotificationListModel.attachRequestCompleted(jQuery.proxy(this.ODataModelRequestCompleted, this));

            oSapSplNotificationListModel.attachRequestFailed(function () {
                oSapSplBusyDialog.getBusyDialogInstance().close();
                if (sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel")) {
                    oSapSplBusyDialog.getBusyDialogInstance().close();
                    var oEmptyObject = {};
                    oEmptyObject["isClicked"] = false;
                    oEmptyObject["noData"] = true;
                    oEmptyObject["showFooterButtons"] = false;
                    sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(oEmptyObject);
                }
            });

            /*Making the model as a named model.*/
            sap.ui.getCore().setModel(oSapSplNotificationListModel, "UserNotificationListODataModel");

            /*Setting the odata model on the list control*/
            this.getView().byId("SapSplMaintenanceNotifierList").setModel(sap.ui.getCore().getModel("UserNotificationListODataModel"));

            this.oSapSplNotificationFilterIsNotification = new sap.ui.model.Filter("isNotification", sap.ui.model.FilterOperator.EQ, "1");

            /*Applying the filter on the myNotification list, by accessing the "items" binding of the list.*/
            oSapSplNotificationListItemsBinding = this.byId("SapSplMaintenanceNotifierList").getBinding("items");

            oSapSplNotificationListItemsBinding.filter([this.oSapSplNotificationFilterIsNotification]);

            this.oSapSplNotificationSorter = new sap.ui.model.Sorter("isActive", true, this.handleGroupingOfNotifications);

            oSapSplNotificationListItemsBinding.sort([this.oSapSplNotificationSorter]);

            this.statusData = [{
                name: oSapSplUtils.getBundle().getText("FILTER_LABEL_ALL"),
                selected: true,
                id: "all"
            }, {
                name: oSapSplUtils.getBundle().getText("FILTER_LABEL_DB_UPGRADE"),
                selected: true,
                id: "dbupgrade"
            }, {
                name: oSapSplUtils.getBundle().getText("FILTER_LABEL_CRITICAL_HOTFIX"),
                selected: true,
                id: "criticalhotfix"
            }, {
                name: oSapSplUtils.getBundle().getText("FILTER_LABEL_PATCH"),
                selected: true,
                id: "patch"
            }, {
                name: oSapSplUtils.getBundle().getText("FILTER_LABEL_OS_UPGRADE"),
                selected: true,
                id: "osupgrade"
            }];

            /*Method to prepare dialog for filters*/
            this.prepareDialogForFilters();

            /*Method to prepare popover for sorters*/
            this.preparePopOverForSorters();

            /*Instantiate Filters and Sorters*/
            this.createFiltersAndSorters();

            /*Localization*/
            this.fnDefineControlLabelsFromLocalizationBundle();

            this.byId("FilterStatusText").setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_ALL"));

            this.appliedFilters = [];
            this.appliedSorters = [];

            this.appliedFilters = this.byId("SapSplMaintenanceNotifierList").getBinding("items").aFilters;
            this.appliedSorters = this.byId("SapSplMaintenanceNotifierList").getBinding("items").aSorters;

        } catch (e) {
            if (e instanceof Error) {
                jQuery.sap.log.error(e.message, "MyNotificationsList not defined", this.getView().getControllerName());
            }
        }
    },

    /***
     * @description method to instantiate all the required model filters and sorters for the SapSplMaintenanceNotifierList.
     * @returns void.
     * since 1.0
     * @throws new Error()
     * @param void.
     */
    createFiltersAndSorters: function () {
        this.oSapSplNotificationFilterDBUpgrade = new sap.ui.model.Filter("MessageType", sap.ui.model.FilterOperator.EQ, "DUN");
        this.oSapSplNotificationFilterPatch = new sap.ui.model.Filter("MessageType", sap.ui.model.FilterOperator.EQ, "PAN");
        this.oSapSplNotificationFilterCriticalHotfix = new sap.ui.model.Filter("MessageType", sap.ui.model.FilterOperator.EQ, "CHN");
        this.oSapSplNotificationFilterOSUpgrade = new sap.ui.model.Filter("MessageType", sap.ui.model.FilterOperator.EQ, "OUN");
    },

    /**
     * @description Method to handle grouping of Notification.
     * @param {object} oContext binding context to guide grouping.
     * @returns {object} object containing the key and text - which would be used for the group header title.
     * @since 1.0
     */
    handleGroupingOfNotifications: function (oContext) {
        var sKey = oContext.getProperty("isActive");

        if (sKey === "1") {
            return {
                key: "Active",
                text: oSapSplUtils.getBundle().getText("ACTIVE")
            };
        } else {
            return {
                key: "Expired",
                text: oSapSplUtils.getBundle().getText("EXPIRED")
            };
        }
    },

    /***
     * @description handler for the back navigation event, in case of App to App navigation.
     * Method to go back 1 page in the baseApp.
     * @param oEvent event object
     * @since 1.0
     * @returns void.
     */
    fnHandleBackNavigation: function () {

        var oBaseApp = null;
        oBaseApp = oSplBaseApplication.getAppInstance();

        // back navigation when the App is not launched through DAL
        if (oBaseApp.getPreviousPage()) {
            oBaseApp.back();
        } else {
            // back navigation when the App is launched through DAL and navToHome = true
            oBaseApp.to("splView.tileContainer.MasterTileContainer");
        }
    },

    fnHandleAddNotication: function () {
        var that = this;
        var viewData = {
                        context : {
                            type: "new"
                        }
        };
        this.byId("SapSplMaintenanceNotifierList").removeSelections();
        if (this.getView().getParent().getParent().getCurrentDetailPage().sId === "MaintenanceNotifierDetail") {
            this.getView().getParent().getParent().toDetail("MaintenanceNotifierAddNotificationDetail","",viewData);
        } else {
            if (oSapSplUtils.getIsDirty()) {
                sap.m.MessageBox.show(
                                      oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),
                                      sap.m.MessageBox.Icon.WARNING,
                                      oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                                      function (selection) {
                                          if (selection === "YES") {
                                              oSapSplUtils.setIsDirty(false);
                                              sap.ui.getCore().getModel("SapSplMaintenanceNotifierAddNotificationModel").setData(that.getEmptyAddNotificationData("create"));
                                              this.getView().getParent().getParent().getCurrentDetailPage().byId("sapSplMaintenanceNotifierDetailAddNotificationPage").setTitle(oSapSplUtils.getBundle().getText("NEW_NOTIFICATION"));
                                          }
                                      },null, oSapSplUtils.fnSyncStyleClass( "messageBox" )
                );
            } else {
                sap.ui.getCore().getModel("SapSplMaintenanceNotifierAddNotificationModel").setData(this.getEmptyAddNotificationData("create"));
                this.getView().getParent().getParent().getCurrentDetailPage().byId("sapSplMaintenanceNotifierDetailAddNotificationPage").setTitle(oSapSplUtils.getBundle().getText("NEW_NOTIFICATION"));
            }
        }
    },

    fnDefineControlLabelsFromLocalizationBundle: function() {
        this.byId("sapSplStartTime").setTitle(oSapSplUtils.getBundle().getText("STARTS"));
        this.byId("sapSplExpiryTime").setTitle(oSapSplUtils.getBundle().getText("EXPIRES"));
        this.byId("SapSplGroupNotificationsButton").setTooltip(oSapSplUtils.getBundle().getText("GROUP_BY"));
        this.byId("SapSplFilterNotificationsButton").setTooltip(oSapSplUtils.getBundle().getText("FILTER"));
        this.byId("SapSplAddNotificationsButton").setTooltip(oSapSplUtils.getBundle().getText("ADD_NOTIFICATION"));
        this.byId("sapSplMaintenanceNotifierMasterSearch").setTooltip(oSapSplUtils.getBundle().getText("SEARCH"));
    },

    /***
     * @description method to prepare a dialog control to show the available filters for notifications.
     * @returns void.
     * since 1.0
     * @param e event object
     */
    prepareDialogForFilters: function () {

        var that = this;
        /* Fix for incident : 1580118382 */
        this.oSapSplNotificationDialogForFilters = new sap.m.Dialog({
            title: oSapSplUtils.getBundle().getText("FILTER_BY"),
            content: new sap.m.List({
                mode: "MultiSelect",
                select: that.fnHandleFilterSelect,
                items: {
                    path: "/items",
                    template: new sap.m.StandardListItem({
                        title: "{name}",
                        selected: "{selected}"
                    })
                }
            }),
            leftButton: new sap.m.Button({
                text: oSapSplUtils.getBundle().getText("OK_BUTTON_TEXT"),
                press: function () {
                    that.oSapSplNotificationDialogForFilters.close();
                }
            }),
            rightButton: new sap.m.Button({
                text: oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON"),
                press: function () {
                    that.oSapSplNotificationDialogForFilters.close();
                }
            })
        }).addStyleClass("SapSplFilterDialog").attachAfterClose(function (evt) {
            if (evt.getParameters("origin").origin.getText() !== oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON")) {
                jQuery.proxy(that.handleSelectOfFilter(evt.getSource().getContent()[0].getSelectedItems()), that);
            }
        }).attachBeforeOpen(function () {
            oSapSplUtils.fnSyncStyleClass(that.oSapSplNotificationDialogForFilters);
        }).attachAfterClose(function(){
            that.getView().byId("sapSplMaintenanceNotifierMasterSearch").focus();
        });
        this.oSapSplNotificationDialogForFilters.setModel(new sap.ui.model.json.JSONModel({
            items: this.statusData
        }));

    },

    fnHandleFilterSelect : function(event) {
        var listData = $.extend(true, [], event.getSource().getModel().getData().items), index, flag = 1;
        if(event.getParameters().listItem.getBindingContext().getProperty().id === "all") {
            for(index = 0; index < listData.length; index++) {
                if(event.getParameters().listItem.getBindingContext().getProperty().selected) {
                    event.getSource().getItems()[index].setSelected(true);
                } else {
                    event.getSource().getItems()[index].setSelected(false);
                }
            }
        } else {
            if(!event.getParameters().listItem.getBindingContext().getProperty().selected) {
                if(listData[0].selected) {
                    event.getSource().getItems()[0].setSelected(false);
                }
            } else {
                for(index = 1; index < listData.length; index++) {
                    if(!event.getSource().getItems()[index].getSelected()) {
                        flag = 0;
                        break;
                    }
                }
                if(flag) {
                    event.getSource().getItems()[0].setSelected(true);
                } else {
                    event.getSource().getItems()[0].setSelected(false);
                }
            }

        }
    },


    /***
     * @description method to handle the select event of one of the filters.
     * This will trigger the filter action on the oSapSplNotificationsList
     * @since 1.0
     * @throws new Error();
     * @param e
     * @returns void.
     */
    handleSelectOfFilter: function (aItems) {
        var oSapSplNotificationList = null,
        oSapSplNotificationListItemsBinding = null;
        var aFilterArray = [], index, filterText = "";

        aFilterArray.push(this.oSapSplNotificationFilterIsNotification);

        try {
            if (this.byId("SapSplMaintenanceNotifierList")) {
                oSapSplNotificationList = this.byId("SapSplMaintenanceNotifierList");
                oSapSplNotificationListItemsBinding = oSapSplNotificationList.getBinding("items");
                if (oSapSplNotificationListItemsBinding) {
                    oSapSplNotificationListItemsBinding.filter([]);
                } else {
                    throw new Error();
                }
            } else {
                throw new Error();
            }

            for( index = 0; index < aItems.length ; index++) {
                if (aItems[index].getBindingContext().getProperty("id") === "all") {
                    this.byId("FilterStatusText").setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_ALL"));
                    break;
                } else {
                    if (aItems[index].getBindingContext().getProperty("id") === "dbupgrade") {
                        if (this.oSapSplNotificationFilterDBUpgrade) {
                            aFilterArray.push(this.oSapSplNotificationFilterDBUpgrade);
                            if(filterText.length !== 0) {
                                filterText = filterText + ", " + oSapSplUtils.getBundle().getText("FILTER_LABEL_DB_UPGRADE");
                            } else {
                                filterText = oSapSplUtils.getBundle().getText("FILTER_LABEL_DB_UPGRADE");
                            }

                        } else {
                            throw new Error();
                        }
                    } else if (aItems[index].getBindingContext().getProperty("id") === "criticalhotfix") {
                        if (this.oSapSplNotificationFilterCriticalHotfix) {
                            aFilterArray.push(this.oSapSplNotificationFilterCriticalHotfix);
                            if(filterText.length !== 0) {
                                filterText = filterText + ", " + oSapSplUtils.getBundle().getText("FILTER_LABEL_CRITICAL_HOTFIX");
                            } else {
                                filterText = oSapSplUtils.getBundle().getText("FILTER_LABEL_CRITICAL_HOTFIX");
                            }
                        } else {
                            throw new Error();
                        }
                    } else if (aItems[index].getBindingContext().getProperty("id") === "patch") {
                        if (this.oSapSplNotificationFilterPatch) {
                            aFilterArray.push(this.oSapSplNotificationFilterPatch);
                            if(filterText.length !== 0) {
                                filterText = filterText + ", " + oSapSplUtils.getBundle().getText("FILTER_LABEL_PATCH");
                            } else {
                                filterText = oSapSplUtils.getBundle().getText("FILTER_LABEL_PATCH");
                            }
                        } else {
                            throw new Error();
                        }
                    } else if (aItems[index].getBindingContext().getProperty("id") === "osupgrade") {
                        if (this.oSapSplNotificationFilterDBUpgrade) {
                            aFilterArray.push(this.oSapSplNotificationFilterOSUpgrade);
                            if(filterText.length !== 0) {
                                filterText = filterText + ", " + oSapSplUtils.getBundle().getText("FILTER_LABEL_OS_UPGRADE");
                            } else {
                                filterText = oSapSplUtils.getBundle().getText("FILTER_LABEL_OS_UPGRADE");
                            }
                        } else {
                            throw new Error();
                        }
                    }
                    this.byId("FilterStatusText").setText(filterText);
                }
            }

            oSapSplNotificationListItemsBinding.filter(aFilterArray);

            this.appliedFilters = oSapSplNotificationListItemsBinding.aFilters;

        } catch (e) {
            if (e instanceof Error) {
                jQuery.sap.log.error(e.message, "undefined", this.getView().getControllerName());
            }
        }
    },

    /***
     * @description method to prepare a popover control to show the available sorters for Notifications.
     * @returns void.
     * since 1.0
     * @param e event object
     */
    preparePopOverForSorters: function () {
        var oSapSplNotificationPopOverForSortersLayout = null;
        this.oSapSplNotificationPopOverForSorters = new sap.m.Popover({
            placement: sap.m.PlacementType.Top,
            showHeader: false
        });
        oSapSplNotificationPopOverForSortersLayout = new sap.ui.commons.layout.VerticalLayout().addStyleClass("sapsplTruckMasterPopover");

        oSapSplNotificationPopOverForSortersLayout.addContent(new sap.m.RadioButton({
            id: "none"
        }).setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_NONE")).attachSelect(jQuery.proxy(this.handleSelectOfSorterRadioButton, this)));
        oSapSplNotificationPopOverForSortersLayout.addContent(new sap.m.RadioButton({
            id: "state",
            selected: true
        }).setText(oSapSplUtils.getBundle().getText("SORT_LABEL_STATE_TYPE")).attachSelect(jQuery.proxy(this.handleSelectOfSorterRadioButton, this)));

        this.oSapSplNotificationPopOverForSorters.addContent(oSapSplNotificationPopOverForSortersLayout);
    },

    /***
     * @description method to handle the select event on the radioButton group "sorters".
     * This will trigger the sort action on the SapSplMaintenanceNotifierList
     * @since 1.0
     * @throws new Error();
     * @param e
     * @returns void.
     */
    handleSelectOfSorterRadioButton: function (oEvent) {

        var e = jQuery.extend(true, {}, oEvent);
        var that = this;
        if (oEvent.getParameter("selected")) {
            if (this.getView().getParent().getParent().getCurrentDetailPage().sId === "MaintenanceNotifierDetail") {
                sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(this.getEmptyAddNotificationData("nodata"));
            }

            if (oSapSplUtils.getIsDirty()) {
                sap.m.MessageBox.show(
                                      oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),
                                      sap.m.MessageBox.Icon.WARNING,
                                      oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                                      function (selection) {
                                          if (selection === "YES") {
                                              oSapSplUtils.setIsDirty(false);
                                              that.sortMasterListBasedOnSortTypeSelection(e);
                                          }
                                      },null, oSapSplUtils.fnSyncStyleClass( "messageBox" )

                );
            } else {
                this.sortMasterListBasedOnSortTypeSelection(e);
            }
        }
    },

    /**
     * @description Method to handle sorting in notification master list.
     * @param {object} eventObject bound object to the selected sort option.
     * @returns void.
     * @since 1.0
     */
    sortMasterListBasedOnSortTypeSelection: function (eventObject) {
        var oSapSplNotificationList = null,
        sId = "",
        oSapSplNotificationListItemsBinding = null,
        aAppliedFilters = [];
        try {
            if (this.oSapSplNotificationPopOverForSorters) {
                this.oSapSplNotificationPopOverForSorters.close();
            } else {
                throw new Error();
            }

            sId = eventObject.getSource().sId;

            if (this.byId("SapSplMaintenanceNotifierList")) {

                oSapSplNotificationList = this.byId("SapSplMaintenanceNotifierList");
                oSapSplNotificationListItemsBinding = oSapSplNotificationList.getBinding("items");
                aAppliedFilters = oSapSplNotificationListItemsBinding.aFilters;

                this.byId("SapSplMaintenanceNotifierList").unbindAggregation("items");
                this.byId("SapSplMaintenanceNotifierList").bindItems({
                    path: "/MyFeed",
                    template: this.byId("oSapSplNotificationListItem")
                });
                oSapSplNotificationListItemsBinding = this.byId("SapSplMaintenanceNotifierList").getBinding("items");

                if (!oSapSplNotificationListItemsBinding) {
                    throw new Error();
                }
            } else {
                throw new Error();
            }

            if (sId === "state") {
                if (this.oSapSplNotificationSorter) {
                    oSapSplNotificationListItemsBinding.sort([this.oSapSplNotificationSorter]);
                    oSapSplNotificationListItemsBinding.filter(aAppliedFilters);
                } else {
                    throw new Error();
                }
            } else {
                oSapSplNotificationListItemsBinding.filter(aAppliedFilters);
                this.oSapSplNotificationDialogForFilters.getModel().setData({
                    items: this.statusData
                });

            }

            this.appliedSorters = oSapSplNotificationListItemsBinding.aSorters;

        } catch (error) {
            if (error instanceof Error) {
                jQuery.sap.log.error(error.message, "undefined", this.getView().getControllerName());
            }
        }
    },

    /**
     * @description Method to prepare the empty Notification object, to be bound in the detail screen.
     * @param {boolean} bMode event object.
     * @returns {object} oEmptyData object containing the notification fields.
     * @since 1.0
     */
    getEmptyAddNotificationData: function (sMode) {
        var oEmptyData = {};

        oEmptyData.Validity_StartTime = new Date();

        oEmptyData.Validity_EndTime = new Date();

        oEmptyData.Validity_StartTime1 = new Date();

        oEmptyData.Validity_EndTime1 = new Date();

        oEmptyData.Text1 = "";


        if (sMode && sMode === "create") {
            oEmptyData["noData"] = false;
            oEmptyData["isClicked"] = true;
            oEmptyData["showFooterButtons"] = true;
        } else {
            oEmptyData["noData"] = true;
            oEmptyData["isClicked"] = false;
            oEmptyData["showFooterButtons"] = false;
        }
        return oEmptyData;
    },

    /***
     * @description method to handle the press event on "sort" button in the master page footer.
     * this will open the popOver prepared earlier, to the top of this button.
     * @returns void.
     * @param e
     * @since 1.0
     * @throws new Error();
     */
    fnHandleSortNotification: function (e) {
        try {
            if (this.oSapSplNotificationPopOverForSorters) {
                this.oSapSplNotificationPopOverForSorters.openBy(e.getSource());
            } else {
                throw new Error();
            }
        } catch (error) {
            if (error instanceof Error) {
                jQuery.sap.log.error(error.message, "Sort Popover not defined", this.getView().getControllerName());
            }
        }
    },

    /***
     * @description method to handle the request completed event of the ODataModel.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    ODataModelRequestCompleted: function () {
        if (arguments[0].getParameters().success) {
            oSapSplBusyDialog.getBusyDialogInstance().close();
            this.onAfterListRendering();
        } else {
            oSapSplBusyDialog.getBusyDialogInstance().close();
            var oEmptyObject = {};
            oEmptyObject["isClicked"] = false;
            oEmptyObject["noData"] = true;
            oEmptyObject["showFooterButtons"] = false;
            if (sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel")) {
                sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(oEmptyObject);
            }
        }
    },

    /***
     * @description method to handle the onAfterRendering event of the SapSplMaintenanceNotifierList control.
     * This is useful to select the first element of the list after either sorting or filtering.
     * @returns void.
     * since 1.0
     * @param e event object
     * @throws new Error();
     */
    onAfterListRendering: function () {
        oSapSplBusyDialog.getBusyDialogInstance().close();
        var aSapSplNotificationListItems = [];
        var oListCustomData = (this.byId("SapSplMaintenanceNotifierList").getCustomData().length > 0) ?
            this.byId("SapSplMaintenanceNotifierList").getCustomData()[this.byId("SapSplMaintenanceNotifierList").getCustomData().length - 1].getKey() : null,
            _iCount = 1;

            try {
                if (this.byId("SapSplMaintenanceNotifierList")) {
                    aSapSplNotificationListItems = this.byId("SapSplMaintenanceNotifierList").getItems();

                    if (aSapSplNotificationListItems.length) {

                        this.byId("sapSplMaintenanceNotifierMasterPage").setTitle(oSapSplUtils.getBundle().getText("NOTIFICATION_TITLE", [splReusable.libs.Utils.prototype.getListCount(this.byId("SapSplMaintenanceNotifierList"))]));

                        if (oListCustomData !== null) {
                            for (var iCount = 0; iCount < aSapSplNotificationListItems.length; iCount++) {

                                /*First item is always GroupHeaderListItem, so ignore and go to the next item*/
                                if ( aSapSplNotificationListItems[iCount].constructor !== sap.m.GroupHeaderListItem ) {
                                    if (oListCustomData === aSapSplNotificationListItems[iCount].getBindingContext().getProperty("MessageUUID")) {
                                        //Match found. Select the item and break;
                                        _iCount = iCount;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if (aSapSplNotificationListItems.length > 0) {
                        this.selectFirstItem(_iCount);
                        if (sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel")) {
                            var modelData = sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").getData();
                            modelData["noData"] = false;
                            modelData["isClicked"] = true;
                            modelData["showFooterButtons"] = true;
                            sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(modelData);
                        }
                    }
                } else {
                    throw new Error();
                }
            } catch (e) {
                if (e instanceof Error) {
                    jQuery.sap.log.error(e.message, "Notification not defined", this.getView().getControllerName());
                }
            }
            this.getView().byId("sapSplMaintenanceNotifierMasterSearch").focus();
    },

    /***
     * @description Method to set the first list item as selected, and also fire the event to bring changes in the corresponding detail page.
     * @returns void.
     */
    selectFirstItem: function (iCount) {

        var oSelectedListItemData = null,
        notificationList = null,
        aNotificationListItems = [],
        selectedId;
        try {
            notificationList = this.getView().byId("SapSplMaintenanceNotifierList");
            aNotificationListItems = notificationList.getItems();
            selectedId = aNotificationListItems[iCount].getId();

            if (aNotificationListItems.length > 0) {
                if (iCount === 1 && aNotificationListItems[0] instanceof sap.m.ObjectListItem) {
                    aNotificationListItems[0].setSelected(true);
                    oSelectedListItemData = aNotificationListItems[0].getBindingContext().getProperty();
                } else {
                    aNotificationListItems[iCount].setSelected(true);
                    oSelectedListItemData = aNotificationListItems[iCount].getBindingContext().getProperty();

                    var prevHeader = 0;
                    for (var iListItemCount = 1; iListItemCount < aNotificationListItems.length; iListItemCount++) {
                        if (aNotificationListItems[iListItemCount] instanceof sap.m.GroupHeaderListItem) {
                            aNotificationListItems[prevHeader].setCount(iListItemCount - 1 - prevHeader);
                            prevHeader = iListItemCount;
                        }
                    }

                    if (aNotificationListItems[prevHeader].constructor === sap.m.GroupHeaderListItem) {
                        aNotificationListItems[prevHeader].setCount(aNotificationListItems.length - 1 - prevHeader);
                    }

                    window.setTimeout(function () {
                        aNotificationListItems[0].rerender();
                    }, 100);
                    window.setTimeout(function () {
                        aNotificationListItems[prevHeader].rerender();
                    }, 100);

                    if (iCount === 0 || iCount === 1) {
                        document.getElementById(this.getView().byId("sapSplMaintenanceNotifierMasterSearch").getId()).scrollIntoView(true);
                    } else {
                        /*HOTFIX An issue where the getElementById on the selected ID is unable to get the 
                         * DOM element immediately. So asyncing it so that the DOM is prepared and then
                         * scroll into it*/
                         window.setTimeout(function () {
                             if (document.getElementById(selectedId)) {
                                 document.getElementById(selectedId).scrollIntoView(true);
                             }
                         }, 100);
                    }
                }
            } else {
                throw new Error();
            }

            this.updateNotificationDetailPage(oSelectedListItemData);
        } catch (e) {
            if (e instanceof Error) {
                jQuery.sap.log.error(e.message, "Cannot select first item of MyNotificationsList", this.getView().getControllerName());
            }
        }
    },

    /**
     * @description select event handler of the "sapSplNotification" list. Results in navigation of the detail page - to Notification detail page.
     * @param evt event object of the select event.
     * @returns void.
     * @since 1.0
     */
    fnHandleSelectOfMaintenanceNotification: function (oEvent) {
        var that = this, sIndex;
        var e = jQuery.extend(true, {}, oEvent);
        if (oSapSplUtils.getIsDirty()) {
            sap.m.MessageBox.show(
                                  oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),
                                  sap.m.MessageBox.Icon.WARNING,
                                  oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                                  function (selection) {
                                      if (selection === "YES") {
                                          that.updateNotificationDetailPage(e.getParameter("listItem").getBindingContext().getProperty());
                                          oSapSplUtils.setIsDirty(false);
                                      } else {

                                          var currentNotification = sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").getData().data;
                                          if (!currentNotification) {
                                              currentNotification = sap.ui.getCore().getModel("SapSplMaintenanceNotifierAddNotificationModel").getData();
                                          }
                                          var masterList = that.byId("SapSplMaintenanceNotifierList");
                                          masterList.removeSelections();

                                          if (currentNotification.MessageUUID) {
                                              for (sIndex = 0; sIndex < masterList.getItems().length; sIndex++) {
                                                  if (masterList.getItems()[sIndex].sId.indexOf("oSapSplNotificationListItem") !== -1) {
                                                      if (masterList.getItems()[sIndex].getBindingContext().getProperty().MessageUUID === currentNotification.MessageUUID) {
                                                          masterList.setSelectedItem(masterList.getItems()[sIndex]);
                                                          break;
                                                      }
                                                  }
                                              }
                                          } else {
                                              masterList.removeSelections();
                                          }

                                      }
                                  },null, oSapSplUtils.fnSyncStyleClass( "messageBox" )
            );
        } else {
            that.updateNotificationDetailPage(oEvent.getParameter("listItem").getBindingContext().getProperty());
        }

    },

    /**
     * @description Method to update the notification detail screen, on a select event on the master list.
     * @param {object} oSelectedListItemData object bound to the selected master list item.
     * @returns void.
     * @since 1.0
     */
    updateNotificationDetailPage: function (oSelectedListItemData) {
        try {
            oSelectedListItemData["isClicked"] = true;
            oSelectedListItemData["noData"] = false;
            oSelectedListItemData["showFooterButtons"] = true;

            var viewData = {
                            context : $.extend(true, {}, oSelectedListItemData)
            };

            if(this.getView().getParent().getParent()) {
                if (this.getView().getParent().getParent().getCurrentDetailPage().sId === "MaintenanceNotifierDetail") {

                    sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(oSelectedListItemData);

                } else {
                    this.getView().getParent().getParent().toDetail("MaintenanceNotifierDetail","",viewData);
                }

            } else {
                throw new Error();
            }
        } catch (e) {
            if (e instanceof Error) {
                jQuery.sap.log.error(e.message, "There is no current Detail Page in Notification SplitApp.", this.getView().getControllerName());
            }
        }
    },

    /***
     * @description method to handle the press event on "filter" button in the master page footer.
     * this will open the popOver prepared earlier, to the top of this button.
     * @returns void.
     * @param e
     * @since 1.0
     * @throws new Error();
     */
    fnHandleFilterNotification: function () {
        var that = this;
        if (oSapSplUtils.getIsDirty()) {
            sap.m.MessageBox.show(
                                  oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),
                                  sap.m.MessageBox.Icon.WARNING,
                                  oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                                  function (selection) {
                                      if (selection === "YES") {

                                          oSapSplUtils.setIsDirty(false);

                                          try {
                                              if (that.oSapSplNotificationDialogForFilters) {
                                                  that.oSapSplNotificationDialogForFilters.open();
                                              } else {
                                                  throw new Error();
                                              }
                                          } catch (e) {
                                              if (e instanceof Error) {
                                                  jQuery.sap.log.error(e.message, "Filter Dialog not defined", that.getView().getControllerName());
                                              }
                                          }
                                      }
                                  },null, oSapSplUtils.fnSyncStyleClass( "messageBox" )
            );
        } else {
            try {
                if (this.oSapSplNotificationDialogForFilters) {
                    this.oSapSplNotificationDialogForFilters.open();
                } else {
                    throw new Error();
                }
            } catch (e) {
                if (e instanceof Error) {
                    jQuery.sap.log.error(e.message, "Filter Dialog not defined", this.getView().getControllerName());
                }
            }
        }

    },

    /**
     * @description Search of Notifications on Press of Search icon or enter
     * @param {object} event
     */
    fnToHandleSearchOfNotications: function (event) {
        var searchString = event.getParameters().query;
        var oSapSplNotificationList;
        var payload, that = this,
        modelData;

        oSapSplUtils.setIsDirty(false);
        oSapSplNotificationList = this.getView().byId("SapSplMaintenanceNotifierList");

        if (searchString.length > 2) {
            payload = that.prepareSearchPayload(searchString);
            that.callSearchService(payload);

        } else if (oSapSplNotificationList.getBinding("items") === undefined || oSapSplNotificationList.getBinding("items").aFilters.length > 0 || event.getParameters().refreshButtonPressed === true) {
            sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(that.getEmptyAddNotificationData("nodata"));

            oSapSplNotificationList.unbindAggregation("items");
            oSapSplNotificationList.bindItems({
                path: "/MyFeed",
                template: that.getView().byId("oSapSplNotificationListItem")
            });
            oSapSplNotificationList.getBinding("items").filter(this.appliedFilters);
            oSapSplNotificationList.getBinding("items").sort(this.appliedSorters);

            modelData = sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").getData();
            modelData["noData"] = true;
            modelData["isClicked"] = false;
            modelData["showFooterButtons"] = false;
            sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(modelData);
        }



    },

    /**
     * @description Method to prepare payload for search.
     * @param {string} searchTerm the string represented by the search field.
     * @returns {object} payload the constructed payload to be used for search.
     * @since 1.0
     */
    prepareSearchPayload: function (searchTerm) {
        var payload = {};

        payload.ObjectType = ["Message"];
        payload.SearchTerm = searchTerm;
        payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
        payload.MaximumNumberOfRecords = SapSplEnums.numberOfRecords;
        payload.ProvideDetails = true;
        payload.SearchInNetwork = false;

        payload.AdditionalCriteria = {};
        payload.AdditionalCriteria.MessageObjectType = "M";
        payload.AdditionalCriteria.isNotification = "1";

        return payload;
    },

    /**
     * @description Method to handle the ajax call to fetch searched results.
     * @param {object} payload payload for post.
     * @returns void.
     * @since 1.0
     */
    callSearchService: function (payload) {
        var oSapSplSearchFilters, oSapSplNotificationFilters = [],
        oSapSplNotificationList;
        var that = this, modelData, index;

        oSapSplAjaxFactory.fireAjaxCall({
            url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/Search.xsjs"),
            method: "POST",
            async: false,
            data: JSON.stringify(payload),
            success: function (data, success, messageObject) {
                oSapSplBusyDialog.getBusyDialogInstance().close();
                if (data.constructor === String) {
                    data = JSON.parse(data);
                }
                if (messageObject["status"] === 200) {

                    oSapSplNotificationList = that.getView().byId("SapSplMaintenanceNotifierList");

                    sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(that.getEmptyAddNotificationData("nodata"));

                    oSapSplNotificationList.unbindAggregation("items");
                    if (data.length > 0) {

                        oSapSplSearchFilters = oSapSplUtils.getSearchItemFilters(data, "MessageUUID");

                        if (oSapSplSearchFilters.aFilters.length > 0) {
                            oSapSplNotificationFilters.push(oSapSplSearchFilters);
                        }

                        for (index = 0; index < that.appliedFilters.length; index++) {
                            oSapSplNotificationFilters.push(that.appliedFilters[index]);
                        }

                        oSapSplNotificationList.bindItems({
                            path: "/MyFeed",
                            template: that.getView().byId("oSapSplNotificationListItem")
                        });

                        oSapSplNotificationList.getBinding("items").filter(oSapSplNotificationFilters);
                        oSapSplNotificationList.getBinding("items").sort(that.appliedSorters);

                        modelData = sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").getData();
                        modelData["noData"] = false;
                        modelData["isClicked"] = true;
                        modelData["showFooterButtons"] = false;
                        sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(modelData);

                    } else {
                        modelData = sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").getData();
                        modelData["noData"] = true;
                        modelData["isClicked"] = false;
                        modelData["showFooterButtons"] = false;
                        sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(modelData);

                        that.byId("sapSplMaintenanceNotifierMasterPage").setTitle(oSapSplUtils.getBundle().getText("NOTIFICATION_TITLE", "0"));
                    }

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

                modelData = sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").getData();
                modelData["noData"] = true;
                modelData["isClicked"] = false;
                modelData["showFooterButtons"] = false;
                sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(modelData);

                if (error && error["status"] === 500) {
                    sap.ca.ui.message.showMessageBox({
                        type: sap.ca.ui.message.Type.ERROR,
                        message: error["status"] + "\t" + error.statusText,
                        details: error.responseText
                    });
                } else {
                    sap.ca.ui.message.showMessageBox({
                        type: sap.ca.ui.message.Type.ERROR,
                        message: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["errorWarningString"],
                        details: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["ufErrorObject"]
                    });
                }
            },
            complete: function () {

            }
        });
    },
    
    onAfterRendering: function(){
        this.getView().byId("sapSplMaintenanceNotifierMasterSearch").focus();
    }

});