statusList = [
	'Deleted', //0
	'Prepayment', //1
	'Payment 1 submitted', //2
	'Payment 1 Confirmed', //3
	'Order Placed', //4
	'Shipped from Merchant', //5
	'Shippment Arrived', //6
	'Payment 2 Submitted', //7
	'Payment 2 Confirmed', //8
	'Shipped to User', //9
	'Completed' //10
];

Handlebars.registerHelper('dateFormat', function(context, block) {
  if (window.moment) {
    var f = block.hash.format || "Do MMMM, YYYY";
    return moment(Date(context)).format(f);
  }else{
    return context;   //  moment plugin not available. return data as is.
  };
});