/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("OPA5TestScript.Assertions.assertions_tours");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");

new sap.ui.test.Opa5.extend(
		"opa5.Assertions.assertions_tours",
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

			iSeeToursPage : function() {
				return this
						.waitFor({
							id : "splView.managetours.ManageToursContainer--sapSplManageToursAppContainer",
							check : function(oPage) {
								return oPage;
							},
							success : function(oPage) {
								ok(true, "Tours status page is loaded" + oPage);
							},
							errorMessage : "Tours page is not loaded"
						});
			},

			iSeeCreateNewToursPage : function() {
				return this
						.waitFor({
							id : "splView.managetours.ManageToursContainer--sapSplManageToursAppContainer",
							success : function(oPage) {
								ok(true, "Tours status page is loaded" + oPage);
							},
							errorMessage : "Tours page is not loaded"
						});
			},

			FreightItemsAdded : function() {
				return this
						.waitFor({
							id : "CreateNewTour--SapSplAddFreightItemsTable",
							check : function(oTable) {
								return ((oTable.getItems()[0].getCells()[0]
										.getText() === container_code) && (oTable
										.getItems()[0].getCells()[2].getText() === container_type))
							},
							success : function(oTable) {
								ok(true, "Freight items added successfully"
										+ oTable);
							},
							errorMessage : "Freight items not added"
						});
			},

			iSeeSelectStopDialog : function() {
				return this
						.waitFor({
							controlType : "sap.m.Dialog",
							success : function(oDialog) {
								ok(true, "Dialog for select stop is visible"
										+ oDialog);
							},
							errorMessage : "Dialog for select stop is not visible",
						});
			},

			PartnerFieldIsVisible : function() {
				return this.waitFor({
					id : "CreateNewTour--AddStopsLayout",
					check : function(oLayout) {
						return oLayout.getContent()[0].getContent()[1]
								.getContent()[0].getText() === "Partner:";
					},
					success : function(oLayout) {
						ok(oLayout, "Partner field is visible"
								+ oLayout.getContent()[0].getContent()[1]
										.getContent()[0]);
					},
					errorMessage : "Partner field is not visible",
				});
			},

			TwoFieldsAreVisible : function() {
				return this
						.waitFor({
							controlType : "sap.m.Dialog",
							check : function(oDialog) {
								return ((oDialog[0].getContent()[0]
										.getContent()[0].getItems()[0]
										.getCells()[6].getPlaceholder() === "Enter Order ID") && (oDialog[0]
										.getContent()[0].getContent()[0]
										.getItems()[0].getCells()[7]
										.getPlaceholder() === "Enter destination details"))
							},
							success : function(oDialog) {
								ok(true,
										"Fields for Order ID and destination Description are visible");
							},
							errorMessage : "Fields for Order ID and destination Description are not visible",
						});
			},

			iSeeAssignedFreightItemsInTable : function() {
				return this
						.waitFor({
							id : "CreateNewTour--AddStopsLayout",
							check : function(oLayout) {
								return oLayout.getContent()[0].getContent()[2]
										.getContent()[0].getItems()[0]
										.getCells()[0].getText() === "1234";
							},
							success : function(oLayout) {
								ok(oLayout,
										"The assigned freight items are visible in the freight items table");
							},
							errorMessage : "The assigned freight items are not visible in the freight items table",
						});
			},
		});