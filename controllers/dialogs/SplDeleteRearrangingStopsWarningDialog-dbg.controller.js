/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.dialogs.SplDeleteRearrangingStopsWarningDialog", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        this.oViewData = this.getView().getViewData();
        this.oSplItemModel = new sap.ui.model.json.JSONModel();
        this.oSplItemModel.setData(this.oViewData);
        this.fnDefineControlLabelsFromLocalizationBundle();
        this.getView().setModel(this.oSplItemModel);

        /*Localization*/
        this.fnDefineControlLabelsFromLocalizationBundle();
    },

    /**
     * @description Method to handle localization of all the hard code texts in the view.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnDefineControlLabelsFromLocalizationBundle: function () {

    },

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
     * @description Method to set Begin & End Button for dialog & set localized text for it.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    setButtonForDialog: function () {
    	
    	this.oSapSplConfirmButton = new sap.m.Button({
            id: "sapSplDeleteRearrangingStopsWarningDialogConfirm",
            press: jQuery.proxy(this.fnHandlePressOfDialogConfirm, this)
        });
    	
    	if( this.oSplItemModel.getData().dialogType === "L") {
    		this.oSapSplConfirmButton.setText(oSapSplUtils.getBundle().getText("OK"));
    		this.oParentDialogInstance.setEndButton(this.oSapSplConfirmButton);
    	} else {
            this.oSapSplCancelButton = new sap.m.Button({
                id: "sapSplDeleteRearrangingStopsWarningDialogCancel",
                press: jQuery.proxy(this.fnHandlePressOfDialogCancel, this)
            });

            this.oSapSplConfirmButton.setText(oSapSplUtils.getBundle().getText("PROMPT_FOR_DELETION_DIALOG_TITLE"));
            this.oSapSplCancelButton.setText(oSapSplUtils.getBundle().getText("CANCEL"));
            this.oParentDialogInstance.setBeginButton(this.oSapSplConfirmButton);
            this.oParentDialogInstance.setEndButton(this.oSapSplCancelButton);
    	}
        
    },

    /**
     * @description Method to handle press of Ok button of dialog.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnHandlePressOfDialogConfirm: function () {
        var action = this.oSplItemModel.getData().Action;
        var modelData = $.extend(true, {}, sap.ui.getCore().getModel("SplCreateNewTourModel").getData());
        var dialogType = this.oSplItemModel.getData().dialogType;
        var firstStopIndex = this.oSplItemModel.getData().firstStopIndex;

        if (dialogType === "R") {

            var secondStopIndex = this.oSplItemModel.getData().secondStopIndex;

            modelData = this.fnDeleteAffectedItemsOfStops(firstStopIndex, "fIndex", modelData, action);
            modelData = this.fnDeleteAffectedItemsOfStops(secondStopIndex, "sIndex", modelData, action);

            modelData = this.fnCorrectItemsOnStopsRearranging(firstStopIndex, modelData, secondStopIndex);
            modelData = this.fnCorrectItemsOnStopsRearranging(secondStopIndex, modelData, firstStopIndex);

            modelData = this.fnSwapStops(firstStopIndex, secondStopIndex, modelData);

        } else if (dialogType === "D") {

            modelData = this.fnDeleteFreightItemAssignments(firstStopIndex, modelData);

            if (firstStopIndex === (modelData.stopsRow.length - 1)) {
                modelData.stopsRow[firstStopIndex - 1].leavesTimeVisible = false;
            }

            modelData.stopsRow.splice(firstStopIndex, 1);
        } else if (dialogType === "L") {
            this.fnDropRemainingFreightItems(firstStopIndex, modelData);
        }

        sap.ui.getCore().getModel("SplCreateNewTourModel").setData(modelData);

        this.fnToCaptureLiveChangeToSetFlag();

        this.getView().getParent().close();
    },

    fnDropRemainingFreightItems: function (currentRowIndex, modelData) {
        var jIndex, sIndex;
        for (sIndex = 0; sIndex < modelData.Items.length; sIndex++) {
            if (modelData.Items[sIndex].dropActionHappened === "N" && modelData.Items[sIndex].pickActionHappened === "P") {
                if (modelData.stopsRow[modelData.Items[sIndex].pickStopIndex].LocationUUID !== modelData.stopsRow[modelData.stopsRow.length - 1].LocationUUID) {
                    modelData.Items[sIndex].dropActionHappened = "D";
                    modelData.Items[sIndex].dropStopIndex = currentRowIndex;
                    for (jIndex = 0; jIndex < modelData.stopsRow[currentRowIndex].items.length; jIndex++) {
                        if (modelData.Items[sIndex].UUID === modelData.stopsRow[currentRowIndex].items[jIndex].ItemUUID) {
                            modelData.stopsRow[currentRowIndex].items[jIndex].Action = "D";
                            modelData.stopsRow[currentRowIndex].items[jIndex].IsDeleted = "0";
                            modelData.stopsRow[currentRowIndex].items[jIndex].pickup = oSapSplUtils.getBundle().getText("FREIGHT_ITEM_ASSIGN_PICK_UP");
                            modelData.stopsRow[currentRowIndex].items[jIndex].drop = oSapSplUtils.getBundle().getText("FREIGHT_ITEM_ASSIGN_DROP");
                            this.fnToCaptureLiveChangeToSetFlag();
                        }
                    }
                }
            }
        }
        return modelData;
    },

    fnDeleteFreightItemAssignments: function (sIndex, modelData) {
        var jIndex, kIndex;
        for (jIndex = 0; jIndex < modelData.Items.length; jIndex++) {
            if (modelData.Items[jIndex].pickStopIndex === sIndex) {
                modelData.Items[jIndex].pickStopIndex = -1;
                modelData.Items[jIndex].pickActionHappened = "N";

                if (modelData.Items[jIndex].dropActionHappened !== "N") {
                    for (kIndex = 0; kIndex < modelData.stopsRow[modelData.Items[jIndex].dropStopIndex].items.length; kIndex++) {
                        if (modelData.stopsRow[modelData.Items[jIndex].dropStopIndex].items[kIndex].ItemUUID === modelData.Items[jIndex].UUID) {
                            modelData.stopsRow[modelData.Items[jIndex].dropStopIndex].items[kIndex].IsDeleted = "1";
                            modelData.stopsRow[modelData.Items[jIndex].dropStopIndex].items[kIndex].Action = "N";
                            break;
                        }
                    }
                }

                modelData.Items[jIndex].dropStopIndex = -1;
                modelData.Items[jIndex].dropActionHappened = "N";
            }
            if (modelData.Items[jIndex].dropStopIndex === sIndex) {
                modelData.Items[jIndex].dropStopIndex = -1;
                
                //Fix incident 1580237948
                modelData.Items[jIndex].dropActionHappened = "N";

                for (kIndex = 0; kIndex < modelData.stopsRow[modelData.Items[jIndex].pickStopIndex].items.length; kIndex++) {
                    if (modelData.stopsRow[modelData.Items[jIndex].pickStopIndex].items[kIndex].ItemUUID === modelData.Items[jIndex].UUID) {
                        modelData.stopsRow[modelData.Items[jIndex].pickStopIndex].items[kIndex].IsDeleted = "1";
                        modelData.stopsRow[modelData.Items[jIndex].pickStopIndex].items[kIndex].Action = "N";
                        break;
                    }
                }

                modelData.Items[jIndex].pickStopIndex = -1;
                modelData.Items[jIndex].pickActionHappened = "N";
            }

            if (modelData.Items[jIndex].dropStopIndex >= sIndex + 1) {
                modelData.Items[jIndex].dropStopIndex--;
            }

            if (modelData.Items[jIndex].pickStopIndex >= sIndex + 1) {
                modelData.Items[jIndex].pickStopIndex--;
            }
        }
        return modelData;
    },

    fnDeleteAffectedItemsOfStops: function (stopIndex, index, modelData, action) {

        var freightItems = this.oSplItemModel.getData().AffectedFreightItems;
        var kIndex, jIndex;

        for (kIndex = 0; kIndex < freightItems.length; kIndex++) {
            for (jIndex = 0; jIndex < modelData.Items.length; jIndex++) {
                if (modelData.Items[jIndex].UUID === freightItems[kIndex].UUID) {
                    if (modelData.stopsRow[stopIndex].items[freightItems[kIndex][index]].Action === action) {
                        modelData.Items[jIndex].pickActionHappened = "N";
                        modelData.Items[jIndex].pickStopIndex = -1;
                    } else {
                        modelData.Items[jIndex].dropActionHappened = "N";
                        modelData.Items[jIndex].dropStopIndex = -1;
                    }
                    modelData.stopsRow[stopIndex].items[freightItems[kIndex][index]].Action = "N";
                    modelData.stopsRow[stopIndex].items[freightItems[kIndex][index]].isDeleted = "1";
                    break;
                }
            }
        }
        return modelData;
    },

    fnCorrectItemsOnStopsRearranging: function (sIndex, modelData, newIndex) {
        var kIndex, jIndex;

        for (kIndex = 0; kIndex < modelData.stopsRow[sIndex].items.length; kIndex++) {
            if (modelData.stopsRow[sIndex].items[kIndex].Action !== "N") {
                for (jIndex = 0; jIndex < modelData.Items.length; jIndex++) {
                    if (modelData.Items[jIndex].UUID === modelData.stopsRow[sIndex].items[kIndex].ItemUUID) {
                        if (modelData.stopsRow[sIndex].items[kIndex].Action === "P") {
                            modelData.Items[jIndex].pickStopIndex = newIndex;
                        } else {
                            modelData.Items[jIndex].dropStopIndex = newIndex;
                        }
                        break;
                    }
                }
            }
        }
        return modelData;
    },

    fnSwapStops: function (fIndex, sIndex, modelData) {
        var tempStop = modelData.stopsRow[fIndex];
        modelData.stopsRow[fIndex] = modelData.stopsRow[sIndex];
        modelData.stopsRow[sIndex] = tempStop;

        var flag = modelData.stopsRow[fIndex].leavesTimeVisible;
        modelData.stopsRow[fIndex].leavesTimeVisible = modelData.stopsRow[sIndex].leavesTimeVisible;
        modelData.stopsRow[sIndex].leavesTimeVisible = flag;

        return modelData;
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
     * @description Method to handle press of Close button of dialog.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnHandlePressOfDialogCancel: function () {
        this.getView().getParent().close();
    }

});
