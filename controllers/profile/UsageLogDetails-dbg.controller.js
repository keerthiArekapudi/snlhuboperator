/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.profile.UsageLogDetails", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        this.fnSetTextBundles();
    },

    /**
     * Sets the text bundles for all the text.
     * @param void
     * @returns void
     * @since 1.0
     * @private
     */
    fnSetTextBundles: function () {
        this.byId("sapSplUsageLogDetailsPage").setTitle(oSapSplUtils.getBundle().getText("USAGE_LOG"));

        //        CSN FIX : 0120031469 0000771513 2014
        this.byId("sapSplUsageLogDetailsObjectHeader").setNumberUnit(oSapSplUtils.getBundle().getText("BILLABLE_DAYS"));

        this.byId("sapSplUsageLogDetailsTrucksTableTitle").setText(oSapSplUtils.getBundle().getText("ACTIVE_TRUCK"));
        this.byId("sapSplUsageLogDetailsTrucksRegNumber").setText(oSapSplUtils.getBundle().getText("REGISTRATION_NUMBER"));
        this.byId("sapSplUsageLogDetailsTrucksDeviceId").setText(oSapSplUtils.getBundle().getText("DEVICE_ID"));
        this.byId("sapSplUsageLogDetailsTrucksDevicetype").setText(oSapSplUtils.getBundle().getText("DEVICE_TYPE"));
        this.byId("sapSplUsageLogDetailsTrucksFrom").setText(oSapSplUtils.getBundle().getText("FROM"));
        this.byId("sapSplUsageLogDetailsTrucksTo").setText(oSapSplUtils.getBundle().getText("TO"));

        this.byId("sapSplUsageLogDetailsUsersTableTitle").setText(oSapSplUtils.getBundle().getText("TOTAL_USERS"));
        this.byId("sapSplUsageLogDetailsUsersName").setText(oSapSplUtils.getBundle().getText("NAME"));
        this.byId("sapSplUsageLogDetailsUsersRole").setText(oSapSplUtils.getBundle().getText("ROLE"));

        this.byId("sapSplUsageLogDetailsUsersTableGroupBy").setTooltip(oSapSplUtils.getBundle().getText("GROUPBY_BUTTON_TOOLTIP"));
        this.byId("sapSplUsageLogDetailsTrucksTableGroupBy").setTooltip(oSapSplUtils.getBundle().getText("GROUPBY_BUTTON_TOOLTIP"));
    },

    onBeforeShow: function (event) {
        this.fnSetHeaderModel(event.data.data);
        this.getUsageLogData(event.data.data);
    },

    fnHandleBackNavigation: function (oEvent) {
        $.sap.log.info("SAP SCL Usage Log", "Back Navigation Event" + oEvent.toString(), "SAPSCL");
        oSplBaseApplication.getAppInstance().back();
    },

    /**
     * Makes an ajax to get the data about the Usage Log.
     * @param eventData
     * @return void
     * @private
     * @since 1.0
     */
    getUsageLogData: function (oEventData) {
        var that = this;
        var data = {
            "CompanyID": oSapSplUtils.getCompanyDetails()["UUID"],
            "StartTime": oEventData["StartTime"],
            "EndTime": oEventData["EndTime"]
        };

        oSapSplAjaxFactory.fireAjaxCall({
            method: "POST",
            data: JSON.stringify(data),
            url: oSapSplUtils.getServiceMetadata("usageLogDetails", true),
            success: function (data) { /*To handle contentType request header*/
            	if ( data.constructor === String ) {
            		data = JSON.parse ( data );
            	}

            	data.ActiveTrucks = data.ActiveTrucks.sort ( function ( a, b ) {
            		if ( a.RegistrationNumber < b.RegistrationNumber ) {
            			return -1;
            		}
            		if ( a.RegistrationNumber > b.RegistrationNumber ) {
            			return 1;
            		}
            		return 0;
            	} );
            	that.fnSetTableModel(data);
            },
            error: function () {
                throw new Error("Usage log service failed");
            }
        });
    },

    /**
     * Creates a JSON model and sets it to the object header.
     * @param data
     * @return void
     * @private
     * @since 1.0
     */
    fnSetHeaderModel: function (headerData) {
        //FIX FOR CSN  759898

        headerData["Title"] = headerData["Name_Description"];
        headerData["TimeFilter"] = headerData["Filter"] + " (" + splReusable.libs.SapSplModelFormatters.showFormattedDateForUsageLog(headerData["StartTime"], headerData["EndTime"]) + ")";

        var oHeaderModel = new sap.ui.model.json.JSONModel(headerData);
        this.byId("sapSplUsageLogDetailsObjectHeader").setModel(oHeaderModel);
    },

    /**
     * Creates a JSON model and sets it to the table.
     * @param data
     * @return void
     * @private
     * @since 1.0
     */
    fnSetTableModel: function (tableData) {
    	/* Fix for incident : 1580142474 */
    	var oTableModel = null;
		if (this.getView ( ).getModel( )) {
			oTableModel = this.getView ( ).getModel( );
		} else {
			oTableModel = new sap.ui.model.json.JSONModel ( ).setDefaultBindingMode ( "OneWay" );
		}
		oTableModel.setData( tableData );
		this.getView ( ).setModel ( oTableModel );
		/* Fix for Incident : 1580068685 */
		this.byId ( "sapSplUsageLogDetailsUsersTableTitle" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOTAL_USERS", this.getView ( ).getViewData ( )[0].toString ( ) ) );
		this.byId ( "sapSplUsageLogDetailsTrucksTableTitle" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ACTIVE_TRUCK", this.getView ( ).getViewData ( )[1].toString ( ) ) );
    },

    fnHandleGrouping: function (event) {

        var that = this;

        if (!this.oList) {
            this.oList = new sap.m.List({
                mode: "SingleSelectLeft",
                select: function (oEvent) {
                    oEvent.getSource().getParent().close();
                    that.fnHandleGroupingAfterDialogSelect(oEvent.getSource().getSelectedItem().getBindingContext().getObject()["CONTEXT"]);
                },
                items: {
                    path: "/",
                    template: new sap.m.StandardListItem({
                        title: "{Name}",
                        selected: "{selected}"
                    })
                }
            }).setModel(new sap.ui.model.json.JSONModel());

            this.aOne = [{
                Name: oSapSplUtils.getBundle().getText("NONE"),
                CONTEXT: ["Trucks", "None"],
                selected: true
            }, {
                Name: oSapSplUtils.getBundle().getText("DEVICE_TYPE"),
                CONTEXT: ["Trucks", "DeviceType"],
                selected: false
            }];

            this.aTwo = [{
                Name: oSapSplUtils.getBundle().getText("NONE"),
                CONTEXT: ["Users", "None"],
                selected: true
            }, {
                Name: oSapSplUtils.getBundle().getText("ROLE"),
                CONTEXT: ["Users", "Role"],
                selected: false
            }];

        }

        var oGroupByDialog = new sap.m.Dialog({
            // CSN FIX : 0120031469 0000670747 2014
            title: oSapSplUtils.getBundle().getText("GROUPBY_BUTTON_TOOLTIP"),
            endButton: new sap.m.Button({
                text: oSapSplUtils.getBundle().getText("CANCEL"),
                press: function () {
                    this.getParent().close();
                }
            }),
            content: [
                that.oList
            ]
        });

        // Trucks group by dialog
        if (event.getSource().sId.split("--")[1] === "sapSplUsageLogDetailsTrucksTableGroupBy") {
            that.oList.getModel().setData(this.aOne);
            // Users group by dialog
        } else if (event.getSource().sId.split("--")[1] === "sapSplUsageLogDetailsUsersTableGroupBy") {
            that.oList.getModel().setData(this.aTwo);
        }

        oGroupByDialog.open().attachAfterOpen(function () {
            oSapSplUtils.fnSyncStyleClass(oGroupByDialog);
        });

    },

    fnHandleGroupingAfterDialogSelect: function (context) {
        if (context[0] === "Trucks") {
            if (context[1] !== "None") {
                this.getView().byId("sapSplUsageLogDetailsTrucksTable").getBinding("items").sort(new sap.ui.model.Sorter(context[1], true, function (oContext) {
                    var sKey = oContext.getProperty("DeviceType");
                    if (!sKey) {
                        return {
                            key: "No Device",
                            text: oSapSplUtils.getBundle().getText("GROUP_HEADER_NO_DEVICE")
                        };
                    } else {
                        return {
                            key: sKey,
                            text: sKey
                        };
                    }

                }));
            } else {
                this.getView().byId("sapSplUsageLogDetailsTrucksTable").getBinding("items").sort([]);
            }
        }
        if (context[0] === "Users") {
            if (context[1] !== "None") {
                this.getView().byId("sapSplUsageLogDetailsUsersTable").getBinding("items").sort(new sap.ui.model.Sorter(context[1], true, function (oContext) {
                    var sKey = oContext.getProperty("Role");
                    if (!sKey) {
                        return {
                            key: "No Role",
                            text: sKey
                        };
                    } else {
                        return {
                            key: sKey,
                            text: sKey
                        };

                    }
                }));


            } else {
                this.getView().byId("sapSplUsageLogDetailsUsersTable").getBinding("items").sort([]);
            }
        }

    },

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     */
    onAfterRendering: function () {}

});
