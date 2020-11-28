import swal from 'sweetalert';
var myvar = '<div class="md-modal md-effect-1" id="modal-1">'+
'                                <div class="md-content">'+
'                                    <h3>Select Platform</h3>'+
'                                    <div >'+
'                                        <div style="display: inline; display: flex; margin:0 auto; vertical-align: middle;">'+
'                                            <section style="display:block; overflow: hidden;  padding:5px; width: 150px;">'+
'                                                <div style="width: 150px;  ">'+
'                                                 <a  href="https://www.microsoft.com/store/productId/9PM98T5CX376" target="_blank">'+
'                                                     <img style="margin:auto; height: 150px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Android_robot.svg/1200px-Android_robot.svg.png">'+
'                                                     <h1 style="color: white; vertical-align: center; text-align: center;">Android</h1>'+
'                                                 </a>'+
'                                                </div>'+
'                                             </section>'+
'                                             <section style="display:block; overflow: hidden;  padding:5px; width: 150px; ">'+
'                                                 <div style="width: 150px;" >'+
'                                                  <a  href="https://www.microsoft.com/store/productId/9PM98T5CX376" target="_blank">'+
'                                                      <img style="margin:auto; height: 150px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Android_robot.svg/1200px-Android_robot.svg.png">'+
'                                                      <h1  style="color: white; vertical-align: center; text-align: center; align-content: center;">Windows</h1>'+
'                                                  </a>'+
'                                                 </div>'+
'                                              </section>'+
'                                        </div>'+
'                                        <button class="md-close">Close</button>'+
'                                    </div>'+
'                                </div>'+
'                            </div>';
function showModalDialog(){
   var overlay = document.getElementById("md-overlayId");
   overlay.innerHTML(myvar);
   swal("Good job!", "You clicked the button!", "success");
}	

var a1 = document.getElementById("a1");
a1.onclick = function(){

}
