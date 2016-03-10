 (function(factory){
 	if(typeof define === "funtion" && define.amd){
 		define(["jquery"], factory);
 	}else if(typeof exports === "object"){
 		factory(require("jquery"));
 	}else{
 		factory(jQuery);
 	}
 }(function($,undefined){
 	if(!("indexOf" in Array.prototype)){
 		Array.prototype.indexOf = function(find, i){
 			if(i === undefined){
 				i = 0;
 			}
 			if(i < 0){
 				i += this.length;
 			}
 			if(i < 0){
 				i = 0;
 			}
 			for(var n = this.length; i<n;i++){
 				if(i in this && this[i] === find){
 					return i;
 				}
 			}
 			return -1;
 		};
 	}

 	function elementOrParentIsFixed(element){
 		var $element = $(element),
 			$checkElements = $element.add($element.parents()),
 			isFixed = false;

 		$checkElements.each(function(){
 			if($(this).css("position") === "fixed"){
 				isFixed = true;
 				return false;
 			}
 		});
 		return isFixed;
 	}

 	function UTCDate(){
 		return new Date(Date.UTC.apply(Date, arguments));
 	}

 	function UTCToday(){
 		var today = new Date();
 		return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds());
 	}


 var DateTimePicker = function(element,options){
 	var that = this;

 	this.element = $(element);
 	this.container = options.container || "body";
 		
 	this.language = options.language || this.element.data("data-language") || "en";
 	this.isRTL = date[this.language].rtl || false;
 	this.formatType = options.formatType || this.element.data("formatType") || "standard";
 	this.format = DPGlobal.parseFormat(options.format || this.element.data("data-format") || dates[this.language].format || DPGlobal.getDefaultFormat(this.formatType, 'input'), this.formatType);
 	this.isInline = false;
 	this.isVisible = false;
 	this.fontAwesome = options.fontAwesome || this.element.data('font-awesome') || false;
 	this.bootcssVer = options.bootcssVer || (this.isInput ? (this.element.is('.form-control') ? 3 : 2) : ( this.bootcssVer = this.element.is('.input-group') ? 3 : 2 ));

    this.component = this.element.is('.date') ? ( this.bootcssVer == 3 ? this.element.find('.input-group-addon .glyphicon-th, .input-group-addon .glyphicon-time, .input-group-addon .glyphicon-remove, .input-group-addon .glyphicon-calendar, .input-group-addon .fa-calendar, .input-group-addon .fa-clock-o').parent() : this.element.find('.add-on .icon-th, .add-on .icon-time, .add-on .icon-calendar, .add-on .fa-calendar, .add-on .fa-clock-o').parent()) : false;
    this.componentReset = this.element.is('.date') ? ( this.bootcssVer == 3 ? this.element.find('.input-group-addon .glyphicon-remove, .input-group-addon .fa-times').parent():this.element.find('.add-on .icon-remove, .add-on .fa-times').parent()) : false;
    this.hasInput = this.component && this.element.find('input').length;
    if (this.component && this.component.length === 0) {
      this.component = false;
    }
    this.linkField = options.linkField || this.element.data('link-field') || false;
    this.linkFormat = DPGlobal.parseFormat(options.linkFormat || this.element.data('link-format') || DPGlobal.getDefaultFormat(this.formatType, 'link'), this.formatType);
    this.minuteStep = options.minuteStep || this.element.data('minute-step') || 5;
    this.pickerPosition = options.pickerPosition || this.element.data('picker-position') || 'bottom-right';
    this.showMeridian = options.showMeridian || this.element.data('show-meridian') || false;
    this.initialDate = options.initialDate || new Date();
    this.zIndex = options.zIndex || this.element.data('z-index') || undefined;
    this.title = typeof options.title === 'undefined' ? false : options.title;

    this.icons = {
      leftArrow: this.fontAwesome ? 'fa-arrow-left' : (this.bootcssVer === 3 ? 'glyphicon-arrow-left' : 'icon-arrow-left'),
      rightArrow: this.fontAwesome ? 'fa-arrow-right' : (this.bootcssVer === 3 ? 'glyphicon-arrow-right' : 'icon-arrow-right')
    }
    this.icontype = this.fontAwesome ? 'fa' : 'glyphicon';

    this._attachEvents();

    this.clickedOutside = function (e) {
        // Clicked outside the datetimepicker, hide it
        if ($(e.target).closest('.datetimepicker').length === 0) {
            that.hide();
        }
    }

    this.formatViewType = 'datetime';
    if ('formatViewType' in options) {
      this.formatViewType = options.formatViewType;
    } else if ('formatViewType' in this.element.data()) {
      this.formatViewType = this.element.data('formatViewType');
    }

    this.minView = 0;
    if ('minView' in options) {
      this.minView = options.minView;
    } else if ('minView' in this.element.data()) {
      this.minView = this.element.data('min-view');
    }
    this.minView = DPGlobal.convertViewMode(this.minView);

    this.maxView = DPGlobal.modes.length - 1;
    if ('maxView' in options) {
      this.maxView = options.maxView;
    } else if ('maxView' in this.element.data()) {
      this.maxView = this.element.data('max-view');
    }
    this.maxView = DPGlobal.convertViewMode(this.maxView);

    this.wheelViewModeNavigation = false;
    if ('wheelViewModeNavigation' in options) {
      this.wheelViewModeNavigation = options.wheelViewModeNavigation;
    } else if ('wheelViewModeNavigation' in this.element.data()) {
      this.wheelViewModeNavigation = this.element.data('view-mode-wheel-navigation');
    }

    this.wheelViewModeNavigationInverseDirection = false;

    if ('wheelViewModeNavigationInverseDirection' in options) {
      this.wheelViewModeNavigationInverseDirection = options.wheelViewModeNavigationInverseDirection;
    } else if ('wheelViewModeNavigationInverseDirection' in this.element.data()) {
      this.wheelViewModeNavigationInverseDirection = this.element.data('view-mode-wheel-navigation-inverse-dir');
    }

    this.wheelViewModeNavigationDelay = 100;
    if ('wheelViewModeNavigationDelay' in options) {
      this.wheelViewModeNavigationDelay = options.wheelViewModeNavigationDelay;
    } else if ('wheelViewModeNavigationDelay' in this.element.data()) {
      this.wheelViewModeNavigationDelay = this.element.data('view-mode-wheel-navigation-delay');
    }

    this.startViewMode = 2;
    if ('startView' in options) {
      this.startViewMode = options.startView;
    } else if ('startView' in this.element.data()) {
      this.startViewMode = this.element.data('start-view');
    }
    this.startViewMode = DPGlobal.convertViewMode(this.startViewMode);
    this.viewMode = this.startViewMode;

    this.viewSelect = this.minView;
    if ('viewSelect' in options) {
      this.viewSelect = options.viewSelect;
    } else if ('viewSelect' in this.element.data()) {
      this.viewSelect = this.element.data('view-select');
    }
    this.viewSelect = DPGlobal.convertViewMode(this.viewSelect);

    this.forceParse = true;
    if ('forceParse' in options) {
      this.forceParse = options.forceParse;
    } else if ('dateForceParse' in this.element.data()) {
      this.forceParse = this.element.data('date-force-parse');
    }
    var template = this.bootcssVer === 3 ? DPGlobal.templateV3 : DPGlobal.template;
    while (template.indexOf('{iconType}') !== -1) {
      template = template.replace('{iconType}', this.icontype);
    }
    while (template.indexOf('{leftArrow}') !== -1) {
      template = template.replace('{leftArrow}', this.icons.leftArrow);
    }
    while (template.indexOf('{rightArrow}') !== -1) {
      template = template.replace('{rightArrow}', this.icons.rightArrow);
    }
    this.picker = $(template)
      .appendTo(this.isInline ? this.element : this.container) // 'body')
      .on({
        click:     $.proxy(this.click, this),
        mousedown: $.proxy(this.mousedown, this)
      });

    if (this.wheelViewModeNavigation) {
      if ($.fn.mousewheel) {
        this.picker.on({mousewheel: $.proxy(this.mousewheel, this)});
      } else {
        console.log('Mouse Wheel event is not supported. Please include the jQuery Mouse Wheel plugin before enabling this option');
      }
    }

    if (this.isInline) {
      this.picker.addClass('datetimepicker-inline');
    } else {
      this.picker.addClass('datetimepicker-dropdown-' + this.pickerPosition + ' dropdown-menu');
    }
    if (this.isRTL) {
      this.picker.addClass('datetimepicker-rtl');
      var selector = this.bootcssVer === 3 ? '.prev span, .next span' : '.prev i, .next i';
      this.picker.find(selector).toggleClass(this.icons.leftArrow + ' ' + this.icons.rightArrow);
    }

    $(document).on('mousedown', this.clickedOutside);

    this.autoclose = false;
    if ('autoclose' in options) {
      this.autoclose = options.autoclose;
    } else if ('dateAutoclose' in this.element.data()) {
      this.autoclose = this.element.data('date-autoclose');
    }

    this.keyboardNavigation = true;
    if ('keyboardNavigation' in options) {
      this.keyboardNavigation = options.keyboardNavigation;
    } else if ('dateKeyboardNavigation' in this.element.data()) {
      this.keyboardNavigation = this.element.data('date-keyboard-navigation');
    }

    this.todayBtn = (options.todayBtn || this.element.data('date-today-btn') || false);
    this.clearBtn = (options.clearBtn || this.element.data('date-clear-btn') || false);
    this.todayHighlight = (options.todayHighlight || this.element.data('date-today-highlight') || false);

    this.weekStart = ((options.weekStart || this.element.data('date-weekstart') || dates[this.language].weekStart || 0) % 7);
    this.weekEnd = ((this.weekStart + 6) % 7);
    this.startDate = -Infinity;
    this.endDate = Infinity;
    this.datesDisabled = [];
    this.daysOfWeekDisabled = [];
    this.setStartDate(options.startDate || this.element.data('date-startdate'));
    this.setEndDate(options.endDate || this.element.data('date-enddate'));
    this.setDatesDisabled(options.datesDisabled || this.element.data('date-dates-disabled'));
    this.setDaysOfWeekDisabled(options.daysOfWeekDisabled || this.element.data('date-days-of-week-disabled'));
    this.setMinutesDisabled(options.minutesDisabled || this.element.data('date-minute-disabled'));
    this.setHoursDisabled(options.hoursDisabled || this.element.data('date-hour-disabled'));
    this.fillDow();
    this.fillMonths();
    this.update();
    this.showMode();

    if (this.isInline) {
      this.show();
    }
 };

 DateTimePicker.prototype = {
 	constructor: DateTimePicker,

 	_events: [],

 	_attachEvents: function(){
 		var _this = this;
 		_this._detachEvents();
 		if(_this.isInput){
 			_this._events = [
 				[_this.element,{
 					focus: $.proxy(_this.show, _this),
 					keyup: $.proxy(_this.update, _this),
 					keydown: $.proxy(_this.keydown, _this)
 				}]];
 		}
 		// else if(this.component && this.hasInput){ //component： input +btn

 		// }
 	},
 	_detachEvents: function(){
 		var _this = this;
 		for(var i =0,el,ev;i<_this._events.length;i++){
 			el = _this._events[i][0]; //element
 			ev = _this._events[i][1]; //event
 			el.off(ev);

 		}
 		_this._events = [];
 	},

 	show: function(e){
 		var _this = this;
 		_this.picker.show();
 		_this.height = _this.component ? _this.component.outerHeight : _this.element.outerHeight;
 		if(_this.forceParse){
 			_this.update();
 		} 
 		_this.setLocation();

 		$(window).on("resize", $.proxy(_this.setLocation,_this));
 		if(e){
 			e.stopPropagation();
 			e.preventDefault();
 		}

 		_this.isVisible = true;
 		_this.element.trigger({
 			type: "show",
 			date: _this.date
 		});
 	},

 	hide: function(e){
 		var _this = this;
 		if(!_this.isVisible){
 			return;
 		}
 		if(_this.isInline){
 			return;
 		}

 		_this.picker.hide();
 		$(window).off("resize", _this.setLocation);

 		_this.viewMode = _this.startViewMode;
 		_this.showMode();

 		if(!_this.isInput){
 			$(document).off("mousedown", _this.hide);
 		}



 		_this.setValue();
 		_this.isVisible = false;
 		_this.element.trigger({
 			type: "hide",
 			date: _this.date
 		});
 	},

 	remove: function(){
 		var _this = this;
 		_this._detachEvents();
 		$(document).off("mousedown", _this.clickOutside);
 		_this.picker.remove();
 		delete _this.picker;
 		delete _this.element.date().datetimepicker;
 	},

 	getDate: function(){
 		var _this = this;
 		var d = this.getUTCDate();

 		return new Date(d.getTime() + (d.getTimezoneOffset()*60000));
 	},

 	getUTCDate: function(){
 		var _this = this;
 		return _this.date;
 	},
 	setUTCDate: function(date){
 		var _this = this;
 		if(date > _this.startDate && d <= _this.endDate){
 			_this.date = date;
 			_this.setValue();
 			_this.viewDate = date; //_this.viewDate = _this.date
 			_this.fill();
 		}else{
 			_this.element.trigger({
 				type: "outOfRange",
 				date: date,
 				startDate: _this.startDate,
 				endDate: _this.endDate
 			});
 		}
 	},

 	getInitialDate: function(){
 		var _this = this;
 		return _this.initialDate;
 	},

 	setInitialDate: function(date){
 		var _this = this;
 		_this.initialDate = date;
 	},

 	setDate: function(date){
 		var _this = this;
 		_this.setUTCDate(new Date(date.getTime()- (date.getTimezoneOffset()*60000)));
 	},

 	setFormat: function(format){
 		var _this = this;
 		var ele;
 		_this.format = DPGlbal.parseFormat(format, _this.formatType);
 		if(_this.isInput){
 			ele = _this.element;
 		}else if(_this.component){
 			ele = _this.element.find("input");
 		}

 		if(ele && ele.val()){
 			_this.setValue();
 		}
 	},

 	setValue: function(){
 		var _this = this;
 		var formatted = _this.getFormattedDate();
 		if(!_this.isInput){
 			if(_this.component){
 				_this.element.find("input").val(formatted);
 			}
 			_this.element.date("date", formatted);
 		}else{
 			_this.element.val(formatted);
 		}

 		if(_this.linkField){
 			$("#" + _this.linkField).val(_this.getFormattedDate(_this.linkFormat));
 		}

 	},

 	getFormattedDate: function(format){
 		var _this = this;
 		if(format === undefined){ //undefined format
 			format = _this.format;
 		}
 		return DPGlobal.formatDate(_this.date,format,_this.language,_this.formatType);

 	},

 	setStartDate: function(startDate){
 		var _this = this;
 		_this.startDate = startDate || -Infinity;
 		if(_this.startDate !== -Infinity){
 			_this.startDate = DPGlobal.parseDate(_this.startDate, _this.format,_this.language,_this.formatType);
 		}
 		_this.update();
 		_this.updateNavArrows();
 	},

 	setEndDate: function(endDate){
 		var _this = this;
 		_this.endDate = endDate || Infinity;
 		if(_this.endDate !== Infinity){
 			_this.endDate = DPGlobal.parseDate(_this.endDate, _this.format,_this.language,_this.formatType);
 		}
 		_this.update();
 		_this.updateNavArrows();
 	},

 	setDisabledDate: function(disabledDate){ //disabled date in array
 		var _this = this;
 		_this.disabledDate = disabledDate || [];
 		if(!$.isArray(_this.disabledDate)){ //if disabledDate is not empty
 			_this.disabledDate = _this.disabledDate.split(/,\s*/);
 		}
 		_this.disabled = $.map(_this.disabledDate, function(d){ // parse every disabledDate to a FormatDate in string 
 			return DPGlobal.parseDate(d, _this.format, _this.language, _this.formatType).toDateString();
 		});

 		_this.update();
 		_this.updateNavArrows();
 	},

 	setDisabledDaysOfWeek: function(disabledDaysOfWeek){ //disabledDaysOfWeek in array
 		var _this = this;
 		_this.disabledDaysOfWeek = disabledDaysOfWeek || [];
 		if(!$.isArray(_this.disabledDaysOfWeek)){
 			_this.disabledDaysOfWeek = _this.disabledDaysOfWeek.split(/,\s*/);
 		}
 		_this.disabledDaysOfWeek = $.map(_this.disabledDaysOfWeek,function(d){
 			//parse string to int type
 			return parseInt(d,10);
 		});
 		_this.update();
 		_this.updateNavArrows();
 	},

 	setDisabledMinutes: function(disabledMinutes)	{
 		var _this = this;
 		_this.disabledMinutes = disabledMinutes || [];
 		if(!$.isArray(_this.disabledMinutes)){
 			_this.disabledMinutes = _this.disabledMinutes.split(/,\s*/);
 		}
 		_this.disabledMinutes = $.map(_this.disabledMinutes, function(d){
 			return parseInt(d,10);
 		});	 
 		_this.update();
 		_this.updateNavArrows();
 	},

 	setDisabledHours: function(disabledHours){
 		var _this = this;
 		_this.disabledHours = disabledHours || [];
 		if(!$.isArray(_this.disabledHours)){
 			_this.disabledHours = _this.disabledHours.split(/,\s*/);
 		}
 		_this.disabledHours = $.map(_this.disabledHours,function(d){
 			return parseInt(d,10);
 		});
 		_this.update();
 		_this.updateNavArrows();
 	},

 	setTitle: function(selector, title){
 		var _this = this;
 		return _this.picker.find(selector)
 					.find('th:eq(1')
 					.text(_this.title === false ? title : _this.title);
 	},

 	setLocation: function(){
 		var _this = this;

 		if(_this.isInline){
 			return;
 		}

 		//set z-index of each div
 		if(!_this.zIndex){
 			var topIndex = 0;
 			$("div").each(function(){
 				var currentIndex = parseInt($(this).css("index"),10);
 				if(currentIndex > topIndex){
 					topIndex = currentIndex;
 				}

 			});
 			_this.zIndex = topIndex + 10;
 		}

 		var offset,
 			top,
 			left,
 			containerOffset;

 		var bodyWidth = document.body.clientWidth || window.innerWidth;
 		if(_this.container instanceof $){
 			containerOffset = _this.container.offset();
 		}else{
 			containerOffset = $(_this.container).offset();
 		}

 		if(_this.component){
 			offset = _this.component.offset();
 			left = offset.left;
 			if(_this.pickerPosition === "bottom-left" || _this.pickerPosition === "top-left"){
 				left += _this.component.outerWidth() - _this.picker.outerWidth();
 			}
 		}else{
 			offset = _this.element.offset();
 			left = offset.left;
 			if(_this.pickerPosition === "bottom-left" || _this.pickerPosition === "top-left"){
 				left += _this.component.outerWidth() - _this.picker.outerWidth();
 			}
 		}

 		if(left + 220 > bodyWidth){
 			left = bodyWidth - 220;
 		}
 		if(_this.component){
 			top = top - containerOffset.top + 169;
 			left = left - containerOffset + 210;
 		}else{
 			if(_this.pickerPosition === "top-left" || _this.pickerPosition === "top-right"){
 				top = offset.top - _this.picker.outerHeight();
 			}else{
 				top = offset.top + _this.height;
 			}
 		}

 		_this.picker.css({
 			top: top,
 			left: left,
 			zIndex: _this.zIndex
 		});
 	},

 	update: function(){
 		var _this = this;
 		var date,
 			fromArgs = false;

 		if(arguments && arguments.length && (typeof arguments[0] === "string" || arguments[0] instanceof Date)){
 			date = arguments[0];
 			formArgs = true;
 		}else{
 			date = (_this.isInput? _this.element.val() : _this.element.find("input").val()) || _this.element.date("date") || _this.initialDate;
 			if(typeof date === "string" || date instanceof String){
 				date = date.replace(/^\s+|\s+$/g,"");
 			}
 		}

 		if(!date){
 			date = new Date();
 			formArgs = false;
 		}

 		_this.date = DPGlobal.parseDate(date, _this.format, _this.language, _this.formatType);

 		if(formArgs){
 			_this.setValue();
 		}
 		if(_this.date < _this.startDate){
 			_this.viewDate = new Date(_this.startDate);
 		}else if(_this.date > _this.endDate){
 			_this.viewDate = new Date(_this.endDate);
 		}else{
 			_this.viewDate = new Date(_this.date);
 		}
 		_this.fill();

 	},

 	fillDow: function(){ //fill days of week
 		var _this = this;
 		var dowCnt = _this.startWeek,
 			html = '<tr>';
 		while(dowCnt < _this.startWeek + 7){
 			html += '<th class="dow">' + dates[_this.language].daysMin[(dowCnt++) % 7] + '</th'; 
 		}
 		html +=	'</tr>';
 		_this.picker.find('.datetimepicker-days thead').append(html);
 	},

 	fillMonths: function(){
 		var _this = this;
 		var html = '',
 			i=0;
 		while(i<12){
 			html += '<span class="month>' + dates[_this.language].mongthShort[i++] + '</span>';
		}
		_this.picker.find('.datetimepicker-mongths td').html(html);
 	},

 	fill: function(){
 		var _this = this;
 		if(_this.date === null || _this.viewDate === null){
 			return;
 		}
 		var d = new Date(_this.viewDate),
 			year = d.getUTCFullYear(),
 			mon = d.getUTCMonth(),
 			dayMonth = d.getUTCDate(),
 			hour = d.getUTCHours(),
 			min = d.getUTCMinutes,
 			startYear = _this.startDate !== -Infinity ? _this.startDate.getUTCFullYear() : -Infinity,
 			endYear = _this.endDate !== Infinity ? _this.endDate.getUTCFullYear() : Infinity,
 			startMon = _this.startDate !== -Infinity ? _this.startDate.getUTCMonth()+1 : -Infinity,
 			endMon = _this.endDate !== -Infinity ? _this.endDate.getUTCMonth()+1 : Infinity,
 			currentDate = (new UTCDate(_this.date.getUTCFullYear(), _this.date.getUTCMonth(),_this.date.getUTCDate())).valueOf(),
 			today = new Date();

 		_this.setTitle(".datetimepicker-days", dates[_this.language].months[mon] + " "+year);

 		if(_this.formatViewType === "time"){
 			var formatted = _this.getFormattedDate();
 			_this.setTitle(".datetimepicker-hours", formatted);
 			_this.setTitle(".datetimepicker-minutes", formatted);
 		}else{
 			_this.setTitle(".datetimepicker-hours", dayMonth + " " + dates[_this.language].months[mon] + " " + year);
 			_this.setTitle(".datetimepicker-minutes", daysMonth + " " + dates[_this.language].months[mon] + " " + year);

 		}	
 		_this.picker.find("tfoot th.today")
 					.text(dates[_this.language].today || dates["en"].today)
 					.toggle(_this.todayBtn !== false);
 		_this.picker.find("tfoot .th.clear")
 					.text(dates[_this.language].clear || dates["en"].clear)
 					.toggle(_this.todayBtn !== false);
 		
 		_this.updateNavArrows();
 		_this.fillMonths();

 		var prevMonth = UTCDate(year, mon-1, 28,0,0,0,0),
 			day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
 		prevMonth.setUTCDate(day);
 		prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - _this.startWeek +7)%7);

 		var nextMonth = new Date(prevMonth);
 		nextMonth.setUTCDate(nextMonth.getUTCDate + 42);
 		nextMonth = nextMonth.valueOf();	

 		var html = [];
 		var className;
 		while(prevMonth.valueOf < nextMonth){
 			if(prevMonth.getUTCDay() === _this.startWeek){
 				html.push('<tr>');
 			}
 			className = "";
 			if(prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() === year && prevMonth.getUTCMonth() < mongth)){
 				className += "old";
 			}else if(prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() === year && prevMonth.getUTCMonth() > mongth)){
 				className += "new";
 			}

 			if(_this.todayHilight && prevMonth.getUTCFullYear() === today.getFullYear() &&
 				prevMonth.getUTCMonth() === today.getMonth() && 
 				prevMonth.getUTCDate() === today.getDate()){
 				className += "today";
 			}
 			if(prevMonth.valueOf() === currentDate){
 				className += "active";
 			}
 			if((prevMonth.valueOf() + 86400000) <= _this.startDate || prevMonth.valueOf() > _this.endDate ||
 				$.inArray(prevMonth.getUTCDay(), _this.disabledDaysOfWeek) !== -1 ||
 				$.inArray(prevMonth.toDateString(), _this.disabledDate) !== -1){
 				className += "disabled";
 			}

 			html.push('<td class="day' + className + '">' + prevMonth.getUTCDate() + '</td>');
 			if(prevMonth.getUTCDay() === _this.endWeek){
 				html.push('</tr>');
 			}
 			prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
 		}

 		_this.picker.find('.datetimepicker-days tbody').empty().append(html.join(''));

 		html = [];
 		var txt = '',
 			meridian = '',
 			meridianOld = '';
 		var disabledMinutes = _this.disabledMinutes || [];
 		for(var i =0; i < 60;i++){
 			if(disabledMinutes.indexOf(i) !== -1){
 				continue;
 			}
 			var actual = UTCDate(year, mon, dayMonth , hour, i, 0);
 			className = "";
 			if(actual.valueOf < _this.startDate || actual.valueOf() > _this.endDate){
 				className += "disabled";
 			}else if(Math.floor(min / _this.minuteStep) === Math.floor(i/_this.minuteStep)){
 				className += "active";
 			}
 			// if(_this.showMeridian && )
 		}
 	},

 	updateNavArrows: function(){
 		var _this = this;
 		var d = new Date(_this.viewDate),
 			year = d.getUTCFullYear(),
 			mon = d.getUTCMonth(),
 			day = d.getUTCDay(),
 			hour = d.getUTCHours();

 		switch(_this.viewDate){
 			case 0:
 				if(_this.startDate !== -Infinity && year <= _this.startDate.getUTCFullYear() 
 					&& mon <= _this.startDate.getUTCMonth()
 					&& day <= _this.startDate.getUTCDate()
 					&& hour <= _this.startDate.getUTCHours()){
 					_this.picker.find('.prev').css({"visibility": "hidden"});
 				}else{
 					_this.picker.find('.prev').css({"visibility": "visible"});
 				}

 				if(_this.endDate !== Infinity && year >= _this.endDate.getUTCFullYear()
 					&& mon >= _this.endDate.getUTCMonth()
 					&& day >= _this.endDate.getUTCDate()
 					&& hour >= _this.endDate.getUTCHours()){
 					_this.picker.find('.next').css({"visibility": "hidden"});
 				}else{
 					_this.picker.find('.next').css({"visibility": "visbile"});
 				}
 				break;
 			case 1:
 				if(_this.startDate !== -Infinity && year <= _this.startDate.getUTCFullYear()
 					&& mon <= _this.getUTCMonth()
 					&& day <= _this.getUTCDate()){
 					_this.picker.find('prev').css({"visibility": "hidden"});
 				}else{
 					_this.picker.find('prev').css({"visibility": "visible"});
 				}
 				if(_this.endDate !== Infinity && year >= _this.endDate.getUTCFullYear()
 					&& mon >= _this.endDate.getUTCMonth()
 					&& day >= _this.endDate.getUTCDate()){
 					_this.picker.find('next').css({"visibility": "hidden"});
 				}else{
 					_this.picker.find('next').css({"visibility": "visible"});
 				}
 				break;
 			case 2:
 				if(_this.startDate !== -Infinity && year <= _this.startDate.getUTCFullYear()
 					&& mon <= _this.getUTCMonth()){
 					_this.picker.find('prev').css({"visibility": "hidden"});
 				}else{
 					_this.picker.find('prev').css({"visibility": "visible"});
 				}
 				if(_this.endDate !== Infinity && year >= _this.endDate.getUTCFullYear()
 					&& mon >= _this.endDate.getUTCMonth()){
 					_this.picker.find('next').css({"visibility": "hidden"});
 				}else{
 					_this.picker.find('next').css({"visibility": "visible"});
 				}
 				break;
 			case 3:
 				break;
 			case 4:
 				if(_this.startDate !== -Infinity && year <= _this.startDate.getUTCFullYear()){
 					_this.picker.find('prev').css({"visibility": "hidden"});
 				}else{
 					_this.picker.find('prev').css({"visibility": "visible"});
 				}
 				if(_this.endDate !== Infinity && year >= _this.endDate.getUTCFullYear()){
 					_this.picker.find('next').css({"visibility": "hidden"});
 				}else{
 					_this.picker.find('next').css({"visibility": "visible"});
 				}
 				break;
 			default: 
 				break;
 		}
 	},

 	mousewheel: function(e){
 		e.preventDefault();
 		e.stopPropagation();

 		var _this = this;
 		if(_this.wheelPause){
 			return;
 		}

 		_this.wheelPause = true;
 		var originalEvent = e.originalEvent,
 			delta = originalEvent.wheelDelta,
 			mode = delta>0? 1: (delta ===0)?0:1;

 		if(_this.wheelViewModeNavigationInverseDirection){
 			mode = -mode;
 		}
 		_this.showMode(mode);

 		setTimeout($.proxy(function(){
 			_this.wheelPause = false;
 		}, _this),_this.wheelViewModeNavigationDelay);
 	},

 	click: function(e){
 		e.preventDefault();
 		e.stopPropagation();
 		var _this = this;
 		var target = $(e.target).closet('span, td, th, legend');
 		if(target.is('.'+ _this.icontype)){
 			target = $(target).parent().closet('span, td, th, legend');
 		}
 		if(target.length === 1){
 			if(target.is('.disabled')){
 				_this.element.trigger({
 					type: 'outOfRange',
 					date: _this.viewDate,
 					startDate: _this.startDate,
 					endDate: _this.endDate 
 				});
 				return;
 			}
 			switch(target[0].nodeName.toLowerCase()){
 				case 'th':
 					switch(target[0].className){
 						case 'switch':
 							_this.showMode(1);
 							break;
 						case 'prev':
 							break;
 						case 'next':
 							var dir = DPGlobal.modes[_this.viewMode].navStep * (target[0].className === 'prev' ? -1:1);
 							switch(_this.viewMode){
 								case 0:
 									_this.viewDate = _this.moveHour(_this.viewDate, dir);
 									break;
 								case 1:
 									_this.viewDate = _this.moveDate(_this.viewDate, dir);
 									break;
 								case 2:
 									_this.viewDate = _this.moveMonth(_this.viewDate, dir);
 									break;
 								case 3:
 									break;
 								case 4:
 									_this.viewDate = _this.moveYear(_this.viewDate, dir);
 									break;
 								default:
 									break;
 							}
 							_this.fill();
 							_this.element.trigger({
 								type: target[0].className + ':' + _this.convertViewModeText(_this.viewMode),
 								date: _this.viewDate,
 								startDate: _this.startDate,
 								endDate: _this.endDate
 							});
 							break;
 						case 'clear':
 							_this.reset();
 							if(_this.autoclose){
 								_this.hide();
 							}
 							break;
 						case 'today':
 							var date = new Date();
 							date = UTCDate(date.getFullYear(), date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());

 							if(date < _this.startDate){
 								date = _this.startDate;
 							}else if(date > _this.endDate){
 								date = _this.endDate;
 							}
 							_this.viewMode = _this.startViewMode;
 							_this.showMode(0);
 							_this._setDate(date);
 							_this.fill();
 							if(_this.autoclose){
 								_this.hide();
 							}
 							break;
 						}		
 						break;

 					case 'span':
 						if(!target.is('.disabled')){
 							var year = _this.viewDate .getUTCFullYear(),
 								mon = _this.viewDate.getUTCMonth(),
 								day = _this.viewDate.getUTCDate(),
 								hours = _this.viewDate.getUTCHours(),
 								minutes = _this.viewDate.getUTCMinutes(),
 								seconds = _this.viewDate.getUTCSeconds();
 							
 							if(target.is('.month')){
 								_this.viewDate.setUTCDate(1);
 								mon = target.parent().find('span').index(target);
 								day = _this.viewDate.getUTCDate();
 								_this.viewDate.setUTCMonth(mon);
 								_this.element.trigger({
 									type: 'changeMonth',
 									date: _this.viewDate
 								});
 								if(_this.viewSelect >= 3){
 									_this._setDate(UTCDate(year, mon, day, hours, minutes, seconds, 0));
 								}
 							}else if(target.is('.year')){
 								_this.viewMode.setUTCDate(1);
 								year = parseInt(target.text(), 10) || 0;
 								_this.viewDate.setUTCFullYear(year);
 								_this.element.trigger({
 									type: 'changeYear',
 									date: _this.viewDate
 								});
 								if(_this.viewSelect >= 4){
 									_this._setDate(UTCDate(year, mon, day, hours,minutes,seconds,0));
 								}
 							}else if(target.is('.hour')){
 								hours = parseInt(target.text(),10) || 0;
 								if(target.hasClass("hour_am") || target.hasClass("hour_pm")){
 									if(hours === 12 && target.hasClass("hour_am")){
 										hours = 0;
 									}else if(hours !== 12 && target.hasClass("hour_pm")){
 										hours += 12;
 									}
 								}
 								_this.viewDate.setUTCHours(hours);
 								_this.element.trigger({
 									type: 'changeHour',
 									date: _this.viewDate
 								});
 								if(_this.viewSelect >= 1){
 									_this._setDate(UTCDate(year, mon,day,hours,minutes,seconds,0));
 								}
 							}else if(target.is('.minute')){
 								 minutes = parseInt(target.text().substr(target.text().indexOf(':') + 1), 10) || 0;
 								 _this.viewDate.setUTCMinutes(minutes);
 								 _this.element.trigger({
 								 	type: 'changeMinute',
 								 	date: _this.viewDate
 								 });
 								 if(_this.viewSelect >= 0){
 								 	var oldView = _this.viewMode;
 								 	_this.showMode(-1);
 								 	_this.fill();
 								 	if(oldViewMode === _this.viewMode && _this.autoclose){
 								 		_this.hide();
 								 	}
 								 }else{
 								 	_this.fill();
 								 	if(_this.autoclose){
 								 		_this.hide();
 								 	}
 								}
 							}
 						}
 						break;
 					case 'td':
 						if(target.is('.day') && !target.is('.disabled')){
 							var day = parseInt(target.next(),10) || 1;
 							var year = _this.viewDate.getUTCFullYear(),
 								mon = _this.viewDate.getUTCMonth(),
 								day = _this.viewDate.getUTCHours(),
 								minutes = _this.viewDate.getUTCMinutes(),
 								seconds = _this.viewDate.getUTCSeconds();
 							if(target.is('.old')){
 								if(mon === 0){
 									mon = 11;
 									year -= 1;
 								}else{
 									mon -= 1;
 								}
 							}else if(target.is('.new')){
 								if(mon === 11){
 									mon = 0;
 									year += 1;
 								}else{
 									mon += 1;
 								}
 							}
 							_this.viewDate.setUTCFullYear(year);
 							_this.viewDate.setUTCMonth(mon);
 							_this.element.trigger({
 								type: 'changeDay',
 								date: _this.viewDate
 							});
 							if(_this.viewSelect >= 2){
 								_this._setDate(UTCDate(year, mon, day, hours, minutes,seconds,0));
 							}
 						}
 						var oldViewMode = _this.viewMode;
 						_this.showMode(-1);
 						_this.fill();
 						if(oldViewMode === _this.viewMode && _this.autoclose){
 							_this.hide();
 						}
 						break;		
 			}
 		}
 	},

 	_setDate: function(date, which){
 		var _this = this;
 		if(!which || which === 'date'){
 			_this.date = date;
 		}
 		if(!which || which === 'view'){
 			_this.viewDate = date;
 		}
 		_this.fill();
 		_this.setValue();

 		var element;
 		if(_this.isInput){
 			element = _this.element
 		}else if(_this.component){
 			element = _this.element.find('input');
 		}
 		if(element){
 			element.change();
 			if(_this.autoclose && (!which || which === 'date')){
 				_this.hide();
 			}
 		}
 		_this.element.trigger({
 			type: 'changeDate',
 			date: _this.getDate()
 		});
 		if(date === null){
 			_this.date = _this.viewDate;
 		}
 	},

 	moveMinute: function(date, dir){
 		var _this = this;
 		if(!dir){
 			return date;
 		}
 		var new_date = new Date(date.valueOf());
 		new_date.setUTCMinutes(new_date.getUTCMinutes() + (dir*_this.minuteStep));
 		return new_date;
 	},

 	moveHour: function(date, dir){
 		var _this = this;
 		if(!dir){
 			return date;
 		}
 		var new_date = new Date(date.valueOf());
 		new_date.setUTCHours(new_date.getUTCHours() + dir);
 		return new_date;
 	},

 	moveDate: function(date, dir){
 		var _this = this;
 		if(!dir){
 			return date;
 		}
 		var new_date = new Date(date.valueOf());
 		new_date.setUTCDate(new_date.getUTCDate() + dir);
 		return new_date;
 	},

 	moveMonth: function(date, dir){
 		var _this = this;
 		if(!dir){
 			return date;
 		}
 		var new_date = new Date(date.valueOf()),
 			day = new_date.getUTCDate(),
 			mon = new_date.getUTCMonth(),
 			mag = Math.abs(dir),
 			new_mon,
 			test;

 		dir = dir > 0 ? 1 : -1;
 		if(mag ===1){
 			test = dir == -1 
 			? function(){
 				return new_date.getUTCMonth() === new_mon;
 			}
 			: function(){
 				return new_date.getUTCMonth() !== new_mon;
 			};
 			new_mon = mon + dir;
 			new_date.setUTCMonth(new_mon);

 			if(new_mon < 0 || new_mon > 11){
 				new_mon = (new_mon + 12)%12;
 			}
 		}else{
 			for(var i=0;i<mag;i++){
 				new_date = _this.moveMonth(new_date, dir);
 			}
 			new_mon = new_date.getUTCMonth();
 			new_date.setUTCDate(day);
 			test = function(){
 				return new_mon !== new_date.getUTCMonth();
 			};
 			
 		}	
 		while(test()){
 			new_date.setUTCDate(--day);
 			new_date.setUTCMonth(new_mon);
 		}

 		return new_date;
 	},

 	moveYear: function(date, dir){
 		var _this = this;
 		return _this.moveMonth(date, dir*12);
 	},

 	dateWithinRange: function(date){
 		var _this = this;
 		return date >= _this.startDate && date <= _this.endDate;
 	},

 	keydown: function(e){
 		var _this = this;
 		if(_thhs.picker.is(':not(:visible)')){
 			if(e.keyCode === 27){ //escape key
 				_this.throw();
 			}
 			return;
 		}

 		var dateChanged = false;
 		var dir, day, mon, newDate, newViewDate;

 		switch(e.keyCode){
 			case 27: //escape
 				_this.hide();
 				e.preventDefault();
 				break;
 			case 37: //left
 				break;
 			case 39: //right
 				if(!_this.keyboardNavigation){
 					break;
 				}

 				dir = e.keyCOde === 37 ? -1 : 1;
 				viewMode = _this.viewMode;
 				if(e.ctrlKey){
 					viewMode += 2;
 				}else if(e.shiftKey){
 					viewMode += 1;
 				}

 				if(viewMode === 4){
 					newDate = _this.moveYear(_this.date, dir);
 					newViewDate = _this.moveYear(_this.viewDate, dir);
 				}else if(viewMode === 3){
 					newDate = _this.moveMonth(_this.date, dir);
 					newViewDate = _this.moveMonth(_this.viewDate,dir);
 				}else if(viewMode === 2){
 					newDate = _this.moveDate(_this.date, dir);
 					newViewDate = _this.moveDate(_this.viewDate, dir);
 				}else if(viewMode === 1){
 					newDate = _this.moveHour(_this.date, dir);
 					newViewDate = _this.moveHour(_this.viewDate, dir);
 				}else if(viewMode === 0){
 					newDate = _this.moveMinute(_this.date, dir);
 					newViewDate = _this.moveMinute(_this.viewDate, dir);
 				}

 				if(_this.dateWithinRange(newDate)){
 					_this.date = newDate;
 					_this.viewDate = newViewDate;
 					_this.setValue();
 					_this.update();
 					e.preventDefault();
 					dateChanged = true;
 				}
 				break;
 			case 38: // up

 			case 40: //down
 				if(!_this.keyboardNavigation){
 					break;
 				}
 				dir = e.keyCode === 38? -1:1;
 				viewMode = _this.viewMode;
 				if(e.ctrlKey){
 					viewMode += 2;
 				}else if(e.shiftKey){
 					viewMode += 1;
 				}
 				if(viewMode === 4){
 					newDate = _this.moveYear(_this.date, dir);
 					newViewDate = _this.moveYear(_this.viewDate ,dir);
 				}else if(viewMode === 3){
 					newDate = _this.moveMonth(_this.date, dir*7);
 					newViewDate = _this.moveMonth(_this.viewDate, dir*7);
 				}else if(viewMode === 2){
 					newDate = _this.moveDate(_this.date, dir);
 					newViewDate = _this.moveDate(_this.viewDate, dir);
 				}else if(viewMode ===1){
 					if(_this.showMeridian){
 						newDate = _this.moveHour(_this.date, dir*6);
 						newViewDate = _this.moveHour(_this.viewMode, dir*6);
 					}else{
 						newDate = _this.moveHour(_this.date, dir *4);
 						newViewDate = _this.moveHour(_this.viewMode, dir*4);
 					}
 				}else if(viewMode === 0){
 					newDate = _this.moveMinute(_this.date, dir*4);
 					newViewDate = _this.moveMinute(_this.viewMode, dir*4);
 				}

 				if(_this.dateWithinRange(newDate)){
 					_this.date = newDate;
 					_this.viewDate = newViewDate;
 					_this.setValue();
 					_this.update();
 					e.preventDefault();
 					dateChanged = true;
 				}
 				break;
 			case 13: //enter
 				if(_this.viewMode !== 0){
 					var oldViewMode = _this.viewMode;
 					_this.showMeridian(-1);
 					_this.fill();
 					if(oldViewMode === _this.viewMode && _this.autoclose){
 						_this.hide();
 					}
 				}else{
 					_this.fill();
 					if(_this.autoclose){
 						_this.hide();
 					}
 				}
 				e.preventDefault();
 				break;
 			case 9: //tab
 				_this.hide();
 				break;
 			default: 
 				break;
 		}
 		if(dateChanged){
 			var element;
 			if(_this.isInput){
 				element = _this.element;
 			}else if(_this.component){
 				element = _this.element.find('input');
 			}
 			if(element){
 				element.change();
 			}
 			_this.element.trigger({
 				type: 'changeDate',
          		date: _this.getDate()
 			});
 		}	
 	},

 	showMode: function(dir){
 		var _this = this;
 		if(dir){
 			var newViewMode = Math.max(0,Math.min(DPGlobal.modes.length -1, _this.viewMode + dir));
 			if(newViewMode >= _this.minView && newViewMode <= _this.maxView){
 				_this.element.trigger({
 					type: 'changeMode',
 					date: _this.viewDate,
 					oldViewMode: _this.viewMode,
 					newViewMode: newViewMode
 				});

 				_this.viewMode = newViewMode;
 			} 
 		}

 		_this.picker.find('>div').hide().filter('datetimepicker-' + DPGlobal.modes[_this.viewMode].className).css('display','block');
 		_this.updateNavArrows();
 	},

 	reset: function(e){
 		var _this = this;
 		_this._setDate(null, 'date');
 	},


 	convertViewModeText: function(viewMode){
 		switch(viewMode){
 			case 4:
 				return 'decade';
 			case 3:
 				return 'year';
 			case 2: 
 				return 'month';
 			case 1:
 				return 'day';
 			case 0:
 				return 'hour';
 			default:
 				breakl;
 		}
 	},
 }; 	

 var old = $.fn.datetimepicker;
 $.fn.datetimepicker = function(options){
 	var dates = $.fn.datetimepicker.dates ={
 		en: {
 			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
 			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
 			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
 			months:      ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      		monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      		meridiem:    ["am", "pm"],
      		suffix:      ["st", "nd", "rd", "th"],
      		today:       "Today",
      		clear:       "Clear"
 		}
 	};

 	var DPGlobal = {
 		modes: [
 			{
 				className: "minutes",
 				navFnc: "Hours",
 				navStep: 1
 			},
 			{
 				className: "hours",
 				navFnc: "Date",
 				navStep: 1
 			},
 			{
 				className: "days",
 				navFnc: "Month",
 				navStep: 1
 			},
 			{
 				className: "months",
 				navFnc: "FullYear",
 				navStep: 1
 			},
 			{
 				className: "years",
 				navFnc: "FullYear",
 				navStep: 10
 			}
 		],
 		isLeapYear: function(year){
 			return (((year % 4 ===0) && (year % 100 !== 0)) || (year %400 === 0));
 		},
 		getDaysInMonth: function(year, mon){
 			var arr = [31, (DPGlobal.isLeapYear(year) ? 29: 28),31,30,31,30,31,31,30,31,30,31];
 			return arr[mon];
 		},
 		getDefaultFormat: function(type, field){
 			if(type === "standard"){
 				if(field === "input"){
 					return "yyyy-mm-dd hh:ii";
 				}else{
 					return "yyyy-mm-dd hh:ii:ss";
 				}
 			}else if(type === "php"){
 				if(field === "input"){
 					return "Y-m-d H:i";
 				}else{
 					return "Y-m-d H:i:s";
 				}
 			}else{
 				throw new Error("Invalid format type");
 			}
 		},
 		validParts: function(type){
 			if(type === "standard"){
 				return /t|hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
 			}else if(type ==="php"){
 				return /[dDjlNwzFmMnStyYaABgGhHis]/g;
 			}else{
 				throw new Error("Invalid format type");
 			}
 		},
 		nonpunctuation: /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,	
 		parseFormat: function(format, type){
 			var separator = format.replace(this.validParts(type), '\0').split('\0'),
 				parts = format.match(this.validParts(type));
 			if(!separator || !separator.length || !parts || parts.length === 0){
 				throw new Error("Invalid date format");
 			}
 			return {separator: separator, parts: parts};

 		},
 		parseDate: function(date, format, language, type){
 			if(date instanceof Date){
 				var dateUTC = new Date(date.valueOf() - date.getTimezoneOffset()*60000);
 				dateUTC.setMillionseconds(0);
 				return dateUTC;
 			}
 			if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)) {
        		format = this.parseFormat('yyyy-mm-dd', type);
      		}
      		if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(date)) {
        		format = this.parseFormat('yyyy-mm-dd hh:ii', type);
      		}
      		if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(date)) {
        		format = this.parseFormat('yyyy-mm-dd hh:ii:ss', type);
        	}
      		
      		if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
        		var part_re = /([-+]\d+)([dmwy])/,
          			parts = date.match(/([-+]\d+)([dmwy])/g),
          			part, 
          			dir;
        		date = new Date();
        		for (var i = 0; i < parts.length; i++) {
          			part = part_re.exec(parts[i]);
          			dir = parseInt(part[1]);
          			switch (part[2]) {
            			case 'd':
              				date.setUTCDate(date.getUTCDate() + dir);
              				break;
            			case 'm':
              				date = Datetimepicker.prototype.moveMonth.call(Datetimepicker.prototype, date, dir);
              				break;
            			case 'w':
              				date.setUTCDate(date.getUTCDate() + dir * 7);
              				break;
            			case 'y':
              				date = Datetimepicker.prototype.moveYear.call(Datetimepicker.prototype, date, dir);
              				break;
          			}
       			}
        		return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), 0);
      		}

      		var parts = date && date.toString().match(this.nonpunctuation) || [],
      			date = new Date(0,0,0,0,0,0,0),
      			parsed = {},
      			setters_order = ["hh", "h", "ii", "i", "ss", "s", "yyyy", "yy", "M", "MM", "m", "mm", "D", "DD", "d", "dd", "H", "HH", "p", "P"],
      			setters_map = {
      				hh: function(d,v){
      					return d.setUTCHours(v);
      				},
      				h: function(d,v){
      					return d.setUTCHours(v);
      				},
      				HH: function(d,v){
      					return d.setUTCHours(v === 12? 0: v);
      				},
      				H: function(d,v){
      					return d.setUTCHours(v === 12? 0:v);
      				},
      				ii: function(d,v){
      					return d.setUTCMinutes(v);
      				},
      				i: function(d,v){
      					return d.setUTCMinutes(v);
      				},
      				ss: function(d,v){
      					return d.setUTCSeconds(v);
      				},
      				s: function(d,v){
      					return d.setUTCSeconds(v);
      				},
      				yyyy: function(d,v){
      					return d.setUTCFullYear(v);
      				},
      				yy: function(d,v){
      					return d.setUTCFullYear(2000+v);
      				},
      				m: function(d,v){
      					v -= 1;
      					while(v<0){
      						v += 12;
      					}
      					v %= 12;
      					d.setUTCMonth(v);
      					while(d.getUTCMonth() !== v){
      						if(isNan(d.getUTCMonth())){
      							return d;
      						}else{
      							d.setUTCDate(d.getUTCDate() -1);
      						}
      					}
      					return d;
      				},
      				d: function(d,v){
      					return d.setUTCDate();
      				},
      				p: function(d){
      					return	d.setUTCHours( v ===1 ? d.getUTCHours() +12 : d.getUTCHours());
      				}

      			},

      			val, filtered, part;
      			setters_map["M"] = setters_map["MM"] = setters_map["mm"] = setters_map["m"];
 				setters_map["dd"] = setters_map["d"];
 				setters_map["P"] = setters_map["p"];
 				date = UTCDate(date.getUTCFullYear(), date.getMonth(), date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
 				if(parts.length === format.parts.length){
 					for(var i=0, cnt=format.parts.length;i<cnt;i++){
 						val = parseInt(parts[i],10);
 						part = format.parts[i];
 						if(isNaN(val)){
 							switch(part){
 								case "MM":
 									filtered = $(date[language].months).filter(function(){
 										var m = this.slice(0, parts[i].length),
 											p = parts[i].slice(0, m.length);
 										return m == p;
 									});
 									val = $.inArray(filtered[0], dates[language].months) + 1;
 									break;
 								case "M":
 									filtered = $(date[language].monthsShort).filter(function(){
 										var m = this.slice(0, parts[i].length),
 											p = parts[i].slice(0, m.length);
 										return m.toLowerCase() == p.toLowerCase(); 
 									});
 									val = $.inArray(part[i].toLowerCase(), dates[language].meridiem);
 									break;
 							}
 						}
 						parsed[part] = val;
 					}
 					for(var i = 0,s;i<setters_order.length; i++){
 						s = setters_order[i];
 						if(s in parsed && !isNaN(parsed[s])){
 							setters_map[s](date, parsed[s]);
 						}
 					}
 				}
 				return date;
 		},

 		formatDate: function(date, format,language, type){
 			if(date == null){
 				return "";
 			}
 			var val;
 			if(type === "standard"){
 				val = {
 					t: date.getTime(),
 					yy: date.getUTCFullYear().toString().substring(2),
 					yyyy: date.getUTCFullYear(),
 					m: date.getUTCMonth() + 1,
 					M: dates[language].monthsShort[date.getUTCMonth()],
 					MM: dates[language].months[date.getUTCMonth()],
 					d: date.getUTCDate(),
 					D: dates[language].daysShort[date.getUTCDate()],
 					DD: dates[language].days[date.getUTCDay()],
 					p: (dates[language].meridiem.length == 2? dates[language].meridiem[date.getUTCHours() < 12? 0:1] : ""),
 					h: date.getUTCHours(),
 					i: date.getUTCMinutes(),
 					s: date.getUTCSeconds()
 				};

 				if(dates[language].meridiem.length === 2){
 					val.H  (val.h %12 === 0 ? 12 : val.h % 12);
 				}else{
 					val.H = val.h;
 				}

 				val.HH = (val.H < 10 ? "0" : "") + val.H;
 				val.P = val.p.toUpperCase();
 				val.hh = (val.h < 10 ? "0" : "") + val.h;
 				val.ii = (val.i < 10 ? "0" : "") + val.i;
 				val.ss = (val.i < 10 ? "0" : "") + val.s;
 				val.dd = (val.d < 10 ? "0" : "") + val.d;
 				val.mm = (val.m < 10 ? "0" : "") + val.m;

 			}else if(type == "php"){
 				val = {
 					//year
 					y: date.getUTCFullYear().toString().substring(2),
 					Y: date.getUTCFullYear(),
 					//month
 					F: dates[anguage].months[date.getUTCMonth()],
 					M: dates[language].monthsShort[date.getUTCMonth()],
 					n: date.getUTCMonth() + 1,
 					t: DPGlobal.getDaysInMonth(date.getUTCFullYear(), date.getUTCMonth()),
 					//day
 					j: date.getUTCDate(),
 					l: dates[language].days[date.getUTCDay()],
 					D: dates[language].daysShort[date.getUTCDay()],
 					w: date.getUTCDay(),
 					N: (date.getUTCDay() == 0? 7:date.getUTCDay()),
 					S: (date.getUTCDate() % 10 <= dates[language].suffix.length ? dates[language].suffix[date.getUTCDate() % 10-1] : ""),
 					//hour
 					a: (dates[language].meridiem.length == 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0: 1] : ""),
 					g: (date.getUTCH1() %12 == 0 ? 12: date.getUTCHours() % 12),
 					G: date.getUTCHours(),
 					//minute
 					i: date.getUTCMinutes(),
 					//second:
 					s: date.getUTCSeconds()
 				};
 				val.m = (val.n < 10 ? "0":"") + val.n;
 				val.d = (val.j < 10 ? "0":"") + val.j;
 				val.A = val.a.toString().toUpperCase();
 				val.h = (val.g < 10 ? "0":"") + val.h;
 				val.H = (val.G < 10 ? "0":"") + val.G;
 				val.i = (val.i < 10 ? "0":"") + val.i;
 				val.s = (val.s < 10 ? "0":"") + val.s;
 			}else{
 				throw new Error("Invalid format type");
 			}
 			var date = [],
 				seps = $.extend([], format.separator);
 			for(var i=0, cnt = format.parts.length; i < cnt;i++){
 				if(seps.length){
 					date.push(seps.shift());
 				}
 				date.push(val[format.parts[i]]);
 			}

 			if(seps.length){
 				date.push(seps.shift());
 			}

 			return date.join("");
 		},

 		convertViewMode: function(viewMode){
 			switch(viewMode){
 				case 4:
 					break;
 				case "decade":
 					viewMode = 4;
 					break;
 				case 3:
 					break;
 				case "year":
 					viewMode = 3;
 					break;
 				case 2:
 					break;
 				case "month":
 					viewMode = 2;
 					breakl
 				case 1:
 					break;
 				case "day":
 					viewMode = 1;
 					break;
 				case 0:
 					break;
 				case "hour":
 					viewMode = 0;
 					break;
 				default: break;

 			}
 			return viewMode;
 		},

 		headTemplate: '<thead>' +
 					  '<tr>' +
 					  '<th class="prev"><i class="{iconType} {leftArrow}"/></th>' +
 					  '<th colspan="5" class="switch"></th>' +
 					  '<th class="next"><i class="iconType} {rightArrow}"/></th>' +
 					  '</tr>' + '</thead>',

 		headTemplateV3: '<thead>' +
 						'<tr>' +
                		'<th class="prev"><span class="{iconType} {leftArrow}"></span> </th>' +
                		'<th colspan="5" class="switch"></th>' +
                		'<th class="next"><span class="{iconType} {rightArrow}"></span> </th>' +
                		'</tr>' +'</thead>',
        conTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
        footTemplate: '<tfoot>'+
        			  '<tr><th colspan="7" class="today"></th></tr>' +
        			  '<tr><th colspan="7" class="clear"></th></tr>' +
        			  '</tfoot>'	
 	};

 	DPGlobal.template = '<div class="datetimepicker">' +
 						'<div class="datetimepicker-minutes">' +	
 						'<table class="table-condensed">' +
 						DPGlobal.headTemplate +
 						DPGlobal.conTemplate +
 						DPGlobal.footTemplate +
 						'</table>' +
 						'</div>' +
 						'<div class="datetimepicker-hours">' +
 						'<table class="table-condensed">' +
 						DPGlobal.headTemplate +
 						DPGlobal.conTemplate + 
 						DPGlobal.footTemplate +
 						'</table>' +
 						'</div>'+
 						'<div class="datetimepicker-days">' +
 						'<table class="table-condensed">' +
 						DPGlobal.headTemplate +
 						DPGlobal.conTemplate +
 						DPG.footTemplate +
 						'</table>' +
 						'</div>' +
 						'<div class="datetimepicker-months">' +
 						'<table class="table-condensed">' +
 						DPGlobal.headTemplate +
 						DPGlobal.conTemplate +
 						DPGlobal.footTemplate +
 						'</table>' +
 						'</div>' +
 						'<div class="datetimepicker-years">' +
 						'<table class="table-condensed">' +
 						DPGlobal.headTemplate +
 						DPGlobal.conTemplate +
 						DPGlobal.footTemplate +
 						'</table>' +
 						'</div>' +
 						'</div>';

 	DPGlobal.templateV3 = '<div class="datetimepicker">' +
 						'<div class="datetimepicker-minutes">' +	
 						'<table class="table-condensed">' +
 						DPGlobal.headTemplateV3 +
 						DPGlobal.conTemplate +
 						DPGlobal.footTemplate +
 						'</table>' +
 						'</div>' +
 						'<div class="datetimepicker-hours">' +
 						'<table class="table-condensed">' +
 						DPGlobal.headTemplateV3 +
 						DPGlobal.conTemplate + 
 						DPGlobal.footTemplate +
 						'</table>' +
 						'</div>'+
 						'<div class="datetimepicker-days">' +
 						'<table class="table-condensed">' +
 						DPGlobal.headTemplateV3 +
 						DPGlobal.conTemplate +
 						DPG.footTemplate +
 						'</table>' +
 						'</div>' +
 						'<div class="datetimepicker-months">' +
 						'<table class="table-condensed">' +
 						DPGlobal.headTemplateV3 +
 						DPGlobal.conTemplate +
 						DPGlobal.footTemplate +
 						'</table>' +
 						'</div>' +
 						'<div class="datetimepicker-years">' +
 						'<table class="table-condensed">' +
 						DPGlobal.headTemplateV3 +
 						DPGlobal.conTemplate +
 						DPGlobal.footTemplate +
 						'</table>' +
 						'</div>' +
 						'</div>';

 	$.fn.datetimepicker.DPGlobal = DPGlobal;

 	$.fn.datetimepicker.noConflict = function(){
 		$.fn.datetimepicker = old;
 		return this;
 	};

 	$(document).on(
 		'focus.datetimepicker.datapi click.datetimepicker.data-api',
 		'[data-provide = "datetimepicker"]',
 		function(e){
 			var $this = $(this);
 			if($this.data('datetimepicker')){
 				return;
 			}
 			e.preventDefault();
 			$this.datetimepicker("show");
 		}
 	);

 	$(function(){
 		$('[data-provide="datetimepicker-inline"]').datetimepicker();
 	});
 )});	 
