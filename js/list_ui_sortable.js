/**
 * 
 * リストソートクラス<br>
 * <br>
 * 
 * リストのソート機能を有効化し、<br>
 * ソート後のタスクのレベル変更、親タスク・子タスクの変更処理を行う<br>
 * <br>
 * 
 */
function Sortable() {

	Sortable.prototype.CLASS_NAME_SORT_HANDLE = "ul-li-demo-sort-handle";
	Sortable.prototype.CLASS_NAME_SORT_MOVING = "ul-li-demo-sort-moving";

	Sortable.prototype.ANIMATE_DURATION = 400; // アニメーションの時間

	this.mBeforeParentTask = null;
	this.mAllChildTasks = null;

	Sortable.prototype._constructor = function() {
		this.mBeforeParentTask = null;
		this.mAllChildTasks = null;

		//リストのソート機能有効化
		var sortable = this;
		$(function() {
			$(".piece-list").sortable({
				handle: ".ul-li-demo-sort-handle",
				placeholder: false,
				axis: "y",
				revert: true,
				scroll: true, // Google Chromeでは有効にならない

				start: function(event, ui) {
					var oSelfNode = ui.item[0];
					sortable.start(oSelfNode);
				},

				update: function(event, ui) {
					var oSelfNode = ui.item[0];
					sortable.update(oSelfNode);
				},

				stop: function(event, ui) {
					var oSelfNode = ui.item[0];
					sortable.stop(oSelfNode);
				},
			});
		});
	};


	Sortable.prototype.start = function(oSelfNode) {
		var oSelfTask = new Task(oSelfNode);
		oSelfTask._addClassName(this.CLASS_NAME_SORT_HANDLE, this.CLASS_NAME_SORT_MOVING);
		this.mBeforeParentTask = oSelfTask.getParetTask();
		this.mAllChildTasks = oSelfTask.getAllChildTasks();

	};


	Sortable.prototype.update = function(oSelfNode) {
		var oSelfTask = new Task(oSelfNode);
		var oPreviousTask = oSelfTask.getPreviousTask();
		var oNextTask = oSelfTask.getNextTask();

		// ソートをキャンセルする必要があるかどうか
		var bRet = this.isCancel(oSelfTask, oPreviousTask, oNextTask);
		if(bRet == true) {
			// ソートをキャンセル
			$(".piece-list").sortable("cancel");
			return;
		}

		// 自身のレベル変更処理
		var nRefLevel = 0;
		var nSelfLevel = oSelfTask.getLevel();
		var nNewLevel = this.getNewLevel(oSelfTask, oPreviousTask, oNextTask);
		if(nSelfLevel != nNewLevel) {
			oSelfTask.setLevel(nNewLevel);
			nRefLevel = nNewLevel - nSelfLevel;
		}

		// 子タスクの移動・レベル変更処理
		this.updateChildTasks(oSelfTask, oPreviousTask, oNextTask, nRefLevel);

		// 移動前のParentTaskの変更処理
		this.updateBeforeParentTask(oSelfTask);
	};


	Sortable.prototype.stop = function(oSelfNode) {
		this.mBeforeParentTask = null;
		this.mAllChildTasks = null;

		var oSelfTask = new Task(oSelfNode);
		oSelfTask._removeClassName(this.CLASS_NAME_SORT_HANDLE, this.CLASS_NAME_SORT_MOVING);
	};


	Sortable.prototype.isCancel = function(oSelfTask, oPreviousTask, oNextTask) {
		var bRet = false;
		var oChildTask = null;
		for( var i = 0; i < this.mAllChildTasks.length; i++) {
			oChildTask = this.mAllChildTasks[i];
			bRet = oChildTask.equals(oPreviousTask);
			if(bRet == true) {
				break;
			}
			bRet = oChildTask.equals(oNextTask);
			if(bRet == true) {
				break;
			}
		}
		return bRet;
	};


	Sortable.prototype.getNewLevel = function(oSelfTask, oPreviousTask, oNextTask) {
		var nPreviousLevel = oPreviousTask.getLevel();
		var nNextLevel = 0;
		if(oNextTask != null) {
			nNextLevel = oNextTask.getLevel();
		}
		else {
			nNextLevel = nPreviousLevel;
		}

		var nNewLevel = oSelfTask.getLevel();
		if(nPreviousLevel == 0) {
			// 前がRootTaskの場合は一番上なので、Level1にする
			nNewLevel = 1;
		}
		else if(nPreviousLevel == nNextLevel) {
			// 上下が同じ場合は、そのLevelにする
			nNewLevel = nPreviousLevel;
		}
		else if(nPreviousLevel < nNextLevel) {
			nNewLevel = nNextLevel;
		}
		else if(nPreviousLevel > nNextLevel) {
			nNewLevel = nPreviousLevel;
		}
		else {
		}
		return nNewLevel;
	};


	Sortable.prototype.updateBeforeParentTask = function(oSelfTask) {
		if(this.mBeforeParentTask != null) {
			var oChildTask = this.mBeforeParentTask.getChildFirstTask();
			if(oChildTask == null) {
				this.mBeforeParentTask.convertChildTask();
			}
		}
	};


	Sortable.prototype.updateChildTasks = function(oSelfTask, oPreviousTask, oNextTask, nRefLevel) {
		if(this.mAllChildTasks.length == 0) {
			return;
		}

		var oChildTask = null;
		var nChildLevel = 0;
		var nSetLevel = 0;
		var nOldTop = this.mAllChildTasks[0].mObjSelfNode.offsetTop;

		for( var i = 0; i < this.mAllChildTasks.length; i++) {
			oChildTask = this.mAllChildTasks[i];
			// 子タスクの移動処理
			this.moveChildTask(oChildTask, oNextTask);
			// 子タスクのレベル変更処理
			nChildLevel = oChildTask.getLevel();
			nSetLevel = nChildLevel + nRefLevel;
			oChildTask.setLevel(nSetLevel);
		}

		var nNewTop = this.mAllChildTasks[0].mObjSelfNode.offsetTop;
		var nDistance = nOldTop - nNewTop;
		this.animateChildTask(nDistance);
	};


	Sortable.prototype.moveChildTask = function(moveChildTask, refChildTask) {
		if(moveChildTask == null) {
			return false;
		}

		// moveChildTaskをrefChildTaskの前に入れる
		var oRootTask = moveChildTask.getRootTask();
		var oRootNode = oRootTask.mObjSelfNode;
		var oMoveNode = moveChildTask.mObjSelfNode;

		if(refChildTask != null) {
			var oRefNode = refChildTask.mObjSelfNode;
			oRootNode.insertBefore(oMoveNode, oRefNode);
		}
		else {
			oRootNode.appendChild(oMoveNode);
		}

		return true;
	};


	Sortable.prototype.animateChildTask = function(nDistance) {
		var oChildTask = null;
		var oChildNode = null;
		for( var i = 0; i < this.mAllChildTasks.length; i++) {
			oChildTask = this.mAllChildTasks[i];
			oChildNode = oChildTask.mObjSelfNode;
			// アニメーションさせるため、入れる前の座標を設定
			oChildNode.style.top = nDistance + "px";
			// アニメーション実行
			$(oChildNode).animate({
				top: 0,
			}, {
				easing: "swing",
				duration: this.ANIMATE_DURATION,
			});
		}
	};


	this._constructor();
}
var list_ui_sortable = new Sortable();
