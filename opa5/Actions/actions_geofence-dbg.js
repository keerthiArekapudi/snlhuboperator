/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
new sap.ui.test.Opa5.extend(
		"opa5.Actions.actions_geofence",
		{

			iclickonTrafficStatusTile : function() {
				return this.waitFor({
					id : this.getContext().oUIAppsObject.liveApp.sId,
					check : function(userTile) {
						return userTile.getState() === "Loaded";
					},
					success : function(oTile) {
						oTile.firePress();
						ok(oTile,
								"Traffic Status tile is loaded and fired press"
										+ oTile);
					},
					errorMessage : "The Traffic Status tile did not load",
				});
			},

			iClickOnEntitiesButton : function() {
				return this.waitFor({
					controlType : "sap.m.Button",
					success : function(oButton) {
						oButton[1].firePress();
						ok(oButton, "Clicked on Entities button" + oButton[1]);
					},
					errorMessage : "Could not find entities button",
				});
			},

			iClickOnGeofenceIcon : function() {
				return this
						.waitFor({
							controlType : "sap.m.IconTabBar",
							success : function(oIconTabBar) {
								oIconTabBar[0].setSelectedItem(oIconTabBar[0]
										.getItems()[0]);
								ok(oIconTabBar,
										"Clicked on the geofence icon in the icon tab bar"
												+ oIconTabBar[0].getItems()[0]);
							},
							errorMessage : "Did not click on the geofence icon in the icon tab bar"
						});
			},

			iClickOnGroupbyButton : function() {
				return this
						.waitFor({
							controlType : "sap.m.Button",
							success : function(oButton) {
								oButton[12].firePress();
								ok(oButton, "Clicked on group by button"
										+ oButton[12]);
							},
							errorMessage : "Could not find group by button",
						});
			},

			iClickOnCompany : function() {
				return this.waitFor({
					controlType : "sap.m.List",
					success : function(oList) {
						oList[1].getItems()[1].$().trigger("tap");
						ok(oList, "Clicked on company radio button"
								+ oList[1].getItems()[1]);
					},
					errorMessage : "Did not click on company radio button",
				});
			},

			iClickOnOKButton : function() {
				return this.waitFor({
					controlType : "sap.m.Button",
					success : function(oButton) {
						oButton[2].firePress();
						ok(oButton, "Clicked on OK button" + oButton[2]);
					},
					errorMessage : "Did not click on OK button",
				});
			},

			iSeeGeofencelist : function() {
				return this.waitFor({
					controlType : "sap.m.List",
					check : function(olist) {
						return olist[2].getItems();
					},
					success : function(oList) {
						ok(oList, "I see the list for geofence" + oList[2]);
					},
					errorMessage : "Did not load the list for geofence",
				});
			},

			iClickOnSharing : function() {
				return this.waitFor({
					controlType : "sap.m.List",
					success : function(oList) {
						oList[1].getItems()[0].$().trigger("tap");
						ok(oList, "Clicked on sharing radio button"
								+ oList[1].getItems()[0]);
					},
					errorMessage : "Did not click on sharing radio button",
				});
			},

			iClickOnFilterbyButton : function() {
				return this
						.waitFor({
							controlType : "sap.m.Button",
							success : function(oButton) {
								oButton[13].firePress();
								ok(oButton, "Clicked on filter by button"
										+ oButton[13]);
							},
							errorMessage : "Could not find filter by button",
						});
			},

			iClickOnFilterIcon : function() {
				return this.waitFor({
					controlType : "sap.ui.core.Icon",
					success : function(oIcon) {
						oIcon[0].$().trigger("tap");
						ok(oIcon, "Clicked on filter icon" + oIcon[0]);
					},
					errorMessage : "Did not click on filter icon",
				});
			},

			iClickOnType : function() {
				return this.waitFor({
					controlType : "sap.m.List",
					success : function(oList) {
						oList[0].getItems()[0].$().trigger("tap");
						ok(oList, "Clicked on type list item"
								+ oList[0].getItems()[0]);
					},
					errorMessage : "Did not click on type list item",
				});
			},

			iClickOnGeofence : function() {
				return this.waitFor({
					controlType : "sap.m.List",
					success : function(oList) {
						oList[0].getItems()[0].$().trigger("tap");
						ok(oList, "Clicked on geofence radio button"
								+ oList[0].getItems()[0]);
					},
					errorMessage : "Did not click on geofence radio button",
				});
			},

			iClickOnRadar : function() {
				return this.waitFor({
					controlType : "sap.m.List",
					success : function(oList) {
						oList[0].getItems()[1].$().trigger("tap");
						ok(oList, "Clicked on radar radio button"
								+ oList[0].getItems()[1]);
					},
					errorMessage : "Did not click on radar radio button",
				});
			},

		});