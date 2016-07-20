/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.DeregistrationHandler");

var oSapSplDeregistrationHandler = (function () {

    var oLaunchDeregCompanyDetailsDialog = function (hubName,confirmHandler, cancelHandler, afterOpen, afterClose) {

        var oSplDeregisterCompanyDetailsView = sap.ui.view({
            viewName: "splView.profile.DeregisterCompanyDetails",
            type: sap.ui.core.mvc.ViewType.XML,
            viewData: {}
        });

        oSplDeregisterCompanyDetailsView.addEventDelegate({
            onBeforeShow: oSplDeregisterCompanyDetailsView.getController().onBeforeShow()
        }, oSplDeregisterCompanyDetailsView.getController());


        var oOKToDeregisterButton = new sap.m.Button({
            text: "{splI18NModel>OK}",
            press: function () {
                oSplDeregisterCompanyDetailsView.getController().oSourceInstance.destroy();
                confirmHandler();
            }
        });

        var oCancelDeregisterButton = new sap.m.Button({
            text: "{splI18NModel>CANCEL}",
            press: function () {
                oSplDeregisterCompanyDetailsView.getController().oSourceInstance.destroy();
                cancelHandler();
            }
        });

        //         Fix for Incident : 1482012129 - added the style class to the dialog
        var oDialog = new sap.m.Dialog({
            contentHeight: "100%",
            contentWidth: "100%",
            width: "800px",
            state: sap.ui.core.ValueState.Warning,
            title: "{splI18NModel>DEREGISTER_YOUR_COMPANY_WITH_HUB}" + hubName,
            content: oSplDeregisterCompanyDetailsView,
            afterOpen: afterOpen || null,
            afterClose: afterClose || null,
            buttons: [oOKToDeregisterButton, oCancelDeregisterButton]
        }).addStyleClass("sapSplDeregisterCompanyDialog");

        oSplDeregisterCompanyDetailsView.getController().oSourceInstance = oDialog;

        oDialog.open();
    };

    return {

        launch: oLaunchDeregCompanyDetailsDialog,

        deRegister: function () {

        }
    };

}());
