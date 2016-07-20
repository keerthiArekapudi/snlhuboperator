/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Assertions.psp_notification");
jQuery.sap.require("sap.ui.test.Opa5");

new sap.ui.test.Opa5.extend("opa5.Assertions.assertions",{
	
    iShouldSeeTiles : function () {
        return this.waitFor({
            id : "masterTileContainerPage",
            viewName : "splView.tileContainer.MasterTileContainer",
            check : function () {
                return this.getContext().oAppsPage && this.getContext().oAppsPage.getContent().length > 0;
            },
            success : function (oPage) {
                this.getContext().oShell = oPage.getParent().getParent().getParent().getParent();
                var aPageTiles = this.getContext().oAppsPage.getContent();
                var oObject = {};
                for (var i=0; i< aPageTiles.length; i++) {
                    oObject[aPageTiles[i].getBindingContext().getProperty().AppID] = aPageTiles[i];
                }

                this.getContext().oUIAppsObject = oObject;
                console.log(oObject);

                ok(oPage, "Found the apps tiles : "+this.getContext().oAppsPage.getContent().length+" tiles");
            },
            errorMessage : "The apps tiles did not contain entries",
        });
    },
    
    iSeeNotificationPageLoaded: function(){
    	return this.waitFor({
    		id: "MaintenanceNotifierDetail--sapSplMaintenanceNotifierDetailPage-title",
    			success: function(oText){
    				this.iSeeFocus("MaintenanceNotifierMaster--sapSplMaintenanceNotifierMasterSearch");
    				ok(true, "Notification page is loaded");
    			},
    			errorMessage: "Notification Page not loaded"
    	});
    },
    
    iSeeFocus: function(sId){
    	  return this.waitFor({
              id:sId,
              check: function(oInput){
                     return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()===sId;
              },
              success : function(oInput){
                     ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()===sId,"Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
                     },
       errorMessage : "Focus on the wrong input "+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
       });
    },
    
    iSeeButtons : function(){
    	return this.waitFor({
    		controlType: "sap.m.Button",
    		success : function(oBtn){
    			ok(true,"Button found!");
    		},
    		errorMessage : "Button not found!"
    	});
    },
    
    iSeeSuccessToastMsg: function(sText){
    	 return this.waitFor({
             "class" : "sapMMessageToast",
             success : function(){
                 ok(true, sText +" added successfully");
             },
             errorMessage : "Error in adding" +sText
         });
    },
    
    iSeeSaveButtonEnabled: function(){
    	return this.waitFor({
    		controlType:"sap.m.Button",
			success:function(oButton){
				if(oButton[4].getEnabled()){
					ok(true, "Save Button is enabled");
				}
			},
			errorMessage: "Save button not enabled"
    	});
    },
    
   
	
});