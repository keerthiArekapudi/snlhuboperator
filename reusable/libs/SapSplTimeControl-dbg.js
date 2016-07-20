/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "sap.ui.layout.HorizontalLayout" );
jQuery.sap.require ( "sap.ui.commons.ComboBox" );
jQuery.sap.declare ( "splReusable.libs.SapSplTimeControl" );

sap.ui.layout.VerticalLayout.extend ( "splReusable.libs.SapSplTimeControl", {
	metadata : {
		properties : {

			format : {
				type : "string",
				defaultValue : "24"

			},

			value : {
				type : "string",
				defaultValue : "12"
			}
		},
		events : {
			"change" : {}
		}
	},

	init : function ( ) {

		var Ante_Meridiem_Text = oSapSplUtils.getBundle ( ).getText ( "ANTEMERIDIEM" );
		var Post_Meridiem_Text = oSapSplUtils.getBundle ( ).getText ( "POSTMERIDIEM" );
		var oComboBox = new sap.ui.commons.ComboBox ( {
			width : "4rem",
			change : function ( oEvent ) {

				this.setValueState ( );
				this.getParent ( ).getContent ( )[0].setValueState ( );
				this.getParent ( ).getParent ( ).isError = false;
				this.getParent ( ).getParent ( ).getContent ( )[1].setVisible ( false );

				var regularExpressionString = null, RegularExpression = null, sValue;

				if ( this.getParent ( ).getParent ( ).getFormat ( ) === "12" ) {
					regularExpressionString = "^(0[0-9]|1[0-2]):[0-5][0-9][\" \"]*(" + Ante_Meridiem_Text + "|" + Post_Meridiem_Text + ")$";

				} else {
					regularExpressionString = "^([0-1][0-9]|2[0-3]):[0-5][0-9]$";
				}
				RegularExpression = new RegExp ( regularExpressionString, "i" );

				if ( new RegExp ( "^[0-9][:][0-9]*[.]*$", "i" ).exec ( this.getValue ( ) ) ) {
					this.setValue ( "0" + this.getValue ( ) );
				}

				if ( new RegExp ( "^[0-9][0-9][0-9][0-9].*$", "i" ).exec ( this.getValue ( ) ) ) {
					sValue = this.getValue ( );
					sValue = sValue.substring ( 0, 2 ) + ":" + sValue.substring ( 2, sValue.length );
					this.setValue ( sValue );
				}

				if ( new RegExp ( "^[0-9][0-9][0-9].*$", "i" ).exec ( this.getValue ( ) ) ) {
					sValue = this.getValue ( );
					sValue = "0" + sValue.substring ( 0, 1 ) + ":" + sValue.substring ( 1, sValue.length );
					this.setValue ( sValue );

				}

				if ( !RegularExpression.exec ( this.getValue ( ) ) ) {
					if ( this.getParent ( ).getParent ( ).getFormat ( ) === "24" ) {
						this.setValue ( this.getModel ( ).getData ( ).data24[0] );

					} else {
						if ( new RegExp ( "^(0[0-9]|1[0-2]):[0-5][0-9][\" \"]*$" ).exec ( this.getValue ( ) ) ) {
							if ( new Date ( ).getHours ( ) < 12 ) {
								this.setValue ( this.getValue ( ) + Ante_Meridiem_Text );
							} else {
								this.setValue ( this.getValue ( ) + Post_Meridiem_Text );
							}
						} else {
							this.setValueState ( sap.ui.core.ValueState.Error );
							this.getParent ( ).getContent ( )[0].setValueState ( sap.ui.core.ValueState.Error );
							this.getParent ( ).getParent ( ).getContent ( )[1].setVisible ( true );

							//this.setValueStateText("To cannot be from");  
							this.getParent ( ).getParent ( ).isError = true;
							// this.setValue(this.getModel().getData().data12[49]);

						}
					}

				}
				this.getParent ( ).getParent ( )._setValueOnChange ( oEvent );

			}
		} );

		if ( this.getContent ( ).length === 0 && this.sId && this.sId.indexOf ( "clone" ) === -1 ) {

			var oVerticalLayout = new sap.ui.layout.HorizontalLayout ( );

			oVerticalLayout.addContent ( new sap.ui.commons.DatePicker ( {
				locale : sap.ui.getCore ( ).getConfiguration ( ).getLanguage ( ),
				change : function ( oEvent ) {
					this.getParent ( ).getParent ( )._setValueOnChange ( oEvent );
				}
			} ) );

			oVerticalLayout.addContent ( oComboBox );
			this.addContent ( oVerticalLayout );
			this.addContent ( new sap.ui.commons.Label ( {
				text : oSapSplUtils.getBundle ( ).getText ( "TIME_CONTROL_ERROR_MESSAGE" ),
				visible : false
			} ) );
		}

	},

	_setValueOnChange : function ( oEvent ) {

		var tempDate = this.getContent ( )[0].getContent ( )[0].getYyyymmdd ( );
		var Post_Meridiem_Text = oSapSplUtils.getBundle ( ).getText ( "POSTMERIDIEM" );
		var date = tempDate.substring ( 6, 8 );
		var month = tempDate.substring ( 4, 6 );
		var year = tempDate.substring ( 0, 4 );
		var minutes = null;
		var hours = null;

		if ( !this.isError ) {
			var TimeString = this.getContent ( )[0].getContent ( )[1].getValue ( );

			minutes = TimeString.split ( ":" )[1][0] + TimeString.split ( ":" )[1][1];

			if ( minutes < 10 ) {
				minutes = "0" + minutes;
			}

			if ( this.getFormat ( ) === "12" && TimeString.toLowerCase ( ).indexOf ( Post_Meridiem_Text.toLowerCase ( ) ) > -1 ) {
				hours = parseInt ( TimeString.split ( ":" )[0], 10 ) + 12;
			} else {
				hours = TimeString.split ( ":" )[0];
			}

			if ( this.getFormat ( ) === "12" && (String ( hours ) === "12" || String ( hours ) === "24") ) {
				hours = hours - 12;
			}

			if ( hours < 10 ) {
				hours = "0" + hours;
			}

			this.setValue ( new Date ( year, month - 1, date, hours, minutes, 0, 0 ) );
			this.fireChange ( oEvent );

		}

	},
	renderer : {},

	getDateValue : function ( ) {
		return this.getValue ( );
	},

	onBeforeRendering : function ( ) {

		var oComboBox = this.getContent ( )[0].getContent ( )[1];
		var index;
		var oModel = new sap.ui.model.json.JSONModel ( );
		var Ante_Meridiem_Text = oSapSplUtils.getBundle ( ).getText ( "ANTEMERIDIEM" );
		var Post_Meridiem_Text = oSapSplUtils.getBundle ( ).getText ( "POSTMERIDIEM" );
		var tempDate, oDate;
		oModel.setData ( {

			data12 : ["12:30" + Ante_Meridiem_Text, "01:00" + Ante_Meridiem_Text, "01:30" + Ante_Meridiem_Text, "02:00" + Ante_Meridiem_Text, "02:30" + Ante_Meridiem_Text, "03:00" + Ante_Meridiem_Text, "03:30" + Ante_Meridiem_Text,
					"04:00" + Ante_Meridiem_Text, "04:30" + Ante_Meridiem_Text, "05:00" + Ante_Meridiem_Text, "05:30" + Ante_Meridiem_Text, "06:00" + Ante_Meridiem_Text, "06:30" + Ante_Meridiem_Text, "07:00" + Ante_Meridiem_Text,
					"07:30" + Ante_Meridiem_Text, "08:00" + Ante_Meridiem_Text, "08:30" + Ante_Meridiem_Text, "09:00" + Ante_Meridiem_Text, "09:30" + Ante_Meridiem_Text, "10:00" + Ante_Meridiem_Text, "10:30" + Ante_Meridiem_Text,
					"11:00" + Ante_Meridiem_Text, "11:30" + Ante_Meridiem_Text, "12:00" + Post_Meridiem_Text, "12:30" + Post_Meridiem_Text, "01:00" + Post_Meridiem_Text, "01:30" + Post_Meridiem_Text, "02:00" + Post_Meridiem_Text,
					"02:30" + Post_Meridiem_Text, "03:00" + Post_Meridiem_Text, "03:30" + Post_Meridiem_Text, "04:00" + Post_Meridiem_Text, "04:30" + Post_Meridiem_Text, "05:00" + Post_Meridiem_Text, "05:30" + Post_Meridiem_Text,
					"06:00" + Post_Meridiem_Text, "06:30" + Post_Meridiem_Text, "07:00" + Post_Meridiem_Text, "07:30" + Post_Meridiem_Text, "08:00" + Post_Meridiem_Text, "08:30" + Post_Meridiem_Text, "09:00" + Post_Meridiem_Text,
					"09:30" + Post_Meridiem_Text, "10:00" + Post_Meridiem_Text, "10:30" + Post_Meridiem_Text, "11:00" + Post_Meridiem_Text, "11:30" + Post_Meridiem_Text, "12:00" + Ante_Meridiem_Text],
			data24 : ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
					"12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"]
		} );

		var oItemTemplate = new sap.ui.core.ListItem ( );
		var is24format = false;
		oItemTemplate.bindProperty ( "text", "" );
		if ( this.getFormat ( ) === "12" ) {
			oComboBox.bindItems ( "/data12", oItemTemplate );
		} else {
			is24format = true;
			oComboBox.bindItems ( "/data24", oItemTemplate );
		}

		oComboBox.setModel ( oModel );

		var hrs = null, minutes = null;
		if ( this.getValue ( ) && !this.isError ) {
			oDate = new Date ( this.getValue ( ) );
			tempDate = oDate;
			if ( is24format ) {
				hrs = oDate.getHours ( );
				minutes = oDate.getMinutes ( );
				if ( hrs < 10 ) {
					hrs = "0" + hrs;
				}
				if ( minutes < 10 ) {
					minutes = "0" + minutes;
				}
				oComboBox.setValue ( hrs + ":" + minutes );

			} else {
				var tempString;
				if ( oDate.getHours ( ) >= 12 ) {
					tempString = Post_Meridiem_Text;
				} else {
					tempString = Ante_Meridiem_Text;
				}
				if ( String ( hrs ) !== "12" || String ( hrs ) !== "0" ) {
					hrs = oDate.getHours ( ) % 12;
				}
				if ( String ( hrs ) === "0" ) {
					hrs = "12";
				}

				if ( hrs < 10 ) {
					hrs = "0" + hrs;
				}

				minutes = oDate.getMinutes ( );
				if ( minutes < 10 ) {
					minutes = "0" + minutes;
				}
				tempString = hrs + ":" + minutes + tempString;
				oComboBox.setValue ( tempString );
			}
		} else {
			oDate = new Date ( );
			tempDate = oDate;
			if ( is24format ) {
				oComboBox.setValue ( oComboBox.getModel ( ).getData ( ).data24[index] );
			} else {
				oComboBox.setValue ( oComboBox.getModel ( ).getData ( ).data12[index] );
			}
		}

		index = oDate.getHours ( ) * 2 + 1;
		if ( oDate.getMinutes ( ) > 30 ) {
			index++;
		}
		this.index = index;
		//HOT FIX
		//Getting the yyyymmdd string from tempDate 

		var dateString = "", sYear, sMonth, sDate;
		//Getting year from the tempdate and converting to string
		sYear = (tempDate.getYear ( ) + 1900).toString ( );
		if ( tempDate.getMonth ( ) + 1 < 10 ) {
			sMonth = "0" + (tempDate.getMonth ( ) + 1).toString ( );
		} else {
			sMonth = (tempDate.getMonth ( ) + 1).toString ( );
		}
		if ( tempDate.getDate ( ) < 10 ) {
			sDate = "0" + (tempDate.getDate ( )).toString ( );
		} else {
			sDate = tempDate.getDate ( ).toString ( );
		}
		dateString = sYear + sMonth + sDate;

		if ( !this.isError ) {
			this.getContent ( )[0].getContent ( )[0].setYyyymmdd ( dateString );

		}
	}

} );
