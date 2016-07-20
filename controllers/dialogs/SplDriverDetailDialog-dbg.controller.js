/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ca.ui.message.message");
sap.ui.controller("splController.dialogs.SplDriverDetailDialog", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */

    onInit: function () {
        this.getView().byId("SapSplDriverListHeaderTitle").setText(oSapSplUtils.getBundle().getText("DRIVERS"));
        this.getView().byId("SapSplSelectDriverList").setNoDataText(oSapSplUtils.getBundle().getText("NO_DRIVERS_TEXT"));
        this.getView().byId("SapSplDriverListBar").addStyleClass("DriverBar");
    },

    /**
     * @description function to modify the buttons in the Dialog
     * @param sPageIdentifier -a string that identifies the page.
     * @returns void.
     * @since 1.0
     */

    setParentDialogButtonStateBasedOnCurrentPage: function (sPageIdentifier) {

        if (!this.oSapSplSendMessageCancelButton) {
            this.oSapSplSendMessageCancelButton = new sap.m.Button({
                press: jQuery.proxy(this.fnHandlePressOfSendMessageDialogCancel, this)
            });
        }

        if (sPageIdentifier === "DriverDetail") {
            this.oSapSplSendMessageCancelButton.setText(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON"));
            this.oParentDialogInstance.setBeginButton(this.oSapSplSendMessageCancelButton);
        }
    },

    /**
     * @description function to handle the press of cancel button.Closes the dialog,when pressed from DriverListPage ,navigates back otherwise
     * @param null
     * @returns void.
     * @since 1.0
     */

    fnHandlePressOfSendMessageDialogCancel: function () {
        this.getView().getParent().getParent().close();
        this.getView().getParent().getParent().destroy();
    },

    setParentDialogInstance: function (oParentDialog) {
        this.oParentDialogInstance = oParentDialog;
        this.setParentDialogButtonStateBasedOnCurrentPage("DriverDetail");
    },

    /**
     * @description Method to handle select of list Item.
     * @since 1.0
     * @param oEvent {object}
     * @returns void.
     */
    fnHandleSelectOfListItem: function (oEvent) {
        var oDriverDetails = null,
            oVehicleData = null,
            oVehicleModelData = null;

        //set isDirtyFlag
        if (!oSapSplUtils.getIsDirty()) {
            oSapSplUtils.setIsDirty(true);
        }

        oDriverDetails = oEvent.getParameter("listItem").getBindingContext().getProperty();
        oVehicleModelData = sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData();
        oVehicleData = oVehicleModelData.data;

        oVehicleData.VehicleDriverFirstName = oDriverDetails["PersonName_Surname"];
        oVehicleData.DriverName = oDriverDetails["PersonName_GivenName"] + " , " + oDriverDetails["PersonName_Surname"];

        oVehicleModelData.data = oVehicleData;
        oVehicleData.VehicleDriverUUID = oDriverDetails["UUID"];
        sap.ui.getCore().getModel("myVehiclesAddVehicleModel").setData(oVehicleModelData);
        this.getView().getParent().getParent().close();
        this.getView().getParent().getParent().destroy();
    }

});
