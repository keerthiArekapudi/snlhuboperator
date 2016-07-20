/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.dialogs.SplNewFreightItem", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        this.oViewData = this.getView().getViewData();

        var modelData = $.extend(true, {}, this.oViewData);

        this.oSplAddFreightItemModel = new sap.ui.model.json.JSONModel();
        this.oSplAddFreightItemModel.setData(modelData);
        this.getView().setModel(this.oSplAddFreightItemModel);

        /* Localization */
        this.fnDefineControlLabelsFromLocalizationBundle();

        /* display dialog based on freight item type */
        this.selectRadioButton();

        /* Select radio button based on length of container*/
        this.selectRadioButtonLength();

        /*save index of model object for edit */
        if (this.oSplAddFreightItemModel.getData().isEdit) {
            this.saveIndexOfModelOnEdit();
        }

        /*Dirtyflag to be used for local purpose. So saving dirtyflag for createTour screen*/
        this.saveDirtyFlag = oSapSplUtils.getIsDirty();
        oSapSplUtils.setIsDirty(false);
    },

    /**
     * @description Method to select appropriate freight item type radio button.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    selectRadioButton: function () {
        if (this.oSplAddFreightItemModel.getData().Type === "B") {
            this.byId("SapSplFreightItemTypeRadioButton_2").setSelected(true);
            this.byId("SapSplFreightItemTypeRadioButton_2").fireSelect({
                selected: true
            });
        } else {
            this.byId("SapSplFreightItemTypeRadioButton_1").setSelected(true);
            this.byId("SapSplFreightItemTypeRadioButton_1").fireSelect({
                selected: true
            });
        }
    },

    /**
     * @description Method to select appropriate segmented button on Edit & Create.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    selectRadioButtonLength: function () {
        if (this.oSplAddFreightItemModel.getData().ContainerType && this.oSplAddFreightItemModel.getData().ContainerType !== null && this.oSplAddFreightItemModel.getData().ContainerType !== "") {
            if (this.oSplAddFreightItemModel.getData().ContainerType === "40ft") {
                this.byId("SapSplFreightItemLengthButton_2").setSelected(true);
                this.byId("SapSplFreightItemCustomLengthInput_3").setEnabled(false);
            } else if (this.oSplAddFreightItemModel.getData().ContainerType === "20ft") {
                this.byId("SapSplFreightItemLengthButton_1").setSelected(true);
                this.byId("SapSplFreightItemCustomLengthInput_3").setEnabled(false);
            } else {
                this.byId("SapSplFreightItemLengthButton_3").setSelected(true);
                this.byId("SapSplFreightItemCustomLengthInput_3").setValue(this.oSplAddFreightItemModel.getData().ContainerType);
                this.byId("SapSplFreightItemCustomLengthInput_3").setEnabled(true);
            }
        }
    },

    /**
     * @description Method to handle localization of all the hard code texts in the view.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnDefineControlLabelsFromLocalizationBundle: function () {
        this.byId("SapSplNewFreightItemFormFreightItemTypeLabel").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_TYPE_LABEL"));
        this.byId("SapSplNewFreightItemFormContainerIdLabel").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_CONTAINER_ID_LABEL"));
        this.byId("SapSplNewFreightItemFormContainerTypeLabel").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_CONTAINER_TYPE_LABEL"));
        this.byId("SapSplNewFreightItemFormContainerLengthLabel").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_CONTAINER_LENGTH_LABEL"));
        this.byId("SapSplNewFreightItemFormQuantityLabel").setText(oSapSplUtils.getBundle().getText("QUANTITY"));
        this.byId("SapSplNewFreightItemFormContainerWeightLabel").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_WEIGHT_LABEL"));
        this.byId("SapSplNewFreightItemFormContainerVolumeLabel").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_VOLUME_LABEL"));
        this.byId("SapSplNewFreightItemFormContainerDangerClassLabel").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_DANGER_CLASS_LABEL"));
        this.byId("SapSplFreightItemTypeRadioButton_1").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_TYPE_CONTAINER"));
        this.byId("SapSplFreightItemTypeRadioButton_2").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_TYPE_BREAK_BULK"));
        this.byId("SapSplFreightItemLengthButton_1").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_LENGTH", "20"));
        this.byId("SapSplFreightItemLengthButton_2").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_LENGTH", "40"));
        this.byId("SapSplFreightItemCustomLengthInput_3").setPlaceholder(oSapSplUtils.getBundle().getText("CUSTOM"));
    },


    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     */
    onAfterRendering: function () {},

    /**
     * @description Method to handle Select of Freight Item Type Radio button.
     * @param {Object} oEvent Select event object of Radio Button.
     * @returns void.
     * @since 1.0
     */
   //FIX for CSN 1580003814
    fnHandleToggleOfRadioButtons: function (event) {
        var modelData = $.extend(true, {}, this.oSplAddFreightItemModel.getData());
        if (event.getParameters().selected === true) {
            if (event.getSource().sId.indexOf("SapSplFreightItemTypeRadioButton_1") !== -1) {
                modelData.Type = "C";
                this.byId("SapSplNewFreightItemFormContainerIdLabel").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_CONTAINER_ID_LABEL"));
                modelData.Type = "C";
                if (modelData.ContainerType === "") {
                    this.byId("SapSplFreightItemLengthButton_1").setSelected(true);
                    this.byId("SapSplFreightItemCustomLengthInput_3").setEnabled(false);
                    modelData.ContainerType = "20ft";
                }
            } else {
                this.byId("SapSplNewFreightItemFormContainerIdLabel").setText(oSapSplUtils.getBundle().getText("FREIGHT_ITEM_IDENTIFIER_LABEL"));
                modelData.Type = "B";
            }

            this.oSplAddFreightItemModel.setData(modelData);

            if (event.getSource().sId.indexOf("SapSplFreightItemTypeRadioButton_2") !== -1) {

                this.byId("SapSplFreightItemCustomLengthInput_3").setValueState("None");

            }
        }
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

        this.oSapSplNewfreightOkButton = new sap.m.Button({
            press: jQuery.proxy(this.fnHandlePressOfNewfreightDialogOk, this)
        });

        this.oSapSplNewfreightCancelButton = new sap.m.Button({
            press: jQuery.proxy(this.fnHandlePressOfNewfreightDialogCancel, this)
        });

        this.oSapSplNewfreightOkButton.setText(oSapSplUtils.getBundle().getText("OK_BUTTON_TEXT"));
        this.oSapSplNewfreightCancelButton.setText(oSapSplUtils.getBundle().getText("CANCEL"));
        this.oParentDialogInstance.setBeginButton(this.oSapSplNewfreightOkButton);
        this.oParentDialogInstance.setEndButton(this.oSapSplNewfreightCancelButton);
    },
    
    fnRegExCheckForNumberAndUnit : function (value) {
        if (/^\d+(\.\d+)?\s*[a-zA-Z]+$/i.test(value)) {
            return true;
        } else {
            return false;
        }
    },
    
    fnRegExCheckForNumberAndUnitForQuantity : function (value) {
        if ( /^\d+(\.\d+)?\s*[a-zA-Z]+$/i.test(value) || (/^\d+(\.\d+)?\s*$/i.test(value)) ) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * @description Method to handle press of Ok button of dialog.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnHandlePressOfNewfreightDialogOk: function () {
        var modelData = $.extend(true, {}, sap.ui.getCore().getModel("SplCreateNewTourModel").getData()),
            data;
        var sIndex, sAction, jIndex, sDeleted, iUUID = oSapSplUtils.getUUID(), ExternalStopDestination, PartnerOrderID,
            flag = 1;
        var addFreightItemModelData = $.extend(true, {}, this.oSplAddFreightItemModel.getData());

        if (addFreightItemModelData.Type === "C") {
            if (this.byId("SapSplFreightItemLengthButton_3").getSelected()) {
                addFreightItemModelData.ContainerType = this.byId("SapSplFreightItemCustomLengthInput_3").getValue();
                if (addFreightItemModelData.ContainerType.length === 0) {
                    flag = 0;
                    this.byId("SapSplFreightItemCustomLengthInput_3").setValueState("Error");
                    this.byId("SapSplFreightItemCustomLengthInput_3").setValueStateText(oSapSplUtils.getBundle().getText("EMPTY_ERROR_MESSAGE"));
                } else {
                    this.byId("SapSplFreightItemCustomLengthInput_3").setValueState("None");
                }
            }
        } else {
            if ( this.byId("SapSplNewFreightItemFormQuantityInput").getValue().length === 0 || this.fnRegExCheckForNumberAndUnitForQuantity(this.byId("SapSplNewFreightItemFormQuantityInput").getValue().trim()) ) {
                this.byId("SapSplNewFreightItemFormQuantityInput").setValueState("None");
                if ( this.byId("SapSplNewFreightItemFormQuantityInput").getValue().length === 0 ) {
                    addFreightItemModelData.Quantity_Value = "";
                    addFreightItemModelData.Quantity_Unit = "";
                } else {
                    addFreightItemModelData.Quantity_Value = parseInt(this.byId("SapSplNewFreightItemFormQuantityInput").getValue(), 10).toString();
                    addFreightItemModelData.Quantity_Unit = this.byId("SapSplNewFreightItemFormQuantityInput").getValue().replace(/\d+(\.\d+)?\s*/,"").length === 0 ? oSapSplUtils.getBundle().getText("DEFAULT_QUANTITY") : this.byId("SapSplNewFreightItemFormQuantityInput").getValue().replace(/\d+(\.\d+)?\s*/,"");
                }
            } else {
                flag = 0;
                this.byId("SapSplNewFreightItemFormQuantityInput").setValueState("Error");
                this.byId("SapSplNewFreightItemFormQuantityInput").setValueStateText(oSapSplUtils.getBundle().getText("WRONG_FORMAT_ERROR_MESSAGE"));
            }
            
            if ( this.byId("SapSplNewFreightItemFormContainerWeightInput").getValue().length === 0 || this.fnRegExCheckForNumberAndUnit(this.byId("SapSplNewFreightItemFormContainerWeightInput").getValue().trim()) ) {
                this.byId("SapSplNewFreightItemFormContainerWeightInput").setValueState("None");
                if ( this.byId("SapSplNewFreightItemFormContainerWeightInput").getValue().length === 0 ) {
                    addFreightItemModelData.Weight_Value = "";
                    addFreightItemModelData.Weight_Unit = "";
                } else {
                    addFreightItemModelData.Weight_Value = parseInt(this.byId("SapSplNewFreightItemFormContainerWeightInput").getValue(), 10).toString();
                    addFreightItemModelData.Weight_Unit = this.byId("SapSplNewFreightItemFormContainerWeightInput").getValue().replace(/\d+(\.\d+)?\s*/,"");
                }
            } else {
                flag = 0;
                this.byId("SapSplNewFreightItemFormContainerWeightInput").setValueState("Error");
                this.byId("SapSplNewFreightItemFormContainerWeightInput").setValueStateText(oSapSplUtils.getBundle().getText("WRONG_FORMAT_ERROR_MESSAGE"));
            }
            
            if ( this.byId("SapSplNewFreightItemFormContainerVolumeInput").getValue().length === 0 || this.fnRegExCheckForNumberAndUnit(this.byId("SapSplNewFreightItemFormContainerVolumeInput").getValue().trim()) ) {
                this.byId("SapSplNewFreightItemFormContainerVolumeInput").setValueState("None");
                if ( this.byId("SapSplNewFreightItemFormContainerVolumeInput").getValue().length === 0 ) {
                    addFreightItemModelData.Volume_Value = "";
                    addFreightItemModelData.Volume_Unit = "";
                } else {
                    addFreightItemModelData.Volume_Value = parseInt(this.byId("SapSplNewFreightItemFormContainerVolumeInput").getValue(), 10).toString();
                    addFreightItemModelData.Volume_Unit = this.byId("SapSplNewFreightItemFormContainerVolumeInput").getValue().replace(/\d+(\.\d+)?\s*/,"");
                }
            } else {
                flag = 0;
                this.byId("SapSplNewFreightItemFormContainerVolumeInput").setValueState("Error");
                this.byId("SapSplNewFreightItemFormContainerVolumeInput").setValueStateText(oSapSplUtils.getBundle().getText("WRONG_FORMAT_ERROR_MESSAGE"));
            }
        }

        if (addFreightItemModelData.ItemID.length !== 0 && flag) {
            if (!addFreightItemModelData.isEdit) {
                var itemsLength = modelData.Items.length;

                modelData.Items[itemsLength] = {};
                modelData.Items[itemsLength].ItemID = addFreightItemModelData.ItemID;
                modelData.Items[itemsLength].Type = addFreightItemModelData.Type;

                if (addFreightItemModelData.Type === "C") {
                    modelData.Items[itemsLength].ContainerType = addFreightItemModelData.ContainerType;
                    modelData.Items[itemsLength].Description = addFreightItemModelData.Description;

                    modelData.Items[itemsLength].Volume_Unit = "";
                    modelData.Items[itemsLength].Volume_Value = "";

                    modelData.Items[itemsLength].Weight_Unit = "";
                    modelData.Items[itemsLength].Weight_Value = "";

                    modelData.Items[itemsLength].Quantity_Unit = "";
                    modelData.Items[itemsLength].Quantity_Value = "";

                    modelData.Items[itemsLength].DangerGoodsClass = "";
                } else {
                    modelData.Items[itemsLength].Volume_Unit = addFreightItemModelData.Volume_Unit;
                    modelData.Items[itemsLength].Volume_Value = addFreightItemModelData.Volume_Value;

                    modelData.Items[itemsLength].Weight_Unit = addFreightItemModelData.Weight_Unit;
                    modelData.Items[itemsLength].Weight_Value = addFreightItemModelData.Weight_Value;

                    modelData.Items[itemsLength].Quantity_Unit = addFreightItemModelData.Quantity_Unit;
                    modelData.Items[itemsLength].Quantity_Value = addFreightItemModelData.Quantity_Value;

                    modelData.Items[itemsLength].ContainerType = "";
                    modelData.Items[itemsLength].Description = "";

                    modelData.Items[itemsLength].DangerGoodsClass = this.byId("SapSplNewFreightItemFormContainerDangerClassInput").getValue();
                }
                data = $.extend(true, {}, modelData.Items[itemsLength]);
                modelData.Items[itemsLength].UUID = iUUID;
                modelData.Items[itemsLength].pickActionHappened = "N";
                modelData.Items[itemsLength].dropActionHappened = "N";
                modelData.Items[itemsLength].pickStopIndex = -1;
                modelData.Items[itemsLength].dropStopIndex = -1;

                for (sIndex = 0; sIndex < modelData.stopsRow.length; sIndex++) {
                    jIndex = modelData.stopsRow[sIndex].items.length;
                    modelData.stopsRow[sIndex].items[jIndex] = $.extend(true, {}, data);
                    modelData.stopsRow[sIndex].items[jIndex]["Action"] = "N";
                    modelData.stopsRow[sIndex].items[jIndex]["IsDeleted"] = "0";
                    modelData.stopsRow[sIndex].items[jIndex]["ItemUUID"] = iUUID;
                    modelData.stopsRow[sIndex].items[jIndex]["PartnerOrderID"] = null;
                    modelData.stopsRow[sIndex].items[jIndex]["ExternalStopDestination"] = null;
                }
            } else {

                modelData.Items[this.editIndex].ItemID = addFreightItemModelData.ItemID;
                modelData.Items[this.editIndex].Type = addFreightItemModelData.Type;
                modelData.Items[this.editIndex].DangerGoodsClass = this.byId("SapSplNewFreightItemFormContainerDangerClassInput").getValue();

                if (addFreightItemModelData.Type === "C") {
                    modelData.Items[this.editIndex].ContainerType = addFreightItemModelData.ContainerType;
                    modelData.Items[this.editIndex].Description = addFreightItemModelData.Description;
                    modelData.Items[this.editIndex].DangerGoodsClass = "";

                    modelData.Items[this.editIndex].Volume_Unit = "";
                    modelData.Items[this.editIndex].Volume_Value = "";

                    modelData.Items[this.editIndex].Weight_Unit = "";
                    modelData.Items[this.editIndex].Weight_Value = "";

                    modelData.Items[this.editIndex].Quantity_Unit = "";
                    modelData.Items[this.editIndex].Quantity_Value = "";
                } else {
                    modelData.Items[this.editIndex].Volume_Unit = addFreightItemModelData.Volume_Unit;
                    modelData.Items[this.editIndex].Volume_Value = addFreightItemModelData.Volume_Value;

                    modelData.Items[this.editIndex].Weight_Unit = addFreightItemModelData.Weight_Unit;
                    modelData.Items[this.editIndex].Weight_Value = addFreightItemModelData.Weight_Value;

                    modelData.Items[this.editIndex].Quantity_Unit = addFreightItemModelData.Quantity_Unit;
                    modelData.Items[this.editIndex].Quantity_Value = addFreightItemModelData.Quantity_Value;

                    modelData.Items[this.editIndex].ContainerType = "";
                    modelData.Items[this.editIndex].Description = "";

                    modelData.Items[this.editIndex].DangerGoodsClass = this.byId("SapSplNewFreightItemFormContainerDangerClassInput").getValue();
                }

                for (sIndex = 0; sIndex < modelData.stopsRow.length; sIndex++) {
                    for (jIndex = 0; jIndex < modelData.stopsRow[sIndex].items.length; jIndex++) {
                        if (modelData.Items[this.editIndex].UUID === modelData.stopsRow[sIndex].items[jIndex].ItemUUID) {
                            sAction = modelData.stopsRow[sIndex].items[jIndex].Action;
                            sDeleted = modelData.stopsRow[sIndex].items[jIndex].IsDeleted;
                            iUUID = modelData.stopsRow[sIndex].items[jIndex].ItemUUID;
                            PartnerOrderID = modelData.stopsRow[sIndex].items[jIndex].PartnerOrderID;
                            ExternalStopDestination = modelData.stopsRow[sIndex].items[jIndex].ExternalStopDestination;

                            if (addFreightItemModelData.Type === "C") {
                                modelData.stopsRow[sIndex].items[jIndex].ContainerType = addFreightItemModelData.ContainerType;
                                modelData.stopsRow[sIndex].items[jIndex].Description = addFreightItemModelData.Description;

                                modelData.stopsRow[sIndex].items[jIndex].Volume_Unit = "";
                                modelData.stopsRow[sIndex].items[jIndex].Volume_Value = "";

                                modelData.stopsRow[sIndex].items[jIndex].Weight_Unit = "";
                                modelData.stopsRow[sIndex].items[jIndex].Weight_Value = "";

                                modelData.stopsRow[sIndex].items[jIndex].Quantity_Unit = "";
                                modelData.stopsRow[sIndex].items[jIndex].Quantity_Value = "";
                            } else {
                                modelData.stopsRow[sIndex].items[jIndex].Volume_Unit = addFreightItemModelData.Volume_Unit;
                                modelData.stopsRow[sIndex].items[jIndex].Volume_Value = addFreightItemModelData.Volume_Value;

                                modelData.stopsRow[sIndex].items[jIndex].Weight_Unit = addFreightItemModelData.Weight_Unit;
                                modelData.stopsRow[sIndex].items[jIndex].Weight_Value = addFreightItemModelData.Weight_Value;

                                modelData.stopsRow[sIndex].items[jIndex].Quantity_Unit = addFreightItemModelData.Quantity_Unit;
                                modelData.stopsRow[sIndex].items[jIndex].Quantity_Value = addFreightItemModelData.Quantity_Value;

                                modelData.stopsRow[sIndex].items[jIndex].ContainerType = "";
                                modelData.stopsRow[sIndex].items[jIndex].Description = "";

                                modelData.stopsRow[sIndex].items[jIndex].DangerGoodsClass = this.byId("SapSplNewFreightItemFormContainerDangerClassInput").getValue();
                            }
                            modelData.stopsRow[sIndex].items[jIndex]["ItemID"] = addFreightItemModelData.ItemID;
                            modelData.stopsRow[sIndex].items[jIndex]["Type"] = addFreightItemModelData.Type;
                            modelData.stopsRow[sIndex].items[jIndex]["Action"] = sAction;
                            modelData.stopsRow[sIndex].items[jIndex]["IsDeleted"] = sDeleted;
                            modelData.stopsRow[sIndex].items[jIndex]["ItemUUID"] = iUUID;
                            modelData.stopsRow[sIndex].items[jIndex]["PartnerOrderID"] = PartnerOrderID;
                            modelData.stopsRow[sIndex].items[jIndex]["ExternalStopDestination"] = ExternalStopDestination;
                        }
                    }
                }
            }
            sap.ui.getCore().getModel("SplCreateNewTourModel").setData(modelData);
            this.fnToCaptureLiveChangeToSetFlag();
            this.getView().getParent().close();

        } else {
            if (addFreightItemModelData.ItemID.length === 0) {
                this.byId("SapSplNewFreightItemFormContainerIdInput").setValueStateText(oSapSplUtils.getBundle().getText("EMPTY_ERROR_MESSAGE"));

                this.byId("SapSplNewFreightItemFormContainerIdInput").setValueState("Error");
            } else {
                this.byId("SapSplNewFreightItemFormContainerIdInput").setValueState("None");
            }
        }
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
    fnHandlePressOfNewfreightDialogCancel: function () {
        var that = this;
        if (oSapSplUtils.getIsDirty()) {
            sap.m.MessageBox.show(
                oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),
                sap.m.MessageBox.Icon.WARNING,
                oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                function (selection) {
                    if (selection === "YES") {
                        that.getView().getParent().close();
                        oSapSplUtils.setIsDirty(that.saveDirtyFlag);
                    }
                }
            );
        } else {
            that.getView().getParent().close();
            oSapSplUtils.setIsDirty(that.saveDirtyFlag);
        }
    },

    /**
     * @description Method to handle Select of Container length Radio button.
     * @param {Object} oEvent Select event object of Radio Button.
     * @returns void.
     * @since 1.0
     */
    fnHandelLengthRadioButton: function (oEvent) {
        var modelData = this.oSplAddFreightItemModel.getData();
        if (oEvent.getSource().getId().indexOf("SapSplFreightItemLengthButton_1") > 0) {
            modelData.ContainerType = "20ft";
            this.byId("SapSplFreightItemCustomLengthInput_3").setEnabled(false);
            this.byId("SapSplFreightItemCustomLengthInput_3").setValueState("None");
        } else if (oEvent.getSource().getId().indexOf("SapSplFreightItemLengthButton_2") > 0) {
            modelData.ContainerType = "40ft";
            this.byId("SapSplFreightItemCustomLengthInput_3").setEnabled(false);
            this.byId("SapSplFreightItemCustomLengthInput_3").setValueState("None");
        } else {
            this.byId("SapSplFreightItemCustomLengthInput_3").setEnabled(true);
        }
        this.oSplAddFreightItemModel.setData(modelData);
    },

    /**
     * @description Method to save row index of Freight item in Edit mode.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    saveIndexOfModelOnEdit: function () {
        var sIndex, modelData = sap.ui.getCore().getModel("SplCreateNewTourModel").getData();
        for (sIndex = 0; sIndex < modelData.Items.length; sIndex++) {
            if (modelData.Items[sIndex].ItemID === this.oSplAddFreightItemModel.getData().ItemID) {
                this.editIndex = sIndex;
                break;
            }
        }
    }
});
