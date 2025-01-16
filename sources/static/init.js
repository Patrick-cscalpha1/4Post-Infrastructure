var login_page = `<ol class="breadcrumb"> <li class="breadcrumb-item"> <a class="card-link link-tag">Home</a> </li> <li class="breadcrumb-item active">Login</li> </ol> <br> <center> <div id="errordiv" class="alert alert-danger alert-dismissable" style="display: none;"> <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button> <a id="errormsg"></a> </div> <div class="card" style="max-width: 25rem;"> <div class="card-body"> <h5 class="card-title"><h3>Login</h3></h5> Log in to comment, post me and make yourself visible within the community! <br> <br> <form action="javascript:login_send()"> <input type="text" autocomplete="off" class="form-control" id="username" name="username" placeholder="Username" required> <br> <input type="password" autocomplete="off" class="form-control" id="password" name="password" placeholder="Password" required> <br> <a class="text-muted">Not registered? <a onclick="load_page('/register',register_page,true)" class="card-link link-tag">Create an account</a></a> <br> <br> <button id="loginenter" type="submit" class="btn btn-primary">Enter</button> </form> </div> </div> </center> <br><br><br>`;
var register_page = `<ol class="breadcrumb"><li class="breadcrumb-item"><a onclick="load_page('/',index_page,true);index_load()" class="card-link link-tag">Home</a></li><li class="breadcrumb-item"><a onclick="load_page('/login',login_page,true);" class="card-link link-tag">Login</a></li><li class="breadcrumb-item active">Register</li></ol><br><center><div id="errordiv" class="alert alert-danger alert-dismissable" style="display: none;"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><a id="errormsg"></a></div><div class="card" style="max-width: 25rem;"><div class="card-body"><h5 class="card-title"><h3>Register</h3></h5>Enter the required information to create an account<br><br><form action="javascript:register_send()"><input type="text" autocomplete="off" class="form-control" id="username" name="username"  placeholder="Username" required><br><input type="password" autocomplete="off" class="form-control" id="password" name="password" placeholder="Password" required><br><input type="text" autocomplete="off" class="form-control" id="description" name="description" placeholder="Description" required><br><button id="registerenter" type="submit" class="btn btn-primary">Enter</button></form></div></div></center><br><br><br>`;
var newpost_page = `<br> <ol class="breadcrumb">  <li class="breadcrumb-item">    <a onclick="load_page('/',index_page,true);index_load()" class="card-link link-tag">Home</a>  </li>  <li class="breadcrumb-item active">New Post</li></ol><br><center><h3>New Post</h3><h7>Write your post in the field below and press enter</h7></center><br><br>  <form action="javascript:addpost()">        <div class="form-group">      <label for="titolo"><h5>Title</h5></label>      <input maxlength="20" class="form-control" id="title" name="title" placeholder="Enter the post title" required></input>    </div>    <br>    <div class="form-group">      <label for="contenuto"><h5>Phrase</h5></label>      <textarea maxlength="500" class="form-control" id="phrase" name="phrase" rows="4" placeholder="Insert phrase..." required></textarea>    </div>    <br>    <button id="addpostenter" type="submit" class="btn btn-primary">Enter</button>      </form><br><br><br></br>`;
var index_page = `<div class="d-flex justify-content-between">  <div class="p-2"><h3>Feed</h3></div>  <div class="p-2"></div>  <div class="p-2"><a onclick="load_page('/newpost',newpost_page,true)" class="btn btn-info"><i class="fa fa-pencil"></i> New Post</a></div></div><hr>  <div id="postsarea">    <center>    <br><br><br>    <img src="/static/img/loading.gif" width="50" height="50" alt="">    <br><br><br>    </center>  </div>      <br>  <br>  <br>  <br>  <br></br>`;
var post_page = `<br> <ol class="breadcrumb">  <li class="breadcrumb-item">    <a onclick="load_page('/',index_page,true);index_load()" class="card-link link-tag">Home</a>  </li>  <li class="breadcrumb-item active">Post</li></ol><div id="singlepostarea">  <center>    <br><br><br>    <img src="/static/img/loading.gif" width="50" height="50" alt="">    <br><br><br>    </center></div><hr><form action="javascript:addcomment()" class="input-group-prepend">  <input autocomplete="off" maxlength="100" class="form-control" id="commenttext" name="commenttext" placeholder="Insert comment...">  <button type="submit" class="btn btn-primary" id="commentbtn">Enter</button></form><br><div id="commentsarea">  <center>    <br>    <img src="/static/img/loading.gif" width="50" height="50" alt="">    <br>    </center></div><br><br><br><br><br></br>`;
var profile_page = `<br> <ol class="breadcrumb">  <li class="breadcrumb-item">    <a onclick="load_page('/',index_page,true);index_load()" class="card-link link-tag">Home</a>  </li>  <li class="breadcrumb-item active">Profile</li></ol><br><div class="card" style="max-width: 40.5em; margin:0 auto;">  <div class="card-body">    <center><h3>Profile Information</h3></center>    <img src="/static/img/imgprofilo.png" alt="" class="float-right" height="100" width="100">    <br>    <u>Nickname:</u> <a id="nickname"></a>    <br>    <u>Description:</u> <a id="description"></a>    <br>    <u>Role:</u> <a id="role"></a>    <br>    <u>Followers:</u> <a id="follower"></a>    <br>    <u>Following:</u> <a id="following"></a>    <br><br>    <a class="btn btn-success" id="notfollowed" onclick="follow(this.id)"><i class="fa fa-plus"></i> Follow</a>    <a class="btn btn-secondary" id="followed" onclick="follow(this.id)"><i class="fa fa-check"></i> Followed</a>      </div></div><br><br><br><br><br><br>`;
var notfound_page = `<h1 class="mt-4 mb-3">404 <small>Page not Found</small> </h1> <ol class="breadcrumb"> <li class="breadcrumb-item"> <a class="link-tag card-link">Home</a> </li> <li class="breadcrumb-item active">404</li> </ol> <div class="jumbotron"> <h1 class="display-1">404</h1> <p>The page you are looking for was not found</p> </div>`;


var block = document.getElementById("page_content");

window.onload = function() {
      
      var id = localStorage.getItem("sessionid");

      if((window.location.pathname!="/login")&&(window.location.pathname!="/register")){

        if(!checkUser()){

          load_page("/login",login_page,true);
          set_navbar(false);
          return;

        }

        set_navbar(true);

      }else{

        if(checkUser()){
          load_page("/",index_page,true);
          index_load();
          set_navbar(true);
          return;
        }

        set_navbar(false);

      }

      if(window.location.pathname=="/login"){
        load_page("/login",login_page,false);
      }else if(window.location.pathname=="/register"){
        load_page("/register",register_page,false);
      }else if(window.location.pathname=="/newpost"){
        load_page("/newpost",newpost_page,false);
      }else if(window.location.pathname=="/"){
        load_page("/",index_page,false);
        index_load();
      }else if(window.location.pathname.includes("post/")){
        load_page(window.location.pathname, post_page,false);
        post_load();
      }else if(window.location.pathname.includes("profile/")){
        load_page(window.location.pathname, profile_page,false);
        profile_load();
      }else{
        load_page(window.location.pathname, notfound_page,false);
      }

    };

    function checkUser(){

      var id = localStorage.getItem("sessionid");
      if(id==null){
        return false;
      }
      return true;

    }


    function load_page(path,html,change_url){

      state = {additionalInformation: 'Updated the URL with JS'}

      if(change_url){ window.history.pushState(state, "", path);}

      block.innerHTML = html;

    }

    function set_navbar(logged){

      if(logged){ var l="block"; var nl="none"}else{ var l="none"; var nl="block"}

      var test = document.getElementsByClassName("loggedlink");
      for(var i=0;i<test.length;i++){ test[i].style.display=l}
      var test = document.getElementsByClassName("nologgedlink");
      for(var i=0;i<test.length;i++){ test[i].style.display=nl}

    }

    function logout(){

      localStorage.removeItem("sessionid");
      load_page("/login",login_page,true);
      set_navbar(false);

    }

    function index_load(){

      var id = localStorage.getItem("sessionid");

      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'https://api.'+window.location.host+'/api/posts'.replace("www.",""), true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
          'sessionid': id
      }));

      xhr.onreadystatechange = function() { 

        if (xhr.readyState == 4 && xhr.status == 200){

          var r = JSON.parse(xhr.responseText);

          var content = "";

          for(var i = 0; i<Object.keys(r).length; i++){

            if(r[i]['like']){
              var imgname = "like1.png";
            }else{
              var imgname = "like2.png";
            }

            content = content + '<div class="card"><div class="card-body"><h5 class="card-title text-dark">'+r[i]['title']+`</h5><a style="cursor: pointer" onclick="load_page('/profile/`+r[i]['userid']+`', profile_page,true);profile_load();" class="card-subtitle mb-2 text-muted">From `+r[i]['username']+'</a><p class="card-text text-dark">'+r[i]['phrase']+'</p><a class="card-subtitle mb-2 text-muted">'+r[i]['date']+' </a>&nbsp;&nbsp;<i style="cursor: pointer;" onclick="like(this)" id="icon,'+r[i]['id']+'"><img src="/static/img/'+imgname+'" height="25" width="25"></i>&nbsp;<a class="text-danger"><i id="count,'+r[i]['id']+'">'+r[i]['likes']+`</i> Likes</a><a onclick="load_page('/post/`+r[i]['id']+`', post_page,true);post_load();" class="card-link" style="cursor: pointer">&nbsp;&nbsp;&nbsp;&nbsp;Comment →</a></div></div><br>`
          
          }

          if(content==""){

            content = "<br><br><br><center><p>You will see posts from users you follow here...</p></center><br><br><br>"

          }

          document.getElementById("postsarea").innerHTML = content;

        }

      }

    }


    function post_load(){

      var id = window.location.pathname.split("/").slice(-1)[0];
      var sessionid = localStorage.getItem("sessionid");

      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'https://api.'+window.location.host+'/api/singlepost'.replace("www.",""), true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
          'postid': id,
          'sessionid': sessionid
      }));

      xhr.onreadystatechange = function() { 

        if (xhr.readyState == 4 && xhr.status == 200){

          var r = JSON.parse(xhr.responseText);

          if(r['like']){
            var imgname = "like1.png";
          }else{
            var imgname = "like2.png";
          }

          var content = '<center><font size="+2"><h1>'+r['title']+`</h1><a style="cursor: pointer" onclick="load_page('/profile/`+r['userid']+`', profile_page,true);profile_load();" class="card-subtitle mb-2 text-muted">From `+r['username']+'</a><p>'+r['phrase']+'</p><a class="mb-2 text-muted">'+r['date']+' </a>&nbsp;&nbsp;&nbsp;<i style="cursor: pointer;" onclick="like(this)" id="icon,'+r['id']+'"><img src="/static/img/'+imgname+'" height="30" width="30"></i>&nbsp;<a class="text-danger"><i id="count,'+r['id']+'">'+r['likes']+'</i> Likes</a></font></center>';

          document.getElementById("singlepostarea").innerHTML = content;

          var c = r['comments'];
          content = "";

          for(var i = 0; i<Object.keys(c).length; i++){

            content = content + `<a style="cursor: pointer" onclick="load_page('/profile/`+c[i]['userid']+`', profile_page,true);profile_load();" class="text-dark"><b>`+c[i]['username']+'</b></a>&nbsp;&nbsp;<a class="text-muted">'+c[i]['date']+'</a><p>'+c[i]['comment']+'</p><hr>'

          }

          document.getElementById("commentsarea").innerHTML = content;
          
        }

      }

    }

    function profile_load(){

      var userid = window.location.pathname.split("/").slice(-1)[0];
      var id = localStorage.getItem("sessionid");

      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'https://api.'+window.location.host+'/api/profile'.replace("www.",""), true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
          'sessionid': id,
          'userid': userid
      }));

      xhr.onreadystatechange = function() { 

        if (xhr.readyState == 4 && xhr.status == 200){

          var p = JSON.parse(xhr.responseText);

          document.getElementById("nickname").textContent = p['username'];
          document.getElementById("description").textContent = p['description'];
          document.getElementById("role").textContent = p['role'];
          document.getElementById("follower").textContent = p['follower'];
          document.getElementById("following").textContent = p['following'];

          if(p['followed']){
            document.getElementById("notfollowed").style.display = "none";
            document.getElementById("followed").style.display = "inline-block";
          }else{
            document.getElementById("notfollowed").style.display = "inline-block";
            document.getElementById("followed").style.display = "none";
          }

        }else{
            load_page("/",index_page,true);
            index_load();
        }

      }

    }


    function like(o){

      var postid = o.id.split(",")[1];
      
      if(o.getElementsByTagName('img')[0].src.includes("like2")){

        o.getElementsByTagName('img')[0].src = "/static/img/like1.png";
        document.getElementById("count,"+postid).textContent = parseInt(document.getElementById("count,"+postid).textContent)+1;
        var likeb = true;

      }else{

        o.getElementsByTagName('img')[0].src = "/static/img/like2.png";
        document.getElementById("count,"+postid).textContent = parseInt(document.getElementById("count,"+postid).textContent)-1;
        var likeb = false;

      }

      var id = localStorage.getItem("sessionid");

      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'https://api.'+window.location.host+'/api/like'.replace("www.",""), true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
          'sessionid': id,
          'postid': postid,
          'like': likeb
      }));

      xhr.onreadystatechange = function() { 

        if (xhr.readyState == 4 && xhr.status == 200){

          //nothing

        }

      }

    }

    function display_error(t){

      document.getElementById("errordiv").style.display = "block";
      document.getElementById("errormsg").textContent = t;
    
    }

    function login_send(){

      var password = document.getElementById("password").value;
      var username = document.getElementById("username").value;

      document.getElementById("loginenter").disabled = true;
    
      var xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://api.'+window.location.host+'/api/login'.replace("www.",""), true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            'username': username,
            'password': password
        }));
    
        xhr.onreadystatechange = function() { 
    
          if (xhr.readyState == 4 && xhr.status == 200){
    
            var resp = xhr.responseText;
            document.getElementById("loginenter").disabled = false;
    
            if(resp!="error"){
    
              localStorage.setItem('sessionid',resp);
              load_page("/",index_page,true);
              index_load();
              set_navbar(true);
    
            }else{
    
              display_error("Bad Credentials");
    
            }
    
          }
    
        }
    
    }


    function register_send(){

      var password = document.getElementById("password").value;
      var username = document.getElementById("username").value;
      var description = document.getElementById("description").value;

      document.getElementById("registerenter").disabled = true;
    
      if(username.includes("-")){
        display_error("Username cannot contain dashes");
        return;
      }
    
      var xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://api.'+window.location.host+'/api/register'.replace("www.",""), true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            'username': username,
            'password': password,
            'description': description
        }));
    
        xhr.onreadystatechange = function() { 
    
          if (xhr.readyState == 4 && xhr.status == 200){
    
            var resp = xhr.responseText;
            document.getElementById("registerenter").disabled = false;
    
            load_page("/login",login_page,true);
    
          }
    
        }
    
    }


    function addcomment(){

      document.getElementById("commentbtn").disabled = true;
  
      var text = document.getElementById("commenttext").value;
      var id = localStorage.getItem("sessionid");
      var postid = window.location.pathname.split("/").slice(-1)[0];
  
      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'https://api.'+window.location.host+'/api/addcomment'.replace("www.",""), true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
          'sessionid': id,
          'comment': text,
          'postid': postid
      }));
  
      xhr.onreadystatechange = function() { 
  
        if (xhr.readyState == 4 && xhr.status == 200){
  
          document.getElementById("commentbtn").disabled = false;
          document.getElementById("commenttext").value = "";
  
          document.getElementById("commentsarea").innerHTML = '<a class="text-dark"><b>you</b></a>&nbsp;&nbsp;<a class="text-muted">now</a><p>'+text+'</p><hr>' + document.getElementById("commentsarea").innerHTML;
  
        }
      
      }
  
    }


    function addpost(){

      var id = localStorage.getItem("sessionid");
      var title = document.getElementById("title").value;
      var phrase = document.getElementById("phrase").value;

      document.getElementById("addpostenter").disabled = true;
  
      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'https://api.'+window.location.host+'/api/addpost'.replace("www.",""), true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
          'sessionid': id,
          'title': title,
          'phrase': phrase
      }));
  
      xhr.onreadystatechange = function() { 
  
        if (xhr.readyState == 4 && xhr.status == 200){

          document.getElementById("addpostenter").disabled = false;
  
          load_page("/",index_page,true);
          index_load();
  
        }
  
      }
  
    }


    function follow(btn){

      document.getElementById(btn).disabled = true;
  
      var userid = window.location.pathname.split("/").slice(-1)[0];
      var id = localStorage.getItem("sessionid");
  
      if(btn=="followed"){
        var follow=false;
      }else{
        var follow=true;
      }
  
      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'https://api.'+window.location.host+'/api/follow'.replace("www.",""), true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
          'sessionid': id,
          'userid': userid,
          'follow': follow
      }));
  
      xhr.onreadystatechange = function() { 
  
        if (xhr.readyState == 4 && xhr.status == 200){
  
          document.getElementById(btn).disabled = false;
  
          if(follow){
            document.getElementById("notfollowed").style.display = "none";
            document.getElementById("followed").style.display = "inline-block";
          }else{
            document.getElementById("notfollowed").style.display = "inline-block";
            document.getElementById("followed").style.display = "none";
          }
  
        }
  
      }
  
    }
