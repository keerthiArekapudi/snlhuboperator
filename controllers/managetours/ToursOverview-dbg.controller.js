/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller ( "splController.managetours.ToursOverview", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onBeforeShow : function ( ) {
		var sNavToHome = "", sGoto = "", oBackButton = "", that = this;
		sNavToHome = jQuery.sap.getUriParameters ( ).get ( "navToHome" );
		sGoto = jQuery.sap.getUriParameters ( ).get ( "goto" );
		oBackButton = this.byId ( "sapSplBackNavigationButton" );

		/* HOTFIX For search focus issue */
		window.setTimeout ( function () {
            if(that.byId("sapSplTourOverviewSearchField")){
                  that.byId("sapSplTourOverviewSearchField").focus();
            }
         },100);

		// if DAL : check for navToHome
		if ( sGoto ) {
			if ( sNavToHome && sNavToHome === "false" ) {
				oBackButton.setVisible ( false );
			} else if ( sNavToHome && sNavToHome === "true" ) {
				oBackButton.setVisible ( true );
			} else {
				// if navToHome is anything other than true or false.
				oBackButton.setVisible ( false );
			}
		} else {
			// not DAL
			oBackButton.setVisible ( true );
		}

		this.byId ( "SapSplToursOverView" ).removeSelections ( );
		
		// Fix for Incident 1580114196
		this.byId ( "sapSplMarkAsFinished" ).setEnabled(splReusable.libs.SapSplModelFormatters.enableCompleteButton(0));
		
		if ( !this.getView ( ).getParent ( ).getCustomData ( )[0] ) {
			this.getView ( ).getParent ( ).addCustomData ( new sap.ui.core.CustomData ( {
				key : "flag",
				value : true
			} ) );
		}
		that.fnGetTourOverViewData ( );
		if ( sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ) ) {
			that.oSapSplTourOverviewrefreshHandle = window.setInterval ( jQuery.proxy ( that.fnGetTourOverViewData, that ), 60000 );
			oSapSplUtils.setIntervalId ( that.oSapSplTourOverviewrefreshHandle );
		}
		if ( this.getView ( ).getParent ( ).getPages ( ).length > 1 && this.getView ( ).getParent ( ).getPages ( )[1].getController ( ).oSapSplTourDetails ) {
			window.clearInterval ( that.getView ( ).getParent ( ).getPages ( )[1].getController ( ).oSapSplTourDetails );
		}
	},

	onAfterRendering : function ( ) {
		oSapSplQuerySelectors.getInstance ( ).setBackButtonTooltip ( );

		// Fix for Incident 1580107894
		if ( this.getView ( ).getParent ( ).getPreviousPage ( ) && (this.getView ( ).getParent ( ).getPreviousPage ( ).sId === "TourDetails" || this.getView ( ).getParent ( ).getPreviousPage ( ).sId === "CreateNewTour") ) {
			this.byId ( "toursOverviewHeader" ).setNumber ( this.byId ( "SapSplToursOverView" ).getBinding ( "items" ).getLength ( ) );
		}
	},

	onInit : function ( ) {

		this.fnDefineControlLabelsFromLocalizationBundle ( );
		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplTourOverview" );
		this.oSapSplApplModel = sap.ui.getCore ( ).getModel ( "ToursOverviewODataModel" );
		sap.ui.getCore ( ).setModel ( this.oSapSplApplModel, "ToursOverViewPageODataModel" );
		this.getView ( ).byId ( "SapSplToursOverView" ).setModel ( sap.ui.getCore ( ).getModel ( "ToursOverViewPageODataModel" ) );
		this.getView ( ).byId ( "sapSplCreateNewTour" ).setModel ( sap.ui.getCore ( ).getModel ( "myCompanyDetails" ) );
		sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( ), "sapSplTourOverviewModel" );
		sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( ), "sapSplTourDetailsModel" );
		this.getView ( ).byId ( "ToursOverViewPage" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ) );
		this.oSapSplStartTimeSorter = new sap.ui.model.Sorter ( "Planned_StartTime", true );
		this.oSapSplRegistrationNumberSorter = new sap.ui.model.Sorter ( "RegistrationNumber", false );
		this.getView ( ).byId ( "SapSplToursOverView" ).getBinding ( "items" ).sort ( [this.oSapSplStartTimeSorter, this.oSapSplRegistrationNumberSorter] );
		this.fnGetTourOverViewData ( );
		this.handleIconTabBarSelect ( );
		this.TourSelectionCountObject = {
				Unssigned : 0,
				Active : 0,
				Completed : 0
		};
	},

	/**
	 * @description Method to set Localization Bundle Text to the labels.
	 * @param void
	 * @returns void.
	 * @since 1.0
	 */

	fnDefineControlLabelsFromLocalizationBundle : function ( ) {

		this.getView ( ).byId ( "toursOverviewHeader" ).setTitle ( oSapSplUtils.getCompanyDetails ( ).Organization_Name + " " + oSapSplUtils.getBundle ( ).getText ( "TOURS" ) );
		this.getView ( ).byId ( "ToursOverViewPageTitle" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MANAGE_TOURS" ) );
		this.getView ( ).byId ( "SapSplTourName" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NAME" ) );
		this.getView ( ).byId ( "SapSplTourID" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOUR_ID" ) );
		this.getView ( ).byId ( "SapSplTourTruck" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TRUCK" ) );
		this.getView ( ).byId ( "SapSplTourStatus" ).setText ( oSapSplUtils.getBundle ( ).getText ( "VEHICLE_STATUS" ) );
		this.getView ( ).byId ( "SapSplTourStartTime" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOUR_START_TIME" ) );
		this.getView ( ).byId ( "SapSplTourEndTime" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOUR_END_TIME" ) );
		this.getView ( ).byId ( "SapSplTourNumberOfDelays" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NUM_OF_DELAYS" ) );
		this.getView ( ).byId ( "SapSplTourDelay" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOUR_DELAY" ) );
// this.getView().byId("SapSplTourStops").setText(oSapSplUtils.getBundle().getText("TOUR_STOPS"));
		this.getView ( ).byId ( "SapSplToursIconTabbarTitle" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOURS" ) );
// this.getView().byId("SapSplTourFreightItems").setText(oSapSplUtils.getBundle().getText("TOUR_FREIGHT_ITEMS"));
		this.getView ( ).byId ( "sapSplMonitorTourStatus" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_FOOTER_MANAGE_GEOFENCES" ) );
		this.getView ( ).byId ( "sapSplCreateNewTour" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CREATE_NEW_TOUR" ) );

		this.getView ( ).byId ( "SapSplToursIconTabFilterUnassigned" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_UNASSIGNED" ) );
		this.getView ( ).byId ( "SapSplToursIconTabFilterActive" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ACTIVE" ) );
		this.getView ( ).byId ( "SapSplToursIconTabFilterCompleted" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_COMPLETED" ) );
		// FIX FOR CSN 1472014884
		this.getView ( ).byId ( "SapSplToursOverView" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "TOURS_NO_DATA" ) );
		this.getView ( ).byId ( "sapSplMarkAsFinished" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MARK_AS_FINISHED" ) );
	},

	/**
	 * @description Method to handleSelectionchange of the Tour Overview List control.
	 * @param oEvent:{object} change event of the selection
	 * @returns void.
	 * @since 1.0
	 */

	handleSelectionChange : function ( oEvent ) {

		var TourDetails, oModelData = {}, that = this;
		if ( !this.getView ( ).getParent ( ).getPage ( "TourDetails" ) ) {
			TourDetails = sap.ui.view ( {
				id : "TourDetails",
				viewName : "splView.managetours.TourDetails",
				type : sap.ui.core.mvc.ViewType.XML
			} );

			TourDetails.addEventDelegate ( {
				onBeforeShow : jQuery.proxy ( TourDetails.getController ( ).onBeforeShow, TourDetails.getController ( ) )
			} );

			this.getView ( ).getParent ( ).addPage ( TourDetails );
		}

		sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).setData ( oEvent.getSource ( ).getBindingContext ( ).getObject ( ) );
		oModelData.data = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( );
		oModelData.label = {};
		oModelData.label.Location = oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_LOCATION" );
		oModelData.label.Start = oSapSplUtils.getBundle ( ).getText ( "START" );
		oModelData.label.End = oSapSplUtils.getBundle ( ).getText ( "END" );
		oModelData.label.Process = oSapSplUtils.getBundle ( ).getText ( "PROCESS" );
		oModelData.label.items = oSapSplUtils.getBundle ( ).getText ( "ITEMS" );

		// process labels
		oModelData.label.ApproachStop = oSapSplUtils.getBundle ( ).getText ( "PROCESS_APPROACHING_STOP" );
		oModelData.label.Arrival = oSapSplUtils.getBundle ( ).getText ( "PROCESS_ARRIVAL" );
		oModelData.label.LoadingStart = oSapSplUtils.getBundle ( ).getText ( "PROCESS_LOADING_START" );
		oModelData.label.UnloadingStart = oSapSplUtils.getBundle ( ).getText ( "PROCESS_UNLOADING_START" );
		oModelData.label.LoadingEnd = oSapSplUtils.getBundle ( ).getText ( "PROCESS_LOADING_END" );
		oModelData.label.UnloadingEnd = oSapSplUtils.getBundle ( ).getText ( "PROCESS_UNLOADING_END" );
		oModelData.label.ProofOfDelievery = oSapSplUtils.getBundle ( ).getText ( "PROCESS_PROOF_OF_DELIEVERY" );
		oModelData.label.Departure = oSapSplUtils.getBundle ( ).getText ( "PROCESS_DEPARTURE" );

		oModelData.index = {
			value : oEvent.getSource ( ).getParent ( ).indexOfItem ( oEvent.getSource ( ) )
		};

		sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).setData ( oModelData );
		window.clearInterval ( that.oSapSplTourOverviewrefreshHandle );

		this.getView ( ).getParent ( ).to ( "TourDetails" );

	},

	/**
	 * @description Method to handleSelectionchange of the Filter Icon in Icon tab bar.Function applies appropriate filter on the binding ,based on the selection
	 * @param oEvent:{object} change event of the selection
	 * @returns void.
	 * @since 1.0
	 */

	handleIconTabBarSelect : function ( ) {
		var oBinding = this.getView ( ).byId ( "SapSplToursOverView" ).getBinding ( "items" ), sKey = this.getView ( ).byId ( "idIconTabBar" ).getSelectedKey ( ), oFilter, oFilter1, oFilter2, oFilter3, objectHeaderNumberUnit = null;
		if ( sKey === "UnAssigned" ) {
			oFilter = new sap.ui.model.Filter ( "TourStatus", "EQ", "U" );
			oBinding.filter ( [oFilter] );
			objectHeaderNumberUnit = oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_UNASSIGNED_TOURS" );
			
			//fix for the incident 1580111283
			if(this.TourSelectionCountObject.Unssigned > 0){
				this.byId ( "sapSplMarkAsFinished" ).setEnabled(splReusable.libs.SapSplModelFormatters.enableCompleteButton(1));
			}
			else{
				this.byId ( "sapSplMarkAsFinished" ).setEnabled(splReusable.libs.SapSplModelFormatters.enableCompleteButton(0));
			}

		} else if ( sKey === "Finished" ) {
			oFilter = new sap.ui.model.Filter ( "TourStatus", "EQ", "C" );
			oBinding.filter ( [oFilter] );
			objectHeaderNumberUnit = oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_COMPLETED_TOURS" );
			
			//fix for the incident 1580111283
			if(this.TourSelectionCountObject.Completed > 0){
				this.byId ( "sapSplMarkAsFinished" ).setEnabled(splReusable.libs.SapSplModelFormatters.enableCompleteButton(1));
			}
			else{
				this.byId ( "sapSplMarkAsFinished" ).setEnabled(splReusable.libs.SapSplModelFormatters.enableCompleteButton(0));
			}
		} else if ( sKey === "Active" ) {
			oFilter = new sap.ui.model.Filter ( "TourStatus", "EQ", "S" );
			oFilter1 = new sap.ui.model.Filter ( "TourStatus", "EQ", "A" );
			oFilter2 = new sap.ui.model.Filter ( "TourStatus", "EQ", "L" );
			oFilter3 = new sap.ui.model.Filter ( "TourStatus", "EQ", "I" );
			oBinding.filter ( [oFilter, oFilter1, oFilter2, oFilter3] );
			objectHeaderNumberUnit = oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ACTIVE_TOURS" );
			
			//fix for the incident 1580111283
			if(this.TourSelectionCountObject.Active > 0){
				this.byId ( "sapSplMarkAsFinished" ).setEnabled(splReusable.libs.SapSplModelFormatters.enableCompleteButton(1));
			}
			else{
				this.byId ( "sapSplMarkAsFinished" ).setEnabled(splReusable.libs.SapSplModelFormatters.enableCompleteButton(0));
			}
		} else {
			objectHeaderNumberUnit = oSapSplUtils.getBundle ( ).getText ( "TOURS" );
			oBinding.filter ( [] );

		}
		this.byId ( "toursOverviewHeader" ).setNumber ( oBinding.getLength ( ) );
		this.byId ( "toursOverviewHeader" ).setNumberUnit ( objectHeaderNumberUnit );

	},

	/**
	 * @description Method to handle the tap of 'create new tour' Button.Navigates to the create new tour page
	 * @param oEvent:{object} change event of the selection
	 * @returns void.
	 * @since 1.0
	 */

	fnHandlePressCreateNewTour : function ( ) {
		var CreateNewTour, that = this;
		if ( !this.getView ( ).getParent ( ).getPage ( "CreateNewTour" ) ) {
			CreateNewTour = sap.ui.view ( {
				id : "CreateNewTour",
				viewName : "splView.managetours.CreateNewTour",
				type : sap.ui.core.mvc.ViewType.XML
			} );

			CreateNewTour.addEventDelegate ( {
				onBeforeShow : jQuery.proxy ( CreateNewTour.getController ( ).onBeforeShow, CreateNewTour.getController ( ) )
			} );

			CreateNewTour.getController ( ).setUnifiedShellInstance ( this.getView ( ).getParent ( ).getParent ( ).getController ( ).getUnifiedShellInstance ( ) );

			this.getView ( ).getParent ( ).addPage ( CreateNewTour );
		}

		this.getView ( ).getParent ( ).to ( "CreateNewTour" );
		window.clearInterval ( that.oSapSplTourOverviewrefreshHandle );

	},

	/**
	 * @description Method to handle the success callback of OData Read.Function sorts the Stops object of each tour and sets data to the model
	 * @param oEvent:{object} data from OData read response
	 * @returns void.
	 * @since 1.0
	 */

	fnHandleSuccessCallback : function ( data ) {
		var oModelData = {};
		this.byId ( "SapSplToursOverView" ).setBusy ( false );
		if ( data && data.results && data.results instanceof Array ) {
			// FIX FOR CSN 1472014884
			if ( data.results.length === 0 ) {
				this.getView ( ).byId ( "SapSplToursOverView" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "TOURS_NO_DATA" ) );
			}

			for ( var i = 0 ; i < data.results.length ; i++ ) {
				if ( data.results[i].Stops && data.results[i].Stops.results && data.results[i].Stops.results instanceof Array ) {
					data.results[i].Stops.results.sort ( splReusable.libs.SapSplModelFormatters.sortStopObjectBasedOnSequenceNumber );
				}
			}
		}
		oModelData = sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).getData ( );
		data.count = oModelData.count;
		if ( data.hasOwnProperty ( "results" ) && data.results instanceof Array ) {
			sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).setSizeLimit ( data.results.length + 1 );
		}
		sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).setData ( data );
		sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).updateBindings ( );

	},
	fnHandleErrorCallback : function ( ) {
		// Fix for CSN 1580095294
		sap.ui.core.Fragment.byId ( "TourDelayDetails", "SapSclTourDelayDetailsTable" ).setBusy ( false );
	},

	/***
	 * @description Method to handle navigation to Manage locations page.
	 * @since 1.0
	 * @returns void.
	 * @param void.
	 */
	fnHandlePressMonitorTourStatus : function ( ) {
		var sNavTo = "splView.liveApp.liveApp", that = this;
		var oNavToPageView = null;
		if ( !sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).getPage ( sNavTo ) ) {

			oNavToPageView = sap.ui.view ( {
				viewName : sNavTo,
				id : sNavTo,
				type : sap.ui.core.mvc.ViewType.XML
			} );

			oNavToPageView.addEventDelegate ( {
				onBeforeShow : jQuery.proxy ( oNavToPageView.getController ( ).onBeforeShow, oNavToPageView.getController ( ) )
			} );
			sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).addPage ( oNavToPageView );
		}

		oSplBaseApplication.getAppInstance ( ).to ( sNavTo, "slide", {
			showBackButton : true
		} );
		window.clearInterval ( that.oSapSplTourOverviewrefreshHandle );
	},

	fnGetTourOverViewData : function ( ) {

		// Fix for CSN 1580006408
		this.oSapSplApplModel.refresh ( );

	},

	/***
	 * @description handler for the back navigation event, in case of App to App navigation.
	 * Method to go back 1 page in the baseApp.
	 * @param oEvent event object
	 * @since 1.0
	 * @returns void.
	 */
	fnHandleBackNavigation : function ( ) {

		var oBaseApp = null;
		oBaseApp = oSplBaseApplication.getAppInstance ( );

		// back navigation when the App is not launched through DAL
		if ( oBaseApp.getPreviousPage ( ) ) {

			if ( oBaseApp.getPreviousPage ( ).sId === "splView.tileContainer.MasterTileContainer" ) {
				sap.ui.getCore ( ).byId ( "sapSplBaseUnifiedShell" ).removeAllHeadItems ( );
			}
			oBaseApp.back ( );

		} else {

			// back navigation when the App is launched through DAL and
			// navToHome = true
			oBaseApp.to ( "splView.tileContainer.MasterTileContainer" );
			sap.ui.getCore ( ).byId ( "sapSplBaseUnifiedShell" ).removeAllHeadItems ( );
		}
	},

	fnHandleSearch : function ( event ) {
		var searchString = event.mParameters.query;

		var payload, that = this;

		if ( searchString.length > 2 ) {

			payload = this.prepareSearchPayload ( searchString );
			this.callSearchService ( payload );

		} else {
			if ( searchString.length === 0 ) {
				that.handleIconTabBarSelect ( );
			}
		}
	},

	prepareSearchPayload : function ( searchTerm ) {
		var payload = {};
		payload.UserID = oSapSplUtils.getLoggedOnUserDetails ( ).usreID;
		payload.ObjectType = "Tour";
		payload.SearchTerm = searchTerm;
		payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
		payload.MaximumNumberOfRecords = SapSplEnums.numberOfRecords;
		payload.ProvideDetails = false;
		payload.SearchInNetwork = true;
		payload.AdditionalCriteria = {};
		payload.AdditionalCriteria.BusinessPartnerType = "P";

		return payload;
	},

	callSearchService : function ( payload ) {
		var that = this;
		oSapSplAjaxFactory.fireAjaxCall ( {
			url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/Search.xsjs" ),
			method : "POST",
			async : false,
			data : JSON.stringify ( payload ),
			success : function ( data, success, messageObject ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
				if ( data.constructor === String ) {
					data = JSON.parse ( data );
				}

				if ( messageObject["status"] === 200 ) {
					that.fnApplySearchFilters ( data );

				}
			},
			error : function ( error ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

				if ( error && error["status"] === 500 ) {
					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : error["status"] + "\t" + error.statusText,
						details : error.responseText
					} );
				} else {
					var response = {};
					if ( error.responseText.constructor === String ) {
						response = JSON.parse ( error.responseText );
					} else {
						response = error.responseText;
					}

					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : oSapSplUtils.getErrorMessagesfromErrorPayload ( response )["errorWarningString"],
						details : oSapSplUtils.getErrorMessagesfromErrorPayload ( response )["ufErrorObject"]
					} );
				}
			},
			complete : function ( ) {

			}
		} );
	},
	/***
	 * @description function to apply filters to the toursOverview table based on search results .
	 * @param oEvent search result object
	 * @since 1.0
	 * @returns void.
	 */
	fnApplySearchFilters : function ( data ) {
		var aFilters = [], aTableFilters = [], oBinding = null;
		this.getView ( ).byId ( "SapSplToursOverView" );
		oBinding = this.getView ( ).byId ( "SapSplToursOverView" ).getBinding ( "items" );
		aFilters = oSapSplUtils.getSearchItemFilters ( data, "UUID" );
		oBinding.filter ( [] );
		this.handleIconTabBarSelect ( );
		if ( oBinding && oBinding.aFilters ) {
			aTableFilters = oBinding.aFilters;
		}

		if ( aTableFilters && aTableFilters instanceof Array && aTableFilters.length > 0 ) {

			aTableFilters.push ( aFilters );
			oBinding.filter ( aTableFilters );
		} else {
			if ( !(aFilters instanceof Array) ) {
				aFilters = [aFilters];
			}
			oBinding.filter ( aFilters );

		}
		this.byId ( "toursOverviewHeader" ).setNumber ( oBinding.getLength ( ) );

	},

	handleSelectOfTour : function ( oEvent ) {

		var selectedTourStatus = null;
		var selectionStatus = null;
		this.getView ( ).byId ( "sapSplMarkAsFinished" ).getModel ( ).getData ( ).count = oEvent.getSource ( ).getSelectedItems ( ).length;
		// Fix for Incident 1580114196
		this.byId ( "sapSplMarkAsFinished" ).setEnabled(splReusable.libs.SapSplModelFormatters.enableCompleteButton(this.getView ( ).byId ( "sapSplMarkAsFinished" ).getModel ( ).getData ( ).count));
		
		//fix for the incident 1580111283
		selectedTourStatus = oEvent.getParameters().listItem.getBindingContext().getProperty().TourStatus;
		selectionStatus = oEvent.getParameters().listItem.getSelected();
		if(selectedTourStatus === 'U'){
			if(selectionStatus === true){
			    this.TourSelectionCountObject.Unssigned ++;
			}
			else {
				this.TourSelectionCountObject.Unssigned --;
			}
		}
		
		else if (selectedTourStatus === 'C'){
			if(selectionStatus === true){
			    this.TourSelectionCountObject.Completed ++;
			}
			else{
				this.TourSelectionCountObject.Completed --;
			}
		}
		
		else if(selectedTourStatus === 'S' || selectedTourStatus === 'A' || selectedTourStatus === 'L' || selectedTourStatus === 'I' ){
			if(selectionStatus === true){
			    this.TourSelectionCountObject.Active ++;
			}
			else{
				this.TourSelectionCountObject.Active --;
			}
		}
	},

	/***
	 * @description function to handle the press of finish button .
	 * @param oEvent event object of click event
	 * @since 1.0
	 * @returns void.
	 */
	fnHandlePressFinish : function ( ) {
		var i, iMax, aTourUUID = [], query, aSelectedItems = this.byId ( "SapSplToursOverView" ).getSelectedItems ( ), that = this;
		iMax = aSelectedItems.length;

		for ( i = 0 ; i < iMax ; i++ ) {
			aTourUUID.push ( aSelectedItems[i].getBindingContext ( ).getObject ( ).UUID );
		}

		if ( aTourUUID.length > 0 ) {
			this.fnPostTourData ( this.preparePayloadForCompletionOfTour ( aTourUUID ) );
			// Fix Incident ID:1580111283
			this.byId ( "SapSplToursOverView" ).removeSelections ( );
			this.byId ( "sapSplMarkAsFinished" ).setEnabled ( false );
			this.getView ( ).byId ( "sapSplMarkAsFinished" ).getModel ( ).getData ( ).count = 0;
		}

// query = this.constructQueryParameters ( aTourUUID );
// sap.ui.getCore ( ).getModel ( "ToursOverViewPageODataModel" ).read (
// "/Tours", null, ["$expand=Items,Position,Stops/AssignedItems&$filter=" +
// query, "$orderby=Planned_StartTime desc,RegistrationNumber"], null,
// jQuery.proxy ( that.fnHandleSuccessCallbackForTourCompletion, this ),
// jQuery.proxy ( that.fnHandleErrorCallback, this ) );
	},

	preparePayloadForCompletionOfTour : function ( aTourUUID ) {
		var index, aPayloadHeader = [], payload = {};

		for ( index = 0 ; index < aTourUUID.length ; index++ ) {
			aPayloadHeader.push ( {
				"UUID" : aTourUUID[index],
				"ChangeMode" : "U"
			} );
		}
		payload["isTourMarkedForCompletion"] = "1";
		payload["inputHasChangeMode"] = true;

		/* Header Payload */
		payload["Header"] = aPayloadHeader;

		return payload;
	},

// fnHandleSuccessCallbackForTourCompletion : function ( oData ) {
// var i = 0;
// var iMax = 0;
// if ( oData && oData.hasOwnProperty ( "results" ) && oData.results instanceof
// Array ) {
// iMax = oData.results.length;
// for ( i = 0 ; i < iMax ; i++ ) {
// this.fnTransformData ( oData.results[i] );
// }
// }
// this.fnPostTourData ( );
// this.byId ( "SapSplToursOverView" ).removeSelections ( );
// this.byId ( "sapSplMarkAsFinished" ).setEnabled ( false );
// this.getView ( ).byId ( "sapSplMarkAsFinished" ).getModel ( ).getData (
// ).count = 0;
//
// },
	constructQueryParameters : function ( aUUID ) {
		var i = 0;
		var iMax = 0;
		var query = "";
		if ( aUUID && aUUID instanceof Array ) {
			iMax = aUUID.length;
			for ( i = 0 ; i < iMax ; i++ ) {
				query = query + " UUID eq X\'" + oSapSplUtils.base64ToHex ( aUUID[i] ) + "\'";
				if ( i !== iMax - 1 ) {
					query = query + " or";
				}
			}
		}
		return query;
	},
	/***
	 * @description function to trigger save action of tour data for tour completion .
	 * @param void
	 * @since 1.0
	 * @returns void.
	 * @private
	 */

	fnPostTourData : function ( oPayload ) {
		var that = this;
		oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );

		window.setTimeout ( function ( ) {
			oSapSplAjaxFactory.fireAjaxCall ( {
				url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/tour.xsjs" ),
				method : "PUT",
				async : false,
				data : JSON.stringify ( oPayload ), // oPayloadForTourCompletion
				success : function ( data, success, messageObject ) {
					var oCustomData = new sap.ui.core.CustomData ( {
						key : "bRefreshTile",
						value : true
					} );
					oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).destroyCustomData ( );
					oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).addCustomData ( oCustomData );
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					if ( data.constructor === String ) {
						data = JSON.parse ( data );
					}
					if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {

						sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "TOUR_MARKED_COMPLTED", data.Header[0].Name ) );
						that.fnGetTourOverViewData ( );
					} else {
						var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
						sap.ca.ui.message.showMessageBox ( {
							type : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["messageTitle"],
							message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
							details : errorMessage
						} );
					}
					oSapSplUtils.setIsDirty ( false );

				},
				error : function ( error ) {
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					if ( error && error["status"] === 500 ) {
						sap.ca.ui.message.showMessageBox ( {
							type : sap.ca.ui.message.Type.ERROR,
							message : error["status"] + " " + error.statusText,
							details : error.responseText
						} );
					} else {
						if ( error.responseText.constructor === String ) {
							error.responseText = JSON.parse ( error.responseText );
						}

						sap.ca.ui.message.showMessageBox ( {
							type : oSapSplUtils.getErrorMessagesfromErrorPayload ( error.responseText )["messageTitle"],
							message : oSapSplUtils.getErrorMessagesfromErrorPayload ( error.responseText )["errorWarningString"],
							details : oSapSplUtils.getErrorMessagesfromErrorPayload ( error.responseText )["ufErrorObject"]
						} );
					}
				},
				complete : function ( ) {

				}

			} );
		}, 400 );

	},

	/***
	 * @description function to transform read data into payload for post.
	 * @param object
	 * @since 1.0
	 * @returns void.
	 * @private
	 */

	fnTransformData : function ( oData ) {
		var oHeader = {}, oText = {}, oItem = {}, oStop = {}, oAssignedItem = {}, i, iMax, j, jMax, aItems, aStops, aAssignedItems;

		if ( !this.oPayloadForTourCompletion ) {

			this.oPayloadForTourCompletion = {};
			this.oPayloadForTourCompletion.isTourMarkedForCompletion = "1";
			this.oPayloadForTourCompletion.inputHasChangeMode = "true";
			this.oPayloadForTourCompletion.Header = [];
			this.oPayloadForTourCompletion.Text = [];
			this.oPayloadForTourCompletion.Stop = [];
			this.oPayloadForTourCompletion.Item = [];
			this.oPayloadForTourCompletion.StopItemAssignment = [];
		}

		oHeader["UUID"] = oData["UUID"];
		oHeader["TourID"] = oData["TourID"];
		oHeader["VehicleUUID"] = oData["VehicleUUID"];
		oHeader["Status"] = "C";
		oHeader["OwnerID"] = oData["OwnerID"];
		oHeader["Name"] = oData["Name"];
		oHeader["EventSchema"] = "default";
		oHeader["Planned.StartTime"] = oData["Planned_StartTime"];
		oHeader["Planned.EndTime"] = oData["Planned_EndTime"];
		oHeader["Actual.StartTime"] = oData["Actual_StartTime"];
		oHeader["Actual.EndTime"] = oData["Actual_EndTime"];
		oHeader["isDeleted"] = oData["isDeleted"];
		oHeader["AuditTrail.CreatedBy"] = null;
		oHeader["AuditTrail.ChangedBy"] = null;
		oHeader["AuditTrail.CreationTime"] = null;
		oHeader["AuditTrail.ChangeTime"] = null;
		oHeader["ChangeMode"] = "U";

		oText["UUID"] = oData["UUID"];
		oText["Text"] = null;
		oText["ChangeMode"] = "U";

		if ( oData.Items && oData.Items.results && oData.Items.results.length > 0 ) {
			aItems = oData.Items.results;
			iMax = aItems.length;
			for ( i = 0 ; i < iMax ; i++ ) {
				oItem["UUID"] = aItems[i].ItemUUID;
				oItem["ItemID"] = aItems[i].ItemID;
				oItem["TourUUID"] = aItems[i].TourUUID;
				oItem["Type"] = aItems[i].Type;
				oItem["Detail1"] = aItems[i].Detail1;
				oItem["Detail2"] = aItems[i].Detail2;
				oItem["Detail3"] = aItems[i].Detail3;
				oItem["DangerGoodsClass"] = aItems[i].DangerGoodsClass;
				oItem["isDeleted"] = aItems[i].isDeleted;
				oItem["ChangeMode"] = "U";
				this.oPayloadForTourCompletion.Item.push ( oItem );
				oItem = {};
			}
		}

		if ( oData.Stops && oData.Stops.results && oData.Stops.results.length > 0 ) {
			aStops = oData.Stops.results;
			iMax = aStops.length;
			for ( i = 0 ; i < iMax ; i++ ) {

				oStop["UUID"] = aStops[i].UUID;
				oStop["TourUUID"] = aStops[i].TourUUID;
				oStop["Sequence"] = aStops[i].Sequence;
				oStop["Name"] = aStops[i].Name;
				oStop["Description"] = aStops[i].Description;
				oStop["Geocordinate"] = null;
				oStop["Status"] = aStops[i].Status;
				oStop["LastReportedEvent"] = aStops[i].LastReportedEvent;
				oStop["Planned.ArrivalTime"] = aStops[i]["Planned_ArrivalTime"];
				oStop["Planned.DepartureTime"] = aStops[i]["Planned_DepartureTime"];
				oStop["Actual.ArrivalTime"] = aStops[i]["Actual_ArrivalTime"];
				oStop["Actual.DepartureTime"] = aStops[i]["Actual_DepartureTime"];
				oStop["LocationUUID"] = aStops[i]["LocationUUID"];
				oStop["isDeleted"] = aStops[i].isDeleted;
				oStop["ChangeMode"] = "U";

				if ( aStops[i].AssignedItems && aStops[i].AssignedItems.results && aStops[i].AssignedItems.results.length > 0 ) {

					aAssignedItems = aStops[i].AssignedItems.results;
					jMax = aAssignedItems.length;
					for ( j = 0 ; j < jMax ; j++ ) {

						oAssignedItem["UUID"] = oSapSplUtils.getUUID ( );
						oAssignedItem["TourUUID"] = aAssignedItems[j]["TourUUID"];
						oAssignedItem["StopUUID"] = aAssignedItems[j]["StopUUID"];
						oAssignedItem["ItemUUID"] = aAssignedItems[j]["ItemUUID"];
						oAssignedItem["Type"] = aAssignedItems[j]["AssignmentType"];
						oAssignedItem["isDeleted"] = aAssignedItems[j]["isDeleted"];
						oAssignedItem["ChangeMode"] = "U";
						this.oPayloadForTourCompletion.StopItemAssignment.push ( oAssignedItem );
						oAssignedItem = {};
					}
				}
				this.oPayloadForTourCompletion.Stop.push ( oStop );
				oStop = {};
			}
			this.oPayloadForTourCompletion.Header.push ( oHeader );
			this.oPayloadForTourCompletion.Text.push ( oText );
		}
	},

	fnHandleNavigationSearch : function ( sVehicleRegistrationNumber ) {
		if ( sVehicleRegistrationNumber ) {
			this.byId ( "idIconTabBar" ).setSelectedKey ( "Active" );
			this.byId ( "idIconTabBar" ).fireSelect ( );
			this.byId ( "sapSplTourOverviewSearchField" ).setValue ( sVehicleRegistrationNumber );
			var oEvent = {};
			oEvent.mParameters = {};
			oEvent.mParameters.query = "";
			this.fnHandleSearch ( oEvent );
			oEvent.mParameters.query = "*" + sVehicleRegistrationNumber + "*";
			this.fnHandleSearch ( oEvent );
		}
	},

	fnHandleTourDelayDetailsLink : function ( oEvent ) {

		if ( !this.oTourStopDelayDetailsPopover ) {
			this.oTourStopDelayDetailsPopover = sap.ui.xmlfragment ( "TourDelayDetails", "splReusable.fragments.TourStopDelayDetails", this );

			this.oSplTourStopDelayDetialsModel = new sap.ui.model.json.JSONModel ( );

			// Localization
			sap.ui.core.Fragment.byId ( "TourDelayDetails", "SapSclTourDelayDetailsPopoverTitle" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "DELAYS" ) );
			sap.ui.core.Fragment.byId ( "TourDelayDetails", "SapSclTourDelayDetailsPopoverCloseButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CLOSE" ) );
			sap.ui.core.Fragment.byId ( "TourDelayDetails", "SapSclTourDelayDetailsTableArrival" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOUR_ARRIVAL" ) );
			sap.ui.core.Fragment.byId ( "TourDelayDetails", "SapSclTourDelayDetailsTableDeparture" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOUR_DEPARTURE" ) );
		}
		// Fix for CSN 1580095294
		sap.ui.core.Fragment.byId ( "TourDelayDetails", "SapSclTourDelayDetailsTable" ).setBusy ( true );
		this.oSplTourStopDelayDetialsModel.setData ( [] );

		this.getStopDetails ( oEvent.getSource ( ).getBindingContext ( ).getProperty ( ) );

		this.oTourStopDelayDetailsPopover.openBy ( oEvent.getSource ( ) );
	},

	getStopDetails : function ( tourObject ) {
		var aTourUUID = [], query, that = this;

		aTourUUID.push ( tourObject.UUID );

		query = this.constructQueryParameters ( aTourUUID );

		sap.ui.getCore ( ).getModel ( "ToursOverViewPageODataModel" ).read ( "/Tours", false, ["$expand=Stops&$filter=" + query], null, jQuery.proxy ( that.fnHandleSuccessCallbackForStopDetails, this ),
				jQuery.proxy ( that.fnHandleErrorCallback, this ) );
	},

	fnHandleSuccessCallbackForStopDetails : function ( oData ) {

		if ( oData && oData.hasOwnProperty ( "results" ) && oData.results instanceof Array ) {
			this.oSplTourStopDelayDetialsModel.setData ( oData.results[0].Stops );
		} else {
			this.oSplTourStopDelayDetialsModel.setData ( [] );
		}
		this.oTourStopDelayDetailsPopover.setModel ( this.oSplTourStopDelayDetialsModel );

		this.oSapSplTourStopDelaySorter = new sap.ui.model.Sorter ( "Sequence", true, this.handleGroupingOfStops );
		sap.ui.core.Fragment.byId ( "TourDelayDetails", "SapSclTourDelayDetailsTable" ).getBinding ( "items" ).sort ( [this.oSapSplTourStopDelaySorter] );

		// Fix for CSN 1580095294
		sap.ui.core.Fragment.byId ( "TourDelayDetails", "SapSclTourDelayDetailsTable" ).setBusy ( false );
	},

	fnHandleTourDelayDetailsPopoverCloseButton : function ( ) {
		this.oTourStopDelayDetailsPopover.close ( );
	},

	handleGroupingOfStops : function ( oContext ) {
		var sName = oContext.getProperty ( "Name" );
		var sKey = oContext.getProperty ( "Sequence" );
		return {
			key : sKey,
			text : sName
		};
	}

} );
