/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
new sap.ui.test.Opa5.extend(
		"opa5.Actions.actions_tours",
		{

			iclickonToursTile : function() {
				return this.waitFor({
					id : this.getContext().oUIAppsObject.manageTours.sId,
					check : function(userTile) {
						return userTile.getState() === "Loaded";
					},
					success : function(oTile) {
						oTile.firePress();
						ok(oTile, "Tours tile is loaded and fired press"
								+ oTile);
					},
					errorMessage : "The Tours tile did not load",
				});
			},

			iclickonCreateNewTours : function() {
				return this.waitFor({
					controlType : "sap.m.Button",
					success : function(oButton) {
						oButton[3].firePress();
						ok(oButton, "Clicked on the 'Create New Tours' button"
								+ oButton[3]);
					},
					errorMessage : "Did not click on the 'Create New Button'",
				});
			},

			iclickonAddFreightItemsLink : function() {
				return this
						.waitFor({
							id : "CreateNewTour--sapSplAddFreightItemLink",
							success : function(oLink) {
								oLink.firePress();
								ok(oLink,
										"Clicked on the 'Add freight items' link"
												+ oLink);
							},
							errorMessage : "Did not click on the 'Add freight items' link",
						});
			},

			iEnterValues : function() {
				return this.waitFor({
					controlType : "sap.m.Dialog",
					success : function(oDialog) {
								oDialog[0].getContent()[0].getContent()[0]
										.getContent()[0].getContent()[3]
										.setValue("1234"), oDialog[0]
										.getContent()[0].getContent()[0]
										.getContent()[0].getContent()[5]
										.setValue("Heavy goods"),
								container_code = "1234";
						container_type = "Heavy goods";
						ok(true, "Freight item details entered");
					},
					errorMessage : "Did not enter freight item values",
				});
			},

			iClickOnOkButton : function() {
				return this.waitFor({
					controlType : "sap.m.Button",
					success : function(oButton) {
						oButton[0].firePress();
						ok(oButton, "Clicked on the Ok button" + oButton[0]);
					},
					errorMessage : "Did not click on the Ok button",
				});
			},

			iClickOnStopInputField : function() {
				return this.waitFor({
					id : "CreateNewTour--AddStopsLayout",
					check : function(oLayout) {
						return oLayout.getContent()[index].getContent()[0]
								.getContent()[1].getContent()[0];
					},
					success : function(oLayout) {
						oLayout.getContent()[index].getContent()[0]
								.getContent()[1].getContent()[0]
								.fireValueHelpRequest();
						ok(oLayout, "Clicked on stop input field"
								+ oLayout.getContent()[index].getContent()[0]
										.getContent()[1].getContent()[0]);
					},
					errorMessage : "Did not click on stop input field",
				});
			},

			iClickOnCTButton : function() {
				return this
						.waitFor({
							controlType : "sap.m.Button",
							check : function(oButton) {
								return oButton[1].getText() === "Container Terminals"
							},
							success : function(oButton) {
								oButton[1].firePress();
								ok(oButton,
										"Clicked on the container terminal button button"
												+ oButton[3]);
							},
							errorMessage : "Did not click on the container terminal button",
						});
			},

			iClickOnTableRow : function() {
				var row_count = 0;
				return this
						.waitFor({
							controlType : "sap.m.Dialog",
							check : function(oDialog) {
								return oDialog[0].getContent()[0].getContent()[1]
										.getRows()[0].getBindingContext() !== undefined;
							},
							success : function(oDialog) {
								row_count = oDialog[0].getContent()[0]
										.getContent()[1].getRows().length;
								oDialog[0].getContent()[0].getContent()[1]
										.setSelectedIndex(Math.ceil(Math
												.random()
												* row_count));
								ok(true, "Stop Selected" + oDialog);
							},
							errorMessage : "Did not select a stop"
						});
			},

			iclickOnAssignFreightItem : function() {
				return this
						.waitFor({
							id : "CreateNewTour--AddStopsLayout",
							check : function(oLayout) {
								return oLayout.getContent()[index].getContent()[3]
										.getContent()[0].getText() === "Assign freight item";
							},
							success : function(oLayout) {
								oLayout.getContent()[index].getContent()[3]
										.getContent()[0].firePress();
								ok(oLayout,
										"Clicked on the 'Assign Freight Items' link"
												+ oLayout.getContent()[index]
														.getContent()[3]
														.getContent()[0]);
							},
							errorMessage : "Did not click on the 'Assign Freight Items' link",
						});
			},

			iClickOnPickUp : function() {
				return this.waitFor({
					controlType : "sap.m.Button",
					success : function(oButton) {
						oButton[1].firePress();
						ok(oButton, "Clicked on the 'Pick Up' button"
								+ oButton[1]);
					},
					errorMessage : "Did not click on the 'Pick Up' button",
				});
			},

			iClickOnDrop : function() {
				return this.waitFor({
					controlType : "sap.m.Button",
					success : function(oButton) {
						oButton[2].firePress();
						ok(oButton, "Clicked on the 'Pick Up' button"
								+ oButton[2]);
					},
					errorMessage : "Did not click on the 'Pick Up' button",
				});
			},

			iEnterOrderIdAndDestination : function() {
				return this
						.waitFor({
							controlType : "sap.m.Dialog",
							success : function(oDialog) {
								oDialog[0].getContent()[0].getContent()[0]
										.getItems()[0].getCells()[6]
										.setValue("ORD-ID-41"
												+ Math.ceil(Math.random() * 50));
								oDialog[0].getContent()[0].getContent()[0]
										.getItems()[0].getCells()[7]
										.setValue("LOADSTN-C61N"
												+ Math.ceil(Math.random() * 50));
								ok(true,
										"Entered Order Id and Destination description");
							},
							errorMessage : "Did not enter Order Id and Destination description",
						});
			},

			iClickOnCloseButton : function() {
				return this
						.waitFor({
							controlType : "sap.m.Button",
							success : function(oButton) {
								oButton[3].firePress();
								ok(oButton, "Clicked on the Close button"
										+ oButton[3]);
							},
							errorMessage : "Did not click on the Close button",
						});
			},

			iClickOnSaveForLaterButton : function() {
				return this
						.waitFor({
							controlType : "sap.m.Button",
							success : function(oButton) {
								oButton[17].firePress();
								ok(oButton,
										"Clicked on the 'Save For Later' button"
												+ oButton[17]);
							},
							errorMessage : "Did not click on the 'Save For Later' button",
						});
			},
		});