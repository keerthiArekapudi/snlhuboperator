/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.dialogs.SplLeftPanelGroupByDialog", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        this.oViewData = this.getView().getViewData();
        this.oSnlhLeftPanelGroupByDialogModel = new sap.ui.model.json.JSONModel();
        this.oSnlhLeftPanelGroupByDialogModel.setData(this.oViewData);
        this.getView().setModel(this.oSnlhLeftPanelGroupByDialogModel);

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

    	this.oSapSnlhLeftPanelGroupByDialogOkButton = new sap.m.Button({
            press: jQuery.proxy(this.fnHandlePressOfLeftPanelGroupByDialogOkButton, this)
        });
    	this.oSapSnlhLeftPanelGroupByDialogCancelButton = new sap.m.Button({
            press: jQuery.proxy(this.fnHandlePressOfLeftPanelGroupByDialogCancelButton, this)
        });
    	this.oSapSnlhLeftPanelGroupByDialogOkButton.setText(oSapSplUtils.getBundle().getText("Ok"));
        this.oSapSnlhLeftPanelGroupByDialogCancelButton.setText(oSapSplUtils.getBundle().getText("CANCEL"));
        
        this.oParentDialogInstance.setBeginButton(this.oSapSnlhLeftPanelGroupByDialogOkButton);
        this.oParentDialogInstance.setEndButton(this.oSapSnlhLeftPanelGroupByDialogCancelButton);
    },

    /**
     * @description Method to handle press of Close button of dialog.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnHandlePressOfLeftPanelGroupByDialogCancelButton: function () {
        this.getView().getParent().close();
        this.getView().getParent().destroy();
    },
    
    fnHandlePressOfLeftPanelGroupByDialogOkButton : function () {
    	var oSorter = new sap.ui.model.Sorter(this.byId("SapSnlhTrackGeofenceDialogList").getSelectedItem().getBindingContext().getProperty().FieldName, true, sap.ui.getCore().byId("splView.liveApp.liveApp").getController().handleGroupingOfLocations);
        var oNameSorter = new sap.ui.model.Sorter("Name", false);
    	
    	sap.ui.getCore().byId("splView.liveApp.liveApp--SapSplLeftPanelList").getBinding("items").sort([]);
    	
        sap.ui.getCore().byId("splView.liveApp.liveApp--SapSplLeftPanelList").getBinding("items").sort([oSorter, oNameSorter]);
        
        if( this.byId("SapSnlhTrackGeofenceDialogList").getSelectedItem().getBindingContext().getProperty().FieldName === "isPublic" ) {
        	sap.ui.getCore().byId("splView.liveApp.liveApp--sapSnlhGroupTitlelabelInfoToolBar").setText(oSapSplUtils.getBundle().getText("GROUPED_BY_SHARING"));
        } else if( this.byId("SapSnlhTrackGeofenceDialogList").getSelectedItem().getBindingContext().getProperty().FieldName === "OwnerName" ) {
        	sap.ui.getCore().byId("splView.liveApp.liveApp--sapSnlhGroupTitlelabelInfoToolBar").setText(oSapSplUtils.getBundle().getText("GROUPED_BY_COMPANY"));
        } else if( this.byId("SapSnlhTrackGeofenceDialogList").getSelectedItem().getBindingContext().getProperty().FieldName === "isRadar" ) {
        	sap.ui.getCore().byId("splView.liveApp.liveApp--sapSnlhGroupTitlelabelInfoToolBar").setText(oSapSplUtils.getBundle().getText("GROUPED_BY_TYPE"));
        }
        
        
        this.getView().getParent().close();
        this.getView().getParent().destroy();
    },
    
    handleGroupingOfLocations : function () {
    	
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
    
    fnHandleSelectOfGeofenceGroupType : function () {
    	
    }
});
    