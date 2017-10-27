_G().onsurf(function(){
	_G('.callback').on('click',function(){
		var ex = this._G()._G('<').next()[0].innerHTML.replace(/<br\>+/g,' ').replace(/<(?:\/|)i\>/g,' ').replace(/[\s\n\t]+/g,' ').replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>');
		console.log(ex);
		eval(ex);
	});
});