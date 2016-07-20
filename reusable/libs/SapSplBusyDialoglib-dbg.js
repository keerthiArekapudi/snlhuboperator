/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.SapSplBusyDialoglib");

splReusable.libs.SapSplBusyDialoglib = function () {
    if (splReusable.libs.SapSplBusyDialoglib.prototype._singletonInstance) {
        return splReusable.libs.SapSplBusyDialoglib.prototype._singletonInstance;
    }
    splReusable.libs.SapSplBusyDialoglib.prototype._singletonInstance = this;
    this.oSapSplDialog = new sap.m.BusyDialog();
};

/**
 * @description Method to return the busy dialog instance.
 * To be used across the application to open/close the busy indicator instance.
 * @param {object} mDialogSettings contains properties title and text of the dialog .
 * @param mDialogSettings.title {String} the title for the busy dialog
 * @param mDialogSettings.text {String} the text for the busy dialog
 * @param mDialogSettings.type {String} the type of busy dialog (fiori|regular)
 * @returns instance of sap.m.BusyDialog
 * @example
 * splReusable.libs.SapSplBusyDialoglib.prototype.getBusyDialogInstance({title:"Loading",text:"Please wait"});
 * splReusable.libs.SapSplBusyDialoglib.prototype.getBusyDialogInstance(); returns dialog without modifying title and text
 */

splReusable.libs.SapSplBusyDialoglib.prototype.getBusyDialogInstance = function (mDialogSettings) {


    if (mDialogSettings && mDialogSettings.title && mDialogSettings.title.constructor === String) {

        this.oSapSplDialog.setProperty("title", mDialogSettings["title"]);

    } else {

        this.oSapSplDialog.setProperty("title", oSapSplUtils.getBundle().getText("BUSY_DIALOG_MESSAGE"));
    }

    if (mDialogSettings && mDialogSettings.text && mDialogSettings.text.constructor === String) {

        this.oSapSplDialog.setProperty("text", mDialogSettings["text"]);

    }

    this.oSapSplDialog
        .setCustomIcon("./resources/icons/spinner.gif")
        .setCustomIconRotationSpeed(0);

    return this.oSapSplDialog;
};

var oSapSplBusyDialog = new splReusable.libs.SapSplBusyDialoglib();
