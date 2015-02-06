$(function(){
  
  var meds = ["pherdipin","dobutamin","dopamin"];
  var jlh_dosis = 20;
  
  setting_init();
  
  $("#patient_name").val(localStorage.getItem("patient_name"));
  $("#patient_weight").val(localStorage.getItem("patient_weight"));
  
  $("#btn_patient_print").click(function(){
    var patient_name = $("#patient_name").val();
    var patient_weight = $("#patient_weight").val();
    
    localStorage.setItem("patient_name",patient_name);
    localStorage.setItem("patient_weight",patient_weight);
  });
  
  
  /***** print page opened ******/
  $.each(meds, function(index,value){
    if ( $("#table_print_"+value).length ) {

      $("#patient_name").text(localStorage.getItem("patient_name"));
      $("#patient_weight").text(localStorage.getItem("patient_weight"));
      
      arr_join = calculate_formula(value);
      $("#table_print_"+value+" tbody").html(arr_join);
    }
  });
  
  /***** modal takaran *****/
  $("#modal-takaran").on("show.bs.modal", function (event) {
    var btn = $(event.relatedTarget);
    var medname = btn.data("medname");
    var data = localStorage.getItem(medname);
    var med_json = JSON.parse(data);
    
    $("#modal-takaranLabel").text(medname);
    $('#sediaan').val(med_json.sediaan);
    $('#pelarut').val(med_json.pelarut);
  });
  
  $("#btn-update-takaran").click(function(){
    $("#sediaan,#pelarut").parent().removeClass("has-error");$("#err-msg").addClass("hide");
    var medname = $("#modal-takaranLabel").text();
    var sediaan = $("#sediaan").val();
    var pelarut = $("#pelarut").val();
    
    if ( (sediaan < 1 || sediaan == "") && (pelarut < 1 || pelarut == "") ) {
      $("#sediaan,#pelarut").parent().addClass("has-error");
      $("#err-med").text("Sediaan dan Pelarut");
      $("#err-msg").removeClass("hide");
      return false;
    }
    
    if (sediaan < 1 || sediaan == "") {
      $("#sediaan").parent().addClass("has-error");
      $("#err-med").text("Sediaan");
      $("#err-msg").removeClass("hide");
      return false;
    }
    
    if (pelarut < 1 || pelarut == "") {
      $("#pelarut").parent().addClass("has-error");
      $("#err-med").text("Pelarut");
      $("#err-msg").removeClass("hide");
      return false;
    }
    
    var obj = '{"dosis":"1","sediaan":'+sediaan+',"pelarut":'+pelarut+',"permikro":"1000"}';
    localStorage.setItem(medname,obj);
    var innerHtml = calculate_formula(medname);
    $("#table_print_"+medname+" tbody").html(innerHtml);
    $("#modal-takaran").modal("hide");
  });
  
  /***** calculation formula ******/
  function calculate_formula(medicine_name) {
    var arr = [];var pelarut = 1;
    var med_json = localStorage.getItem(medicine_name);
    var patient_weight = localStorage.getItem("patient_weight");
    med_json = JSON.parse(med_json);
    if (med_json.pelarut > 1) {
      pelarut = med_json.pelarut;
    }
    var jadi_mikro = (med_json.sediaan * med_json.permikro) / pelarut;
    var result = (med_json.dosis * patient_weight * 60) / jadi_mikro;
    var amp1 = result;
    var amp2 = result/2;

    for(i = 1; i<=jlh_dosis;i++) {
      amp1_print = amp1 * i;
      amp2_print = amp2 * i;
      arr.push("<tr><td>"+i+"</td><td>"+amp1_print.toFixed(2)+"</td><td>"+amp2_print.toFixed(2)+"</td></tr>");
    }

    var arr_join = arr.join('');
    return arr_join;
}
  
  
  /***** basic settings ******/
  function setting_init() {
    
    if ( !localStorage.jlh_dosis ) {
      localStorage.jlh_dosis = 20;
    }
    
    $.each(meds, function(index,value){
      if ( !localStorage.value ) {
        var med_json = '{"dosis":"1","sediaan":"200","pelarut":"50","permikro":"1000"}';
        localStorage.setItem(value,med_json);
      }      
    });
  
  }
  
});