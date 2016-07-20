/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("OPA5TestScript.Assertions.assertions_geofence");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");

new sap.ui.test.Opa5.extend(
		"opa5.Assertions.assertions_geofence",
		{

			iShouldSeeTiles : function() {
				return this
						.waitFor({
							id : "masterTileContainerPage",
							viewName : "splView.tileContainer.MasterTileContainer",
							check : function() {
								return this.getContext().oAppsPage
										&& this.getContext().oAppsPage
												.getContent().length > 0;
							},
							success : function(oPage) {
								this.getContext().oShell = oPage.getParent()
										.getParent().getParent().getParent();
								var aPageTiles = this.getContext().oAppsPage
										.getContent();
								var oObject = {};
								for (var i = 0; i < aPageTiles.length; i++) {
									oObject[aPageTiles[i].getBindingContext()
											.getProperty().AppID] = aPageTiles[i];
								}

								this.getContext().oUIAppsObject = oObject;
								console.log(oObject);

								ok(oPage, "Found the apps tiles : "
										+ this.getContext().oAppsPage
												.getContent().length + " tiles");
							},
							errorMessage : "The apps tiles did not contain entries",
						});
			},

			iSeeTrafficStatusPage : function() {
				return this
						.waitFor({
							id : "splView.liveApp.liveApp--sapSplTrafficStatusMapContainer",
							success : function() {
								ok(true, "Traffic status page is loaded");
							},
							errorMessage : "Traffic status page is not loaded",
						});
			},

			iSeeAllEntities : function() {
				return this
						.waitFor({
							controlType : "sap.m.IconTabBar",
							check : function(oIconTabBar) {
								return oIconTabBar[0];
							},
							success : function(oIconTabbar) {
								ok(true, "I see all the entities"
										+ oIconTabbar[0]);
							},
							errorMessage : "Did not load the icon tab bar for entities",
						});
			},

			iSeeGeofenceList : function() {
				return this.waitFor({
					controlType : "sap.m.List",
					check : function(olist) {
						return olist[1].getItems();
					},
					success : function(oList) {
						ok(oList, "I see the list for geofence" + oList[1]);
					},
					errorMessage : "Did not load the list for geofence",
				});
			},

			iSeeDialogForGroupby : function() {
				return this
						.waitFor({
							controlType : "sap.m.Dialog",
							check : function(oDialog) {
								return oDialog[0];
							},
							success : function(oDialog) {
								ok(oDialog, "Dialog for group by appeared"
										+ oDialog[0]);
							},
							errorMessage : "Did not load the dialog for group by",
						});
			},

			iCheckGroupbyCompany : function() {
				var success_flag = 0;
				return this
						.waitFor({
							controlType : "sap.m.List",
							check : function(oList) {
								for (var i = 0; i < oList[2].getItems().length; i++) {
									if (oList[2].getItems()[i].getTitle() === "My Company Geofences") {
										success_flag = 1;
										break;
									} else if (oList[2].getItems()[i]
											.getTitle() === "Container Terminal") {
										success_flag = 1;
										break;
									} else if (oList[2].getItems()[i]
											.getTitle() === "Hub Operator") {
										success_flag = 1;
										break;
									}
								}
								if (success_flag == 1) {
									return oList[2].getItems()[i];
								} else {
									return false;
								}
							},
							success : function(oList) {
								ok(oList, "Geofences are grouped by company");
							},
							errorMessage : "Geofences are not grouped by company",
						});
			},

			iCheckGroupbySharing : function() {
				var success_flag = 0;
				return this
						.waitFor({
							controlType : "sap.m.List",
							check : function(oList) {
								for (var i = 0; i < oList[2].getItems().length; i++) {
									if (oList[2].getItems()[i].getTitle() === "Private Geofences") {
										success_flag = 1;
										break;
									} else if (oList[2].getItems()[i]
											.getTitle() === "Shared Geofences") {
										success_flag = 1;
										break;
									} else if (oList[2].getItems()[i]
											.getTitle() === "Public Geofences") {
										success_flag = 1;
										break;
									}
								}
								if (success_flag == 1) {
									return oList[2].getItems()[i];
								} else {
									return false;
								}
							},
							success : function(oList) {
								ok(oList, "Geofences are grouped by sharing");
							},
							errorMessage : "Geofences are not grouped by sharing",
						});
			},

			iSeeDialogForFilterby : function() {
				return this.waitFor({
					controlType : "sap.m.Dialog",
					check : function(oDialog) {
						return oDialog[0];
					},
					success : function(oDialog) {
						ok(oDialog, "Dialog for filter by appeared"
								+ oDialog[0]);
					},
					errorMessage : "Did not load the dialog for filter by",
				});
			},

			iSeeDialogForGroupbyType : function() {
				return this
						.waitFor({
							controlType : "sap.m.Label",
							check : function(oLabel) {
								return oLabel[0].getText() === "Filter By: Type";
							},
							success : function(oLabel) {
								ok(oLabel,
										"Dialog for 'group by: Type' appeared"
												+ oLabel[0]);
							},
							errorMessage : "Did not load the dialog for 'group by: Type'",
						});
			},

			iCheckFilterbyGeofences : function() {
				return this.waitFor({
					controlType : "sap.m.Label",
					check : function(oLabel) {
						return oLabel[6].getText() == "Filter by Geofence";
					},
					success : function(oLabel) {
						ok(oLabel, "The list items are filtered by geofence"
								+ oLabel[6]);
					},
					errorMessage : "Did not filter the list items by geofence",
				});
			},

			iCheckFilterbyRadar : function() {
				return this.waitFor({
					controlType : "sap.m.Label",
					check : function(oLabel) {
						return oLabel[6].getText() == "Filter by Radar";
					},
					success : function(oLabel) {
						ok(oLabel, "The list items are filtered by radar"
								+ oLabel[6]);
					},
					errorMessage : "Did not filter the list items by radar",
				});
			},

		});