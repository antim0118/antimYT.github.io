/* MAIN JS CODE */
(function(){

	//если данный класс уже создан
	if(window.TsarvarWidgetClass){return;}

	//---
    var

    /*------------------------------------------------------------------------------------*/
    /*----- КОНСТРУКТОР КЛАССА -----------------------------------------------------------*/
    /*------------------------------------------------------------------------------------*/

    construct=function(){

		//ссылка на свой класс-конструктор
        this.self=window.TsarvarWidgetClass;

		//инициализируем плагин при загрузке DOM
		this.onDomLoaded(this.init);

    },

    /*------------------------------------------------------------------------------------*/
    /*----- МЕТОДЫ КЛАССА ----------------------------------------------------------------*/
    /*------------------------------------------------------------------------------------*/

    methods={

        /*====================================================================================*/
        /*===== СПЕЦИАЛЬНЫЕ ==================================================================*/
        /*====================================================================================*/

		//вызвать коллбэк-функцию `callback` при наступлении события `onDOMContentLoaded`
        onDomLoaded:function(callback){
			var called=false;
			var ready=this.context(function(){
				if(called){return;}
				called=true;
				callback.call(this);
			});
			if(document.addEventListener){
				document.addEventListener('DOMContentLoaded',function(){
					ready();
				},false);
			}
			else if(document.attachEvent){
				if(document.documentElement.doScroll&&window==window.top) {
					function tryScroll(){
						if(called){return;}
						if(!document.body){return;}
						try{
							document.documentElement.doScroll('left');
							ready();
						}
						catch(e){setTimeout(tryScroll,0);}
					}
					tryScroll();
				}
				document.attachEvent('onreadystatechange',function(){
					if(document.readyState==='complete'){
						ready();
					}
				});
			}
		    if(window.addEventListener){window.addEventListener('load',ready,false);}
		    else if(window.attachEvent){window.attachEvent('onload',ready);}
        },

		//возвращает функцию-обёртку, которая вызывает функцию `f` с параметрами `p` в контексте виджета
        context:function(f,p){
            return (function(f,p,o){
                return function(){
                    return f.apply(o,p||arguments||[]);
                };
            })(f,p,this);
        },

        /*====================================================================================*/
        /*===== ИНИЦИАЛИЗИРОВАТЬ ПЛАГИН ВИДЖЕТА ==============================================*/
        /*====================================================================================*/

		//инициализировать виджет и вызвать коллбэк-функцию callback
        init:function(callback){
            //если плагин ранее уже инициализирован
			if(this.self.initCompleted){
				typeof(callback)=='function'&&callback.call(this);
				//-
				return;
			}
			//добавляем коллбэк функцию в очередь
			if(typeof(callback)=='function'){
				this.self.initCallbacks.push(callback);
			}
            //если плагин уже начал инициализацию
            if(this.self.initStarted){
				return;
            }
            this.self.initStarted=true;
			//--- вставляем css-стили в тело документа
			var style=document.createElement('style');
			style.innerHTML=this.self.cssContent;
			document.getElementsByTagName('head')[0].appendChild(style);
			//--- создаём обработчик инициализации
			var initHandler=this.context(function(){
				//если виджет уже проинициализирован
                if(this.self.initCompleted){
					return;
                }
                //отмечаем виджет инициализированным
				this.self.initCompleted=true;
				//вызываем коллбэк-функции из очереди
				for(var i=0;i<this.self.initCallbacks.length;++i){
					this.self.initCallbacks[i].call(this);
				}
				//--- производим манипуляции для очередей инициализации серверов
				if(!window.TsarvarWidgetQueue){window.TsarvarWidgetQueue=[];}
				//если есть серверы в очереди
	            if(window.TsarvarWidgetQueue.length){
	                //инициализируем серверы, стоящие в очереди
	                this.initServersWidgets({
	                    serversData:window.TsarvarWidgetQueue
	                });
	                //очищаем очередь
	                window.TsarvarWidgetQueue=[];
	            }
	            //перегружаем метод добавления сервера в очередь
				window.TsarvarWidgetQueue.push=(function(This){
					return function(p){
						//инициализируем виджет
						This.initServersWidgets({
							serversData:p
						});
					}
				})(this);
			});
			//--- грузим jQuery и вызываем callback
			//если jQuery уже загружен
			if(jQuery){
				initHandler();
			}
			//если jQuery ещё не загружен
			else{
				var script=document.createElement('script');
	            script.type='text/javascript';
	            script.onload=initHandler;
	            script.async=true;
	            script.src='http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js';
	            document.getElementsByTagName('head')[0].appendChild(script);
			}
        },

        /*====================================================================================*/
        /*===== ИНИЦИАЛИЗИРОВАТЬ ВИДЖЕТ СЕРВЕРА ==============================================*/
        /*====================================================================================*/

		//инициализировать виджеты серверов на основе параметров `p`:
		//p.serversData - массив данных серверов
		//p.serversData[].element - (обязательно) селектор элемента для виджета
		//p.serversData[].serverId - (опционально) ID сервера
		//p.serversData[].serverDomain - (опционально) домен сервера
		//p.serversData[].serverIp - (опционально) IP сервера
		//p.serversData[].serverPort - (опционально) порт сервера
		//--- прочие дополнительные параметры:
		//p.serversData[].blackMode=true - если нужно отобразить виджет в тёмном цвете
		initServersWidgets:function(p){
			//инициализируем плагин
			this.init(function(){
				//при загрузке DOM
				jQuery(this.context(function(){
					//получаем данные серверов по API
					p.callback=function(){
						//инициализируем виджет сервера на основе присланных данных
						for(var k in p.serversData){
							//определяем список элементов для инициализации
							var elements=null;
							if(typeof(p.serversData[k].element)=='string'){
								elements=[];
								var $elements=jQuery(p.serversData[k].element);
								for(var i=0;i<$elements.length;++i){
									elements.push($elements.get(i));
								}
							}
							else{
								elements=[p.serversData[k].element];
							}
							//заполняем элементы данными
							for(var i=0;i<elements.length;++i){
								var fillParam={}; //определяем параметры для вызова метода
								//копируем параметры (настройки виджета)
								for(var j in p.serversData[k]){
									fillParam[j]=p.serversData[k][j];
								}
								fillParam.element=elements[i]; //элемент для виджета
								fillParam.serverData=this.findLoadedServerData(p.serversData[k]); //находим данные сервера в списке ранее загруженных данных
								//заполняем элемент данными
								this.fillServerWidgetContent(fillParam);
							}
						}
					}
					//-
					this.queryServersData(p);
				}))
			});
		},

		/*====================================================================================*/
        /*===== НАЙТИ РАНЕЕ ЗАГРУЖЕННЫЕ ДАННЫЕ ДАННЫЕ СЕРВЕРА ================================*/
        /*====================================================================================*/

		//найти ранее загруженные данные сервера на основе параметров `p`:
		//p.serverId (или p.id) - (опционально) ID сервера
		//p.serverDomain (или p.domain) - (опционально) домен сервера
		//p.serverIp (или p.ip) - (опционально) IP сервера
		//p.serverPort (или p.port) - (опционально) порт сервера
		//returnKey=true - если нужно вернуть ключ данных (индекс массива), а не сами данные
		findLoadedServerData:function(p,returnKey){
			if(!p){return;}
			//ищем данные сервера с конца массива
			for(var i=(this.self.serversQueriesServersData.length-1);i>=0;--i){
				if(
					//ищем по ID сервера
					p.serverId&&this.self.serversQueriesServersData[i].id&&p.serverId==this.self.serversQueriesServersData[i].id
					||p.id&&this.self.serversQueriesServersData[i].id&&p.id==this.self.serversQueriesServersData[i].id
					//ищем по домену+порту сервера
					||(
						p.serverDomain&&this.self.serversQueriesServersData[i].domain&&p.serverDomain==this.self.serversQueriesServersData[i].domain
						&&p.serverPort&&this.self.serversQueriesServersData[i].port&&p.serverPort==this.self.serversQueriesServersData[i].port
					)
					||(
						p.domain&&this.self.serversQueriesServersData[i].domain&&p.domain==this.self.serversQueriesServersData[i].domain
						&&p.port&&this.self.serversQueriesServersData[i].port&&p.port==this.self.serversQueriesServersData[i].port
					)
					//ищем по IP+порту сервера
					||(
						p.serverIp&&this.self.serversQueriesServersData[i].ip&&p.serverIp==this.self.serversQueriesServersData[i].ip
						&&p.serverPort&&this.self.serversQueriesServersData[i].port&&p.serverPort==this.self.serversQueriesServersData[i].port
					)
					||(
						p.ip&&this.self.serversQueriesServersData[i].ip&&p.ip==this.self.serversQueriesServersData[i].ip
						&&p.port&&this.self.serversQueriesServersData[i].port&&p.port==this.self.serversQueriesServersData[i].port
					)
				){
					return returnKey?i:this.self.serversQueriesServersData[i];
				}
			}
		},

		/*====================================================================================*/
        /*===== ПОЛУЧИТЬ ДАННЫЕ СЕРВЕРОВ ПО API ==============================================*/
        /*====================================================================================*/

		//получить данные серверов по API на основе данных `p`:
		//p.serversData - массив данных серверов
		//p.serversData[].serverId - ID сервера
		//p.serversData[].serverDomain - домен сервера
		//p.serversData[].serverIp - IP сервера
		//p.serversData[].serverPort - порт сервера
		//p.callback - коллбэк-функция, которая выполнится при успешном получении данных сервера
        queryServersData:function(p){
            //определяем URL получения данных сервера
            var param=[];
			//собираем параметры для акта получения данных серверов
			//-
			//собираем данные сервера для параметров запроса
			var serversData=[];
			for(var k in p.serversData){
				serversData[k]={};
				serversData[k].serverId=p.serversData[k].serverId;
				if(p.serversData[k].serverDomain){serversData[k].serverDomain=p.serversData[k].serverDomain;}
				if(p.serversData[k].serverIp){serversData[k].serverIp=p.serversData[k].serverIp;}
				if(p.serversData[k].serverPort){serversData[k].serverPort=p.serversData[k].serverPort;}
			}
			param.push('serversData='+encodeURIComponent(JSON.stringify(serversData)));
			//собираем данные клиента для параметров запроса
			if(!this.isLocalDomainMode()){
				var clientData=this.getClientData();
				param.push('clientData='+encodeURIComponent(JSON.stringify(clientData)));
			}
			//-
			var unixtime=new Date().valueOf()/1000;
			var random=unixtime-unixtime%(15*60);
			param.push('random='+random);
            var url=this.getWidgetDomainUrl(
                (this.self.backendDetectLang?('/'+this.self.backendDetectLang):'')
                +'/getServersWidgetsData?'+param.join('&')
            );
            //грузим скрипт с данными
            var s=document.createElement('script');
            s.type='text/javascript';
            s.onload=this.context(function(){
				p.callback&&p.callback.call(this);
            });
            s.src=url;
            document.getElementsByTagName('head')[0].appendChild(s);
        },

		//добавить данные ответа по запросу данных серверов
	    //(метод вызывается из ответа данных серверов)
        addServersQueryData:function(queryData){
            //если не получены данные серверов
            if(!queryData||!queryData.serversData){
                //RETURN ERROR
                return;
            }
            //-
            for(var k in queryData.serversData){
                //если пустые данные
				if(!queryData.serversData[k]){continue;}
				//добавляем данные сервера
				this.self.serversQueriesServersData.push(queryData.serversData[k]);
            }
        },

		/*====================================================================================*/
        /*===== КОНТЕНТ ВИДЖЕТА СЕРВЕРА ======================================================*/
        /*====================================================================================*/

		//заполнить контент элемента виджета сервера на основе данных `p`:
		//p.element - ссылка на DOM-элемент для виджета сервера
		//p.serverData - (обязательно) данные сервера, полученные по API
		//--- прочие дополнительные параметры:
		//p.blackMode=true - если нужно отобразить виджет в тёмном цвете
        fillServerWidgetContent:function(p){
            if(!p){
                //RETURN ERROR
				return;
            }
            //--- определяем данные
            var element=p.element; //элемент для виджета
            //если не указан элемент для виджета
            if(!element){
                //RETURN ERROR
				return;
            }
            //--- определяем параметры виджета
	        var blackMode=p.blackMode; //нужно ли отобразить виджет в тёмном цвете
			//---
            var serverData=p.serverData; //данные сервера
            //---
			var wasWidgetInited=false; //флаг о том, был ли ранее проинициализирован виджет
			var resizeHandler=null; //сюда будет записан обработчик ресайза окна
            //--- если элемент уже был проинициализирован
            if(jQuery(element).attr('data-tsarvarWidgetInited')){
				wasWidgetInited=true;
            }
            //если элемент ещё не был проинициализирован
            else{
				//--- меняем название тега с `a` на `div`
				var elementContent=jQuery('<div></div>').append(jQuery(element).clone()).html();
				elementContent=elementContent.split('<a').join('<div').split('</a').join('</div');
				var newElement=jQuery(elementContent).get(0);
				jQuery(element).replaceWith(newElement);
				element=newElement;
				//--- добавляем необходимые классы
				jQuery(element).addClass('tsarvarServerWidget');
				//--- отмечаем элемент проинициализированным
				jQuery(element).attr('data-tsarvarWidgetInited','true');
				//--- указываем в атрибутах ключ данных виджета сервера
	            var serverDataKey=this.findLoadedServerData(serverData,true); //определяем ключ данных сервера в сохранённых данных серверов
	            jQuery(element).attr('data-tsarvarServerDataKey',serverDataKey);
	            //--- ставим обработчик ресайза окна или родительского элемента виджета
	            resizeHandler=this.context(this.updateResizeServerWidget,[element]);
	            jQuery(element).parent().bind('change',resizeHandler);
	            jQuery(window).bind('resize',resizeHandler);
	            //--- если после элемента виджета находятся скрипты - перемещаем скрипты в head документа
	            var removeNextElements=[];
	            var nextElement=jQuery(element).next().get(0);
	            while(nextElement&&jQuery(nextElement).get(0).tagName==='SCRIPT'){

					removeNextElements.push(nextElement);
					nextElement=jQuery(nextElement).next().get(0);
	            }
	            for(var i=0;i<removeNextElements.length;++i){
					jQuery(removeNextElements[i]).appendTo('head');
	            }
            }
            //--- если виджет нужно отобразить в чёрном цвете
			if(blackMode){jQuery(element).addClass('tsarvarServerWidget-BlackMode');}
			else{jQuery(element).removeClass('tsarvarServerWidget-BlackMode');}
            //--- генерируем контент виджета
			var content=[];
            //если не получены данные сервера
            if(!serverData||!serverData.id){
				//генерируем контент о том, что не получилось загрузить данные сервера
				content.push('<div class="tsarvarServerWidget-na">');
				content.push('<a class="tsarvarServerWidget-naLogo" href="'+this.getMainDomainUrl('/')+'">Tsarvar Widget</a>');
				content.push('<br />');
				content.push('<a class="tsarvarServerWidget-naText" href="'+this.getMainDomainUrl('/')+'">');
				content.push(this.text('widget/server-na')); //ТЕКСТ: Не удалось загрузить данные сервера
				content.push('</a>');
				content.push('</div>'); //.tsarvarServerWidget-na
            }
            //если получены данные сервера
            else{
	            //--- определяем данные сервера
	            var serverIsOnline=parseInt(serverData.status);
	            var serverGameId=serverData.gameId; //ID игры
	            var serverGameName=this.getGameName(serverGameId); //название игры сервера
	            var serverGameShortName=this.getGameShortName(serverGameId); //короткое название игры сервера
	            var serverName=serverData.name; //название сервера
	            var serverMapName=serverData.mapName; //название карты сервера
	            var serverMapColorHex=serverData.mapColorHex; //цвет карты
	            var serverMapImages=serverData.mapImages; //данные изображений карты
	            var serverPlayersCount=serverData.playersCount; //текущее количество игроков на сервере
	            var serverPlayersMaxCount=serverData.playersMaxCount; //максимальное количество игроков на сервере
				var serverCountryName=serverData.countryName; //название страны сервера
				var serverCountryIco16Url=serverData.countryIco16Url&&this.getStaticDomainUrl(serverData.countryIco16Url); //URL изображения страны сервера
				var serverPlayersActivity=serverData.playersHoursActivity; //массив почасовой активности игроков
				var serverAddress=serverData.address; //адрес сервера
				var serverUrl=this.getMainDomainUrl(serverData.url); //URL страницы сервера на основном сайте
				//---
				content.push('<div class="tsarvarServerWidget-body">');
				content.push('<div class="tsarvarServerWidget-bodyC1">');
				//изображение
				content.push('<a class="tsarvarServerWidget-images">');
				//если есть изображения
				var c=0;
				if(serverMapImages&&serverMapImages.length){
					for(var i=0;i<serverMapImages.length;++i){
						content.push('<div class="tsarvarServerWidget-image'+(c?' tsarvarServerWidget-image-Hidden':'')+'">'
							+'<div class="tsarvarServerWidget-imageWrap">'
								+'<div class="tsarvarServerWidget-imageWrap2">'
									+'<img src="'+(serverMapImages[i]['thumbUrl'])+'" />'
								+'</div>'
							+'</div>'
						+'</div>');
						++c;
					}
				}
				else{
					content.push('<div class="tsarvarServerWidget-noImage"></div>');
				}
				content.push('</a>'); // /.tsarvarServerWidget-images
				//-
				content.push('</div>'); // /.tsarvarServerWidget-bodyC1
				content.push('<div class="tsarvarServerWidget-bodyC2">');
				//название сервера
				content.push('<a class="tsarvarServerWidget-name">'
					+'<span class="tsarvarServerWidget-nameValue">'
						+(serverName||'')
					+'</span>'
				+'</a>');
				//--- свойства сервера
				content.push('<div class="tsarvarServerWidget-fields">');
				//статус сервера
				content.push('<a class="tsarvarServerWidget-field">'
					+'<div class="tsarvarServerWidget-status '+(serverIsOnline?'tsarvarServerWidget-status-Online':'tsarvarServerWidget-status-Offline')+'">'
						+(serverIsOnline?'Online':'Offline')
					+'</div>'
				+'</a>');
				//название карты (если сервер онлайн)
				if(serverIsOnline){
					content.push('<a class="tsarvarServerWidget-field">'
						+'<div class="tsarvarServerWidget-map">'
							+'<span class="tsarvarServerWidget-mapLabel">'
								+this.text('custom/Map') //ТЕКСТ: Карта
							+'</span>'
							+'<span class="tsarvarServerWidget-mapName" style="color:'+(serverMapColorHex||'')+';">'
								+(serverMapName||'')
							+'</span>'
						+'</div>'
					+'</a>');
				}
				//количество игроков (если сервер онлайн)
				if(serverIsOnline&&serverPlayersMaxCount){
					//определяем процент количества игроков на сервере (от 0 до 100)
					var playersProcent=100*serverPlayersCount/serverPlayersMaxCount;
					//определяем стили для секторов окружности количества игроков
					var chartColor=blackMode?'#3a3a3a':'#eee';
					var chartCss='';
					var chartBarCss='';
					if(playersProcent<50){
						chartCss='background-color:#2075F6';
						chartBarCss='background-image:linear-gradient(90deg,'+chartColor+' 50%,transparent 50%)'
							+',linear-gradient('+(-90+(180*playersProcent/50))+'deg,'+chartColor+' 50%,transparent 50%)';
					}
					else{
						chartCss='background-color:'+chartColor;
						chartBarCss='background-image:linear-gradient(-90deg,#2075F6 50%,transparent 50%)'
							+',linear-gradient('+(-270+(180*(playersProcent)/50))+'deg,#2075F6 50%,transparent 50%)';
					}
					//---
					content.push('<a class="tsarvarServerWidget-field">'
						+'<div class="tsarvarServerWidget-players">'
							+'<div class="tsarvarServerWidget-playersC1">'
								+'<div class="tsarvarServerWidget-playersChart" style="'+chartCss+'">'
									+'<div class="tsarvarServerWidget-playersChartBar" style="'+chartBarCss+'"></div>'
								+'</div>'
							+'</div>'
							+'<div class="tsarvarServerWidget-playersC2">'
								+'<span class="tsarvarServerWidget-playersLabel">'
									+this.text('custom/Players') //ТЕКСТ: Игроки
								+'</span>'
								+'<span class="tsarvarServerWidget-playersCount">'
									+'<span class="tsarvarServerWidget-playersCountCurrent">'+(serverPlayersCount||'0')+'</span>'
									+'<span class="tsarvarServerWidget-playersCountSep">/</span>'
									+'<span class="tsarvarServerWidget-playersCountMax">'+(serverPlayersMaxCount)+'</span>'
								+'</span>'
							+'</div>'
						+'</div>'
					+'</a>');
				}
				//страна (если сервер онлайн)
				if(serverIsOnline&&serverCountryName&&serverCountryName.length){
					content.push('<a class="tsarvarServerWidget-field">'
						+'<div class="tsarvarServerWidget-country">'
							+'<div class="tsarvarServerWidget-countryC1">'
								+'<img class="tsarvarServerWidget-countryIco" src="'+(serverCountryIco16Url||'')+'" />'
							+'</div>'
							+'<div class="tsarvarServerWidget-countryC2">'
								+'<div class="tsarvarServerWidget-countryName">'+(serverCountryName||'')+'</div>'
							+'</div>'
						+'</div>'
					+'</a>');
				}
				//адрес
				content.push('<div class="tsarvarServerWidget-field">'
					+'<div class="tsarvarServerWidget-address">'
						+'<span class="tsarvarServerWidget-addressLabel">'
							+this.text('custom/Address') //ТЕКСТ: Адрес
						+'</span>'
						+'<span class="tsarvarServerWidget-addressValue">'
							+(serverAddress||'')
						+'</span>'
					+'</div>'
				+'</div>');
				content.push('<a onclick="CopyIPToClipboard(\''+(serverAddress||'')+'\');" class="btn btn-primary btn-round" style="position:absolute;bottom:0px;right:4px;font-size:10px;width:30px;height:10px;"><i class="material-icons" style="right:7px;top:-6px">link</i></a>');
				//-
				content.push('</div>'); // /.tsarvarServerWidget-fields
				//-
				content.push('</div>'); // /.tsarvarServerWidget-bodyC2
				content.push('</div>'); // /.tsarvarServerWidget-body
            }
			//---
			content=content.join('');
			//--- вставляем контент
			jQuery(element).html(content);
			//--- если виджет интегрируется на родном сайте - инициализируем ссылки в виджете
			if(this.isLocalDomainMode()){
				window.Tsarvar.initDom(element);
			}
			//--- вызываем обработчик ресайза окна
			if(!wasWidgetInited){
				resizeHandler();
			}
        },

        /*====================================================================================*/
        /*===== КОНТЕНТ ВИДЖЕТА СЕРВЕРА ======================================================*/
        /*====================================================================================*/

		//обработчик ресайза окна или родительского элемента виджета (`e` - элемент виджета)
        updateResizeServerWidget:function(e){
            if(!e||!jQuery(e).parents('html, body').get(0)){
                //RETURN ERROR
                return;
            }
			//получаем ширину элемента
			var eWidth=jQuery(e).width();
			//если нужно садаптировать элемент
			if(eWidth<=360){
				jQuery(e).addClass('tsarvarServerWidget-Compact');
			}
			//обычный режим
			else{
				jQuery(e).removeClass('tsarvarServerWidget-Compact');
			}
        },

        /*====================================================================================*/
        /*===== ОБНОВИТЬ ВИДЖЕТ СЕРВЕРА С ОСНОВЫМИ ПАРАМЕТРАМИ ===============================*/
        /*====================================================================================*/

		//обновить отображение виджета сервера с новыми параметрами на основе параметров `p`:
		//p.element - элемент виджета
		//--- параметры виджета:
		//p.blackMode=true - если нужно отобразить виджет в тёмном цвете
        updateServerWidgetSettings:function(p){
            if(!p){
                //RETURN ERROR
                return;
            }
            //определяем элементы виджетов
            var elements=null;
			if(typeof(p.element)=='string'){
				elements=[];
				var $elements=jQuery(p.element);
				for(var i=0;i<$elements.length;++i){
					elements.push($elements.get(i));
				}
			}
			else{
				elements=[p.element];
			}
			//---
			for(var i=0;i<elements.length;++i){
				//если виджет неинициализирован в данном элементе
				if(!jQuery(elements[i]).attr('data-tsarvarWidgetInited')){
					//CONTINUE ERROR
					continue;
				}
				//определяем ключ данных сервера
				var serverDataKey=jQuery(elements[i]).attr('data-tsarvarServerDataKey');
				//добавляем в параметры данные сервера из сохранённых данных
				p.serverData=this.self.serversQueriesServersData[serverDataKey];
				//обновляем отображение виджета
				this.fillServerWidgetContent(p);
			}
        },

        /*====================================================================================*/
        /*===== ЯЗЫКИ / ТЕКСТЫ ===============================================================*/
        /*====================================================================================*/

        //добавить тексты
        addTexts:function(d){
            for(var k in d){
                this.self.langTexts[k]=d[k];
            }
        },

        //получить текст по коду фразы
        text:function(code){
            return typeof(this.self.langTexts[code])=='undefined'?code:this.self.langTexts[code];
        },

        /*====================================================================================*/
        /*===== ДАННЫЕ ИГР ===================================================================*/
        /*====================================================================================*/

        //получить название игры с ID=`gameId`
        getGameName:function(gameId){
			return this.self.games[gameId]&&this.self.games[gameId]['name'];
        },

		//получить короткое название игры с ID=`gameId`
        getGameShortName:function(gameId){
			return this.self.games[gameId]&&this.self.games[gameId]['shortName'];
        },

        /*====================================================================================*/
        /*===== URL ==========================================================================*/
        /*====================================================================================*/

		//вернуть true/false, запускается ли виджет на родном сайте
        isLocalDomainMode:function(){
			return window.TsarvarSiteClass&&window.Tsarvar?true:false;
        },

        //получить URL домена виджета сервера на основе относительного пути `url`
        getWidgetDomainUrl:function(url){
			//если это не относительный URL
			if(url[0]!=='/'||url[1]==='/'){return url;}
			return 'http://widget.tsarvar.com'+url;
        },

        //получить URL для основного сайта на основе относительного пути `url`
        getMainDomainUrl:function(url){
            //если виджет интегрируется на родном сайте
            if(this.isLocalDomainMode()){
                return window.Tsarvar.url(url);
            }
			//если это не относительный URL
			if(url[0]!=='/'||url[1]==='/'){return url;}
			return 'http://tsarvar.com'+url;
        },

        //получить URL для основного сайта на основе относительного пути `url` и текущего языка
        getMainDomainLangUrl:function(url){
            //если виджет интегрируется на родном сайте
            if(this.isLocalDomainMode()){
                return window.Tsarvar.url(url);
            }
			//если это не относительный URL
			if(url[0]!=='/'||url[1]==='/'){return url;}
			//вызываем основной обработчик получения URL
			return this.getMainDomainUrl('/'+this.self.backendDetectLang+url);
        },

        //получить URL для статического сервера на основе относительного пути `url`
        getStaticDomainUrl:function(url){
			//если это не относительный URL
			if(url[0]!=='/'||url[1]==='/'){return url;}
			return 'http://static.tsarvar.com'+url;
        },

        /*====================================================================================*/
        /*===== ДАТЫ =========================================================================*/
        /*====================================================================================*/

        //получить строку времени "hh:mm" для даты `date`
        getDateTimeStr:function(date){
            if(!(date instanceof Date)){date=new Date(date);} //если передана не дата а unixtime
			var hours=date.getHours();
			var minutes=date.getMinutes();
			return hours+':'+(minutes>10?'':'0')+minutes;
        },

        /*====================================================================================*/
        /*===== ДАННЫЕ О КЛИЕНТЕ =============================================================*/
        /*====================================================================================*/

		//собрать данные о клиенте для отсылки серверу Tsarvar
		getClientData:function(){
			var d={}; //объект возвращаемых данных
			d.pageUrl=window.location.href; //URL страницы, на которой запущен виджет
			//-
			return d;
		}

    },

    /*------------------------------------------------------------------------------------*/
    /*----- СТАТИЧЕСКИЕ СВОЙСТВА КЛАССА --------------------------------------------------*/
    /*------------------------------------------------------------------------------------*/

    staticProps={

        /*====================================================================================*/
        /*===== ИНИЦИАЛИЗАЦИЯ ================================================================*/
        /*====================================================================================*/

		//флаг о том, что была начата инициализация
		initStarted:false,

        //флаг о том, что была произведена инициализация
		initCompleted:false,

		//массив функций-коллбэк ожидающих инициализации
		initCallbacks:[],

		/*====================================================================================*/
        /*===== ОБРАБОТКА ЗАПРОСОВ ===========================================================*/
        /*====================================================================================*/

        //сда сохраняются данные серверов, полученные в ответе на запросы к API данных серверов
        serversQueriesServersData:[],

        /*====================================================================================*/
        /*===== ЯЗЫКИ ========================================================================*/
        /*====================================================================================*/

        //сюда будет записан язык пользователя, определённый серверной стороной
        backendDetectLang:null,

        //здесь будут сохранены данные языковых текстов
        langTexts:{},

        /*====================================================================================*/
        /*===== ДАННЫЕ ИГР ===================================================================*/
        /*====================================================================================*/

		//данные игр
        games:{
            //COUNTER-STRIKE 1.6
            '1':{
                name:'Counter-Strike 1.6',
                shortName:'CS 1.6'
            },
            //COUNTER-STRIKE GO
            '2':{
                name:'Counter-Strike GO',
                shortName:'CS GO'
            },
            //COUNTER-STRIKE SOURCE
            '3':{
                name:'Counter-Strike Source',
                shortName:'CSS'
            }
        }

    };

    /*------------------------------------------------------------------------------------*/
    /*----- СОЗДАНИЕ ЭКЗЕМПЛЯРА КЛАССА ---------------------------------------------------*/
    /*------------------------------------------------------------------------------------*/

    //создаём класс
    window.TsarvarWidgetClass=construct;
    for(var k in methods){window.TsarvarWidgetClass.prototype[k]=methods[k];}
    for(var k in staticProps){window.TsarvarWidgetClass[k]=staticProps[k];}
    //создаём объект-экземпляр
    window.TsarvarWidget=new TsarvarWidgetClass();

})();
/* /MAIN JS CODE */
/* LANGUAGES JS CODE */
window.TsarvarWidgetClass.backendDetectLang='ru'
window.TsarvarWidget.addTexts({
	"custom/Address":"IP:",
	"custom/Map":"Карта",
	"custom/Players":"Игроки",
	"custom/Server":"Сервер",
	"custom/server_widget":"виджет сервера",
	"widget/server-na":"Не удалось загрузить данные сервера"
	});
/* /LANGUAGES JS CODE */
/* CSS CODE */
window.TsarvarWidgetClass.cssContent='.tsarvarServerWidget{display:inline-block;vertical-align:top;width:100%;box-sizing:border-box;text-decoration:none;background:#fff;border-radius:2px;text-align:left;box-shadow:0 0 1px rgba(0,0,0,0.05);font-family: Arial, Tahoma, Verdana, sans-serif;box-shadow:0 0 1px rgba(0,0,0,0.15),0 0 3px rgba(0,0,0,0.1);} .tsarvarServerWidget.tsarvarServerWidget-BlackMode{background:#181818;box-shadow:0 0 1px rgba(0,0,0,0.75),0 0 3px rgba(0,0,0,0.5);} .tsarvarServerWidget + .tsarvarServerWidget{margin-top:6px;}  .tsarvarServerWidget-body{display:table;width:100%;box-sizing:border-box;padding:3px;} .tsarvarServerWidget.tsarvarServerWidget-Compact .tsarvarServerWidget-body{display:block;padding:6px 6px 0 6px;} .tsarvarServerWidget-bodyC1{display:table-cell;vertical-align:top;width:120px;} .tsarvarServerWidget.tsarvarServerWidget-Compact .tsarvarServerWidget-bodyC1{display:block;width:auto;} .tsarvarServerWidget-bodyC2{display:table-cell;vertical-align:top;padding:9px 0 0 12px;} .tsarvarServerWidget.tsarvarServerWidget-Compact .tsarvarServerWidget-bodyC2{display:block;width:auto;padding-left:0;padding-top:12px;}  .tsarvarServerWidget-images{display:block;text-decoration:none;} .tsarvarServerWidget.tsarvarServerWidget-Compact .tsarvarServerWidget-images{text-align:center;} .tsarvarServerWidget-image{width:120px;height:96px;overflow:hidden;position:relative;border-radius:1px;background:#f5f5f5;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-image{background:#222;} .tsarvarServerWidget.tsarvarServerWidget-Compact .tsarvarServerWidget-image{margin:0 auto;} .tsarvarServerWidget-imageWrap{display:table;width:120px;position:absolute;left:0;top:50%;margin:-60px 0 0 0;} .tsarvarServerWidget-imageWrap2{display:table-cell;height:120px;vertical-align:middle;text-align:center;} .tsarvarServerWidget-image img{display:inline-block;vertical-align:top;max-width:120px;max-height:120px;} .tsarvarServerWidget-image-Hidden{display:none;} .tsarvarServerWidget-noImage{width:120px;height:96px;overflow:hidden;position:relative;border-radius:1px;background:url(http://widget.tsarvar.com/img/no_photo_128x128.jpg?VER=2) #f8f8f8 center center no-repeat;background-size:cover;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-noImage{background-image:url(http://widget.tsarvar.com/img/no_photo_black_128x128.jpg?VER=2);background-color:#222;} .tsarvarServerWidget.tsarvarServerWidget-Compact .tsarvarServerWidget-noImage{margin:0 auto;}  .tsarvarServerWidget-name{display:block;font-size:16px;line-height:18px;text-decoration:none;font-weight:600;letter-spacing:0.25px; transition:opacity .1s linear; } .tsarvarServerWidget-name:hover{opacity:0.75; transition:opacity .1s linear; } .tsarvarServerWidget.tsarvarServerWidget-Compact .tsarvarServerWidget-name{text-align:center;} .tsarvarServerWidget-nameLabel{display:inline-block;margin:0 6px 0 0;color:#aaa;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-nameLabel{color:#555;} .tsarvarServerWidget-nameGame{display:inline-block;margin:0 6px 0 0;color:#555;font-weight:600;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-nameGame{color:#bbb;} .tsarvarServerWidget-nameValue{color:#2075F6;} .tsarvarServerWidget.tsarvarServerWidget-Compact .tsarvarServerWidget-nameValue{display:block;margin-top:12px;}  .tsarvarServerWidget-fields{margin:6px 0 0 0;} .tsarvarServerWidget.tsarvarServerWidget-Compact .tsarvarServerWidget-fields{text-align:center;} .tsarvarServerWidget-field{display:inline-block;vertical-align:middle;margin:0 12px 8px 0;} a.tsarvarServerWidget-field{text-decoration:none; transition:opacity .1s linear; } .tsarvarServerWidget.tsarvarServerWidget-Compact .tsarvarServerWidget-field{display:block;margin-right:0;margin-top:12px;} .tsarvarServerWidget.tsarvarServerWidget-Compact .tsarvarServerWidget-field > *{margin:0 auto !important;} a.tsarvarServerWidget-field:hover{opacity:0.75; transition:opacity .1s linear; }  .tsarvarServerWidget-status{font-size:14px;line-height:14px;text-transform:uppercase;font-weight:700;letter-spacing:1px;} .tsarvarServerWidget-status-Online{color:#2075F6;} .tsarvarServerWidget-status-Offline{color:#888;}  .tsarvarServerWidget-map{font-size:13px;line-height:13px;} .tsarvarServerWidget-mapLabel{margin:0 6px 0 0;color:#aaa;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-mapLabel{color:#555;} .tsarvarServerWidget-mapName{color:#555;font-weight:600;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-mapName{color:#888;}  .tsarvarServerWidget-players{display:table;font-size:13px;line-height:13px;} .tsarvarServerWidget-playersC1{display:table-cell;vertical-align:middle;width:16px;} .tsarvarServerWidget-playersC2{display:table-cell;vertical-align:middle;padding:0 0 0 9px;} .tsarvarServerWidget-playersChart{position:relative;width:16px;height:16px;border-radius:50%;} .tsarvarServerWidget-playersChartBar{position:absolute;left:0;top:0;bottom:0;right:0;border-radius:50%;} .tsarvarServerWidget-playersLabel{margin:0 6px 0 0;color:#aaa;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-playersLabel{color:#555;} .tsarvarServerWidget-playersCount{} .tsarvarServerWidget-playersCountCurrent{color:#555;font-weight:600;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-playersCountCurrent{color:#bbb;} .tsarvarServerWidget-playersCountSep{margin:0 3px;color:#aaa;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-playersCountSep{color:#555;} .tsarvarServerWidget-playersCountMax{color:#aaa;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-playersCountMax{color:#555;}  .tsarvarServerWidget-activity{margin:0 6px 0 0;} .tsarvarServerWidget.tsarvarServerWidget-Compact .tsarvarServerWidget-activity{margin-top:12px;margin-right:0;} .tsarvarServerWidget-activityItems{border-bottom:1px solid #f2f2f2;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-activityItems{border-bottom-color:#222;} .tsarvarServerWidget-activityItem{display:inline-block;vertical-align:top;height:18px;vertical-align:bottom;position:relative;width:4.16%;} .tsarvarServerWidget-activityItemBar{display:block;position:absolute;left:0;right:0;bottom:0;background:#f2f2f2;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-activityItemBar{background:#222;} .tsarvarServerWidget-activityScales{display:table;width:100%;box-sizing:border-box;margin:4px 0 0 0;} .tsarvarServerWidget-activityScale{display:table-cell;vertical-align:top;width:16.66%;text-align:center;font-size:10px;line-height:10px;color:#aaa;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-activityScale{color:#555;}  .tsarvarServerWidget-country{display:table;font-size:13px;line-height:13px;} .tsarvarServerWidget-countryC1{display:table-cell;vertical-align:middle;width:16px;} .tsarvarServerWidget-countryC2{display:table-cell;vertical-align:middle;padding:0 0 0 6px;} .tsarvarServerWidget-countryIco{display:block;width:16px;height:16px;} .tsarvarServerWidget-countryName{color:#555;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-countryName{color:#bbb;}  .tsarvarServerWidget-address{font-size:13px;line-height:13px;} .tsarvarServerWidget-addressLabel{margin:0 6px 0 0;color:#aaa;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-addressLabel{color:#555;} .tsarvarServerWidget-addressValue{color:#555;font-weight:700;letter-spacing:0.25px;} .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-addressValue{color:#bbb;}  .tsarvarServerWidget-foot{padding:2px 6px 4px 6px;font-size:10px;line-height:12px;text-transform:uppercase;letter-spacing:0.25px;} .tsarvarServerWidget.tsarvarServerWidget-Compact .tsarvarServerWidget-foot{vertical-align:top;padding-top:12px;text-align:center;} .tsarvarServerWidget-footLink{text-decoration:none;color:#aaa; transition:color .1s linear; } .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-footLink{color:#666;} .tsarvarServerWidget-footLink:hover{color:#2075F6 !important; transition:color .1s linear; } .tsarvarServerWidget-footLinkIco{content:\'\';display:inline-block;width:12px;height:10px;margin:0 5px 0 0;background:url(http://widget.tsarvar.com/img/logo_12x12.png?VER=2) 0 1px no-repeat;} .tsarvarServerWidget-footLinkText{} .tsarvarServerWidget-footLinkTextBrand{font-weight:700;} .tsarvarServerWidget-footLinkTextName{}  .tsarvarServerWidget-na{text-align:center;padding:12px;} .tsarvarServerWidget-naLogo{position:relative;display:inline-block;vertical-align:top;padding:0 0 0 18px;font-size:12px;line-height:12px;text-transform:uppercase;letter-spacing:2px;color:#aaa;font-weight:700;text-decoration:none; transition:color .1s linear; } .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-naLogo{color:#777;} .tsarvarServerWidget-naLogo:hover{color:#2075F6; transition:color .1s linear; } .tsarvarServerWidget-naLogo:before{position:absolute;content:\'\';background:url(http://widget.tsarvar.com/img/logo_12x12.png?VER=2) center center no-repeat;left:0;top:50%;margin:-6px 0 0 0;width:12px;height:12px;} .tsarvarServerWidget-naText{display:inline-block;vertical-align:top;margin:3px 0 0 0;font-size:11px;line-height:11px;text-transform:uppercase;letter-spacing:1px;color:#555;text-decoration:none; transition:color .1s linear; } .tsarvarServerWidget.tsarvarServerWidget-BlackMode .tsarvarServerWidget-naText{color:#aaa;} .tsarvarServerWidget-naText:hover{color:#2075F6; transition:color .1s linear; }';
/* /CSS CODE */
/* DONE IN 0.0008 */