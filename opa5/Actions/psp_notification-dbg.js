/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Actions.psp_notification");
jQuery.sap.require("sap.ui.test.Opa5");

new sap.ui.test.Opa5.extend("opa5.Actions.actions", {

	iClickNotificationTile: function() {
		return this.waitFor({
			id: this.getContext().oUIAppsObject.userNotification.sId,
			check: function(userNotificationTile) {
				return userNotificationTile.getState() === "Loaded";
			},
			success: function(oTile) {
				oTile.firePress();
				ok(oTile, "userNotification tile is loaded and fired press");
			},
			errorMessage: "The userNotification tile did not load",
		});
	},

	iClickAddNotification: function() {
		return this.waitFor({
			//	id:"SapSplAddNotificationsButton",
			//	viewName : "splView.adminConsole.MaintenanceNotifierMaster",
			id: "MaintenanceNotifierMaster--SapSplAddNotificationsButton",
			success: function(oButton) {
				oButton.firePress();
				ok(true, "Add notifications button pressed");
			},
			errorMessage: "Button Not found"
		});
	},

	iEnterMessage: function() {
		return this.waitFor({
//			id:"SapSplAddNotificationMessage",
//			viewName : "splView.adminConsole.MaintenanceNotifierAddNotificationDetail",
			controlType:"sap.m.TextArea",
			success:function(aTextArea){
				aTextArea[0].setValue("DB Upgrade");
				ok(true, "Message entered");
			},
			errorMessage: "Message field not found"
		});
	},
	
	iSelectType: function(){
		return this.waitFor({
			//controlType:"sap.m.Select",
			id:"MaintenanceNotifierAddNotificationDetail--sapSplAddNotificationType",
			success:function(oSelect){
				oSelect.setSelectedItem(oSelect.getItems()[2]);
				oSelect.fireChange({
                    selectedItem: oSelect.getItems()[2]
                });
				 ok(true, "Message type selected");
			},
			errorMessage:"Select control not found"
		});
	},
	
	iEnterDates: function(){
		return this.waitFor({
			controlType:"sap.m.DatePicker",
			success:function(aDate1){
				var d = aDate1[0].getDateValue();
				d.setDate( d.getDate() + 2 );
				//aDate1[0].setDateValue(d);
				aDate1[1].setDateValue(d);
				ok(true, "Date entered");
			},
			errorMessage: "Date Fields not found"
			
		});
	},
	
	iEnterTime: function(){
		return this.waitFor({
			controlType:"sap.m.DateTimeInput",
			success:function(aTimeInput){
				var d=aTimeInput[0].getDateValue();
				aTimeInput[0].setDateValue(new Date());
				d.setHours(d.getHours()+1);
				aTimeInput[1].setDateValue(d);
				ok(true, "Time entered");
			},
			errorMessage: "Time field not found"
		});
	},
	
	iClickSave: function(){
		return this.waitFor({
			//id:"MaintenanceNotifierAddNotificationDetail--sapSplAddNotificationSave",
			controlType:"sap.m.Button",
			success:function(oButton){
				oButton[4].firePress();
			},
			errorMessage: "Save button not found"
		});
	},

	iSeeFocus: function(sId) {
		return this.waitFor({
			id: sId,
			check: function(oInput) {
				return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId() === sId;
			},
			success: function(oInput) {
				ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId() === sId, "Focus is on the right input element" + sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
			},
			errorMessage: "Focus on the wrong input " + sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
		});
	},
	
	iClickGroupBy: function(){
		return this.waitFor({
		//	id:"MaintenanceNotifierMaster--SapSplGroupNotificationsButton",
			controlType:"sap.m.Button",
			success: function(oButton){
				oButton[1].firePress();
				ok(true, "Group By button selected");
			},
			errorMessage: "GroupBy Button not present"
		});
	},
	
	GroupByNone: function(){
		return this.waitFor({
			id: "none",
			success: function(oRadioBut){
				oRadioBut.setSelected(true);
				ok(true, "Group By none selected");
			},
			errorMessage: "None Option not found"
		});
	},
	
	iClickFilterBy: function(){
		return this.waitFor({
			controlType:"sap.m.Button",
			success: function(oButton){
				oButton[2].firePress();
				ok(true, "Group By button selected");
			},
			errorMessage: "GroupBy Button not present"
		});
	},
	
	iClickOk: function(){
        return this.waitFor({
            controlType: "sap.m.Button",
            matchers : new sap.ui.test.matchers.PropertyStrictEquals({
                name : "text",
                value : "Ok"
            }),
            success : function (oButtons) {
                oButtons[0].$().trigger("tap");
                ok(true, "Go button pressed");
            },
            errorMessage: "Button not found"
        });
        },
        
        iClickEditNotification: function(){
        	return this.waitFor({
        		id:"MaintenanceNotifierDetail--sapSplMaintenanceNotifierDetailEdit",
        		success: function(oButton){
        			oButton.firePress();
        			ok(true, "Edit button clicked!");
        		},
        		errorMessage: "Button not find"
        	});
        },
        iClickCancel: function(){
        	return this.waitFor({
        		id: "MaintenanceNotifierAddNotificationDetail--sapSplAddNotificationCancel",
        		success:function(oButton){
        			oButton.firePress();
        			ok(true, "Cancel Button Clicked");
        		},
        		errorMessage: "Cancel Button not found"
        	});
        }
});
