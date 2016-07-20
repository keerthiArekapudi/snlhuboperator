/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("OPA5TestScript.Assertions.assertions_trucks");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");


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
                ok(oPage, "Found the apps tiles : "+this.getContext().oAppsPage.getContent().length+" tiles");
            },
            errorMessage : "The apps tiles did not contain entries",
        });
    },
    iclickonTrucksTile : function(){
    	
            return this.waitFor({
                   controlType : "sap.m.SearchField",
                   check: function(oSearchField){
                          return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='MyVehiclesMaster--sapSplVehicleSearch';
                   },
                   success : function(oSearchField){
                          ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='MyVehiclesMaster--sapSplVehicleSearch',"Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
                          },
            errorMessage : "Focus on the wrong input"
            });
     
    },
    focusCheckforAddTrucks : function()
    {
    	return this.waitFor({
            controlType:"sap.m.Input",
            check: function(oInput){
            	
                   return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='MyVehiclesDetailAddVehicle--SapSplNewVehiclesVehicleRegistrationNumber';
            },
            success : function(oInput){
                   ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='MyVehiclesDetailAddVehicle--SapSplNewVehiclesVehicleRegistrationNumber',"Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
                   },
     errorMessage : "Focus on the wrong input"
     });
    },
    focusCheckAfterFilter: function()
    {
    	return this.waitFor({
            controlType : "sap.m.SearchField",
            check: function(oSearchField){
            		
                   return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='MyVehiclesMaster--sapSplVehicleSearch';
            },
            success : function(oSearchField){
                   ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='MyVehiclesMaster--sapSplVehicleSearch',"Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
                   },
     errorMessage : "Focus on the wrong input"
     });
    },
    focusCheckEdit: function()
    {
    	return this.waitFor({
            id : "MyVehiclesDetailAddVehicle--SapSplNewVehiclesVehicleRegistrationNumber",
            check: function(oInput){
            	
                   return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='MyVehiclesDetailAddVehicle--SapSplNewVehiclesVehicleRegistrationNumber';
            },
            success : function(oSearchField){
            	
                   ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='MyVehiclesDetailAddVehicle--SapSplNewVehiclesVehicleRegistrationNumber',"Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
                   },
     errorMessage : "Focus on the wrong input"
     });
    },
    cancleReturn : function()
    {
    	return this.waitFor({
    		id : "MyVehiclesDetail--MyVehiclesDetailHeader",
    		success : function(oHeader)
    		{
    			ok(true,"Cancle button pressed and header of truck loaded"+ oHeader.getTitle());
    		},
    	errorMessage : "cancle not pressed",
    	});
    	
           
    
    },
    iShouldSeePopover : function()
	{
		return this.waitFor({
		controlType:"sap.m.Popover",
		success: function(oPopover)
		{
			ok(true,"Group by popover loaded");
		}
		});
	}
    
});