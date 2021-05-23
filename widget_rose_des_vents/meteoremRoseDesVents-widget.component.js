"use strict";
class widget_rose_des_vents extends HTMLElement {

    // 1-contructeur de la balise
    constructor() {

        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="widget_rose_des_vents/content/css/style.css" />
        <section id="widget-vent">
            <header>
                <div class="title-name">Meteorem
                    <span class="ref-btn">
                        <div id='refreshDone' style="opacity:0">Done !</div>
                        <img class='refresh' src="widget_rose_des_vents/content/images/refresh.png" alt="">
                    </span>
                </div>
            </header>
            <div class="statioin">
                <p>Relevé</p>
                <p id='stationName'></p>:
                <h4 class='longitude'></h4>
                <p>/</p>
                <h4 class='latitude'></h4>
            </div>
                <div class="container">
                        <div class="web-section">
                            <div class="flex-block order-2">
                                <div class="circle-img">
                                    <span class="m-cir">
                                        <img id='circle' src="widget_rose_des_vents/content/images/meater-circle.png" alt="">
                                    </span>
                                    <span class="needle">
                                        <img id="flecheDirection" src="widget_rose_des_vents/content/images/needle2.png" alt="">
                                        <span class="gray-circle-number">
                                            <p id="direction"></p>
                                            <sup>&#176;</sup>
                                        </span>
                                    </span>
                                </div>
                                <span class="dernier">
                                    <div id='rel'>
                                        Dernier relevé :
                                        <p id='dernierRel'></p>
                                        mn
                                    </div>
                                    <div id='divTemperature'>
                                        <p>Température :<p>
                                        <span id='temperature'></span> 
                                        <p>°C à<p>
                                        <span id="horaire"></span>
                                    </div>
                                </span>
                            </div>
                            <div class="flex-block algin-v order-1">
                                <div class="vitesses">
                                    <div class="vent-sec">
                                        <div class='divVent'>
                                            <strong id='lblVent'>Vent :</strong>
                                            <div class="abc ventContent">
                                                <p id='vent'></p>
                                                <p id='ventDec'></p>
                                                <p id='convertVent'></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="refales-sec">
                                        <div class='divRafales'>
                                            <strong id='lblRafales'>Rafales :</strong>
                                            <div class="abc rafalesContent">
                                                <p id='rafales'></p>
                                                <p id='rafalesDec'></p>
                                                <p id='convertRafales'></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="radio-btn">
                                    <div class="radio_box">
                                        <input type="radio" id="kmh" name="radio" checked>
                                        <label for="kmh">km/h</label>
                                    </div>
                                    <div class="radio_box">
                                        <input type="radio" id="ms" name="radio">
                                        <label for="ms">m/s</label>
                                    </div>
                                    <div class="radio_box last-box-margin">
                                        <input type="radio" id="nds" name="radio">
                                        <label for="nds">nds</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cordinate-metero">
                    <ul>
                        <li>
                            <p>48,800686 / 2,1431802</p>
                        </li>
                        <li><a href="mailto:info@meteorem.com">info@meteorem.com</a></li>
                        <li><a href="tel:0624636741">Tel : 06 </a>24 63 67 41</li>
                    </ul>
                </div>
            </div>
        </section>
        `;
    }

    // affichage si erreur
    shadowError = () => {
        this.shadowRoot.innerHTML = `
        <style>
            #widget-vent {
                border       : 3px solid #0553b2;
                border-radius: 5px;
                height       : auto;
                max-width: 400px;
                overflow: hidden;
            }
            
            #widget-vent header {
                background: #0553b2;
                display   : block;
                width     : 100%;
                padding : 1rem
            }
            
            #widget-vent .title-name {
                display  : block;
                width    : 100%;
                color    : #ffffff;
                font-size: 23px;
                position : relative
            }

            #widget-vent #noData{
                color: red;
                padding: 2rem;
            }

            #widget-vent .cordinate-metero {
                display: flex;
                justify-content: center;
                height: 100%;
                border-top : solid 1px #e4e4e4;
                width      : 100%;
                color      : #666666;
                background : #eeeeee;
                font-size  : 1rem
            }

            #widget-vent .cordinate-metero ul li {
                display: flex;
                float     : left;
                padding   : 0 10px;
                list-style: none;
                position  : relative
            }
            
            #widget-vent .cordinate-metero ul li:after {
                content   : "";
                position  : absolute;
                background: #999;
                width     : 1px;
                height    : 20px;
                right     : 0;
                top       : 0.6rem;
            }
            
            #widget-vent .cordinate-metero ul li:last-child:after {
                background: none
            }
            
            #widget-vent .cordinate-metero a {
                color: #666666
            }
            
        </style>
        <section id="widget-vent">
            <header>
                <div class="title-name">Meteorem</div>
            </header>
            <div id='noData'>Le serveur ne retourne aucune donnée ou les données renseignées sont incorrectes. (Veuillez contacter le service Météorem)</div>
            <div class="cordinate-metero">
            <ul>
                <li><a href="mailto:info@meteorem.com">info@meteorem.com</a></li>
                <li><a href="tel:0624636741">Tel : 06 </a>24 63 67 41</li>
            </ul>
        </section>
    `
    }


    // 3-Récupère les données de l'API
    fetchAPIData = () => {
        fetch('http://152.228.135.248:6060/stations/' + this._city)
            .then(response => response.json())
            .then(json => {
                this.APIData(json);
                this.render();
                this.refreshBtn();
                this.refreshEvent();
            })
            // A mettre en commentaire lors de debogage
            .catch(() => {
                this.shadowError()
            })
    }

    // 2-Retourne les paramètres entrants (ici la ville, dimensions, chemin)
    connectedCallback() {
        this._city = this.getAttribute('vent-ville') || '505';
        this._size = this.getAttribute('vent-taille') || '4';
        this._href = this.getAttribute('vent-chemin') || '';
        this.fetchAPIData();
    }


    // 4-Initialise des variables extraites de l'API
    APIData = (x) => {
        this.nom = x[0].nom;
        this.refStation = new Date(x[0].refStation);
        this.refTemp = new Date(x[0].refTemp);
        this.longitude = x[0].longitude;
        this.latitude = x[0].latitude;
        this.direction = x[0].direction;
        this.rafales = x[0].burst;
        this.vent = x[0].wind;
        this.temperature = x[0].temperature;
    }

    // 6.4/(refresh)-mise en forme de la vitesse et des unitées de mesures 
    kmh = () => {
        this.selector('#rafales').textContent = parseInt(this.rafales).toString();
        this.selector('#vent').textContent = parseInt(this.vent).toString();
        this.selector('#rafalesDec').textContent = (this.rafales - Math.floor(this.rafales)).toFixed(2).toString().substr(1, 3).replace('.', ',');
        this.selector('#ventDec').textContent = (this.vent - Math.floor(this.vent)).toFixed(2).toString().substr(1, 3).replace('.', ',');
        this.selector('#convertVent').textContent = 'km/h';
        this.selector('#convertRafales').textContent = 'km/h';
    }

    ms = () => {
        this.selector('#rafales').textContent = parseInt(this.rafales / 3.6).toString();
        this.selector('#vent').textContent = parseInt(this.vent / 3.6).toString();
        this.selector('#rafalesDec').textContent = ((this.rafales / 3.6) - Math.floor((this.rafales / 3.6))).toFixed(2).toString().substr(1, 3).replace('.', ',');
        this.selector('#ventDec').textContent = ((this.vent / 3.6) - Math.floor((this.vent / 3.6))).toFixed(2).toString().substr(1, 3).replace('.', ',');
        this.selector('#convertVent').textContent = 'm/s';
        this.selector('#convertRafales').textContent = 'm/s';
    }

    nds = () => {
        this.selector('#rafales').textContent = parseInt(this.rafales / 1.852).toString();
        this.selector('#vent').textContent = parseInt(this.vent / 1.852).toString();
        this.selector('#rafalesDec').textContent = ((this.rafales / 1.852) - Math.floor((this.rafales / 1.852))).toFixed(2).toString().substr(1, 3).replace('.', ',');
        this.selector('#ventDec').textContent = ((this.vent / 1.852) - Math.floor((this.vent / 1.852))).toFixed(2).toString().substr(1, 3).replace('.', ',');
        this.selector('#convertVent').textContent = 'nds';
        this.selector('#convertRafales').textContent = 'nds';
    }


    // 5-raccourci selector (replace le this.shadowRoot.querySelector par this.selector)
    selector = (y) => this.shadowRoot.querySelector(y);


    // 6-Rendu
    render = () => {

        // 6.1-injecte les données dans la page constructeur
        var now = new Date();
        this.selector('#horaire').textContent = this.refTemp.getMinutes() + ":" + this.refTemp.getSeconds();
        this.selector('#stationName').textContent = this.nom;
        this.selector('#temperature').textContent = this.temperature;
        this.selector('#dernierRel').textContent = ((now.getTime() - this.refStation.getTime())/60000).toFixed(0);
        this.selector('#flecheDirection').style.transform = "rotate(" + (this.direction - 180) + "deg)";
        this.selector('#direction').textContent = this.direction;
        this.selector('h4.longitude').textContent = this.longitude;
        this.selector('h4.latitude').textContent = this.latitude;
        this.kmh();

        // 6.2-chemins des images (si le dossier widget_rose_des_vents ne se trouve pas à la racine)
        if (this._href != ''){
            this.selector('link').href = this._href + '/widget_rose_des_vents/content/css/style.css';
            this.selector('#circle').src = this._href + '/widget_rose_des_vents/content/images/meater-circle.png';
            this.selector('#flecheDirection').src = this._href + '/widget_rose_des_vents/content/images/needle2.png';
            this.selector('#img.refresh').src = this._href + '/widget_rose_des_vents/content/images/refresh.png';
        }


        // 6.3-évenements des checkbox
        this.selector('#kmh').onclick = () => this.kmh();
        this.selector('#ms').onclick = () => this.ms();
        this.selector('#nds').onclick = () => this.nds();



        // 6.5-ajuste le style en fonction de la dimension du widget
        if (this._size == 4) {
            resize(this);
            var parent = this;
            window.addEventListener('resize', function () {
                var parentEvent = parent;
                resize(parentEvent)
            });

            function resize(x){ 
                if(window.matchMedia("(max-width:800px)").matches){
                    /* L'affichage est inférieur à 800px de large inclus */
                    x.selector('section').style.minWidth = "450px";
                    x.selector('div.web-section').style.flexDirection = "column";
                    x.selector('div.vitesses').style.flexDirection = "row";
                    x.selector('div.vitesses').style.height = "auto";
                    x.selector('div.vitesses').style.marginBottom = "0px";
                    x.selector('div.flex-block').style.width = "100%";
                    x.selector('div.order-1').style.order = "1";
                    x.selector('div.order-2').style.order = "2";
                    x.selector('div.order-1').style.padding = "2rem 0rem 0rem 0rem";
                    x.selector('div.order-2').style.padding = "1rem 0rem 0rem 0rem";
                    x.selector('div.cordinate-metero').style.fontSize = "15px";
                    
                    // mediaQueries vent
                    x.selector('div.vent-sec').style.width = "auto";
                    x.selector('div.divVent').style.width = "auto";
                    x.selector('#lblVent').style.fontSize = "15px";
                    x.selector('#vent').style.fontSize = "40px";
                    x.selector('#vent').style.transform = "translateY(6px)";
                    x.selector('#ventDec').style.fontSize = "20px";
                    x.selector('#ventDec').style.transform = "translateY(10px)";
                    x.selector('#convertVent').style.fontSize = "10px";
                    x.selector('div.ventContent').style.transform = "translateY(-10px)";

                    // mediaQueries rafales
                    x.selector('div.refales-sec').style.width = "auto";
                    x.selector('div.divRafales').style.width = "auto";
                    x.selector('#lblRafales').style.fontSize = "15px";
                    x.selector('#rafales').style.fontSize = "40px";
                    x.selector('#rafales').style.transform = "translateY(6px)";
                    x.selector('#rafalesDec').style.fontSize = "20px";
                    x.selector('div.refales-sec').style.transform = "translateY(0)";
                    x.selector('div.refales-sec').style.marginTop = "auto";
                    x.selector('#convertRafales').style.fontSize = "10px";
                    x.selector('div.rafalesContent').style.transform = "translateY(-10px)";
                } else{
                    /* L'affichage est supérieur à 800px de large */
                    x.selector('section').style.minWidth = "600px";
                    x.selector('div.web-section').style.flexDirection = "row";
                    x.selector('div.vitesses').style.flexDirection = "column";
                    x.selector('div.vitesses').style.height = "150px";
                    x.selector('div.vitesses').style.marginBottom = "3rem";
                    x.selector('div.flex-block').style.width = "50%";
                    x.selector('div.order-1').style.order = "2";
                    x.selector('div.order-2').style.order = "1";
                    x.selector('div.order-1').style.padding = "3rem 0rem 0rem 0rem";
                    x.selector('div.order-2').style.padding = "3rem 0rem 0rem 0rem";
                    x.selector('div.cordinate-metero').style.fontSize = "15px";


                    // mediaQueries vent
                    x.selector('div.vent-sec').style.width = "auto";
                    x.selector('div.divVent').style.width = "auto";
                    x.selector('#lblVent').style.fontSize = "25px";
                    x.selector('#vent').style.fontSize = "50px";
                    x.selector('#vent').style.transform = "translateY(6px)";
                    x.selector('#ventDec').style.fontSize = "20px";
                    x.selector('#ventDec').style.transform = "translateY(17px)";
                    x.selector('#convertVent').style.fontSize = "15px";
                    x.selector('#convertVent').style.transform = "translateY(18px)";
                    x.selector('div.ventContent').style.transform = "translateY(-8px)";

                    // mediaQueries rafales
                    x.selector('div.refales-sec').style.width = "auto";
                    x.selector('div.divRafales').style.width = "auto";
                    x.selector('#lblRafales').style.fontSize = "25px";
                    x.selector('#rafales').style.fontSize = "50px";
                    x.selector('#rafales').style.transform = "translateY(6px)";
                    x.selector('#rafalesDec').style.fontSize = "20px";
                    x.selector('#rafalesDec').style.transform = "translateY(17px)";
                    x.selector('#convertRafales').style.fontSize = "15px";
                    x.selector('#convertRafales').style.transform = "translateY(18px)";
                    x.selector('div.refales-sec').style.paddingTop = "0px";
                    x.selector('div.refales-sec').style.transform = "translateY(-1em)";
                    x.selector('div.refales-sec').style.marginTop = "10%"; 
                    x.selector('div.rafalesContent').style.transform = "translateY(-8px)";         
                }

                if(window.matchMedia("(max-width:600px)").matches){
                    /* L'affichage est inférieur à 600px de large inclus */
                    x.selector('section').style.minWidth = "280px";
                    x.selector('header').style.padding = "5px";
                    x.selector('div.statioin').style.fontSize = "15px";
                    x.selector('div.statioin').style.padding = "5px";
                    x.selector('div.web-section').style.flexDirection = "column";
                    x.selector('div.web-section').style.fontSize = "10px";
                    x.selector('div.vitesses').style.flexDirection = "row";
                    x.selector('div.vitesses').style.height = "auto";
                    x.selector('div.vitesses').style.marginBottom = "0px";
                    x.selector('div.flex-block').style.width = "100%";
                    x.selector('div.order-1').style.order = "1";
                    x.selector('div.order-2').style.order = "2";
                    x.selector('div.order-1').style.padding = "1rem 0rem 0rem 0rem";
                    x.selector('div.order-2').style.padding = "1rem 0rem 0rem 0rem";
                    x.selector('#kmh').style.transform = "scale(1.5)";
                    x.selector('#ms').style.transform = "scale(1.5)";
                    x.selector('#nds').style.transform = "scale(1.5)";
                    x.selector('[for="kmh"]').style.marginLeft = "0.5rem";
                    x.selector('[for="ms"]').style.marginLeft = "0.5rem";
                    x.selector('[for="nds"]').style.marginLeft = "0.5rem";
                    x.selector('span.gray-circle-number').style.fontSize = "11px";
                    x.selector('#flecheDirection').style.width = "35%";
                    x.selector('div.cordinate-metero').style.fontSize = "9px";
                    
                    // mediaQueries vent
                    x.selector('div.vent-sec').style.width = "auto";
                    x.selector('div.divVent').style.width = "auto";
                    x.selector('#lblVent').style.fontSize = "9px";
                    x.selector('#vent').style.fontSize = "25px";
                    x.selector('#vent').style.transform = "translateY(6px)";
                    x.selector('#ventDec').style.fontSize = "12px";
                    x.selector('#ventDec').style.transform = "translateY(12px)";
                    x.selector('#convertVent').style.fontSize = "10px";
                    x.selector('#convertVent').style.transform = "translateY(10px)";
                    x.selector('div.ventContent').style.transform = "translateY(-10px)";

                    // mediaQueries rafales
                    x.selector('div.refales-sec').style.width = "auto";
                    x.selector('div.divRafales').style.width = "auto";
                    x.selector('#lblRafales').style.fontSize = "9px";
                    x.selector('#rafales').style.fontSize = "25px";
                    x.selector('#rafales').style.transform = "translateY(6px)";
                    x.selector('#rafalesDec').style.fontSize = "12px";
                    x.selector('#rafalesDec').style.transform = "translateY(12px)";
                    x.selector('#convertRafales').style.transform = "translateY(10px)";
                    x.selector('div.refales-sec').style.transform = "translateY(0)";
                    x.selector('div.refales-sec').style.marginTop = "auto";
                    x.selector('div.rafalesContent').style.transform = "translateY(-10px)";   

                } else {
                    x.selector('div.web-section').style.fontSize = "15px";
                    x.selector('header').style.padding = "10px";
                    x.selector('div.statioin').style.fontSize = "20px";
                    x.selector('span.dernier').style.fontSize = "14px";
                    x.selector('#kmh').style.transform = "scale(2)";
                    x.selector('#ms').style.transform = "scale(2)";
                    x.selector('#nds').style.transform = "scale(2)";
                    x.selector('[for="kmh"]').style.marginLeft = "1rem";
                    x.selector('[for="ms"]').style.marginLeft = "1rem";
                    x.selector('[for="nds"]').style.marginLeft = "1rem";
                    x.selector('#flecheDirection').style.width = "55%";
                    x.selector('span.gray-circle-number').style.fontSize = "20px";
                }
            }
            this.selector('div.vitesses').style.height = "auto";
            this.selector('div.vitesses').style.width = "auto";
            this.selector('section').style.width = "auto";
            this.selector('section').style.height = "auto";
            this.selector('section').style.maxWidth = "800px";
        }

        if (this._size == 3) {
            this.selector('header').style.padding = "5px";
            this.selector('div.statioin').style.padding = "5px";
            this.selector('#kmh').style.transform = "scale(1.5)";
            this.selector('#ms').style.transform = "scale(1.5)";
            this.selector('#nds').style.transform = "scale(1.5)";
            this.selector('div.web-section').style.fontSize = "10px";
            this.selector('span.gray-circle-number').style.fontSize = "11px";
            this.selector('span.dernier').style.fontSize = "14px";
            this.selector('[for="kmh"]').style.marginLeft = "0.5rem";
            this.selector('[for="ms"]').style.marginLeft = "0.5rem";
            this.selector('[for="nds"]').style.marginLeft = "0.5rem";
            this.selector('div.vitesses').style.height = "auto";
            this.selector('div.vitesses').style.width = "auto";
            this.selector('#flecheDirection').style.width = "35%";
   
            resize(this);
            var parent = this;
            window.addEventListener('resize', function () {
                var parentEvent = parent;
                resize(parentEvent)
            });
            function resize(x){
                if(window.matchMedia("(max-width:600px)").matches){
                    /* L'affichage est inférieur à 600px de large inclus */
                    x.selector('section').style.minWidth = "280px";
                    x.selector('div.statioin').style.fontSize = "15px";
                    x.selector('div.web-section').style.flexDirection = "column";
                    x.selector('div.vitesses').style.flexDirection = "row";
                    x.selector('div.vitesses').style.height = "auto";
                    x.selector('div.vitesses').style.marginBottom = "0px";
                    x.selector('div.flex-block').style.width = "100%";
                    x.selector('div.order-1').style.order = "1";
                    x.selector('div.order-2').style.order = "2";
                    x.selector('div.order-1').style.padding = "1rem 0rem 0rem 0rem";
                    x.selector('div.order-2').style.padding = "1rem 0rem 0rem 0rem";
                    x.selector('div.cordinate-metero').style.fontSize = "9px";
                    x.selector('div.cordinate-metero').style.visibility = "hidden";
                    x.selector('div.cordinate-metero').style.height = "0px";
                    
                    // mediaQueries vent
                    x.selector('div.vent-sec').style.width = "auto";
                    x.selector('div.divVent').style.width = "auto";
                    x.selector('#lblVent').style.fontSize = "9px";
                    x.selector('#vent').style.fontSize = "25px";
                    x.selector('#vent').style.transform = "translateY(6px)";
                    x.selector('#ventDec').style.fontSize = "12px";
                    x.selector('#ventDec').style.transform = "translateY(10px)";
                    x.selector('#convertVent').style.fontSize = "10px";
                    x.selector('div.ventContent').style.transform = "translateY(-10px)";

                    // mediaQueries rafales
                    x.selector('div.refales-sec').style.width = "auto";
                    x.selector('div.divRafales').style.width = "auto";
                    x.selector('#lblRafales').style.fontSize = "9px";
                    x.selector('#rafales').style.fontSize = "25px";
                    x.selector('#rafales').style.transform = "translateY(6px)";
                    x.selector('#rafalesDec').style.fontSize = "12px";
                    x.selector('div.refales-sec').style.transform = "translateY(0)";
                    x.selector('div.refales-sec').style.marginTop = "auto";
                    x.selector('#convertRafales').style.fontSize = "10px";
                    x.selector('div.rafalesContent').style.transform = "translateY(-10px)";

                } else {
                    /* L'affichage est supérieur à 600px de large */
                    x.selector('section').style.minWidth = "400px";
                    x.selector('div.statioin').style.fontSize = "20px";
                    x.selector('div.web-section').style.flexDirection = "row";
                    x.selector('div.vitesses').style.flexDirection = "column";
                    x.selector('div.vitesses').style.height = "110px";
                    x.selector('div.vitesses').style.marginBottom = "30px";
                    x.selector('div.flex-block').style.width = "50%";
                    x.selector('div.order-1').style.order = "2";
                    x.selector('div.order-2').style.order = "1";
                    x.selector('div.order-1').style.padding = "1rem 0rem 0rem 0rem";
                    x.selector('div.order-2').style.padding = "1rem 0rem 0rem 0rem";
                    x.selector('div.cordinate-metero').style.fontSize = "12px";
                    x.selector('div.cordinate-metero').style.visibility = "visible";
                    x.selector('div.cordinate-metero').style.height = "auto";


                    // mediaQueries vent
                    x.selector('div.vent-sec').style.width = "auto";
                    x.selector('div.divVent').style.width = "auto";
                    x.selector('#lblVent').style.fontSize = "15px";
                    x.selector('#vent').style.fontSize = "30px";
                    x.selector('#vent').style.transform = "translateY(6px)";
                    x.selector('#ventDec').style.fontSize = "15px";
                    x.selector('#ventDec').style.transform = "translateY(10px)";
                    x.selector('#convertVent').style.fontSize = "10px";
                    x.selector('div.ventContent').style.transform = "translateY(-8px)";

                    // mediaQueries rafales
                    x.selector('div.refales-sec').style.width = "auto";
                    x.selector('div.divRafales').style.width = "auto";
                    x.selector('#lblRafales').style.fontSize = "15px";
                    x.selector('#rafales').style.fontSize = "30px";
                    x.selector('#rafales').style.transform = "translateY(6px)";
                    x.selector('#rafalesDec').style.fontSize = "15px";
                    x.selector('#rafalesDec').style.transform = "translateY(10px)";
                    x.selector('#convertRafales').style.fontSize = "10px";
                    x.selector('div.refales-sec').style.paddingTop = "0px";
                    x.selector('div.refales-sec').style.transform = "translateY(-1em)";
                    x.selector('div.refales-sec').style.marginTop = "10%"; 
                    x.selector('div.rafalesContent').style.transform = "translateY(-8px)";                
                }
            }
            this.selector('section').style.width = "auto";
            this.selector('section').style.maxWidth = "400px"
            this.selector('section').style.height = "auto";
        }
        
        if (this._size == 2) {
            this.selector('section').style.minWidth = "280px";
            this.selector('section').style.overflow = "hidden";
            this.selector('header').style.padding = "5px";
            this.selector('div.statioin').style.padding = "5px";
            this.selector('div.statioin').style.fontSize = "15px";
            this.selector('div.title-name').style.fontSize = "15px";
            this.selector('span.ref-btn').style.right = "5px";
            this.selector('img.refresh').style.height = "15px";
            this.selector('img.refresh').style.width = "15px";
            this.selector('div.web-section').style.flexDirection = "column";
            this.selector('div.web-section').style.flexDirection = "column";
            this.selector('div.flex-block').style.width = "100%";
            this.selector('div.order-1').style.order = "1";
            this.selector('div.order-2').style.order = "2";
            this.selector('div.order-2').style.transform = "translateY(-70px)";
            this.selector('div.order-1').style.padding = "1rem 0rem 0rem 0rem";
            this.selector('div.order-2').style.padding = "1rem 0rem 0rem 0rem";
            this.selector('#kmh').style.transform = "scale(1.5)";
            this.selector('#ms').style.transform = "scale(1.5)";
            this.selector('#nds').style.transform = "scale(1.5)";
            this.selector('div.web-section').style.fontSize = "10px";
            this.selector('span.gray-circle-number').style.fontSize = "11px";
            this.selector('#flecheDirection').style.width = "20%";
            this.selector('#circle').style.width = "40%";
            this.selector('span.dernier').style.fontSize = "14px";
            this.selector('[for="kmh"]').style.marginLeft = "0.5rem";
            this.selector('[for="ms"]').style.marginLeft = "0.5rem";
            this.selector('[for="nds"]').style.marginLeft = "0.5rem";
            this.selector('div.vitesses').style.height = "auto";
            this.selector('div.vitesses').style.width = "auto";
            this.selector('div.vitesses').style.flexDirection = "row";
            this.selector('div.vitesses').style.marginBottom = "0px";
            this.selector('div.divVent').style.flexDirection = "column";
            this.selector('div.divRafales').style.flexDirection = "column";
            this.selector('#lblVent').style.margin = "0";
            this.selector('#lblRafales').style.margin = "0";
            this.selector('div.radio-btn').style.visibility = "hidden";
            this.selector('div.cordinate-metero').style.fontSize = "9px";
            
            // mediaQueries vent
            this.selector('div.vent-sec').style.width = "auto";
            this.selector('div.divVent').style.width = "auto";
            this.selector('#lblVent').style.fontSize = "9px";
            this.selector('#vent').style.fontSize = "25px";
            this.selector('#vent').style.transform = "translateY(6px)";
            this.selector('#ventDec').style.fontSize = "12px";
            this.selector('#ventDec').style.transform = "translateY(10px)";
            this.selector('#convertVent').style.fontSize = "10px";
            this.selector('div.ventContent').style.transform = "translateY(-10px)";

            // mediaQueries rafales
            this.selector('div.refales-sec').style.width = "auto";
            this.selector('div.divRafales').style.width = "auto";
            this.selector('#lblRafales').style.fontSize = "9px";
            this.selector('#rafales').style.fontSize = "25px";
            this.selector('#rafales').style.transform = "translateY(6px)";
            this.selector('#rafalesDec').style.fontSize = "12px";
            this.selector('div.refales-sec').style.transform = "translateY(0)";
            this.selector('div.refales-sec').style.marginTop = "auto";
            this.selector('#convertRafales').style.fontSize = "10px";
            this.selector('div.rafalesContent').style.transform = "translateY(-10px)";

            var btnUnits = document.createElement('button');
            btnUnits.innerHTML = `units`;
            btnUnits.className = 'btnUnits';
            this.selector('div.vitesses').appendChild(btnUnits);
            this.selector('section').style.width = "auto";
            this.selector('section').style.maxWidth = "250px"
            this.selector('section').style.height = "350px";

            this.selector('button.btnUnits').onclick = () => {
                if(this.selector('#convertVent').innerHTML == 'km/h'){
                    this.ms();
                    return;
                };
                if(this.selector('#convertVent').innerHTML == 'm/s'){
                    this.nds();
                    return;
                };
                if(this.selector('#convertVent').innerHTML == 'nds'){
                    this.kmh();
                    return;
                };
            };

        }

        if (this._size == 1) {
            this.selector('section').style.overflow = "hidden";
            this.selector('section').style.minWidth = "280px";
            this.selector('header').style.padding = "5px";
            this.selector('div.statioin').style.padding = "5px";
            this.selector('div.statioin').style.fontSize = "15px";
            this.selector('div.web-section').style.flexDirection = "column";
            this.selector('div.flex-block').style.width = "100%";
            this.selector('div.title-name').style.fontSize = "15px";
            this.selector('span.ref-btn').style.right = "5px";
            this.selector('img.refresh').style.height = "15px";
            this.selector('img.refresh').style.width = "15px";
            this.selector('div.web-section').style.flexDirection = "column";
            this.selector('div.order-1').style.order = "1";
            this.selector('div.order-2').style.order = "2";
            this.selector('div.order-2').style.transform = "translateY(-70px)";
            this.selector('div.order-1').style.padding = "1rem 0rem 0rem 0rem";
            this.selector('div.order-2').style.padding = "1rem 0rem 0rem 0rem";
            this.selector('#kmh').style.transform = "scale(1.5)";
            this.selector('#ms').style.transform = "scale(1.5)";
            this.selector('#nds').style.transform = "scale(1.5)";
            this.selector('div.web-section').style.fontSize = "10px";
            this.selector('div.circle-img').style.transform = "rotateX(50deg)";
            this.selector('#circle').style.position = "absolute";
            this.selector('#circle').style.left = "15%";
            this.selector('#circle').style.top = "45%";
            this.selector('div.circle-img').style.height = "105px";
            this.selector('div.circle-img').style.overflow = "hidden";
            this.selector('div.circle-img').className = "imgBorderBottom";
            this.selector('#circle').style.transform = "translateY(-45px) rotate(" + -(this.direction) + "deg)";
            this.selector('span.needle').style.transform = "translateX(-50%) translateY(-35%)";
            this.selector('span.gray-circle-number').style.fontSize = "11px";
            this.selector('span.gray-circle-number').style.transform = "translateX(-45%) translateY(-90%)";
            this.selector('#flecheDirection').style.transform = "rotate(180deg)";
            this.selector('#flecheDirection').style.width = "35%";
            this.selector('span.dernier').style.fontSize = "14px";
            this.selector('[for="kmh"]').style.marginLeft = "0.5rem";
            this.selector('[for="ms"]').style.marginLeft = "0.5rem";
            this.selector('[for="nds"]').style.marginLeft = "0.5rem";
            this.selector('div.vitesses').style.height = "auto";
            this.selector('div.vitesses').style.width = "auto";
            this.selector('div.vitesses').style.flexDirection = "row";
            this.selector('div.vitesses').style.marginBottom = "0px";
            this.selector('div.divVent').style.flexDirection = "column";
            this.selector('div.divRafales').style.flexDirection = "column";
            this.selector('#lblVent').style.margin = "0";
            this.selector('#lblRafales').style.margin = "0";
            this.selector('div.radio-btn').style.visibility = "hidden";
            this.selector('div.cordinate-metero').style.fontSize = "9px";
            
            // mediaQueries vent
            this.selector('div.vent-sec').style.width = "auto";
            this.selector('div.divVent').style.width = "auto";
            this.selector('#lblVent').style.fontSize = "9px";
            this.selector('#vent').style.fontSize = "25px";
            this.selector('#vent').style.transform = "translateY(6px)";
            this.selector('#ventDec').style.fontSize = "12px";
            this.selector('#ventDec').style.transform = "translateY(10px)";
            this.selector('#convertVent').style.fontSize = "10px";
            this.selector('div.ventContent').style.transform = "translateY(-10px)";

            // mediaQueries rafales
            this.selector('div.refales-sec').style.width = "auto";
            this.selector('div.divRafales').style.width = "auto";
            this.selector('#lblRafales').style.fontSize = "9px";
            this.selector('#rafales').style.fontSize = "25px";
            this.selector('#rafales').style.transform = "translateY(6px)";
            this.selector('#rafalesDec').style.fontSize = "12px";
            this.selector('div.refales-sec').style.transform = "translateY(0)";
            this.selector('div.refales-sec').style.marginTop = "auto";
            this.selector('#convertRafales').style.fontSize = "10px";
            this.selector('div.rafalesContent').style.transform = "translateY(-10px)";

            var btnUnits = document.createElement('button');
            btnUnits.innerHTML = `units`;
            btnUnits.className = 'btnUnits';
            this.selector('div.vitesses').appendChild(btnUnits);
            this.selector('section').style.width = "auto";
            this.selector('section').style.maxWidth = "250px"
            this.selector('section').style.height = "350px";
            this.size = 1;

            this.selector('button.btnUnits').onclick = () => {
                if(this.selector('#convertVent').innerHTML == 'km/h'){
                    this.ms();
                    return;
                };
                if(this.selector('#convertVent').innerHTML == 'm/s'){
                    this.nds();
                    return;
                };
                if(this.selector('#convertVent').innerHTML == 'nds'){
                    this.kmh();
                    return;
                };
            };

        }
    }

    // (évenement)-bouton refresh
    refreshBtn = () => {
        this.shadowRoot.querySelector('img.refresh').onclick = () => {
            this.refresh();
            this.selector('#refreshDone').style.opacity = "1";
            setTimeout(() => {
                this.selector('#refreshDone').style.opacity = "0"
            }, 1500)
        }
    }

    // (évenement)-refresh toutes des 20min
    refreshEvent = () => {
        setInterval(() => {
            this.refresh();
        }, 600000);
    }

    refresh = () => {
        fetch('http://152.228.135.248:6060/stations/' + this._city)
        .then(response => response.json())
        .then(json => {
            this.APIData(json)
            var now = new Date;
            if (this.selector('#convertVent').innerHTML == 'km/h') {
                this.kmh();
                this.selector('#temperature').textContent = this.temperature;
                this.selector('#dernierRel').textContent = ((now.getTime() - this.refStation.getTime())/60000).toFixed(0);
                if(this.size === 1){
                    this.selector('#circle').style.transform = "translateY(-45px) rotate(" + -(this.direction) + "deg)";
                } else {
                    this.selector('#flecheDirection').style.transform = "rotate(" + (this.direction - 180) + "deg)";
                }
                this.selector('#direction').textContent = this.direction;
            }

            if (this.selector('#convertVent').innerHTML == 'm/s') {
                this.ms();
                this.selector('#convertVent').textContent = 'm/s';
                this.selector('#convertRafales').textContent = 'm/s';
                this.selector('#temperature').textContent = this.temperature;
                this.selector('#dernierRel').textContent = ((now.getTime() - this.refStation.getTime())/60000).toFixed(0);
                if(this.size === 1){
                    this.selector('#circle').style.transform = "translateY(-45px) rotate(" + -(this.direction) + "deg)";
                } else {
                    this.selector('#flecheDirection').style.transform = "rotate(" + (this.direction - 180) + "deg)";
                }
                this.selector('#direction').textContent = this.direction;
            }

            if (this.selector('#convertVent').innerHTML == 'nds') {
                this.nds();
                this.selector('#convertVent').textContent = 'nds';
                this.selector('#convertRafales').textContent = 'nds';
                this.selector('#temperature').textContent = this.temperature;
                this.selector('#dernierRel').textContent = ((now.getTime() - this.refStation.getTime())/60000).toFixed(0);
                if(this.size === 1){
                    this.selector('#circle').style.transform = "translateY(-45px) rotate(" + -(this.direction) + "deg)";
                } else {
                    this.selector('#flecheDirection').style.transform = "rotate(" + (this.direction - 180) + "deg)";
                }
                this.selector('#direction').textContent = this.direction;
            }
        })
    }
}

// 7-création de la balise
window.customElements.define('rose-des-vents', widget_rose_des_vents);
