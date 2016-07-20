/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.dialogs.SplTourProgressDialog", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        this.oViewData = this.getView().getViewData();
        this.oSplTourProgressModel = new sap.ui.model.json.JSONModel();
        this.oSplTourProgressModel.setData(this.oViewData);
        this.getView().setModel(this.oSplTourProgressModel);
        
        this.oSapSplTourStopDelaySorter1 = new sap.ui.model.Sorter("StopName", true, this.handleGroupingOfStops);
        this.oSapSplTourStopDelaySorter2 = new sap.ui.model.Sorter("ReportedTime");
        
        this.byId("SapSclTourPrgressDetailsTable").getBinding("items").sort([this.oSapSplTourStopDelaySorter1, this.oSapSplTourStopDelaySorter2]);
        
        this.byId("SapSclTourPrgressDetailsTable").getBinding("items").filter(new sap.ui.model.Filter("EventType", sap.ui.model.FilterOperator.EQ, "S"));

        /*Localization*/
        this.fnDefineControlLabelsFromLocalizationBundle();
    },
    
    handleGroupingOfStops : function (oContext) {
        var sName = oContext.getProperty("StopName");
        var sKey = oContext.getProperty("StopName");
        return {
            key: sKey,
            text: sName
        };
    },


    /**
     * @description Method to handle localization of all the hard code texts in the view.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnDefineControlLabelsFromLocalizationBundle: function () {
        this.byId("SapSclTourProgressTableStatus").setText(oSapSplUtils.getBundle().getText("STATUS"));
        this.byId("SapSclTourProgressTableTime").setText(oSapSplUtils.getBundle().getText("TIME"));
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

        this.oSapSplTourProgressCancelButton = new sap.m.Button({
            press: jQuery.proxy(this.fnHandlePressOfTourProgressDialogCancel, this)
        });

        this.oSapSplTourProgressCancelButton.setText(oSapSplUtils.getBundle().getText("CLOSE"));

        this.oParentDialogInstance.setEndButton(this.oSapSplTourProgressCancelButton);
    },

    /**
     * @description Method to handle press of Close button of dialog.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnHandlePressOfTourProgressDialogCancel: function () {
        this.getView().getParent().close();
        this.getView().getParent().destroy();
    }

});
