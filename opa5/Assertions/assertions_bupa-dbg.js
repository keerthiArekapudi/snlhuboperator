/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("OPA5TestScript.Assertions.assertions_bupa");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");


new sap.ui.test.Opa5.extend("opa5.Assertions.assertions_bupa",{

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
    
    iCheckForInitialFocus : function(){
        return this.waitFor({
        	id : "MyBusinessPartnerMaster--sapSplSearchBusinessPartnerMasterList",
               check: function(oInput){
                      return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()=== oInput.sId;
               },
               success : function(oInput){
                      ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()=== oInput.sId,"Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
                      },
        errorMessage : "Focus on the wrong input"
        });
  },
  
  iCheckForInitialFocusOnSelected : function(){
      return this.waitFor({
    	  id : "FreelancerConnectDetail--sapSplBusinessPartnerSearchField",
             check: function(oInput){
                    return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()=== "FreelancerConnectDetail--sapSplBusinessPartnerSearchField";
             },
             success : function(oInput){
                    ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()=== "FreelancerConnectDetail--sapSplBusinessPartnerSearchField","Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
                    },
      errorMessage : "Focus on the wrong input"
      });
},

iShouldSeeCarrierDetails : function(){
    return this.waitFor({
    	controlType : "sap.m.ObjectHeader",
    	check : function(oHeader)
    	{
    		return oHeader[0].getTitle() === oTitle;
    	},
        success : function(oheader)
        {
            ok(true, "The bupa carrier page is displayed, carrier:" + oTitle);
        },
        errorMessage : "The bupa app page didn't load!"
    });
},

iShouldSeeForm : function(){
    return this.waitFor({
    	controlType : "sap.m.IconTabBar",
    	check : function(oIconTabBar)
    	{
    		return oIconTabBar[0].getItems()[i].getContent()[i];
    	},
        success : function(oItem)
        {
            ok(true, "The contents for the selected icon are displayed" + oItem[0].getItems()[i].getContent()[i]);
        },
        errorMessage : "Didn't load the contents for the selected icon"
    });
},

});