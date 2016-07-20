/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.SapSplMessageBoxlib");

splReusable.libs.SapSplMessageBoxlib = function () {
    if (splReusable.libs.SapSplMessageBoxlib.prototype._singletonInstance) {
        return splReusable.libs.SapSplMessageBoxlib.prototype._singletonInstance;
    }
    splReusable.libs.SapSplMessageBoxlib.prototype._singletonInstance = this;
    this.oSapSplMessageBox = new sap.m.Dialog({
        endButton: new sap.m.Button({
            text: oSapSplUtils.getBundle().getText("ERROR_MESSAGE_HANDLING_OK_BUTTON"),
            tap: function (oEvent) {
                oEvent.getSource().getParent().close();
            }

        })
    });
};

/**
 * @description Method to return the MessageBox instance.
 * To be used across the application to open the MessageBox.
 * @params {object} mDialogSettings contains properties title and text of the dialog .
 * @returns instance of sap.m.BusyDialog
 * @example
 * splReusable.libs.SapSplBusyDialoglib.prototype.getBusyDialogInstance({title:"Loading",text:"Please wait"});
 * splReusable.libs.SapSplBusyDialoglib.prototype.getBusyDialogInstance(); returns dialog without modifying title and text
 */

splReusable.libs.SapSplMessageBoxlib.prototype.getMessageBoxInstance = function (mErrorHandlingSettings) {
    if (this.oSapSplMessageBox.getContent().length !== 0) {
        this.oSapSplMessageBox.destroyContent();
    }
    if (mErrorHandlingSettings) {
        //this.oSapSplMessageBox.setType(sap.m.DialogType.Message);
        this.oSapSplMessageBox.setTitle(oSapSplUtils.getBundle().getText("ERROR_MESSAGE_HANDLING_TITLE"));
        var oContent = [],
            i = 0;
        if (mErrorHandlingSettings.message && mErrorHandlingSettings.message.constructor === String) {
            oContent[i++] = new sap.m.Label({
                text: mErrorHandlingSettings["message"]
            });
        }
        if (mErrorHandlingSettings.details && mErrorHandlingSettings.details.constructor === String) {

            oContent[i++] = new sap.m.TextArea({
                value: mErrorHandlingSettings.details,
                cols: 60,
                rows: 6
            });
        }
        if (i > 0) {
            this.oSapSplMessageBox.addContent(new sap.ui.layout.VerticalLayout({
                content: oContent
            }));
        }

    }
    return this.oSapSplMessageBox;
};

var oSapSplErrorHandling = new splReusable.libs.SapSplMessageBoxlib();
