/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
new sap.ui.test.Opa5.extend(
		"opa5.Actions.actions_webcam",
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

			iClickOnParkingspaceIcon : function() {
				return this
						.waitFor({
							controlType : "sap.m.IconTabBar",
							success : function(oIconTabBar) {
								oIconTabBar[0].setSelectedItem(oIconTabBar[0]
										.getItems()[2]);
								ok(oIconTabBar,
										"Clicked on the parking space icon in the icon tab bar"
												+ oIconTabBar[0].getItems()[2]);
							},
							errorMessage : "Did not click on the parking space icon in the icon tab bar"
						});
			},

			iClickOnBridgeIcon : function() {
				return this
						.waitFor({
							controlType : "sap.m.IconTabBar",
							success : function(oIconTabBar) {
								oIconTabBar[0].setSelectedItem(oIconTabBar[0]
										.getItems()[4]);
								ok(oIconTabBar,
										"Clicked on the bridge icon in the icon tab bar"
												+ oIconTabBar[0].getItems()[4]);
							},
							errorMessage : "Did not click on the bridge icon in the icon tab bar"
						});
			},

			iClickOnCTIcon : function() {
				return this
						.waitFor({
							controlType : "sap.m.IconTabBar",
							success : function(oIconTabBar) {
								oIconTabBar[0].setSelectedItem(oIconTabBar[0]
										.getItems()[6]);
								ok(oIconTabBar,
										"Clicked on the container terminal in the icon tab bar"
												+ oIconTabBar[0].getItems()[6]);
							},
							errorMessage : "Did not click on the container terminal icon in the icon tab bar"
						});
			},

			iClickOnContainerdepotIcon : function() {
				return this
						.waitFor({
							controlType : "sap.m.IconTabBar",
							success : function(oIconTabBar) {
								oIconTabBar[0].setSelectedItem(oIconTabBar[0]
										.getItems()[8]);
								ok(oIconTabBar,
										"Clicked on the container depot icon in the icon tab bar"
												+ oIconTabBar[0].getItems()[8]);
							},
							errorMessage : "Did not click on the container depot icon in the icon tab bar"
						});
			},

			iSelectAnEntity : function() {
				return this.waitFor({
					controlType : "sap.m.List",
					check : function(olist) {
						return olist[2].getItems()[1]
					},
					success : function(oList) {
						oList[2].getItems()[1].$().children().children()
								.trigger("tap");
						ok(oList, "Entity Selected" + oList[2].getItems()[1]);
					},
					errorMessage : "Entity not selected"
				});
			},

			iSeeWebCamURLDetails : function() {
				return this
						.waitFor({
							controlType : "sap.m.Label",
							check : function(oLabel) {
								return oLabel[webcam_label_index].getText() === "WEBCAM_URL_LABEL";
							},
							success : function(oLabel) {
								webcamlink_id = oLabel[webcam_label_index].__sLabeledControl;
								ok(true, "Found the Webcam URL label"
										+ oLabel[webcam_label_index]);
							},
							errorMessage : "Didn't find the Webcam URL label"
						});
			},

		});