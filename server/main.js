Meteor.startup(function() {
	Meteor.publish('all', function() {
		return [Exchange.find(), Spree.find(), Merchant.find(), Order.find({user:'122'})];
	});
	// createUserAdminRoles();
	// Roles.addUsersToRoles("BrxgJJ4kjJfCJTM2o", ["admin", "user-admin"]);
});


