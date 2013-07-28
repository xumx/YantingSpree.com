statusList = [
	'Prepayment', //0
	'Payment 1 Submitted', //1
	'Payment 1 Confirmed', //2
	'Order Placed', //3
	'Shipped from Merchant', //4
	'Shipment Arrived', //5
	'Payment 2 Submitted', //6
	'Payment 2 Confirmed', //7
	'Shipped to User', //8
	'Completed', //9
	'Archived'//10
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