/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui
		.controller (
				"splController.managetours.ManageToursContainer",
				{
					/**
					 * Called when a controller is instantiated and its View controls (if available) are already created.
					 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
					 */
					onInit : function ( ) {

						this.oToursAppContainer = this.getView ( ).byId ( "sapSplManageToursAppContainer" );

						/* To instantiate all the required views */
						this.instantiatePages ( );

						/* To set the initial view of the Tours Container. */
						this.setInitialState ( );

						/* Localization */
						this.fnDefineControlLabelsFromLocalizationBundle ( );

						this.getView ( ).addEventDelegate ( {
							onAfterShow : function ( oEvent ) {
								/*
								 * HOTFIX: Fix for crash when navigating from
								 * Traffic Status to Tours
								 */
								try{
									window.setTimeout(function(){
										/*
										 * *object check to ensure currentPage is a view. 
										 * Needed for LiveApp>View Tours>Back Button scenario
										 * */
										if(oEvent.srcControl.getCurrentPage().getContent()[0].getCurrentPage().constructor === sap.ui.core.mvc.XMLView){
											oEvent.srcControl.getCurrentPage().getContent()[0].getCurrentPage().getController().byId("sapSplTourOverviewSearchField").focus();
										}
									},1000);
								} catch ( e ){
									jQuery.sap.log.error ( "SAP SCL Tours Event", "Focus Error " + e.toString ( ), "SAPSPL" );
								}

							}
						} );

					},

					onAfterRendering : function ( ) {
						$ ( 'span[data-sap-ui*="ToursOverview--sapSplBackNavigationButton-img"]' ).attr ( "title", oSapSplUtils.getBundle ( ).getText ( "BACK_BUTTON_TOOLTIP" ) );
					},

					/**
					 * @description Method to handle localization of all the hard code texts in the view.
					 * @param void.
					 * @returns void.
					 * @since 1.0
					 */
					fnDefineControlLabelsFromLocalizationBundle : function ( ) {

					},

					onBeforeShow : function ( oEvent ) {
						var sVehicleRegNumber = null;

						this.oToursAppContainer.to ( "ToursOverview" );

						if ( oEvent.data && oEvent.data["FromApp"] === "liveApp" ) {
							sVehicleRegNumber = oEvent.data["VehicleUUID"];
						}

						this.oToursAppContainer.getPages ( )[0].getController ( ).fnHandleNavigationSearch ( sVehicleRegNumber );

						if ( this.oToursAppContainer.getCustomData ( )[0] ) {
							this.oToursAppContainer.getPages ( )[0].getController ( ).onBeforeShow ( );
						}
						this.setCurrentAppInfo ( oEvent );

					},

					setCurrentAppInfo : function ( oEvent ) {
						oSapSplHelpHandler
								.setAppHelpInfo (
										{
											iUrl : "./help/SCLTours.pdf",
											eUrl : "//help.sap.com/saphelp_scl10/helpdata/en/ef/cce153cafa9117e10000000a44176d/content.htm?frameset=/en/d4/dbe153cafa9117e10000000a44176d/frameset.htm&current_toc=/en/b7/8ee25341d61e4ee10000000a423f68/plain.htm&node_id=11&show_children=false"
										}, oEvent );
					},

					/**
					 * @description Method to instantiate all the required views which will be a part of the Manage Tours Tile
					 * Registering "onBeforeShow" events to all the instantiated views, to listen to navigation events
					 * To set the unified shell instance on all the instantiated views, which is a super parent of all these views
					 * Add the pages to the ToursAppContainer control.
					 * @param void.
					 * @returns void.
					 * @since 1.0
					 */
					instantiatePages : function ( ) {
						var ToursOverview = null;

						/* instantiate views */
						ToursOverview = sap.ui.view ( {
							id : "ToursOverview",
							viewName : "splView.managetours.ToursOverview",
							type : sap.ui.core.mvc.ViewType.XML
						} );

						/*
						 * Register "onBeforeShow" event handlers - to listen to
						 * navigation events.
						 */
						ToursOverview.addEventDelegate ( {
							onBeforeShow : jQuery.proxy ( ToursOverview.getController ( ).onBeforeShow, ToursOverview.getController ( ) )
						} );

						/* Set the unified shell instance on all the views */
						this.oToursAppContainer.addPage ( ToursOverview );
					},

					/**
					 * @description Method to set the initial page of the ManageToursContainer control.
					 * @param void.
					 * @returns void.
					 * @since 1.0
					 */
					setInitialState : function ( ) {

						this.getView ( ).byId ( "sapSplManageToursAppContainer" ).setInitialPage ( "ToursOverview" );

						if ( jQuery.sap.getUriParameters ( ).get ( "navToHome" ) && jQuery.sap.getUriParameters ( ).get ( "navToHome" ) === "true" ) {
							oSapSplUtils.showHeaderButton ( {
								showButton : true,
								sNavToPage : "splView.tileContainer.MasterTileContainer"
							} );
						}

					},

					/**
					 * @description Getter method to get the unified shell instance which is the super parent of this view.
					 * @param void.
					 * @returns this.unifiedShell the unified shell instance previously set to this view during instantiation.
					 * @since 1.0
					 */
					getUnifiedShellInstance : function ( ) {
						return this.unifiedShell;
					},

					/**
					 * @description Setter method to set the unified shell instance which is the super parent of this view.
					 * @param void.
					 * @returns void.
					 * @since 1.0
					 */
					setUnifiedShellInstance : function ( oUnifiedShellInstance ) {
						this.unifiedShell = oUnifiedShellInstance;
					}
				} );
