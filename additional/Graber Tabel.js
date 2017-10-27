/*use graber lib */
(function(){
	var Table = function(parent,rows,cols,preset){
		this.parent = parent || undefined;
		this.rows = rows || 0;
		this.cols = cols || 0;
		this.orientation = 'portait';
		this.id = undefined;
		this.heading = {
			value : [],
		};
		this.preset(preset);
	};
	var Toolkit = function(){
		this.el = undefined;
		this.ins = undefined;
		this.linkId = undefined;
		this.lastPos = undefined;
		this.target = undefined;
		this.jdata = undefined;
		this.init = function(el,target){
			if(!this.el){
				this.create();
			}
			var pos,tpos;
			if(el[0].id !== this.linkId){
				pos = el.bound()[0];
				this.el.css({
					'left':pos.left+'px',
					'top':pos.top+'px'
				});
				this.linkId = el[0].id;
				this.lastPos = pos;
				this.el._G('.action_tool').css({
					'visibility':'visible'
				});
			}else{
				pos = this.lastPos;
			}
			if(target[0].tagName === 'TD'){
				tpos = target.bound()[0];
				this.ins[0].value = target.text();
				this.ins.css({
					'left': tpos.left-pos.left+'px',
					'top': tpos.top-pos.top+'px',
					'width': tpos.width+'px',
					'height': tpos.height+'px',
					'visibility':'visible',
				})[0].focus();
				this.target = target;
			}
		};
		this.handle = function(inp){
			this.target.text(inp.value);
			inp.value = '';
			inp._G().css({
				'left':'0px',
				'top':'0px',
				'width':'0px',
				'height':'0px',
				'visibility':'hidden',
			});
		};
		this.create = function(){
			this.el = _G().add('DIV#TableToolkit').css({
				'position':'absolute',
				'left':'0px',
				'top':'0px',
			});
			this.ins = this.el.add('INPUT.insert_tool').css({
				'position':'absolute',
				'left':'0px',
				'top':'0px',
				'width':'0px',
				'height':'0px',
				'box-sizing':'border-box',
				'padding':'0 5px',
				'visibility':'hidden',
			}).on('keypress',function(ev){
				var pr = ev.which || ev.keyCode;
				if(pr === 13){
					TableToolkit.handle(this);
				}
			});
			var preset = this.el.add('DIV.action_tool').add('DIV.manage_tool*1');
			preset.css({
				'background':'transparent',
				'height':'10px',
				'width':'10px',
				'text-align':'center',
				'box-sizing':'border-box',
				'overflow':'hidden',
				'cursor':'pointer',
			}).on('click',function(){
				TableToolkit.toJSON();
			}).parent().css({
				'visibility':'hidden'
			});
			_G().add('STYLE').text(".manage_tool:after { content: ''; display: block;   position: absolute; left: 0; top: 0; width: 0; height: 0; border-top: 10px solid #000000cc; border-right: 10px solid transparent; border-bottom: 0 solid transparent; border-left: 0 solid transparent; }");
		};
		this.toJSON = function(){
			var res = [];
			var linkEl = _G('#'+this.linkId);
			var jsondata, i, j, th, tr, td;
			if(linkEl[0].orientation === 'portait'){
				th = linkEl._G('TH');
				tr = linkEl._G('TR');
				for (i = 0; i < tr.length; i++) {
					if(i > 0){
						jsondata = {};
						td = tr[i]._G().child();
						for (j = 0; j < th.length; j++) {
							jsondata[th[j].innerHTML] = td[j].innerHTML;
						}
						res.push(jsondata);
					}
				}
			}else if(linkEl[0].orientation === 'landscape'){
				th = linkEl._G('TH');
				tr = linkEl._G('TR');
				var w = tr[0]._G().child();
				for (i = 0; i < w.length; i++) {
					if(i > 0){
						jsondata = {};
						for (j = 0; j < th.length; j++) {
							td = tr[j]._G().child();
							jsondata[th[j].innerHTML] = td[i].innerHTML;
						}
						res.push(jsondata);
					}
				}
			}
			try{
				var WinPrompt = window.open("", "JSON_DATA", "width=500,height=500");
    			WinPrompt.document.write("<textarea style='width:100%;height:100%;display:block;'>"+(JSON.stringify(res).replace(/\"\,/g,'\"\,\n\t').replace(/\}\,/g,'\}\,\n').replace(/\{\"/g,'\{\n\t\"').replace(/\"\}/g,'\"\n\}'))+"</textarea>");
			}catch(err){
				_G().add('TEXTAREA').css({
					'display':'block',
					'width':'100%',
					'height':'500px',
					'position':'fixed',
					'left':'0',
					'top':'0'
				}).text( (JSON.stringify(res).replace(/\"\,/g,'\"\,\n\t').replace(/\}\,/g,'\}\,\n').replace(/\{\"/g,'\{\n\t\"').replace(/\"\}/g,'\"\n\}')) );
			}
		};
	};
	Table.prototype = {
		preset : function(preset){
			if(this.parent !== undefined && this.parent instanceof _G.init.Graber === false){
				this.parent = this.parent._G();
			}else if(this.parent === undefined){
				this.parent = _G();
			}
			preset = preset || {};
			for(var i in preset){
				if(preset.hasOwnProperty(i)){
					this[i] = preset[i];
				}
			}
			if(this.rows > 0 && this.cols > 0){
				this.create();
			}
		},
		create : function(){
			var i,j;
			this.id = this.id ? this.id : 'table_'+Math.floor(randomize(99999,9999999));
			this.el = this.parent.add('TABLE#'+this.id);
			this.el[0].orientation = this.orientation;
			for (i = 0; i < this.rows; i++) {
				var row = this.el.add('TR');
				for (j = 0; j < this.cols; j++) {
					var col;
					if(this.orientation == 'portait'){
						if(i == 0){
							col = row.add('TH');
							this.createHead(col,i,j,j);
						}else{
							col = row.add('TD');
							this.heading[j].data.push(col[0]);
						}
					}
					if(this.orientation == 'landscape'){
						if(j == 0){
							col = row.add('TH');
							this.createHead(col,i,j,i);
						}else{
							col = row.add('TD');
							this.heading[i].data.push(col[0]);
						}
					}
				}
			}
			for(i in this.heading){
				if(this.heading.hasOwnProperty(i)){
					if(i !== 'value'){
						this.heading[i].data = this.heading[i].data._G();
					}
				}
			}
		},
		createHead : function(el,r,c,idx){
			this.heading[idx] = {
				name : 'head'+idx,
				self : el,
				data : [],
				row : r,
				col : c
			};
			this.heading.value.push(this.heading[idx].name);
			this.heading[idx].self.text(this.heading[idx].name);
		},
		fillHead : function(headname){
			for (var i = 0; i < headname.length; i++){
				this.heading[i].name = headname[i];
				this.heading[i].self.text(this.heading[i].name);
				this.heading.value[i] = this.heading[i].name;
			}
		},
		addHead : function(index,headData){
			var h,i,j,row,rows,col,cols;
			if(index != undefined){
				j = 0;
				for(i = 0; i < this.heading.value.length; i++){
					if(i >= index && i < headData.length+index){
						this.heading[i].name = headData[j];
						this.heading[i].self.text(this.heading[i].name);
						j++;
					}
				}
			}else{
				if(this.orientation === 'portait'){
					rows = this.el._G('TR');
					for(i = 0; i < rows.length; i++) {
						if(i === 0){
							cols = rows[i]._G().add('TH*'+headData.length);
							h = this.heading.value.length;
							for(j = 0; j < headData.length; j++){
								this.createHead(cols[j]._G(),0,h,h);
								this.heading[h].name = headData[j];
								this.heading[h].self.text(this.heading[h].name);
								this.heading.value[h] = this.heading[h].name;
								h++;
							}
						}else{
							cols = rows[i]._G().add('TD*'+headData.length);
							h = this.heading.value.length-headData.length;
							for(j = 0; j < headData.length; j++){
								this.heading[h].data.push(cols[j]);
								h++;
							}
						}
					}
					h = this.heading.value.length-headData.length;
					for(j = 0; j < headData.length; j++){
						this.heading[h].data = this.heading[h].data._G();
						h++;
					}
					this.cols += headData.length;
				}else if(this.orientation === 'landscape'){
					rows = this.el.add('TR*'+headData.length);
					h = this.heading.value.length;
					for(i = 0; i < rows.length; i++){
						for(j = 0; j < this.cols; j++){
							if(j === 0){
								col = rows[i]._G().add('TH');
								this.createHead(col,h,0,h);
								this.heading[h].name = headData[i];
								this.heading[h].self.text(this.heading[h].name);
								this.heading.value[h] = this.heading[h].name;
							}else{
								col = rows[i]._G().add('TD');
								this.heading[h].data.push(col[0]);
							}
						}
						h++;
					}
					this.rows += headData.length;
				}
				for(i in this.heading){
					if(this.heading.hasOwnProperty(i) && i !== 'value'){
						if(Array.isArray(this.heading[i].data)){
							this.heading[i].data = this.heading[i].data._G();
						}
					}
				}
			}
		},
		insert : function(jdata){
			var h,i,j;
			if(this.rows === 0 && this.cols === 0){
				j = 0;
				for(i in jdata[0]){
					if(jdata[0].hasOwnProperty(i)){
						j++;
					}
				}
				if(this.orientation === 'portait'){
					this.rows = jdata.length+1;
					this.cols = j;
				}else if(this.orientation === 'landscape'){
					this.rows = j;
					this.cols = jdata.length+1;
				}
				this.create();
			}
			for(i = 0; i < jdata.length; i++){
				h = 0;
				for(j in jdata[i]){
					if(jdata[i].hasOwnProperty(j)){
						var th = this.heading.value.indexOf(j);
						if(th === -1){
							this.heading[h].name = j;
							this.heading[h].self.text(this.heading[h].name);
							this.heading.value[h] = this.heading[h].name;
							th = h;
						}
						if(jdata[i][j].length > 0){
							this.heading[th].data[i]._G().text(jdata[i][j]);
						}
						h++;
					}
				}
			}
		},
		add : function(index,data){
			var i,row,rows,col,cols;
			if(index != undefined){
				for(i in this.heading){
					if(this.heading.hasOwnProperty(i) && i !== 'value'){
						if(data[i].length > 0){
							this.heading[i].data[index]._G().text(data[i]);
						}
					}
				}
			}else{
				if(this.orientation === 'portait'){
					row = this.el.add('TR');
					cols = row.add('TD*'+data.length);
					for(i in this.heading){
						if(this.heading.hasOwnProperty(i) && i !== 'value'){
							this.heading[i].data[this.heading[i].data.length] = cols[i];
							this.heading[i].data.length += 1;
							if(data[i].length > 0){
								this.heading[i].data[this.heading[i].data.length-1]._G().text(data[i]);
							}
						}
					}
					this.rows++;
				}else if(this.orientation === 'landscape'){
					rows = this.el._G('TR');
					for(i in this.heading){
						if(this.heading.hasOwnProperty(i) && i !== 'value'){
							col = rows[i]._G().add('TD');
							this.heading[i].data[this.heading[i].data.length] = col[0];
							this.heading[i].data.length += 1;
							if(data[i].length > 0){
								this.heading[i].data[this.heading[i].data.length-1]._G().text(data[i]);
							}
						}
					}
					this.cols++;
				}
			}
		},
		select : function(label,callback){
			var res = [];
			var selHead = this.heading.value.indexOf(label);
			if(selHead !== -1){
				var data = this.heading[selHead].data;
				for (var i = 0; i < data.length; i++) {
					res.push(callback(data[i],i,data));
				}
			}
			return res;
		},
		delete : function(label,amount){
			var h,i,j,k = false,selHead;
			amount = amount ? amount : 1;
			if(typeof label === 'string'){
				selHead = this.heading.value.indexOf(label);
				h = selHead;
				if(selHead !== -1){
					for (i = 0; i < amount; i++) {
						if(this.heading[selHead]){
							if(this.orientation === 'portait'){
								this.heading[selHead].self.remove();
								this.heading[selHead].data.remove();
							}else if(this.orientation === 'landscape'){
								this.heading[selHead].self.parent().remove();
							}
							delete this.heading[selHead];
							selHead++;
						}
					}
					this.heading.value.splice(h,amount);
					k = true;
				}
				if(k){
					h = {};
					j = 0;
					for(i in this.heading){
						if(this.heading.hasOwnProperty(i) && i !== 'value'){
							h[j] = this.heading[i]; 
						}
						j++;
					}
					h.value = this.heading.value;
					this.heading = h;
				}
			}else if(typeof label === 'number'){
				for(i = 0; i < this.heading.value.length; i++){
					var data = this.heading[i].data.toArray();
					var delidx = data.splice(label,amount);
					delidx._G().remove();
					this.heading[i].data = data._G();
				}
				if(this.orientation == 'portait'){
					var rows = this.el._G('TR');
					rows = rows.toArray();
					var xrows = rows.splice(label+1,amount);
					xrows._G().remove();
				}
			}
		},
		interactive : function(){
			this.el.on('click',function(ev){
				var target = document.elementFromPoint(ev.clientX, ev.clientY);
				TableToolkit.init(this._G(),target._G());
			});
		},
		toJSON : function(){
			var res = [];
			var jsondata, i, j, th, tr, td;
			if(this.el[0].orientation === 'portait'){
				th = this.el._G('TH');
				tr = this.el._G('TR');
				for (i = 0; i < tr.length; i++) {
					if(i > 0){
						jsondata = {};
						td = tr[i]._G().child();
						for (j = 0; j < th.length; j++) {
							jsondata[th[j].innerHTML] = td[j].innerHTML;
						}
						res.push(jsondata);
					}
				}
			}else if(this.el[0].orientation === 'landscape'){
				th = this.el._G('TH');
				tr = this.el._G('TR');
				var w = tr[0]._G().child();
				for (i = 0; i < w.length; i++) {
					if(i > 0){
						jsondata = {};
						for (j = 0; j < th.length; j++) {
							td = tr[j]._G().child();
							jsondata[th[j].innerHTML] = td[i].innerHTML;
						}
						res.push(jsondata);
					}
				}
			}
			return res;
		}
	};
	this.Table = Table;
	this.TableToolkit = new Toolkit();
}());