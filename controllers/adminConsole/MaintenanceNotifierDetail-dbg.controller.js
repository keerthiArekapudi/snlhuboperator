/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.adminConsole.MaintenanceNotifierDetail", {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        
        var oSapSplMaintenanceNotifierDetailModel = null;

        oSapSplMaintenanceNotifierDetailModel = new sap.ui.model.json.JSONModel({
            noData: true,
            isClicked: false,
            showFooterButtons: false
        });
        
        sap.ui.getCore().setModel(oSapSplMaintenanceNotifierDetailModel, "SapSplMaintenanceNotifierDetailModel");
        
        this.getView().setModel(sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel"));
        
        /*Localization*/
        this.fnDefineControlLabelsFromLocalizationBundle();
    },
    
    fnHandleEditNotification: function () {
        
        var oModelData = $.extend(true, {}, sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").getData());
        
        oModelData.type = "edit";
        
        var viewData = {
                context : oModelData
        };
        
        this.getView().getParent().to("MaintenanceNotifierAddNotificationDetail","",viewData);
    },
    
    fnDefineControlLabelsFromLocalizationBundle: function () {
        this.byId("sapSplMaintenanceNotifierDetailPage").setTitle(oSapSplUtils.getBundle().getText("NOTIFICATION"));
        
        this.byId("sapSplStartTime").setTitle(oSapSplUtils.getBundle().getText("STARTS"));
        
        this.byId("sapSplExpiryTime").setTitle(oSapSplUtils.getBundle().getText("EXPIRES"));
        
        this.byId("sapSplMaintenanceNotifierMessage").setText(oSapSplUtils.getBundle().getText("MESSAGE"));
        
        this.byId("sapSplNotificationDetailNoDataLabel").setText(oSapSplUtils.getBundle().getText("NO_NOTIFICATIONS_TEXT"));
        
        this.byId("sapSplMaintenanceNotifierDetailEdit").setText(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_EDIT_BUTTON"));
    },
    
    onBeforeShow: function (oEvent) {
        if (oEvent.data.context) {
            sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(oEvent.data.context);
            
            this.byId("sapSplStartTime").setText(splReusable.libs.SapSplModelFormatters.convertDateTimeToStringBasedOnLocaleInMediumFormat(oEvent.data.context.Validity_StartTime));
            
            this.byId("sapSplExpiryTime").setText(splReusable.libs.SapSplModelFormatters.convertDateTimeToStringBasedOnLocaleInMediumFormat(oEvent.data.context.Validity_EndTime));
        }
    }
});