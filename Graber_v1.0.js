/*
	GRABER LIBRARY V1.0
	Author : Leonardo H.
*/
(function(){
	var res;
	var Grab = function(selector){
		if(!selector){
			if(this !== window){
				if(this instanceof _G.init.Graber){
					return this;
				}
				if(Array.isArray(this)){
					return new Grab.init.Graber(this);
				}else{
					return new Grab.init.Graber([this]);
				}
			}else{
				return new Grab.init.Graber([document.body]);
			}
		}
		if(selector && typeof selector === 'string'){
			try{
				res = document.querySelectorAll(selector);
				return new Grab.init.Graber(res);
			}catch(err){
				try{
					if(this !== window){
						var els;
						if(this instanceof _G.init.Graber === false){
							if(this[0] != undefined){
								var toArr = [];
								for (var i = 0; i < this.length; i++) {
									toArr.push(this[i]);
								}
								els = new _G.init.Graber(toArr);
							}else{
								els = new _G.init.Graber([this]);
							}
						}else{
							els = this;
						}
						res = els.map(function(elem){
							var matches = Grab.init.Nav(elem,selector);
							return matches;
						});
						return new Grab.init.Graber(res);
					}
				}catch(err){
					return undefined;
				}
			}
		}
	};
	(function(){
		Grab.init = Grab.prototype = {
			Graber : function(elms){
				var ps = 0;
				for(var i = 0; i < elms.length; i++ ) {
					if(elms[i] instanceof _G.init.Graber){
						for(var j = 0; j < elms[i].length; j++){
							this[ps] = elms[i][j];
							ps++;
						}
					}else{
						this[ps] = elms[i];
						ps++;
					}
				}
				this.length = ps;
			},
			Nav : function(target,selector){
				var rlen = /[\d]+/, 
					len = rlen.exec(selector) ? parseFloat(rlen.exec(selector)[0]) : undefined,
					base = target;
				if(selector.match(/^</)){
					if(!len) len = 1;
					for (var i = 0; i < len; i++) {
						base = base.parentElement;
					}
					return base;
				}
				if(selector.match(/^\>/)){
					if(!len) len = 0;
					base = base.children[len];
					return base;
				}
				if(selector.match(/^\+/)){
					if(!len) len = 1;
					for (var i = 0; i < len; i++) {
						if(base.nextElementSibling){
							base = base.nextElementSibling;
						}
					}
					return base;
				}
				if(selector.match(/^\-/)){
					if(!len) len = 1;
					for (var i = 0; i < len; i++) {
						if(base.previousElementSibling){
							base = base.previousElementSibling;
						}
					}
					return base;
				}
			},
			handle : function(){}
		};
		Grab.fn = Grab.prototype = {
			add : function(query,parent){
				this.query = query || '';
				this.parent = parent || document.body;
				this.len = 1;
				this.pos = undefined;
				this.els = [];
				this.init = function(){
					this.els = [];
					var rlen = /\*[\d]+/, rmultiple = /\[.*?\]/, rsingle = /[^*]+/, rprop = /(?:\.|\#|\$)\w*/g, rtag = (/^\w*/), rpos = /\((?:[\.\#]\w+|\d+)\)/;
					this.len = rlen.exec(this.query) ? parseFloat(rlen.exec(this.query)[0].replace('*','')):1;
					this.el = rmultiple.exec(this.query) ? (rmultiple.exec(this.query)[0].replace(/[\[\]]/g,'')).split(',') : rsingle.exec(this.query)[0].replace(/[\*]/g);
					this.len = Array.isArray(this.el) ? (this.len >= this.el.length ? this.len : this.el.length) : this.len;
					this.pos = rpos.exec(this.query) ? rpos.exec(this.query)[0].replace(/[\(\)]/g,'') : undefined;
					for(var j = 0; j < this.len; j++){
						var el = Array.isArray(this.el) ? this.el[j] : this.el;
						if(el){
							var prop = el.match(rprop) ? el.match(rprop) : null;
							var newEl = document.createElement(rtag.exec(el.replace(/\s+/g,''))[0].toUpperCase());
							if(prop){
								for (var k = 0; k < prop.length; k++) {
									if(prop[k].match(/^\#/) != null){
										newEl.id = prop[k].replace('#','');
									}
									if(prop[k].match(/^\./) != null){
										newEl.className = prop[k].replace('.','');
									}
									if(prop[k].match(/^\$/) != null){
										var newName = document.createAttribute('name');
										newName.value = prop[k].replace('$','');
										newEl.setAttributeNode = newName;
									}
								}
							}
							if(this.pos){
								var insertPos = !isNaN(parseFloat(this.pos)) ? parseFloat(this.pos) : this.pos;
								if(typeof insertPos === 'number'){
									this.parent.insertBefore(newEl,this.parent.childNodes[insertPos]);
								}else{
									this.parent.className = this.parent.className.length > 0 ? this.parent.className + ' grabclass' : this.parent.className = 'grabclass';
									var elPos = document.querySelectorAll('.grabclass>'+this.pos);
									this.parent.insertBefore(newEl,elPos[0]);
									this.parent.className = this.parent.className.replace(/(?:\s|)grabclass/g,'');
								}
							}else{
								this.parent.appendChild(newEl);
							}
							this.els.push(newEl);
						}
					}
				};
				this.init();
				return new _G.init.Graber(this.els);
			},
			prop : function(target,preset){
				if(typeof preset === 'string'){
					return target[preset];
				}else{
					for(var i in preset){
						if(preset.hasOwnProperty(i)){
							target[i] = preset[i];
						}
					}
				}
			},
			attr : function(target,preset){
				if(typeof preset === 'string'){
					return target.getAttribute(preset);
				}else{
					for(var i in preset){
						if(preset.hasOwnProperty(i)){
							target.setAttribute(i,preset[i]);
						}
					}
				}
			},
			css : function(target,preset){
				var rfix = /\w\-\w/g;
				if(typeof preset === 'string'){
					var matchcss = target.style[preset] != '' ? target.style[preset] : window.getComputedStyle(target,null)[preset];
					return matchcss;
				}else{
					for(var i in preset){
						if(preset.hasOwnProperty(i)){
							target.style[i] = preset[i];
						}
					}
				}
			},
			text : function(target,intext){
				if(intext){
					target.innerText = intext;
				}else{
					return target.innerText;
				}
			},
			html : function(target,inhtml){
				if(inhtml){
					target.innerHTML = inhtml;
				}else{
					return target.innerHTML;
				}
			},
			on : function(target,event,callback){
				if(target.event === undefined){
					target.event = {};
				}
				if(target.event[event] === undefined){
					target.event[event] = {};
				}
				var fname;
				if(callback.name === "anonymous" || callback.name === ''){
					fname = 'F'+Math.floor(_G.math.randomize(999999,9999999999));
				}else{
					fname = callback.name;
				}
				target.event[event][fname] = callback;
				target.addEventListener(event,target.event[event][fname]);
				target.lastEvent = [event,fname];
			},
			off : function(target,event,fname){
				target.removeEventListener(event,target.event[event][fname]);
				try{
					delete target.event[event][fname];
				}catch(err){}
				if(target.lastEvent[1] == fname){
					target.lastEvent = [];
				}
			},
			isReady : function(){
				document.onreadystatechange = function () {
					if (document.readyState === "complete") {
						_G.init.handle();
					}
				};
			},
		};
		Grab.lib = Grab.prototype = {
			onsurf : function(callback){
				Grab.init.handle = callback;
			},
			map : function(callback){
				var results = [], i = 0;
				for ( ; i < this.length; i++) {
					results.push(callback.call(this, this[i], i));
				}
				return results;
			},
			toArray : function(){
				var res = this.map(function(elem){
					return elem;
				});
				return res;
			},
			each : function(callback){
				this.map(callback);
				return this;
			},
			add : function(query){
				var newEl;
				newEl = this.map(function(elem){
					res = _G.fn.add(query,elem);
					return res;
				});
				return new _G.init.Graber(newEl);
			},
			hasClass : function(classname){
				var reclass = new RegExp(classname,"g");
				var res = this.map(function(elem){
					return elem.className.match(reclass) != null ? true : false;
				});
				return res;
			},
			addClass : function(classname){
				this.map(function(elem){
					elem.className =  elem.className.length > 0 ? elem.className+' '+classname: classname;
				});
				return this;
			},
			removeClass : function(classname){
				var patt = '(?:\\s|)';
				patt+=classname;
				var reclass = new RegExp(patt);
				this.map(function(elem){
					elem.className =  elem.className.replace(reclass,'');
				});
				return this;
			},
			remove : function(){
				var res = this.map(function(elem){
					var par = elem.parentElement;
					par.removeChild(elem);
					return par;
				});
				return res[res.length-1];
			},
			prop : function(objprop){
				if(typeof objprop === 'string'){
					res = this.map(function(elem){
						var props = _G.fn.prop(elem,objprop);
						return props;
					});
					return res;
				}else{
					this.map(function(elem){
						_G.fn.prop(elem,objprop);
					});
					return this;
				}
				
			},
			attr : function(objattr){
				if(typeof objattr === 'string'){
					res = this.map(function(elem){
						var attrs = _G.fn.attr(elem,objattr);
						return attrs;
					});
					return res;
				}else{
					this.map(function(elem){
						_G.fn.attr(elem,objattr);
					});
					return this;
				}
			},
			css : function(objcss){
				if(typeof objcss === 'string'){
					res = this.map(function(elem){
						var csst = _G.fn.css(elem,objcss);
						return csst;
					});
					return res;
				}else{
					this.map(function(elem){
						_G.fn.css(elem,objcss);
					});
					return this;
				}
			},
			text : function(intext){
				if(intext){
					this.map(function(elem){
						_G.fn.text(elem,intext);
					});
					return this;
				}else{
					res = this.map(function(elem){
						var intext = _G.fn.text(elem,null);
						return intext;
					});
					return res;
				}
			},
			html : function(inhtml){
				if(inhtml){
					this.map(function(elem){
						_G.fn.html(elem,inhtml);
					});
					return this;
				}else{
					res = this.map(function(elem){
						var inhtml = _G.fn.html(elem,null);
						return inhtml;
					});
					return res;
				}
			},
			next : function(num){
				num = num || 1;
				var res = this.map(function(elem){
					var base = elem;
					for (var k = 0; k < num; k++) {
						if(base.nextElementSibling){
							base = base.nextElementSibling;
						}else{
							base = null;
						}
					}
					return base;
				});
				return new _G.init.Graber(res);
			},
			prev: function(num){
				num = num || 1;
				var res = this.map(function(elem){
					var base = elem;
					for (var k = 0; k < num; k++) {
						if(base.previousElementSibling){
							base = base.previousElementSibling;
						}else{
							base = null;
						}
					}
					return base;
				});
				return new _G.init.Graber(res);
			},
			siblings: function(){
				res = this[0].parentElement.children;
				return new _G.init.Graber(res);
			},
			select: function(start,inc,len){
				start = start || 0;
				inc = inc || 1;
				len = len || this.length;
				var j = len > 0 ? 1 : -1, matches = [], res = [];
				for (var i = 0; i < Math.abs(len); i++) {
					if(start >= 0 || start < this.len){
						matches.push(this[start]);
					}
					start += (j*inc);
				}
				for(j in matches){
					if(matches.hasOwnProperty(j)){
						if(j !== 'length'){
							if(matches[j]) res.push(matches[j]);
						}
					}
				}
				return new _G.init.Graber(res);
			},
			skip: function(start,inc,len){
				len = len || this.length;
				inc = inc || 1;
				var j = len > 0 ? 1 : -1, matches = [];
				for (var i = 0; i < Math.abs(len); i++) {
					if(start >= 0 || start < this.len){
						delete this[start];
					}
					start += (j*inc);
				}
				for(j in this){
					if(this.hasOwnProperty(j)){
						if(j !== 'length'){
							matches.push(this[j]);
						}
					}
				}
				return new _G.init.Graber(matches);
			},
			parent: function(){
				var par = [],i,j,selfpar;
				for (i = 0; i < this.length; i++){
					if(this[i].parentElement.className.match(/grabclass/g) === null){
						selfpar = this[i].parentElement;
						selfpar._G().addClass('grabclass'+par.length);
						par.push(selfpar);
					}
				}
				par._G().removeClass('grabclass[\\d]+');
				return new _G.init.Graber(par);
			},
			child: function(){
				res = [];
				var matches = this.map(function(elem){
					return elem.children;
				});
				for (var i = 0; i < matches.length; i++) {
					for (var j = 0; j < matches[i].length; j++) {
						res.push(matches[i][j]);
					}
				}
				return new _G.init.Graber(res);
			},
			on: function(event,callback){
				this.map(function(elem){
					_G.fn.on(elem,event,callback);
				});
				return this;
			},
			off: function(event,functionName){
				this.map(function(elem){
					if(!functionName){
						setup = elem.lastEvent;
						_G.fn.off(elem,setup[0],setup[1]);
					}else{
						_G.fn.off(elem,event,functionName);
					}
				});
				return this;
			},
			bound: function(){
				var boundingRect = this.map(function(elem){
					var res = elem.getBoundingClientRect();
					return res;
				});
				return boundingRect;
			},
			offset : function(){
				var offset = this.map(function(elem){
					var resOffset = {};
					resOffset.left = elem.offsetLeft;
					resOffset.top = elem.offsetTop;
					resOffset.width = elem.offsetWidth;
					resOffset.height = elem.offsetHeight;
					return resOffset;
				});
				return offset;
			},
		};
		Grab.math = Grab.prototype = {
			randomize : function(min,max){
				min = min || 0;
				if(!max){
					max = min != 0 ? 1 : min;
					min = 0;
				}
				return (Math.random() * (max-min)) + min;
			}
		};
		Grab.array = Grab.prototype = {
			sortAsc : function(){
				var newArr;
				if(typeof this[0] === 'string' && isNaN(parseFloat(this[0]))){
					newArr = this.slice(0,this.length);
					return newArr.sort();
				}else{
					newArr = this.slice(0,this.length);
					return newArr.sort(function(argsA, argsB){return parseFloat(argsA) - parseFloat(argsB);});
				}
			},
			sortDsc : function(){
				var newArr;
				if(typeof this[0] === 'string' && isNaN(parseFloat(this[0]))){
					newArr = this.slice(0,this.length);
					newArr.sort();
					return newArr.reverse();
				}else{
					newArr = this.slice(0,this.length);
					return newArr.sort(function(argsA, argsB){return parseFloat(argsB) - parseFloat(argsA);});
				}
			},
			max : function(){
				var newArr = this.sortAsc();
				return Math.max.apply(null, newArr);
			},
			min : function(){
				var newArr = this.sortAsc();
				return Math.min.apply(null, newArr);
			},
			sum : function(){
				var newArr = this.sortAsc();
				return newArr.reduce(function(total,num){
					return total + num;
				});
			},
			near : function(val){
				var absnum = Math.abs(val);
				var newArr = this.sortAsc();
				var nearnum = newArr.reduce(function(res,num){
					var curres = Math.abs(absnum - Math.abs(num));
					return (res = (res[0] < curres ? res : [curres,num]));
				},[Infinity,-1]);
				return nearnum[1];
			},
			far : function(val){
				var absnum = Math.abs(val);
				var newArr = this.sortAsc();
				var nearnum = newArr.reduce(function(res,num){
					var curres = Math.abs(absnum - Math.abs(num));
					return (res = (res[0] > curres ? res : [curres,num]));
				},[0,-1]);
				return nearnum[1];
			}
		};
		Grab.string = Grab.prototype = {
			add : function(post,text){
				return this.substr(0, post) + text + this.substr(post + text.length);
			}
		};
		Grab.number = Grab.prototype = {
			scaler : function(min,max,minscale,maxscale){
				return (((maxscale - minscale)/(max - min))*(parseFloat(this)-min))+minscale;
			},
			fixed : function(dec){
				return parseFloat(this.toFixed(dec));
			},
			rad : function(){
				//degree to radians
				return this * (2*Math.PI) / 360;
			},
			deg : function(){
				//radians to degree.
				return this * 360 / (2*Math.PI);
			}
		};
		Grab.object = Grab.prototype = {
			vw : function(screen){
				//convert px to viewport width
				screen = screen || window.innerWidth;
				num = typeof this === 'string' ? parseFloat(this.replace(/[^\d\.]+/,'')) : this;
				return (num * 100 / screen);
			},
			vh : function(screen){
				//convert px to viewport height
				screen = screen || window.innerHeight;
				num = parseFloat(this.replace(/[^\d\.]+/,''));
				return (num * 100 / screen);
			},
		};
		Grab.locale = Grab.prototype = {
			requestAnimationFrame : window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
			cancelAnimationFrame : window.cancelAnimationFrame || window.mozCancelAnimationFrame,
		};
		Grab.additional = Grab.prototype = {
			Vector : function(x,y){
				this.x = x || 0;
				this.y = y || 0;
				return this;
			},
			Canvas : function(w,h,p){
				this.w = w || window.innerWidth;
				this.h = h || window.innerHeight;
				this.e = undefined;
				this.c = undefined;
				this.p = p || document.body;
				this.create = function(){
					this.e = document.createElement('CANVAS');
					this.e.width = this.w;
					this.e.height = this.h;
					this.c = this.e.getContext('2d');
					this.p.appendChild(this.e);
				};
				this.create();
			},
			Anime : {
				start : function(){
					if(!Anime.running){
						Anime.running = true;
						Anime.timer.last = new Date().getTime();
						Anime.frameset();
					}
				},
				frameset : function(){
					if(Anime.running){
						if(Anime.frameCount % Anime.rollSpeed == 0){
							Anime.timestamp.end = Anime.timestamp.start;
							Anime.timestamp.start = new Date().getTime();
							Anime.timer.now = new Date().getTime();
							Anime.timer.delta = (Anime.timer.now-Anime.timer.last)/1000;
							for(var i in Anime.onrender){
								if(Anime.onrender.hasOwnProperty(i)){
									Anime.engine(Anime.onrender[i]);
								}
							}
							Anime.frameRate();
							Anime.timer.last = new Date().getTime();
						}
						Anime.frameCount++;
						Anime.loop = requestAnimationFrame(Anime.frameset);
					}
				},
				engine : function(callback){
					callback();
				},
				break : function(){
					Anime.running = false;
					cancelAnimationFrame(Anime.loop);
					Anime.frameCount = 0;
					Anime.timestamp = {
						start : undefined,
						end : undefined,
					};
					for(var i in Anime.onbreak){
						if(Anime.onbreak.hasOwnProperty(i)){
							Anime.engine(Anime.onbreak[i]);
						}
					}
				},
				running : false,
				onrender : {},
				onbreak : {},
				loop : undefined,
				FPS : undefined,
				frameCount : 0,
				frameSpeed : 0,
				rollSpeed : 1,
				timestamp : {
					start : 0,
					end : undefined,
				},
				timer : {
					last : 0,
					now : 0,
					delta : 0,
				},
				frameRate : function(){
					if(Anime.timestamp.end){
						Anime.frameSpeed = (Anime.timestamp.start - Anime.timestamp.end);
						Anime.FPS = Math.floor(1000/Anime.frameSpeed);
					}
				},
			},
		};
		//Vector proto object
		Grab.additional.Vector.prototype = {
			set : function(x,y){
				this.x = x;
				this.y = y != undefined ? y : x;
				return this;
			},
			copy : function(other){
				this.x = other.x;
				this.y = other.y;
				return this;
			},
			clone : function(){
				return new Vector(this.x,this.y);
			},
			add : function(other){
				this.x += other.x;
				this.y += other.y;
				return this;
			},
			sub : function(other){
				this.x -= other.x;
				this.y -= other.y;
				return this;
			},
			mult : function(x,y){
				this.x *= x;
				this.y *= y || x;
				return this;
			},
			div : function(x,y){
				this.x /= x;
				this.y /= y || x;
				return this;
			},
			dir : function(){
				return Math.atan2(this.y,this.x);
			},
			mag : function(){
				return Math.sqrt(this.magSq());
			},
			magSq : function(){
				return this.dot(this);
			},
			dist : function(other){
				var del = other.clone().sub(this);
				return del.mag();
			},
			dot : function(other){
				return (this.x * other.x)+(this.y * other.y);
			},
			norm : function(){
				return this.mag() === 0 ? this : this.div(this.mag());
			},
			angle : function(other){
				return Math.acos(this.dot(other) / (this.mag() * other.mag()));
			},
			translate : function(other){
				return this.sub(other);
			},
			project : function(other,origin){
				origin = origin || new Vector();
				var PA = this.clone().translate(origin);
				var PB = other.clone().translate(origin);
				var Projectlen = PB.setMag(PA.scalar(PB));
				return(origin.clone().add(Projectlen));
			},
			rotate : function(a){
				var newAng = this.dir() + a;
				var mag = this.mag();
				this.x = mag * Math.cos(newAng);
				this.y = mag * Math.sin(newAng);
				return this;
			},
			heading : function(a){
				var mag = this.mag();
				this.x = mag * Math.cos(a);
				this.y = mag * Math.sin(a);
				return this;
			},
			setMag : function(n){
				return this.norm().mult(n);
			},
			scalar : function(other){
				return this.mag() * Math.cos(other.angle(this));
			},
			limit : function(max){
				var magSq = this.magSq();
				if(magSq > (max*max)){
					this.div(Math.sqrt(magSq));
					this.mult(max);
				}
				return this;
			},
			reverse : function(){
				this.x = -this.x;
				this.y = -this.y;
				return this;
			},
		};
		Grab.additional.Canvas.prototype = {
				two_PI : (2 * Math.PI),
				colorMode : 'RGB',
				lineProp : {
					'Width' : 1,
					'Cap' : 'butt',
					'Join' : 'miter',
				},
				shadowProp : {
					'OffsetX' : 0,
					'OffsetY' : 0,
					'Blur' : 0,
					'Color' : 'rgba(0, 0, 0, 0)'
				},
				textProp : {
					'font' : '10px sans-serif',
					'textAlign' : 'start'
				},
				save : function(){
					this.c.save();
				},
				restore : function(){
					this.c.restore();
				},
				clear : function(){
					this.c.clearRect(0,0,this.w,this.h);
				},
				colorInit : function(set1,set2,set3,set4){
					if(typeof set1 === 'string'){
						return set1;
					}else{
						if(Array.isArray(set1)){
							if(set1.length != 4){
								set1.push(1);
							}
							if(this.colorMode == 'RGB'){
								return ('rgba(' + set1[0] + ',' + set1[1] + ',' + set1[2] + ',' + set1[3] + ')');
							}else if(this.colorMode == 'HSL'){
								return ('hsla(' + set1[0] + ',' + set1[1] + '%,' + set1[2] + '%,' + set1[3] + ')');
							}
						}else if(typeof set1 === 'number'){
							set2 = set2 != undefined ? set2 : set1;
							set3 = set3 != undefined ? set3 : set2;
							set4 = set4 != undefined ? set4 : 1;
							if(this.colorMode == 'RGB'){
								return ('rgba(' + set1 + ',' + set2 + ',' + set3 + ',' + set4 + ')');
							}else if(this.colorMode == 'HSL'){
								return ('hsla(' + set1 + ',' + set2 + '%,' + set3 + '%,' + set4 + ')');
							}
						}
					}
				},
				lineInit : function(){
					for(var i in this.lineProp){
						if(this.lineProp.hasOwnProperty(i)){
							this.c['line'+i] = this.lineProp[i];
						}
					}
				},
				shadowInit : function(){
					for(var i in this.shadowProp){
						if(this.shadowProp.hasOwnProperty(i)){
							this.c['shadow'+i] = this.shadowProp[i];
						}
					}
				},
				textInit : function(){
					for(var i in this.textProp){
						if(this.textProp.hasOwnProperty(i)){
							this.c[i] = this.textProp[i];
						}
					}
				},
				fillBg : function(set1,set2,set3,set4){
					this.save();
					this.c.rect(0,0,this.w,this.h);
					set2 = set2 != undefined ? set2 : undefined;
					set3 = set3 != undefined ? set3 : undefined;
					set4 = set4 != undefined ? set4 : undefined;
					this.c.fillStyle = this.colorInit(set1,set2,set3,set4);
					this.c.fill();
					this.restore();
				},
				fill : function(set1,set2,set3,set4){
					set2 = set2 != undefined ? set2 : undefined;
					set3 = set3 != undefined ? set3 : undefined;
					set4 = set4 != undefined ? set4 : undefined;
					this.c.fillStyle = this.colorInit(set1,set2,set3,set4);
					this.c.fill();
				},
				fillStyle : function(set1,set2,set3,set4){
					set2 = set2 != undefined ? set2 : undefined;
					set3 = set3 != undefined ? set3 : undefined;
					set4 = set4 != undefined ? set4 : undefined;
					this.c.fillStyle = this.colorInit(set1,set2,set3,set4);
					return this.c.fillStyle;
				},
				stroke : function(set1,set2,set3,set4){
					set2 = set2 != undefined ? set2 : undefined;
					set3 = set3 != undefined ? set3 : undefined;
					set4 = set4 != undefined ? set4 : undefined;
					this.c.strokeStyle = this.colorInit(set1,set2,set3,set4);
					this.c.stroke();
				},
				strokeStyle : function(set1,set2,set3,set4){
					set2 = set2 != undefined ? set2 : undefined;
					set3 = set3 != undefined ? set3 : undefined;
					set4 = set4 != undefined ? set4 : undefined;
					this.c.strokeStyle = this.colorInit(set1,set2,set3,set4);
					return this.c.strokeStyle;
				},
				fillText : function(text,x,y,opt){
					if(opt){
						for(var i in opt){
							if(opt.hasOwnProperty(i)){
								this.textProp[i] = opt[i];
							}
						}
					}
					this.textInit();
					this.c.fillText(text,x,y);
				},
				strokeText : function(text,x,y,opt){
					if(opt){
						for(var i in opt){
							if(opt.hasOwnProperty(i)){
								this.textProp[i] = opt[i];
							}
						}
					}
					this.textInit();
					this.c.strokeText(text,x,y);
				},
				lineStyle : function(width,cap,join){
					this.lineProp.Width = width || this.lineProp.Width;
					this.lineProp.Cap = cap || this.lineProp.Cap;
					this.lineProp.Join = join || this.lineProp.Join;
					this.lineInit();
				},
				shadow : function(xoff,yoff,blur,color){
					this.shadowProp.OffsetX = xoff || this.shadowProp.OffsetX;
					this.shadowProp.OffsetY = yoff || this.shadowProp.OffsetY;
					this.shadowProp.Blur = blur || this.shadowProp.Blur;
					this.shadowProp.Color = color || this.shadowProp.Color;
					this.shadowInit();
				},
				begin : function(){
					this.c.beginPath();
				},
				close : function(){
					this.c.closePath();
				},
				translate : function(x,y){
					this.c.translate(x,y);
				},
				rotate : function(r){
					this.c.rotate(r);
				},
				scale : function(sw,sh){
					sw = sw || 1;
					sh = sh || sw;
					this.c.scale(sw,sh);
				},
				line : function(a,b){
					this.c.moveTo(a.x,a.y);
					this.c.lineTo(b.x,b.y);
				},
				arc : function(x,y,r,rs,re,mode){
					mode = mode || 'chord';
					var start = rs * (2*Math.PI) || 0;
					var end = re * (2*Math.PI) || 2*Math.PI;
					this.begin();
					if(mode == 'pie'){
						this.c.moveTo(x,y);
					}
					this.c.arc(x,y,r,start,end);
					if(mode != 'open'){
						this.close();
					}
				},
				rect : function(x,y,w,h){
					this.c.rect(x,y,w,h);
				},
				path : function(vertex,mode){
					mode = mode || 'close';
					this.begin();
					this.c.moveTo(vertex[0].x,vertex[0].y);
					var j = 1;
					for(var i = 0; i < vertex.length; i++){
						this.c.lineTo(vertex[j].x,vertex[j].y);
						j = j+1 < vertex.length ? j+1 : 0;
						if(j == 0 && mode == 'open'){
							break;
						}
					}
					if(mode == 'close'){
						this.close();
					}
				},
				polygon : function(cx,cy,r,s){
					var angAcc = this.two_PI/s;
					var angVel = 0;
					var vertex = [];
					for(var i = 0; i < s; i ++){
						var vec = {x:0,y:0};
						vec.x = cx + (r * Math.cos(angVel));
						vec.y = cy + (r * Math.sin(angVel));
						vertex.push(vec);
						angVel += angAcc;
					}
					this.path(vertex);
				},
				plane : function(vec,theta){
					var ang = Math.atan2(theta.y,theta.x);
					var plane = [{x:6,y:0},{x:-6,y:4},{x:-4,y:0},{x:-6,y:-4}];
					this.translate(vec.x,vec.y);
					this.rotate(ang);
					this.path(plane);
				}
		};
		Grab.init.Graber.prototype = Grab.lib;
	}());
	//define lib.
	//Array
	var i;
	for(i in Grab.array){
		if(Grab.array.hasOwnProperty(i)){
			Array.prototype[i] = Grab.array[i];
		}
	}
	//String
	for(i in Grab.string){
		if(Grab.string.hasOwnProperty(i)){
			String.prototype[i] = Grab.string[i];
		}
	}
	//Number
	for(i in Grab.number){
		if(Grab.number.hasOwnProperty(i)){
			Number.prototype[i] = Grab.number[i];
		}
	}
	//Object
	for(i in Grab.object){
		if(Grab.object.hasOwnProperty(i)){
			Object.prototype[i] = Grab.object[i];
		}
	}
	//Browser Support
	for(i in Grab.locale){
		if(Grab.locale.hasOwnProperty(i)){
			this[i] = Grab.locale[i];
		}
	}
	Object.prototype._G = Grab;
	this._G = Grab;
	this.randomize = Grab.math.randomize;
	//Vector
	this.Vector = Grab.additional.Vector;
	//Canvas
	this.Canvas = Grab.additional.Canvas;
	//Animator
	this.Anime = Grab.additional.Anime;
	_G.fn.isReady();
}());