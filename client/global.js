statusList = [
	'Archived', //0
	'Prepayment', //1
	'Payment 1 Submitted', //2
	'Payment 1 Confirmed', //3
	'Order Placed', //4
	'Shipped from Merchant', //5
	'Shipment Arrived', //6
	'Payment 2 Submitted', //7
	'Payment 2 Confirmed', //8
	'Shipped to User', //9
	'Completed' //10
];

Handlebars.registerHelper('dateFormat', function(context, block) {
  if (window.moment) {
    var f = block.hash.format || "Do MMMM, YYYY";
    console.log(context);
    return moment(context).format(f);
  }else{
    return context;   //  moment plugin not available. return data as is.
  };
});