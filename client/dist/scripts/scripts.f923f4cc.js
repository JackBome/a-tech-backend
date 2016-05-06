"use strict";angular.module("clientApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.bootstrap"]).constant("apiUrl","http://sxnk110.workerhub.cn:9000/api/v1").constant("hostUrl","http://sxnk110.workerhub.cn:9000").config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/welcome.html",controller:"MainCtrl"}).when("/signup",{templateUrl:"views/signup.html",controller:"SignupCtrl"}).when("/dashboard",{templateUrl:"views/dashboard.html",controller:"DashboardCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/addpost",{templateUrl:"views/addpost.html",controller:"AddpostCtrl"}).when("/viewpost/:postId",{templateUrl:"views/viewpost.html",controller:"ViewpostCtrl"}).when("/article/add",{templateUrl:"views/article/add.html",controller:"ArticleCtrl"}).when("/article/list",{templateUrl:"views/article/list.html",controller:"ArticleCtrl"}).when("/category/add",{templateUrl:"views/category/add.html",controller:"CategoryCtrl"}).when("/category/list",{templateUrl:"views/category/list.html",controller:"CategoryCtrl"}).when("/video/add",{templateUrl:"views/video/add.html",controller:"VideoCtrl"}).when("/video/list",{templateUrl:"views/video/list.html",controller:"VideoCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("clientApp").controller("MainCtrl",["$scope","$http",function(a,b){}]),angular.module("clientApp").controller("SignupCtrl",["$scope","$http","$log","alertService","$location","userService","apiUrl",function(a,b,c,d,e,f,g){a.signup=function(){var c={email:a.email,password:a.password,phone:a.phone,name:a.name};b.post(g+"/admin/signup",c).error(function(a,b){400===b&&angular.forEach(a,function(a,b){"email"===b||"password"===b?d.add("danger",b+" : "+a):d.add("danger",a.message)}),500===b&&d.add("danger","Internal server error!")}).success(function(b){b.hasOwnProperty("success")&&(f.username=a.email,e.path("/dashboard"))})}}]),angular.module("clientApp").factory("alertService",["$timeout",function(a){function b(b,d,e){return e?a(function(){c(this)},e):a(function(){c(this)},g),i.push({type:b,msg:d,close:function(){return c(this)}})}function c(a){return d(i.indexOf(a))}function d(a){return i.splice(a,1)}function e(){i=[]}function f(){return i}var g=3e3,h={add:b,closeAlert:c,closeAlertIdx:d,clear:e,get:f},i=[];return h}]),angular.module("clientApp").controller("AlertsCtrl",["$scope","alertService",function(a,b){a.alerts=b.get()}]),angular.module("clientApp").controller("DashboardCtrl",["$scope","$log","$http","alertService","$location",function(a,b,c,d,e){a.loadPosts=function(){c.get("/app/userposts").error(function(a,b){401===b?e.path("/login"):d.add("danger",a.error.message)}).success(function(b){a.posts=b})}}]),angular.module("clientApp").factory("userService",function(){var a="";return{username:a}}),angular.module("clientApp").controller("MenuCtrl",["$scope","$http","userService","$location",function(a,b,c,d){a.user=c,a.logout=function(){b.get("/api/v1/admin/logout").success(function(a){a.hasOwnProperty("success")&&($cookies.isLoggedIn=!1,c.username="",d.path("/login"))})},a.$watch("user.username",function(b){""===b?a.isLoggedIn=!1:(a.username=b,a.isLoggedIn=!0)})}]),angular.module("clientApp").controller("LoginCtrl",["$scope","userService","$cookies","$cookieStore","$location","$log","$http","alertService","apiUrl","hostUrl",function(a,b,c,d,e,f,g,h,i,j){a.isAuthenticated=function(){b.username?(f.debug(b.username),e.path("/dashboard")):g.get(j+"/api/isauthenticated").error(function(){e.path("/login")}).success(function(a){console.log(a.success),a.hasOwnProperty("success")&&(b.username=a.success.user,e.path("/dashboard"))})},a.isAuthenticated(),a.login=function(){var a={email:this.email,password:this.password};g.post(i+"/admin/login",a).error(function(a,b){400===b?angular.forEach(a,function(a,b){"email"===b||"password"===b?h.add("danger",b+" : "+a):h.add("danger",a.message)}):401===b?h.add("danger","Invalid login or password!"):500===b?h.add("danger","Internal server error!"):h.add("danger",a)}).success(function(a){f.debug(a),a.hasOwnProperty("success")&&(c.isLoggedIn=!0,d.put("isLoggedIn",1),b.username=a.success.user,e.path("/dashboard"))})}}]),angular.module("clientApp").controller("AddpostCtrl",["$scope","$http","alertService","$location",function(a,b,c,d){a.post=function(){var e={subject:a.subject,content:a.content};b.post("/app/post",e).error(function(a,b){400===b?angular.forEach(a,function(a,b){"subject"===b||"content"===b?c.add("danger",b+" : "+a):c.add("danger",a.message)}):401===b?d.path("/login"):500===b?c.add("danger","Internal server error!"):c.add("danger",a)}).success(function(b){a.subject="",a.content="",c.add("success",b.success.message)})}}]),angular.module("clientApp").controller("ViewpostCtrl",["$scope","$http","$routeParams","alertService","$location","userService",function(a,b,c,d,e,f){a.user=f,a.params=c,a.postId=a.params.postId,a.viewPost=function(){b.get("/app/post/"+a.postId).error(function(a){d.add("danger",a.error.message)}).success(function(b){a.post=b})},a.viewPost(),a.addComment=function(){var c={postId:a.postId,comment:a.comment};b.post("/app/comment",c).error(function(a,b){400===b?angular.forEach(a,function(a,b){"comment"===b?d.add("danger",b+" : "+a):d.add("danger",a.message)}):401===b?e.path("/login"):500===b?d.add("danger","Internal server error!"):d.add("danger",a)}).success(function(b){d.add("success",b.success.message),a.comment="",a.viewPost()})}}]),angular.module("clientApp").service("articleService",["$http","$cookies","apiUrl",function(a,b,c){var d=this;return d.addArticle=function(d,e,f){a({method:"POST",url:c+"/article",headers:{authenticate:b.token},data:{title:d.title,content:d.content,tag:d.tag,sort:d.sort,image:d.image,categoryId:d.categoryId}}).then(function(a){"function"==typeof e&&e(a)},function(a){"function"==typeof f&&f(a)})},d.updateArticle=function(d,e,f){a({method:"PUT",url:c+"/article/"+d.articleId,headers:{authenticate:b.token},data:{title:d.title,content:d.content,tag:d.tag,sort:d.sort,image:d.image,categoryId:d.categoryId}}).then(function(a){"function"==typeof e&&e(a)},function(a){"function"==typeof f&&f(a)})},d.getArticles=function(d,e,f){a({method:"GET",url:c+"/articles",headers:{authenticate:b.token}}).then(function(a){"function"==typeof e&&e(a)},function(a){"function"==typeof f&&f(a)})},d.deleteArticle=function(d,e,f){a({method:"DELETE",url:c+"/article/"+d.id,headers:{authenticate:b.token}}).then(function(a){"function"==typeof e&&e(a)},function(a){"function"==typeof f&&f(a)})},d}]),angular.module("clientApp").controller("ArticleCtrl",["$scope","$rootScope","$http","alertService","$location","articleService",function(a,b,c,d,e,f){a.getArticles=function(){f.getArticles({},function(b){console.log(b.data),a.articles=b.data},function(a){console.log("文章获取失败")})},a.getArticles(),a.addArticle=function(){f.addArticle({title:a.title,content:a.content,tag:a.tag,sort:a.sort,image:a.image,categoryId:a.categoryId},function(b){a.subject="",a.content="",d.add("success",b.data.success.message),e.path("/article/list")},function(a){console.log(a),400===a.status?angular.forEach(a.data,function(a,b){"title"===b||"content"===b||"categoryId"==b?d.add("danger",b+" : "+a):d.add("danger",a.message)}):401===a.status?e.path("/login"):500===a.status?d.add("danger","Internal server error!"):d.add("danger",a.date)})},a.deleteArticle=function(b){f.deleteArticle({id:b},function(b){d.add("success",b.data.success.message),a.getArticles()},function(a){d.add("success",a.data.error.message)})}}]),angular.module("clientApp").service("categoryService",["$http","$cookies","apiUrl",function(a,b,c){var d=this;return d.addCategory=function(d,e,f){a({method:"POST",url:c+"/category?categoryType="+d.type+"&parentId="+d.parentId,headers:{authenticate:b.token},data:{name:d.name,sort:d.sort,image:d.image}}).then(function(a){"function"==typeof e&&e(a)},function(a){"function"==typeof f&&f(a)})},d.updateCategory=function(d,e,f){a({data:{name:d.name,sort:d.sort,image:d.image},method:"PUT",url:c+"/category/"+d.categoryId,headers:{authenticate:b.token}}).then(function(a){"function"==typeof e&&e(a)},function(a){"function"==typeof f&&f(a)})},d.getCategories=function(d,e,f){a({method:"GET",url:c+"/categories",data:{categoryType:d.type},headers:{authenticate:b.token}}).then(function(a){"function"==typeof e&&e(a)},function(a){"function"==typeof f&&f(a)})},d.deleteCategory=function(d,e,f){a({method:"DELETE",url:c+"/category/"+d.id,headers:{authenticate:b.token}}).then(function(a){"function"==typeof e&&e(a)},function(a){"function"==typeof f&&f(a)})},d}]),angular.module("clientApp").controller("CategoryCtrl",["$scope","$http","alertService","$location","categoryService",function(a,b,c,d,e){a.selectType="",a.getCategories=function(b){e.getCategories({type:b},function(b){console.log(b.data),a.categories=b.data},function(a){console.log("分类获取失败")})},a.getCategories(""),a.addCategory=function(b){e.addCategory({parentId:a.categoryId,name:a.name,sort:a.sort,image:a.image,type:"ARTICLE"},function(a){console.log(a.data.success.message),c.add("success",a.data.success.message),d.path("/category/list")},function(a){console.log(a),400===a.status?angular.forEach(a.data,function(a,b){"name"===b||"image"===b?c.add("danger",b+" : "+a):c.add("danger",a.message)}):401===a.status?d.path("/login"):500===a.status?c.add("danger","Internal server error!"):c.add("danger",a.date)})},a.deleteCategory=function(b){e.deleteCategory({id:b},function(b){c.add("success",b.data.success.message),a.getCategories("")},function(a){c.add("success",a.data.error.message)})},a.$watch(a.selectType,a.getCategories(a.selectType))}]),angular.module("clientApp").service("videoService",["$http","$cookies","apiUrl",function(a,b,c){var d=this;return d.addVideo=function(d,e,f){a({method:"POST",url:c+"/video",headers:{authenticate:b.token},data:{name:d.name,description:d.description,path:d.path,categoryId:d.categoryId}}).then(function(a){"function"==typeof e&&e(a)},function(a){"function"==typeof f&&f(a)})},d.deleteVideo=function(d,e,f){a({method:"DELETE",url:c+"/video/"+d.videoId,headers:{authenticate:b.token}}).then(function(a){"function"==typeof e&&e(a)},function(a){"function"==typeof f&&f(a)})},d.updateVideo=function(d,e,f){a({method:"PUT",url:c+"/video/"+d.videoId,headers:{authenticate:b.token},data:{name:d.name,description:d.description,path:d.path,categoryId:d.categoryId}}).then(function(a){"function"==typeof e&&e(a)},function(a){"function"==typeof f&&f(a)})},d.getVideos=function(d,e,f){a({method:"GET",url:c+"/videos",headers:{authenticate:b.token}}).then(function(a){"function"==typeof e&&e(a)},function(a){"function"==typeof f&&f(a)})},d}]),angular.module("clientApp").controller("VideoCtrl",["$scope","$rootScope","$http","alertService","$location","videoService",function(a,b,c,d,e,f){a.getVideos=function(){f.getVideos({},function(b){console.log(b.data),a.videos=b.data},function(a){console.log("视频获取失败")})},a.getVideos(),a.deleteVideo=function(b){f.deleteVideo({videoId:b},function(b){d.add("success",b.data.success.message),a.getVideos()},function(a){d.add("success",a.data.error.message)})},a.addVideo=function(){f.addVideo({name:a.name,description:a.description,path:a.path,categoryId:a.categoryId},function(b){a.name="",a.description="",a.path="",a.categoryId="",d.add("success",b.data.success.message),e.path("/video/list")},function(a){console.log(a),400===a.status?angular.forEach(a.data,function(a,b){"name"===b||"description"===b||"categoryId"==b||"path"===b?d.add("danger",b+" : "+a):d.add("danger",a.message)}):401===a.status?e.path("/login"):500===a.status?d.add("danger","Internal server error!"):d.add("danger",a.date)})}}]);