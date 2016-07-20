/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Actions.ExternalIDInBupaDetailsActions");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");

new sap.ui.test.Opa5.extend("opa5.Actions.actions", {
	ClickOnBupaTile : function()
	{
	        return this.waitFor({
	            id : this.getContext().oUIAppsObject.myBusinessPartners.sId,
	            check : function (userTile) {
	                return userTile.getState() === "Loaded";
	            },
	            success : function (oTile) {
	                oTile.firePress();
	                ok(oTile, "Bupa Tile is loaded and fired press");
	            },
	            errorMessage : "Bupa tile did not load"});
	},
	ClickonBupaDetailsEdit : function()
	{
		return this.waitFor({
			id : "MyBusinessPartnerDetail--MyBuPaDetailsEditButton",
			success : function(oButton){
				oButton.firePress();
				ok(oButton,"Edit button firePressed");
			},
			errorMessage : "Could not find Edit button",
		});
	},
	CheckExternalIDMessageStrip : function()
	{
		return this.waitFor({
			id:"MyBusinessPartnerDetail--sapSplBusinessPartnerDetailExternalIdMessage",
			check : function(oMessageStrip){
				if(oMessageStrip.getVisible())
				{
					return true;
				}
			},
			 success : function()
			 {
				 ok(true,"External ID message Strip is visible in edit Mode");
			 },
			errorMessage : "External ID message Strip is not visible in edit Mode",
		});
	},
	CheckExternalIDMessageStripisNotVisible : function()
	{
		return this.waitFor({
			controlType:"sap.m.Label",
			check: function(oLabel){
				if(oLabel.Length = 9)
					{
					 return true;
					}
				else{
					return false;
				}
			},
			 success : function()
			 {
				 ok(true,"External ID message Strip is not visible in view Mode");
			 },
			errorMessage : "External ID message Strip is visible in view Mode",
		});
	},
	ClickonBupaDetailsCancel : function()
	{
		return this.waitFor({
			id : "MyBusinessPartnerDetail--MyBupaEditCancel",
			success : function(oButton){
				oButton.firePress();
				ok(oButton,"Cancle button firePressed");
			},
			errorMessage : "Could not find Cancle button",
		});
	},
	EnterSomeValueInExternalIDField : function()
	{
		return this.waitFor({
			id :"MyBusinessPartnerDetail--sapSplBusinessPartnerExternalIdInput",
			success : function(oInput){
				oInput.setValue("HEllo World");
				ok(true,"External Id value Entered");
				
			},
			errorMessage : "ExternalID field not editable",
		});
	},
	ClickOnSaveButton : function()
	{
		return this.waitFor({
			id:"MyBusinessPartnerDetail--MyBuPaDetailsEditButton",
			success : function(oButton)
			{
				oButton.firePress();
				ok(true,"Save button firepressed");
			},
			errorMessage :"could not find save button",
		});
	}
	
});
