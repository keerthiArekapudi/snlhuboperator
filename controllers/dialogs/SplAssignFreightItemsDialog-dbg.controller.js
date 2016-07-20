/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.dialogs.SplAssignFreightItemsDialog", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        this.oViewData = this.getView().getViewData();
        this.oSplNewLocationItemModel = new sap.ui.model.json.JSONModel();
        this.oSplNewLocationItemModel.setData(this.oViewData);
        this.fnDefineLocalizationForActionButtons();
        this.getView().setModel(this.oSplNewLocationItemModel);

        /*Localization*/
        this.fnDefineControlLabelsFromLocalizationBundle();
    },

    /**
     * @description Method to set localization text of Action Buttons in dialog.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnDefineLocalizationForActionButtons: function () {
        var modelData = this.oSplNewLocationItemModel.getData();
        var labels = {
            "donothing": oSapSplUtils.getBundle().getText("FREIGHT_ITEM_ASSIGN_DO_NOTHING"),
            "pickup": oSapSplUtils.getBundle().getText("FREIGHT_ITEM_ASSIGN_PICK_UP"),
            "drop": oSapSplUtils.getBundle().getText("FREIGHT_ITEM_ASSIGN_DROP")
        };
        modelData["labels"] = labels;
        this.oSplNewLocationItemModel.setData(modelData);
    },

    /**
     * @description Method to handle localization of all the hard code texts in the view.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnDefineControlLabelsFromLocalizationBundle: function () {
        this.byId("SapSplAssignFreightItemsTable").setNoDataText(oSapSplUtils.getBundle().getText("NO_DATA_TEXT"));
        this.byId("SapSplAssignFreightItemsTableColumnHeader_Action").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_ACTION_LABEL"));
        this.byId("SapSplAssignFreightItemsTableColumnHeader_OrderID").setText(oSapSplUtils.getBundle().getText("Order ID"));
        this.byId("SapSplAssignFreightItemsTableColumnHeader_DestinationDescription").setText(oSapSplUtils.getBundle().getText("Destination description"));
    },


    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     */
    onAfterRendering: function () {},

    /**
     * @description Method to save dialog instance & set buttons for dialog.
     * @param {Object} oParentDialog.
     * @returns void.
     * @since 1.0
     */
    setParentDialogInstance: function (oParentDialog) {
        this.oParentDialogInstance = oParentDialog;
        this.setButtonForDialog();
    },

    /**
     * @description Method to set End Button for dialog & set localized text for it.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    setButtonForDialog: function () {

        this.oSapSplNewLocationCancelButton = new sap.m.Button({
            press: jQuery.proxy(this.fnHandlePressOfNewLocationDialogCancel, this)
        });

        this.oSapSplNewLocationCancelButton.setText(oSapSplUtils.getBundle().getText("CLOSE"));

        this.oParentDialogInstance.setEndButton(this.oSapSplNewLocationCancelButton);
    },

    /**
     * @description Method to handle press of Close button of dialog.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnHandlePressOfNewLocationDialogCancel: function () {
    	var modelData = sap.ui.getCore().getModel("SplCreateNewTourModel").getData();
    	var index = this.oSplNewLocationItemModel.getData().rowIndex;
    	var action,sdeleted;
    	
    	for( var i = 0; i < modelData.stopsRow[index].items.length ; i++ ) {
    		action = modelData.stopsRow[index].items[i].Action;
    		sdeleted = modelData.stopsRow[index].items[i].IsDeleted;
    		
    		modelData.stopsRow[index].items[i] = this.oSplNewLocationItemModel.getData().fItems[i];
    		
    		modelData.stopsRow[index].items[i].Action = action;
    		modelData.stopsRow[index].items[i].IsDeleted = sdeleted;
    		modelData.stopsRow[index].items[i].pickup = oSapSplUtils.getBundle().getText("FREIGHT_ITEM_ASSIGN_PICK_UP");
    		modelData.stopsRow[index].items[i].drop = oSapSplUtils.getBundle().getText("FREIGHT_ITEM_ASSIGN_DROP");
    		modelData.stopsRow[index].items[i]["delete"] = oSapSplUtils.getBundle().getText("DELETE");
    	}
    	modelData.stopsRow[index].items = this.oSplNewLocationItemModel.getData().fItems;
    	sap.ui.getCore().getModel("SplCreateNewTourModel").setData(modelData);
    	this.getView().getParent().close();
        this.getView().getParent().destroy();
    },

    /**
     * @description Called to set isDirtyFlag to true in Utils
     * @returns void.
     * @since 1.0
     * */
    fnToCaptureLiveChangeToSetFlag: function () {
        if (!oSapSplUtils.getIsDirty()) {
            oSapSplUtils.setIsDirty(true);
        }
    },

    /**
     * @description Method to handle press of Action Buttons (PickUp / Drop / Donothing).
     * @param {Object} oEvent press event object of Action Button.
     * @returns void.
     * @since 1.0
     */
    fnhandelPressOfActionButton: function (oEvent) {
        var sIndex = parseInt(oEvent.getSource().getBindingContext().sPath.split("/")[2],10);
        var modelData = sap.ui.getCore().getModel("SplCreateNewTourModel").getData();
        var currentDialogData = this.oSplNewLocationItemModel.getData();
        var action = "",
            aFilters, jIndex, sdeleted;

        if (oEvent.getSource().sId.indexOf("SapSplAssignFreightItemsTableButton_1") > 0) {
            action = "N";
            sdeleted = "0";
        } else if (oEvent.getSource().sId.indexOf("SapSplAssignFreightItemsTableButton_2") > 0) {
            action = "P";
            sdeleted = "0";
        } else if (oEvent.getSource().sId.indexOf("SapSplAssignFreightItemsTableButton_3") > 0) {
            action = "D";
            sdeleted = "0";
        }

        if (action !== "") {
            modelData.stopsRow[currentDialogData.rowIndex].items[sIndex].Action = action;
            modelData.stopsRow[currentDialogData.rowIndex].items[sIndex].IsDeleted = sdeleted;
            modelData.stopsRow[currentDialogData.rowIndex].items[sIndex].pickup = oSapSplUtils.getBundle().getText("FREIGHT_ITEM_ASSIGN_PICK_UP");
            modelData.stopsRow[currentDialogData.rowIndex].items[sIndex].drop = oSapSplUtils.getBundle().getText("FREIGHT_ITEM_ASSIGN_DROP");
            modelData.stopsRow[currentDialogData.rowIndex].items[sIndex]["delete"] = oSapSplUtils.getBundle().getText("DELETE");
            for (jIndex = 0; jIndex < modelData.Items.length; jIndex++) {
                if (modelData.stopsRow[currentDialogData.rowIndex].items[sIndex].ItemUUID === modelData.Items[jIndex].UUID) {
                    if (action === "P") {
                        modelData.Items[jIndex].pickActionHappened = action;
                        modelData.Items[jIndex].pickStopIndex = currentDialogData.rowIndex;
                        if (modelData.Items[jIndex].dropStopIndex === currentDialogData.rowIndex) {
                            modelData.Items[jIndex].dropActionHappened = "N";
                            modelData.Items[jIndex].dropStopIndex = -1;
                        }
                    } else if (action === "D") {
                        modelData.Items[jIndex].dropActionHappened = action;
                        modelData.Items[jIndex].dropStopIndex = currentDialogData.rowIndex;
                        if (modelData.Items[jIndex].pickStopIndex === currentDialogData.rowIndex) {
                            modelData.Items[jIndex].pickActionHappened = "N";
                            modelData.Items[jIndex].pickStopIndex = -1;
                        }
                    } else {
                        if (modelData.Items[jIndex].pickStopIndex === currentDialogData.rowIndex) {
                            modelData.Items[jIndex].pickActionHappened = "N";
                            modelData.Items[jIndex].pickStopIndex = -1;
                        } else if (modelData.Items[jIndex].dropStopIndex === currentDialogData.rowIndex) {
                            modelData.Items[jIndex].dropActionHappened = "N";
                            modelData.Items[jIndex].dropStopIndex = -1;
                        }
                    }
                    break;
                }
            }
            currentDialogData.fItems[sIndex].Action = action;
            sap.ui.getCore().getModel("SplCreateNewTourModel").setData(modelData);

            /*Formatter method called explicitly */
            this.getView().getViewData()["oSaveButtonInstance"].setEnabled(splReusable.libs.SapSplModelFormatters.enableAssignTourButton(modelData));
            
            // Fix Incident ID:1580112051
            this.getView().getViewData()["tableInstance"].getContent()[modelData.stopsRow.length - 1].getContent()[3].getContent()[1].setEnabled(splReusable.libs.SapSplModelFormatters.enableDropRemainingFreightItemsLink(modelData.Items, modelData.stopsRow.length - 1));
            
            oEvent.getSource().getParent().getParent().getCells()[6].setVisible(splReusable.libs.SapSplModelFormatters.setVisiblePropertyForOrderIdDestinationInfo(currentDialogData.rowIndex,modelData.stopsRow, sIndex));
            oEvent.getSource().getParent().getParent().getCells()[7].setVisible(splReusable.libs.SapSplModelFormatters.setVisiblePropertyForOrderIdDestinationInfo(currentDialogData.rowIndex,modelData.stopsRow, sIndex));

            this.fnToCaptureLiveChangeToSetFlag();

            this.oSplNewLocationItemModel.setData(currentDialogData);

            aFilters = [new sap.ui.model.Filter("Action", sap.ui.model.FilterOperator.NE, "N"), new sap.ui.model.Filter("IsDeleted", sap.ui.model.FilterOperator.EQ, "0")];

            /* Apply filter to all stop rows */
            for (jIndex = 0; jIndex < modelData.stopsRow.length; jIndex++) {
                this.oSplNewLocationItemModel.getData().tableInstance.getContent()[jIndex].getContent()[2].getContent()[0].getBinding("items").filter(new sap.ui.model.Filter(aFilters, true));
            }
        }
    }
});
