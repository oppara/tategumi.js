/*

Copyright (c) 2011 Alliance Port, LLC (www.allianeport.jp)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function(){
var Tategumibeta = function(element,styles){

	this.targetElement = !element.tagName ? document.getElementById( element ) : element;
	this.paragrpElements = this.targetElement.getElementsByTagName('p');
	this.styles = new Array();	
	this.paragraphs = new Array();
	
	this.layout = function(){
		
		var tempHtml ='';
		
		for(i=0; i<this.paragraphs.length; i++){
			tempHtml+= this.paragraphs[i].applyStyle();	
		}
		this.targetElement.innerHTML= tempHtml;
	}
	
	this.init = function(){
	
		// styles setup
		for(var i=0; i<styles.length;i++){
			this.styles[styles[i].selector] = styles[i].style;	
		}
		this.styles['.DEFAULT'] = {glyphSize:10,glyphsPerLine:20,lineMargin:20,glyphMargin:0,blockMargin:100,kinsoku:true};
	
		//paragrps setup
		for(i=0; i<this.paragrpElements.length; i++){
			var selector = this.paragrpElements[i].className;
			if(selector == null || !this.styles['.'+selector]) selector = 'DEFAULT';
			var style = this.styles['.'+selector];
			if(this.paragrpElements[i].firstChild != null){
				var text = this.paragrpElements[i].firstChild.nodeValue
			}
			else{
				var text = '　';
			}
			this.paragraphs.push(new TGParagraph(selector,style,text));
		}
		
		this.layout();
	}
	
	this.init();


};

var TGParagraph = function(selector,style,text){

	this.selector = selector;

	this.style = {
		glyphSize:		style.glyphSize,
		glyphsPerLine:	style.glyphsPerLine,
		glyphMargin:	style.glyphMargin,
		lineMargin:		style.lineMargin,
		blockMargin:	style.blockMargin,
		kinsoku:		style.kinsoku
	}
	this.text = text;
	this.applyStyle = function(){
		
		var paragraphStyle = 'margin-left: '+this.style.lineMargin + 'px;'
							+' width: '+this.style.glyphSize+'px; '
							+' height: '+eval(this.style.glyphSize*this.style.glyphsPerLine)+'px; '
							+'margin-bottom: '
							+this.style.blockMargin + 'px;';
		var html ='<div class="TGLine '+this.selector+'" style="float:right; '+paragraphStyle+'">';
		var stringArr ='';
		var numGlypL = this.style.glyphsPerLine;
		var charNumL =1;
		var glyphStyle = 'font-size: '+this.style.glyphSize+'px; '
					  +	'line-height: '+this.style.glyphSize+'px; '
					  +	'width: '+this.style.glyphSize+'px; '
					  + 'height: '+this.style.glyphSize+'px; '
					  + 'margin: 0 0 '+this.style.glyphMargin+'px 0;'
					  + 'text-align:inherit; vertical-align: middle;';
		
		var yakumonoShiftVerical = -1*this.style.glyphSize*3/5+'px';
		var yakumonoShiftHorizontal = this.style.glyphSize*2/3+'px';
		
		for(var i = 0 ; i < this.text.length; i++ ){
			if(this.text.charAt(i) =='\n'){
				html += '</div><div class="TGLine '+this.selector+'" style="float:right; '+paragraphStyle+'">';
				charNumL = 1;
			}
			else{
				
				//kinsoku - oidashi
				if(this.style.kinsoku){
					if((charNumL)%numGlypL ==0 && this.text.charAt(i+1)!=null){				
						if(prohibiCh(this.text.charAt(i+1))){								
							stringArr += '</div><div class="TGLine '+this.selector+'" style="float:right; '+paragraphStyle+'">';		
							charNumL ++;												
						}															
					}
				}
				
				//shift 'kutou-ten' 
				
				if(this.text.charAt(i) =='、'||this.text.charAt(i) =='。'){
					stringArr += '<div class="TGglyph"'+' style="'+glyphStyle+'"><span style="position:relative; top:'+yakumonoShiftVerical+'; left:'+yakumonoShiftHorizontal+';">'+glyphRotate(this.text.charAt(i))+'</span></div>';
				}
				else{
					stringArr += '<div class="TGglyph"'+' style="'+glyphStyle+'">'+glyphRotate(this.text.charAt(i))+'</div>';
				}
					
				
				if((charNumL)%numGlypL ==0){
					stringArr += '</div><div class="TGLine '+this.selector+'" style="float:right; '+paragraphStyle+'">';
				}
				charNumL ++;
			}
		}
		
		html += stringArr+ '</div>';
		
		return html;
	}
};

//define -rotated 

var horisontalGlyphs = new Array();
horisontalGlyphs[0] = '（';
horisontalGlyphs[1] = '︵';
horisontalGlyphs[2] = '）';
horisontalGlyphs[3] = '︶';
horisontalGlyphs[4] = '｛';
horisontalGlyphs[5] = '︷';
horisontalGlyphs[6] = '｝';
horisontalGlyphs[7] = '︸';
horisontalGlyphs[8] = '「';
horisontalGlyphs[9] = '﹁';
horisontalGlyphs[10] = '」';
horisontalGlyphs[11] = '﹂';
horisontalGlyphs[12] = '『';
horisontalGlyphs[13] = '﹃';
horisontalGlyphs[14] = '』';
horisontalGlyphs[15] = '﹄';
horisontalGlyphs[18] = 'ー';
horisontalGlyphs[19] = '︱';
horisontalGlyphs[20] = '…';
horisontalGlyphs[21] = '︰';
horisontalGlyphs[22] = '(';
horisontalGlyphs[23] = '︵';
horisontalGlyphs[24] = ')';
horisontalGlyphs[25] = '︶';
horisontalGlyphs[26] = '{';
horisontalGlyphs[27] = '︷';
horisontalGlyphs[28] = '}';
horisontalGlyphs[29] = '︸';
horisontalGlyphs[30] = '[';
horisontalGlyphs[31] = '︵';
horisontalGlyphs[32] = ']';
horisontalGlyphs[33] = '︶';
horisontalGlyphs[34] = '【';
horisontalGlyphs[35] = '︵';
horisontalGlyphs[36] = '】';
horisontalGlyphs[37] = '︶';
horisontalGlyphs[38] = '―';
horisontalGlyphs[39] = '︱';


function glyphRotate(x){
	var temp = '';
	for(var i =0; i<horisontalGlyphs.length; i++){
		if(x == horisontalGlyphs[i]){
  			temp = horisontalGlyphs[i+1];
  			break;
		}
	}
	if(temp =='') temp=x;
	return temp;
}


//define -kinsoku

var pchVerArr = new Array();
pchVerArr[0] = '、';
pchVerArr[1] = '。';
pchVerArr[2] = '（';
pchVerArr[3] = '）';
pchVerArr[4] = '｛';
pchVerArr[5] = '｝';
pchVerArr[6] = '「';
pchVerArr[7] = '」';
pchVerArr[8] = '『';
pchVerArr[9] = '』';
pchVerArr[10] = 'ー';
pchVerArr[11] = '…';
pchVerArr[12] = '(';
pchVerArr[13] = ')';
pchVerArr[14] = '{';
pchVerArr[15] = '}';
pchVerArr[16] = '[';
pchVerArr[17] = ']';
pchVerArr[18] = '【';
pchVerArr[19] = '】';
	function prohibiCh(str){
		for(var i=0; i<pchVerArr.length; i++){
			if(str==pchVerArr[i]){
					return true;
					break;
			}
		}
		return false;
	}


window.Tategumi = Tategumibeta;

// A simple jQuery wrapper
if ( window.jQuery ) {

	$.Tategumi = {};
	$.Tategumi.o = [];
	$.Tategumi.op = {};
	$.Tategumi.defaults = {
		styles: []
	};

	$.fn.Tategumi = function( op ) {

    	return this.each(
        	function() {

            	var s = this.serial = $.Tategumi.o.length;
            	var o = $.extend( {}, $.Tategumi.defaults, op );
            	$.Tategumi.o[s] = $.Tategumi.op = o;

				Tategumibeta( this, o.styles );

			}
		);
	};

}

})();