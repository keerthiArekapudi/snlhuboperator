/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Actions.profile_initialFocus_actions");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");

new sap.ui.test.Opa5.extend("opa5.Actions.actions", {
	
	   iClickOnUsersTile : function () {
	        return this.waitFor({
	            id : this.getContext().oUIAppsObject.myUsers.sId,
	            check : function (userTile) {
	                return userTile.getState() === "Loaded";
	            },
	            success : function (oTile) {
	                oTile.firePress();
	                ok(oTile, "Users tile is loaded and fired press");
	            },
	            errorMessage : "The users tile did not load",
	        });
	    },
	    
	    iClickOnAddUsersButton : function() {
	        return this.waitFor({
	            id : "MyContactsMaster--sapSplAddBusinessPartnerUserButton",
	            controltype : "sap.m.Button",
	            success : function(oButton) {
	                oButton.firePress();
	                ok(true,"clicked add button");
	            },
	            errorMessage : "did not find add users button"
	        });
	    },
	    
	    iSelectUserType : function(){
			return this.waitFor({
				controlType : "sap.m.Popover",
				success : function(oPopover){
					oPopover[0].getContent()[0].getButtons()[0].firePress();
					ok(true,"User type selected!");
				},
				errorMessage : "User Type options not found!"
			});
		},
	    
	    iClickOnCancelButton : function() {
	        return this.waitFor({
	            id : "NewContactRegistrationDetail--newContactCancel",
	            controltype : "sap.m.Button",
	            success : function(oButton) {
	                oButton.firePress();
	                ok(true,"clicked cancel button");
	            },
	            errorMessage : "did not find cancel button"
	        });
	    },
	    
	    iClickOnEditUsersButton : function() {
	        return this.waitFor({
	            id : "MyContactDetails--MyContactDetailsEditButton",
	            controltype : "sap.m.Button",
	            success : function(oButton) {
	                oButton.firePress();
	                ok(true,"clicked edit button");
	            },
	            errorMessage : "did not find edit button"
	        });
	    }
});