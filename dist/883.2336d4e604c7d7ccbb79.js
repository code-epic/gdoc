"use strict";(self.webpackChunkargon_dashboard_angular=self.webpackChunkargon_dashboard_angular||[]).push([[883],{84883:function(L,m,c){c.r(m),c.d(m,{AuthLayoutModule:function(){return k}});var f=c(72767),T=c(61116),g=c(31041),A=c(70946),e=c(89071),q=c(3492),Z=c(81888),h=function(){return{standalone:!0}},U=[{path:"login",component:function(){function r(a,n,i,s){this.router=a,this.loginService=n,this.toastrService=i,this.ngxService=s,this.loading=!1,this.isHidden=!0,this.iToken={token:""},this.index=0,null!=sessionStorage.getItem("token")&&this.router.navigate(["/dashboard"])}return r.prototype.ngOnInit=function(){},r.prototype.login=function(){return function(r,a,n,i){return new(n||(n=Promise))(function(t,u){function d(l){try{o(i.next(l))}catch(v){u(v)}}function p(l){try{o(i.throw(l))}catch(v){u(v)}}function o(l){l.done?t(l.value):function(t){return t instanceof n?t:new n(function(u){u(t)})}(l.value).then(d,p)}o((i=i.apply(r,a||[])).next())})}(this,void 0,void 0,function(){var a=this;return function(r,a){var i,s,t,u,n={label:0,sent:function(){if(1&t[0])throw t[1];return t[1]},trys:[],ops:[]};return u={next:d(0),throw:d(1),return:d(2)},"function"==typeof Symbol&&(u[Symbol.iterator]=function(){return this}),u;function d(o){return function(l){return function(o){if(i)throw new TypeError("Generator is already executing.");for(;n;)try{if(i=1,s&&(t=2&o[0]?s.return:o[0]?s.throw||((t=s.return)&&t.call(s),0):s.next)&&!(t=t.call(s,o[1])).done)return t;switch(s=0,t&&(o=[2&o[0],t.value]),o[0]){case 0:case 1:t=o;break;case 4:return n.label++,{value:o[1],done:!1};case 5:n.label++,s=o[1],o=[0];continue;case 7:o=n.ops.pop(),n.trys.pop();continue;default:if(!(t=(t=n.trys).length>0&&t[t.length-1])&&(6===o[0]||2===o[0])){n=0;continue}if(3===o[0]&&(!t||o[1]>t[0]&&o[1]<t[3])){n.label=o[1];break}if(6===o[0]&&n.label<t[1]){n.label=t[1],t=o;break}if(t&&n.label<t[2]){n.label=t[2],n.ops.push(o);break}t[2]&&n.ops.pop(),n.trys.pop();continue}o=a.call(r,n)}catch(l){o=[6,l],s=0}finally{i=t=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,l])}}}(this,function(n){switch(n.label){case 0:return this.ngxService.startLoader("loader-login"),[4,this.loginService.getLogin(this.usuario,this.clave).subscribe(function(i){a.itk=i,sessionStorage.setItem("token",a.itk.token),a.ngxService.stopLoader("loader-login"),a.router.navigate(["/dashboard"])},function(i){a.usuario="",a.clave="",a.ngxService.stopLoader("loader-login"),a.toastrService.error("Error al acceder a los datos de conexion","Bus Empresarial")})];case 1:return n.sent(),[2]}})})},r.\u0275fac=function(n){return new(n||r)(e.Y36(f.F0),e.Y36(A.r),e.Y36(q._W),e.Y36(Z.LA))},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-login"]],decls:48,vars:7,consts:[[1,"header","bg-gradient-success","py-5","py-lg-7"],[1,"container"],[1,"header-body","text-center","mb-5"],[1,"row","justify-content-center"],[1,"col-lg-5","col-md-2"],[1,"text-white"],[1,"separator","separator-bottom","separator-skew","zindex-100"],["x","0","y","0","viewBox","0 0 2560 100","preserveAspectRatio","none","version","1.1"],["points","2560 0 2560 100 0 100",1,"fill-default"],[1,"container","mt--8","pb-5"],[1,"col-lg-5","col-md-"],[1,"card","bg-secondary","shadow","border-0"],[1,"card-header","bg-transparent","pb-1"],[1,"btn-wrapper","text-center"],["src","./assets/img/brand/mppd.png","alt","Responsive image",1,"img-fluid",2,"height","auto"],[1,"card-body","px-lg-3","py-lg-3"],[3,"loaderId"],[1,"text-center","text-muted","mb-4"],["role","form"],["form","ngForm"],[1,"form-group","mb-3"],[1,"input-group","input-group-alternative"],[1,"input-group-prepend"],[1,"input-group-text"],[1,"fa","fa-user"],["placeholder","Usuario","type","text","required","",1,"form-control",3,"ngModel","ngModelOptions","ngModelChange"],[1,"form-group"],[1,"ni","ni-lock-circle-open"],["placeholder","Clave","type","password","required","",1,"form-control",3,"ngModel","ngModelOptions","ngModelChange"],[1,"text-center"],["type","submit",1,"btn","btn-success","my-4",3,"click"],[1,"row","mt-3"],[1,"col-6"],["href","javascript:void(0)",1,"text-light"],[1,"col-6","text-right"]],template:function(n,i){1&n&&(e.TgZ(0,"div",0),e.TgZ(1,"div",1),e.TgZ(2,"div",2),e.TgZ(3,"div",3),e.TgZ(4,"div",4),e.TgZ(5,"h1",5),e._uU(6,"Sistema de Gesti\xf3n de Documentos Despacho MPPD"),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.TgZ(7,"div",6),e.O4$(),e.TgZ(8,"svg",7),e._UZ(9,"polygon",8),e.qZA(),e.qZA(),e.qZA(),e.kcU(),e.TgZ(10,"div",9),e.TgZ(11,"div",3),e.TgZ(12,"div",10),e.TgZ(13,"div",11),e.TgZ(14,"div",12),e.TgZ(15,"div",13),e._UZ(16,"img",14),e.qZA(),e.qZA(),e.TgZ(17,"div",15),e._UZ(18,"ngx-ui-loader",16),e.TgZ(19,"div",17),e.TgZ(20,"small"),e._uU(21,"Introduzca sus credenciales"),e.qZA(),e.qZA(),e.TgZ(22,"form",18,19),e.TgZ(24,"div",20),e.TgZ(25,"div",21),e.TgZ(26,"div",22),e.TgZ(27,"span",23),e._UZ(28,"i",24),e.qZA(),e.qZA(),e.TgZ(29,"input",25),e.NdJ("ngModelChange",function(t){return i.usuario=t}),e.qZA(),e.qZA(),e.qZA(),e.TgZ(30,"div",26),e.TgZ(31,"div",21),e.TgZ(32,"div",22),e.TgZ(33,"span",23),e._UZ(34,"i",27),e.qZA(),e.qZA(),e.TgZ(35,"input",28),e.NdJ("ngModelChange",function(t){return i.clave=t}),e.qZA(),e.qZA(),e.qZA(),e.TgZ(36,"div",29),e.TgZ(37,"button",30),e.NdJ("click",function(){return i.login()}),e._uU(38,"Ingresar"),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.TgZ(39,"div",31),e.TgZ(40,"div",32),e.TgZ(41,"a",33),e.TgZ(42,"small"),e._uU(43,"Recuperar clave?"),e.qZA(),e.qZA(),e.qZA(),e.TgZ(44,"div",34),e.TgZ(45,"a",33),e.TgZ(46,"small"),e._uU(47,"Crear un nuevo usuario"),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA()),2&n&&(e.xp6(18),e.Q6J("loaderId","loader-login"),e.xp6(11),e.Q6J("ngModel",i.usuario)("ngModelOptions",e.DdM(5,h)),e.xp6(6),e.Q6J("ngModel",i.clave)("ngModelOptions",e.DdM(6,h)))},directives:[Z.Jj,g._Y,g.JL,g.F,g.Fj,g.Q7,g.JJ,g.On],styles:[""]}),r}()},{path:"register",component:function(){function r(){}return r.prototype.ngOnInit=function(){},r.\u0275fac=function(n){return new(n||r)},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-register"]],decls:71,vars:0,consts:[[1,"header","bg-gradient-danger","py-7","py-lg-8"],[1,"container"],[1,"header-body","text-center","mb-7"],[1,"row","justify-content-center"],[1,"col-lg-5","col-md-6"],[1,"text-white"],[1,"text-lead","text-light"],[1,"separator","separator-bottom","separator-skew","zindex-100"],["x","0","y","0","viewBox","0 0 2560 100","preserveAspectRatio","none","version","1.1","xmlns","http://www.w3.org/2000/svg"],["points","2560 0 2560 100 0 100",1,"fill-default"],[1,"container","mt--8","pb-5"],[1,"col-lg-6","col-md-8"],[1,"card","bg-secondary","shadow","border-0"],[1,"card-header","bg-transparent","pb-5"],[1,"text-muted","text-center","mt-2","mb-4"],[1,"text-center"],["href","javascript:void(0)",1,"btn","btn-neutral","btn-icon","mr-4"],[1,"btn-inner--icon"],["src","assets/img/icons/common/github.svg"],[1,"btn-inner--text"],["href","javascript:void(0)",1,"btn","btn-neutral","btn-icon"],["src","assets/img/icons/common/google.svg"],[1,"card-body","px-lg-5","py-lg-5"],[1,"text-center","text-muted","mb-4"],["role","form"],[1,"form-group"],[1,"input-group","input-group-alternative","mb-3"],[1,"input-group-prepend"],[1,"input-group-text"],[1,"ni","ni-hat-3"],["placeholder","Name","type","text",1,"form-control"],[1,"ni","ni-email-83"],["placeholder","Email","type","email",1,"form-control"],[1,"input-group","input-group-alternative"],[1,"ni","ni-lock-circle-open"],["placeholder","Password","type","password",1,"form-control"],[1,"text-muted","font-italic"],[1,"text-success","font-weight-700"],[1,"row","my-4"],[1,"col-12"],[1,"custom-control","custom-control-alternative","custom-checkbox"],["id","customCheckRegister","type","checkbox",1,"custom-control-input"],["for","customCheckRegister",1,"custom-control-label"],[1,"text-muted"],["href","#!"],["type","button",1,"btn","btn-primary","mt-4"]],template:function(n,i){1&n&&(e.TgZ(0,"div",0),e.TgZ(1,"div",1),e.TgZ(2,"div",2),e.TgZ(3,"div",3),e.TgZ(4,"div",4),e.TgZ(5,"h1",5),e._uU(6,"Welcome!"),e.qZA(),e.TgZ(7,"p",6),e._uU(8,"Use these awesome forms to login or create new account in your project for free."),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.TgZ(9,"div",7),e.O4$(),e.TgZ(10,"svg",8),e._UZ(11,"polygon",9),e.qZA(),e.qZA(),e.qZA(),e.kcU(),e.TgZ(12,"div",10),e.TgZ(13,"div",3),e.TgZ(14,"div",11),e.TgZ(15,"div",12),e.TgZ(16,"div",13),e.TgZ(17,"div",14),e.TgZ(18,"small"),e._uU(19,"Sign up with"),e.qZA(),e.qZA(),e.TgZ(20,"div",15),e.TgZ(21,"a",16),e.TgZ(22,"span",17),e._UZ(23,"img",18),e.qZA(),e.TgZ(24,"span",19),e._uU(25,"Github"),e.qZA(),e.qZA(),e.TgZ(26,"a",20),e.TgZ(27,"span",17),e._UZ(28,"img",21),e.qZA(),e.TgZ(29,"span",19),e._uU(30,"Google"),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.TgZ(31,"div",22),e.TgZ(32,"div",23),e.TgZ(33,"small"),e._uU(34,"Or sign up with credentials"),e.qZA(),e.qZA(),e.TgZ(35,"form",24),e.TgZ(36,"div",25),e.TgZ(37,"div",26),e.TgZ(38,"div",27),e.TgZ(39,"span",28),e._UZ(40,"i",29),e.qZA(),e.qZA(),e._UZ(41,"input",30),e.qZA(),e.qZA(),e.TgZ(42,"div",25),e.TgZ(43,"div",26),e.TgZ(44,"div",27),e.TgZ(45,"span",28),e._UZ(46,"i",31),e.qZA(),e.qZA(),e._UZ(47,"input",32),e.qZA(),e.qZA(),e.TgZ(48,"div",25),e.TgZ(49,"div",33),e.TgZ(50,"div",27),e.TgZ(51,"span",28),e._UZ(52,"i",34),e.qZA(),e.qZA(),e._UZ(53,"input",35),e.qZA(),e.qZA(),e.TgZ(54,"div",36),e.TgZ(55,"small"),e._uU(56,"password strength: "),e.TgZ(57,"span",37),e._uU(58,"strong"),e.qZA(),e.qZA(),e.qZA(),e.TgZ(59,"div",38),e.TgZ(60,"div",39),e.TgZ(61,"div",40),e._UZ(62,"input",41),e.TgZ(63,"label",42),e.TgZ(64,"span",43),e._uU(65,"I agree with the "),e.TgZ(66,"a",44),e._uU(67,"Privacy Policy"),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.TgZ(68,"div",15),e.TgZ(69,"button",45),e._uU(70,"Create account"),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA())},directives:[g._Y,g.JL,g.F],styles:[""]}),r}()}],C=c(12500),_={bgsColor:"#79c680",bgsOpacity:.2,bgsPosition:"center-center",bgsSize:60,bgsType:"ball-spin-clockwise",blur:8,delay:0,fastFadeOut:!0,fgsColor:"#1ea24a",fgsPosition:"center-center",fgsSize:50,fgsType:"ball-spin-clockwise",gap:24,logoPosition:"center-center",logoSize:120,logoUrl:"",masterLoaderId:"master",overlayBorderRadius:"0",overlayColor:"rgba(40, 40, 40, 0.63)",pbColor:"#79c680",pbDirection:"ltr",pbThickness:3,hasProgressBar:!0,text:"",textColor:"#FFFFFF",textPosition:"center-center",maxTime:-1,minTime:300},k=function(){function r(){}return r.\u0275fac=function(n){return new(n||r)},r.\u0275mod=e.oAB({type:r}),r.\u0275inj=e.cJS({imports:[[T.ez,f.Bz.forChild(U),g.u5,Z.Js.forRoot(_),C.IJ]]}),r}()}}]);