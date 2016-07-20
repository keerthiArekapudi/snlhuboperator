/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Actions.InitialFocusForIncidents_actions");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");

new sap.ui.test.Opa5.extend("opa5.Actions.actions", {

	iClickOnIncidentsTile : function() {
		return this.waitFor({
			id : this.getContext().oUIAppsObject.incidences.sId,
			check : function (incidentsTile) {
				return incidentsTile.getState() === "Loaded";
			},
			success : function (oTile) {
				oTile.firePress();
				ok(oTile, "Incidents tile is loaded and press is fired");
			},
			errorMessage : "Incidents tile did not load",
		});
	},

	iClickOnAddIncidentButton : function()
	{
		return this.waitFor({
			id : "IncidentsMasters--SapSplAddIncidentButton",
			success : function(oButton) {
				oButton.firePress();
				ok(true,"Add Incident button Clicked");
			},
			errorMessage : "Add button not found"
		});
	},

	iClickOnCancelButton : function() {
		return this.waitFor({
			id : "IncidentsDetails--SapSplIncidentsFooterCancel",
			controltype : "sap.m.Button",
			success : function(oButton) {
				oButton.firePress();
				ok(true,"Cancel button Clicked");
			},
			errorMessage : "did not find cancel button"
		});
	},

	iClickOnEditIncidentButton : function() {
		return this.waitFor({
			id :"IncidentsDetails--SapSplIncidentsFooterEdit",
			controltype : "sap.m.Button",
			success : function(oButton) {
				oButton.firePress();
				ok(true,"Edit Incident button clicked!");
			},
			errorMessage : "Couldn't find edit button!"
		});
	},

	iClickOnSortButton : function() {
		return this.waitFor({
			controlType :"sap.m.Button",
			success : function(oButton){
				oButton[1].firePress();
				ok(true,"Sort button clicked!");
			},
			errorMessage : "Couldn't find sort button!"
		});
	},

	iSortIncidents : function(){
		return this.waitFor({
			controlType : "sap.m.Popover",
			success : function(oPopover){
				oPopover[0].getContent()[0].getContent()[2].setSelected(true);
				oPopover[0].getContent()[0].getContent()[2].fireSelect({selected:true});
				ok(true,"Incidents Sorted!");
			},
			errorMessage : "Sort options not found!"
		});
	},

	iClickOnFilterButton : function() {
		return this.waitFor({
			controlType :"sap.m.Button",
			success : function(oButton){
				oButton[2].firePress();
			},
			errorMessage : "Couldn't find filter button!"
		});
	},

	iFilterIncidents : function() {
		return this.waitFor({
			controlType : "sap.m.Dialog",
			success : function(oDialog){
				oDialog[0].getContent()[0].getPages()[0].getContent()[1].getItems()[0].firePress();
				oDialog[0].getContent()[0].getPages()[1].getContent()[0].getItems()[0].setSelected(true);
				oDialog[0].getButtons()[0].firePress();
				ok(true,"Incidents filtered!");
			},
			errorMessage : "Couldn't find filter options!"
		});
	}

});