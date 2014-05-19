/**
 * CmnLog
 * 
 * @class ログ出力クラス
 */
function CmnLog() {
	this.enabled = false; // 出力を無効化

	this.FUNC_IN = 1;
	this.FUNC_OUT = 2;

	CmnLog.prototype.funcIn = function() {
		if(this.enabled == false) {
			return;
		}
		var sMsg = "IN = ";
		var sTmp = "";
		sTmp = this._createMessage(arguments);
		sMsg += sTmp;
		this._println(false, sMsg);
	};


	CmnLog.prototype.funcOut = function() {
		if(this.enabled == false) {
			return;
		}
		var sMsg = "OUT = ";
		var sTmp = "";
		sTmp = this._createMessage(arguments);
		sMsg += sTmp;
		this._println(false, sMsg);
	};


	CmnLog.prototype.debug = function() {
		if(this.enabled == false) {
			return;
		}
		var sMsg = this._createMessage(arguments);
		this._println(false, sMsg);
	};


	CmnLog.prototype.err = function() {
		var sMsg = this._createMessage(arguments);
		this._println(true, sMsg);
	};


	CmnLog.prototype._createMessage = function(aTargets) {
		var sMsg = "";
		for( var i = 0; i < aTargets.length; i++) {
			sMsg += this._subCreateMessage(aTargets[i]);
			sMsg += ", ";
		}
		sMsg = sMsg.substring(0, sMsg.length - 2);
		return sMsg;
	};


	CmnLog.prototype._subCreateMessage = function(oTarget) {
		var sMsg = null;
		switch(typeof oTarget) {
		case "number":
		case "boolean":
			sMsg = oTarget.toString();
			break;

		case "string":
			sMsg = oTarget;
			break;

		case "function":
			sMsg = oTarget.name;
			break;

		case "object":
			if(oTarget != null) {
				sMsg = oTarget.constructor.name;
				switch(sMsg) {
				case "Task":
					sMsg = "<" + oTarget.mObjSelfNode.tagName + " id=" + oTarget.mObjSelfNode.id + ">";
					break;
				case "Array":
					sMsg = "[" + oTarget.length.toString() + "]=";
					for( var i = 0; i < oTarget.length; i++) {
						sMsg += this._subCreateMessage(oTarget[i]);
						sMsg += "&";
					}
					sMsg = sMsg.substring(0, sMsg.length - 1);
					break;
				case "HTMLUListElement":
				case "HTMLLIElement":
				case "HTMLAnchorElement":
					sMsg = "<" + oTarget.tagName + " id=" + oTarget.id + ">";
					break;
				default:
					break;
				}
			}
			else {
				sMsg = "null";
			}
			break;

		case "undefined":
		default:
			sMsg = typeof oTarget;
			break;
		}
		return sMsg;
	};


	CmnLog.prototype._caller = function() {
		var aCaller = new Array();

		var oErr = new Error();
		if(oErr.stack == null) { // iOSでは対応されていないため
			aCaller[0] = "No Stack";
			aCaller[1] = "0";
			return aCaller;
		}
		var aStacks = oErr.stack.split("\n", 5);
		var sTmp = aStacks[4];

		var aTmp = sTmp.split(" ");
		var sFunctionName = aTmp[5];
		sTmp = aTmp[6];
		aTmp = sTmp.split(":");
		var sLineNo = aTmp[aTmp.length - 2];

		// 戻り値用の配列を生成
		aCaller[0] = sFunctionName;
		aCaller[1] = sLineNo;
		return aCaller;
	};


	CmnLog.prototype._println = function(bError, sInMsg) {
		var aCaller = this._caller();
		var sFunctionName = aCaller[0];
		var sLineNo = aCaller[1];
		var sMsg = sFunctionName + "() : " + sLineNo + " : " + sInMsg;
		if(bError == true) {
			console.error(sMsg);
		}
		else {
			console.log(sMsg);
		}
	};
}
var cmnLog = new CmnLog();
