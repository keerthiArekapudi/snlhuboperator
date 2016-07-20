/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Actions.actions_trucks");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");

new sap.ui.test.Opa5.extend("opa5.Actions.actions", {

	ClickTrucksTile : function(){
	        return this.waitFor({
	            id : this.getContext().oUIAppsObject.vehicles.sId,
	            check : function (userTile) {
	                return userTile.getState() === "Loaded";
	            },
	            success : function (oTile) {
	                oTile.firePress();
	                ok(oTile, "Tours tile is loaded and fired press");
	            },
	            errorMessage : "The tours tile did not load"});
	},
	AddNewTruck_focusCheck: function(){
		return this.waitFor({
			controlType:"sap.m.Button",
			success: function(oButton)
			{
				oButton[4].firePress();
				ok(true,"Add trucks button Fired press");
			},
			errorMessage : "couldn't find the button",
		});

	},
	ApplyFilters : function()
	{
		return this.waitFor({
			controlType:"sap.m.Button",
			success: function(oButton)
			{
				oButton[3].firePress();
				ok(true,"Filter button Fired press");
			},
			errorMessage : "couldn't find the button",
		});
		
	},
	chooseFilter : function()
	{
		return this.waitFor({
			controlType:"sap.m.StandardListItem",
			success: function(oListItem)
			{
			
				oListItem[3].firePress();
				ok(true,"Filter Choosen");
			},
			errorMessage : "couldn't find the listItem",
		});
		
	},
	confirmFilter : function()
	{
		return this.waitFor({
			controlType:"sap.m.Button",
			success: function(oButton)
			{
				
				oButton[1].firePress();
				ok(true,"Filter Choosen");
			},
			errorMessage : "couldn't find the listItem",
		});
		
	},
	ApplyGrouping : function()
	{
		return this.waitFor({
			controlType:"sap.m.Button",
			success: function(oButton)
			{
				
				for(var i =0; i<oButton.length;i++)
					{
						if(oButton[i].sId === "MyVehiclesMaster--sapSplGroupVehiclesButton")
							{
								
								oButton[i].firePress();
								ok(true,"Group By button Fired press");
							}
					}
				
				
			},
			errorMessage : "couldn't find the button",
		});
		
	},
	choosegroup : function()
	{
		return this.waitFor({
			controlType:"sap.m.RadioButton",
			success: function(oRadiaoButton)
			{
				oRadiaoButton[0].fireSelect();
				oRadiaoButton[0].$().trigger("tap");
				ok(true,"Group chosen");
			},
			errorMessage : "couldn't find the button",
		});
	},
	EditTruckFocusTest : function()
	{
		return this.waitFor({
			controlType : "sap.m.Button",
			success: function(oButton)
			{
				
				oButton[5].firePress();
				ok(true,"Edit button fireed press");
			},
			errorMessage : "couldn't find the button",
		});
	},
	ClickEditCancle : function()
	{
		return this.waitFor({
			id:"MyVehiclesDetailAddVehicle--addVehicleCancel",
			success: function(oButton)
			{
				oButton.firePress();
				ok(true,"Cancle button fireed press");
			},
			errorMessage : "couldn't find the button",
		});
	},
	ClickAddTruckCancle : function()
	{
		return this.waitFor({
			controlType:"sap.m.Button", 
			success: function(oButton)
			{
				for(var i =0; i<oButton.length;i++)
				{
					if(oButton[i].sId === "CancelMyVehiclesDetailAddVehicle--addVehicleCancel")
						{
							oButton[i].firePress();
							ok(true,"Group By button Fired press");
						}
				}
			
			},
			errorMessage : "couldn't find the button",
		});
	}
	
});



