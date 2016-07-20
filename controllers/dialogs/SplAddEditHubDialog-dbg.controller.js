/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller ( "splController.dialogs.SplAddEditHubDialog", {

	onInit : function ( ) {

		this.oPreviouslySelectedItem = null;
		var that = this;

		sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( {
			visible : true,
			subScriptionAccepted : false
		} ), "splSearchVisibilityModel" );

		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplAddEditDeregisterHubDialog", "css" );

		this.byId ( "SubscriptionPackage" ).attachBrowserEvent ( "click", jQuery.proxy ( this.fnToCatchCurrentSubscription, this ) );

		var oSelectSub = {}, aConnectedHubs = [], sSelectedHub = {}, aPossibleOwners = [], aSubscriptionTypes = [];

		this.oSapSplHubListModel = new sap.ui.model.json.JSONModel ( );

		oSelectSub["Name"] = "Select";
		oSelectSub["Name.description"] = oSapSplUtils.getBundle ( ).getText ( "PLEASE_SELECT_PLACEHOLDER" );

		this.getView ( ).setModel ( this.oSapSplHubListModel );

		function getListOfUnConnectedHubs ( ) {

			var oSelect = {};
			var possibleOwners = [];
			oSelect["OwnerID"] = "Select";
			oSelect["OwnerName"] = oSapSplUtils.getBundle ( ).getText ( "PLEASE_SELECT_PLACEHOLDER" );
			possibleOwners[0] = oSelect;
			oSapSplAjaxFactory.fireAjaxCall ( {
				url : oSapSplUtils.getServiceMetadata ( SapSplEnums.RootApp, true ) + "/PossibleOwnerList?$format=json&$filter=isConnected eq 0",
				async : false,
				method : "Get",
				success : function ( oResult ) {
					if ( oResult.d.results.length > 0 ) {
						oResult.d.results.unshift ( oSelect );
						possibleOwners = oResult.d.results;
					}
				}
			} );
			return possibleOwners;
		}

		if ( this.getView ( ).getViewData ( ) && this.getView ( ).getViewData ( ).Text === "Create" ) {
			this.byId ( "SelectedHubName" ).setVisible ( false );
			this.byId ( "SelectOneOfAlreadyConnectedHubsToDeregister" ).setVisible ( false );
			this.byId ( "DeregistrationHorizontalLayout" ).setVisible ( false );
			aPossibleOwners = getListOfUnConnectedHubs ( );
		} else if ( this.getView ( ).getViewData ( ) && this.getView ( ).getViewData ( ).Text === "Edit" ) {
			this.byId ( "HubText" ).setVisible ( false );
			this.byId ( "SelectNewHub" ).setVisible ( false );
			this.byId ( "AgreeDisagreeClause" ).setVisible ( false );
			this.byId ( "SelectOneOfAlreadyConnectedHubsToDeregister" ).setVisible ( false );
			this.byId ( "DeregistrationHorizontalLayout" ).setVisible ( false );
			sSelectedHub = this.getView ( ).getViewData ( ).SelectedHubForEdit;
			/*
			 * CSN Internal Incident Fix - 1570002987 The Checkbox is either
			 * checked or unchecked depending on the value from previous view
			 */
			if ( sSelectedHub.isVisibleOnSearch === "1" ) {
				this.byId ( "BuPaIsVisibleCheckBox" ).setSelected ( true );
			} else if ( sSelectedHub.isVisibleOnSearch === "0" ) {
				this.byId ( "BuPaIsVisibleCheckBox" ).setSelected ( false );
			}
			aSubscriptionTypes = this.fnToGetSubscriptionProductForSelectedHub ( sSelectedHub.OwnerID );
			if ( aSubscriptionTypes.length === 1 ) {
				this.byId ( "SubscriptionPackage" ).setVisible ( false );
			} else {
				this.byId ( "SingleSubscriptionPackage" ).setVisible ( false );
			}
		} else if ( this.getView ( ).getViewData ( ) && this.getView ( ).getViewData ( ).Text === "Deregister" ) {
			this.byId ( "SelectNewHub" ).setVisible ( false );
			this.byId ( "SelectedHubName" ).setVisible ( false );
			this.byId ( "SubscriptionPackageText" ).setVisible ( false );
			this.byId ( "SubscriptionPackage" ).setVisible ( false );
			this.byId ( "SingleSubscriptionPackage" ).setVisible ( false );
			this.byId ( "BuPaIsVisibleCheckBox" ).setVisible ( false );
			this.byId ( "AgreeDisagreeClause" ).setVisible ( false );
			aConnectedHubs = oSapSplUtils.getCompanyDetails ( ).MyOwnerList;
		}
		this.oSapSplHubListModel.setData ( {
			possibleOwners : aPossibleOwners,
			subscription : aSubscriptionTypes,
			connectedHubs : aConnectedHubs,
			SelectedHub : sSelectedHub
		} );

		/* HOT FIX : 1580111006 */
		this.byId ( "SubscriptionPackage" ).addEventDelegate ( {
			onAfterRendering : function ( oEvent ) {
				if ( that.byId ( "SubscriptionPackage" ).getSelectedItem ( ) ) {
					that.byId ( "SubscriptionPackage" ).fireChange ( {
						selectedItem : that.byId ( "SubscriptionPackage" ).getSelectedItem ( )
					} );
				}
				oEvent.srcControl.$().on("focusout", function (oEvent) {
        			oEvent.stopPropagation();
        		});
			}
		} );
	},

	fnToCatchCurrentSubscription : function ( oEvent ) {
		this.previousSelectedKeyForSubscription = sap.ui.getCore ( ).byId ( oEvent.target.parentNode.id ).getSelectedKey ( );
		this.previousSelectedItemForSubscription = sap.ui.getCore ( ).byId ( oEvent.target.parentNode.id ).getSelectedItem ( );
	},

	handleHubSelectionChange : function ( event ) {
		var sSelectedItemKey = event.getParameter ( "selectedItem" ).getKey ( );
		var aSubscriptionTypes = [];
		var oModelDataTemp = this.oSapSplHubListModel.getData ( );
		var that = this;

		if ( sSelectedItemKey !== "Select" ) {
			this.fnToCaptureLiveChangeToSetFlag ( );
			this.byId ( "SingleSubscriptionPackage" ).setVisible ( false );
			aSubscriptionTypes = this.fnToGetSubscriptionProductForSelectedHub ( sSelectedItemKey );
			if ( aSubscriptionTypes.length === 1 ) {
				this.byId ( "SubscriptionPackage" ).setVisible ( false );
				this.byId ( "SubscriptionPackageText" ).setVisible ( false );
			}
			oModelDataTemp.subscription = aSubscriptionTypes;
			this.oSapSplHubListModel.setData ( oModelDataTemp );
		}
	},

	handleAgreeDisagreeSelect : function ( event ) {
		this.fnToCaptureLiveChangeToSetFlag ( );
		if ( event.getParameters ( ).selected ) {
			this.getView ( ).getParent ( ).getBeginButton ( ).setEnabled ( true );
		} else if ( !(event.getParameters ( ).selected) ) {
			this.getView ( ).getParent ( ).getBeginButton ( ).setEnabled ( false );
		}
	},

	fnToGetSubscriptionProductForSelectedHub : function ( sSelectedItemKey ) {
		var oSubscriptionList = [];
		/*
		 * oSelect["Name"] = "Select"; oSelect["Name.description"] =
		 * oSapSplUtils.getBundle().getText('PLEASE_SELECT_PLACEHOLDER');
		 * oSubscriptionList[0] = oSelect;
		 */
		oSapSplAjaxFactory.fireAjaxCall ( {
			url : oSapSplUtils.getServiceMetadata ( SapSplEnums.RootApp, true ) + "/PossibleOwnerList?$format=json&$filter=OwnerID eq X\'" + oSapSplUtils.base64ToHex ( sSelectedItemKey ) + "\'&$expand=SubscriptionProductList",
			async : false,
			method : "Get",
			success : function ( oResult ) {
				if ( oResult.d.results.length > 0 ) {
					if ( oResult.d.results[0] && oResult.d.results[0].SubscriptionProductList.results ) {
						// oResult.d.results[0].SubscriptionProductList.results.unshift(oSelect);
						oSubscriptionList = oResult.d.results[0].SubscriptionProductList.results;
					}
				}
			}
		} );
		return oSubscriptionList;
	},

	/**
	 * @description Called to set isDirtyFlag to true in Utils
	 * @returns void.
	 * @since 1.0
	 * */
	fnToCaptureLiveChangeToSetFlag : function ( ) {
		if ( !oSapSplUtils.getIsDirty ( ) ) {
			oSapSplUtils.setIsDirty ( true );

			// CSN Fix - Internal Incident 1570003978
			if ( this.getView ( ).getViewData ( ) && this.getView ( ).getViewData ( ).Text === "Edit" ) {
				this.getView ( ).getParent ( ).getBeginButton ( ).setEnabled ( true );
			}
		}
	},

	/* Fix for Incident 1580122113*/
	fnToSetSaveButtonEnablement : function ( oEvent ) {

		/* Function returns true only if some change has been made in the dialog */
		function bCanEnableSaveButton ( bParam1, bParam2 ) {
			return ((bParam1 || bParam2) && !(bParam1 && bParam2));
		}
		if ( this.getView ( ).getViewData ( ) && this.getView ( ).getViewData ( ).Text === "Edit" ) {
			if ( bCanEnableSaveButton ( parseInt ( this.getView ( ).getViewData ( ).SelectedHubForEdit.isVisibleOnSearch ), oEvent.getParameters ( ).selected ) ) {
				this.getView ( ).getParent ( ).getBeginButton ( ).setEnabled ( true );
				oSapSplUtils.setIsDirty ( true );
			} else {
				this.getView ( ).getParent ( ).getBeginButton ( ).setEnabled ( false );
				oSapSplUtils.setIsDirty ( false );
			}
		}
	},

	fnCaptureNoChangeOnSubscription : function ( ) {
		if ( oSapSplUtils.getIsDirty ( ) ) {
			oSapSplUtils.setIsDirty ( false );
		}
		if ( this.getView ( ).getViewData ( ) && this.getView ( ).getViewData ( ).Text === "Edit" ) {
			this.getView ( ).getParent ( ).getBeginButton ( ).setEnabled ( false );
		}
	},

	setSubscriptionItem : function ( oItem ) {
		if ( this.getView ( ).getViewData ( ).HubMode === "Edit" ) {
			this.oPreviouslySelectedItem = oItem;
		} else {
			this.oPreviouslySelectedItem = null;
		}
	},

	/**
	 * @private
	 * @param oEvent
	 */
	/*
	 * CSN Internal incident fix - 1570004631 Dialog pop-up when subscription
	 * product is changed
	 */
	handleProductChange : function ( oEvent ) {
		if ( oEvent.mParameters.data === undefined ) {
//			oSapSplUtils.setIsDirty ( true );
			var oProductChangeHandlerDialog = null;

			function handlePromptDialogLaunchForSubscriptionChange ( instance, sourceEvent, fnOKToPrompt, fnCancelPrompt ) {
				oProductChangeHandlerDialog = new sap.m.Dialog ( {
					contentHeight : "280px",
					contentWidth : "670px",
					state : sap.ui.core.ValueState.Warning,
					title : "{splI18NModel>CONFIRMATION_DIALOG_HEADER_TITLE}",
					buttons : [new sap.m.Button ( {
						text : "{splI18NModel>OK}",
						enabled : {
							path : "splSearchVisibilityModel>/subScriptionAccepted"
						},
						press : [function ( oEvent ) {

							fnOKToPrompt ( oEvent );

						}, instance]
					} ), new sap.m.Button ( {
						text : "{splI18NModel>CANCEL}",
						press : [function ( oEvent ) {

							fnCancelPrompt ( oEvent );

						}, instance]
					} )],

					content : sap.ui.view ( {
						viewName : "splView.dialogs.SplChangeSubScriptionPromptDialog",
						id : "splView.dialogs.SplChangeSubScriptionPromptDialog",
						type : sap.ui.core.mvc.ViewType.XML,
						viewData : {
							data : oEvent.getParameter ( "selectedItem" )
						}
					} ),
					afterClose : [function ( ) {
						oProductChangeHandlerDialog.destroy ( );
					}, instance]
				} );
				oProductChangeHandlerDialog.addStyleClass ( "sapSplProductChangeAgreementDialog" );
				oProductChangeHandlerDialog.open ( );
			}

			/*
			 * Display the prompt ONLY if the subscription is changed. DO NOT
			 * display otherwise
			 */
			if ( ((this.byId ( "SubscriptionPackage" ).getSelectedKey ( ) !== this.getView ( ).getViewData ( ).SelectedHubDetails.SubscriptionProductName)) ) {
				var that = this;
				handlePromptDialogLaunchForSubscriptionChange ( this, oEvent, function ( oEvent ) {
					that.bProfileIsModified = true;
					that.fnToCaptureLiveChangeToSetFlag ( );
					$.sap.log.info ( "SAP SCL Event", "Event fired " + oEvent, "SAPSCL" );
					oSapSplUtils.getStorageInstance ( "session" ).put ( "spl-change-prompt-subscr", "x" );
					oEvent.getSource ( ).getParent ( ).getParent ( ).destroy ( );
					oSapSplUtils.setIsDirty ( false );
				}, function ( oEvent ) {
					var bFireSelectionHandler = false;
					that.byId ( "SubscriptionPackage" ).setSelectedItem ( that.oPreviouslySelectedItem );
					$.sap.log.info ( "SAP SCL Event", "Event fired " + oEvent, "SAPSCL" );
					if ( oSapSplUtils.getStorageInstance ( "session" ).get ( "spl-change-prompt-subscr" ) ) {
						oSapSplUtils.getStorageInstance ( "session" ).remove ( "spl-change-prompt-subscr" );
					}
					oEvent.getSource ( ).getParent ( ).getParent ( ).destroy ( );
				} );
			} else {
				// CSN Incident 1580122113. Disable "Save" button if
				// subscription not changed
				this.fnCaptureNoChangeOnSubscription ( );
			}

		}
	}
} );