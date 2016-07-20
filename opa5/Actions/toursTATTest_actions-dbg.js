/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Actions.toursTATTest_actions");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");

new sap.ui.test.Opa5.extend("opa5.Actions.actions", {
	ClickonToursTile : function()
	{
	        return this.waitFor({
	            id : this.getContext().oUIAppsObject.manageTours.sId,
	            check : function (userTile) {
	                return userTile.getState() === "Loaded";
	            },
	            success : function (oTile) {
	                oTile.firePress();
	                ok(oTile, "Tours tile is loaded and fired press");
	            },
	            errorMessage : "The tours tile did not load"});
	},
	ClickonCompleteTours: function()
	{
		return this.waitFor({
			controlType:"sap.m.IconTabBar",
			success : function(oIconTabBar){
				 oIconTabBar[0].setSelectedItem(oIconTabBar[0].getItems()[4]);
	                ok(true,"Complete Tours IconTab Filter Pressed");
			},
			errorMessage :"Complted Tour IconTAb Filter did not load",
		});
	},
	ClickOnCompletedTour:function()
	{
		return this.waitFor({
			controlType :"sap.m.ColumnListItem",
			success : function(oColumnListItem){
				oColumnListItem[2].firePress();
				ok(true,"Completed Tour Selected");
			}
		});
	},
	ClickOnBack : function()
	{
		return this.waitFor({
			controlType : "sap.m.Button",
			success : function(oButton){
	
				for(var i = 0;i<oButton.length;i++)
					{
						if(oButton[i].getIcon() === "sap-icon://nav-back" && oButton[i].sId != "ToursOverview--sapSplBackNavigationButton")
							{
								oButton[i].firePress();
								oButton[i].$().trigger("tap");
							}
					}
				ok(true,"Back Button fire Pressed");
			}
		});
	},
	ClickOnActiveTours : function()
	{
		return this.waitFor({
			controlType:"sap.m.IconTabBar",
			success : function(oIconTabBar){
				 oIconTabBar[0].setSelectedItem(oIconTabBar[0].getItems()[3]);
//					 oIconTabBar[0].fireSelect({selected:true});
				 
	                ok(true,"Active Tours IconTab Filter Pressed");
			},
			errorMessage :"Active Tour IconTAb Filter did not load",
		});
	},
	ClickOnActiveTourListItem:function()
	{
		return this.waitFor({
			controlType :"sap.m.ColumnListItem",
			success : function(oColumnListItem){
				oColumnListItem[0].firePress();
				
				ok(true,"Active Tour Selected");
			}
		});
	},

});