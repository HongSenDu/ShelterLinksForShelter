var currentSheltercoins;
var couponRedirect;
var correctId;
var email;
var db = firebase.firestore();
(function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      name=auth.currentUser.displayName;
      var img2 = document.getElementById('myimg2');
      email=auth.currentUser.email;
      db.collection("Users").where("email", "==", email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc1) {
          correctId=doc1.data().individualCoupon;
          db.collection("Coupons").doc(correctId)
          .get()
          .then(function(doc) {
            var ourData=doc.data();
            var company=ourData.business;
            $("#couponInfo").append("<img class=\"couponImage\" src=\""+ourData.image+"\"><h1 class=\"couponName\">"+ourData.business+"</h1><h2 class=\"couponDescription\">"+ourData.description+
            "<br><a id=\"couponRedirect\" class=\"btn btn-primary redeem\" href=\"#\" role=\"button\">Open QR Scanner</a>"+
            "<a id=\"maps\" class=\"btn btn-primary map\" href=\"https://www.google.com/maps/search/?api=1&query="+company+"\" role=\"button\">Open in Maps</a>"+
            "<h5 id=\"redeemHead\">REDEEMING YOUR COUPON WITH SHELTERCOINS IS SIMPLE:</h5>"+
            "<ol id=\"directions\">"+
            "<li>After choosing the coupon that you want to redeem, go to the business associated with the coupon.</li>"+
            "<li>Open the QR Code Scanner above directly in the app.</li>"+
            "<li>Go to the register and scan the QR code with the ShelterLinks Logo</li>"+
            "<li>After scanning, the required number of points will be deducted.</li>"+
            "<li>Present the coupon verification page to the cashier.</li>"+
            "<li>Enjoy your food!</li>"+
            "</ol>"+
            "<div class=\"panel-group\" id=\"faqAccordion\"><div class=\"panel panel-default \"><div class=\"panel-heading accordion-toggle question-toggle collapsed\" data-toggle=\"collapse\" data-parent=\"#faqAccordion\" data-target=\"#question0\">"+
            "<h4 class=\"panel-title\"><a href=\"#\" id=\"boied\" class=\"ing\">Click for Terms and Services</a></h4></div>"+
            "<div id=\"question0\" class=\"panel-collapse collapse\" style=\"height: 0px;\"><div class=\"panel-body\"><p id=\"termsServed\">"+ourData.termsAndServices+"</p></div></div></div></div>");
            couponRedirect=document.getElementById("couponRedirect");
            couponRedirect.addEventListener('click',e => {
              currentSheltercoins=doc1.data().points;
              if(currentSheltercoins<300){
                alert("Sorry, you do not have enough points to redeem this coupon.");
              }else{
                cordova.plugins.barcodeScanner.scan(
                  function (result) {
                    var correctCode="ShelterLinks Redemption: "+company;
                    if (result.text==correctCode){
                      currentSheltercoins-=300;
                      return db.collection("Users").doc(doc1.id).update({
                        points:currentSheltercoins,
                        couponRedeemed:doc.id
                      })
                      .then(function() {
                        window.location.replace("couponRedeemed.html");
                      })
                    }else{
                      alert("This is not the correct QR code, or you are using the incorrect QR scanner")
                    }
                  },
                  function (error) {
                    alert("Scanning failed: " + error);
                  },
                  {
                    preferFrontCamera : false, // iOS and Android
                    showFlipCameraButton : true, // iOS and Android
                    showTorchButton : true, // iOS and Android
                    torchOn: true, // Android, launch with the torch switched on (if available)
                    saveHistory: true, // Android, save scan history (default false)
                    prompt : "Place a barcode inside the scan area", // Android
                    resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                    formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                    orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                    disableAnimations : true, // iOS
                    disableSuccessBeep: false // iOS and Android
                  }
                );
              }
            });
          });
        })
      });
      if(user.photoURL==null){
        img2.src="../images/white.png";
      }else{
        img2.src = user.photoURL;
      }
    }else {
      console.log("boi");
    }
  });
}());
