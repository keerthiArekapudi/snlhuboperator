/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("OPA5TestScript.Assertions.ExternalIDInBupaDetailsAssertions");
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
    iShouldSeeBupaList : function()
    {
    	return this.waitFor({
    		id: "MyBusinessPartnerDetail--MyBusinessPartnerDetailPage-title",
    		success: function()
    		{
    			ok(true,"Bupa List is Visible");
    		}
    	});
    },
    iShouldSeeExternalIDEditable : function()
    {
    	return this.waitFor({
    		id:"MyBusinessPartnerDetail--sapSplBusinessPartnerExternalIdInput",
    		check : function(oInput)
    		{
    			if(oInput.getEditable())
    				{	
    					
    					return true;
    				}
    		},
    		success: function()
    		{
    			ok(true,"External ID field is editable in Bupa Details Page in edit mode");
    		},
    		errorMessage : "External ID field is not editable in Bupa Details Page in edit mode",
    	});
    },
    iShouldSeeAllFieldsNoEditable:function()
    {
    	return this.waitFor({
    		id:"MyBusinessPartnerDetail--sapSplBusinessPartnerExternalIdInput",
    		check : function(oInput)
    		{
    			if(!oInput.getEditable())
    				{	
    					
    					return true;
    				}
    		},
    		success: function()
    		{
    			ok(true,"External ID field is not editable in Bupa Details Page in view Details mode");
    		},
    		errorMessage : "External ID field is editable in Bupa Details Page in view details mode",
    	});
    },
    ShouldSeeSavedValueInDetailsPage:function()
    {
    	return this.waitFor({
    	id:"MyBusinessPartnerDetail--sapSplBusinessPartnerExternalIdInput",
    	check : function(oInput)
    	{
    		if(oInput.getValue() == "HEllo World")
    			{
    				
    				return true;
    			}
    	},
    	success: function()
    	{
    		ok(true,"External ID value saved Properly");
    	},
    	errorMessage : "External ID value  could not be saved",
    	});
    	
    }
});