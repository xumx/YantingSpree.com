Proxino.key = "zLtTh21LnAkdc9JjxFX9DA";
Proxino.track_errors();

Meteor.subscribe('all');

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Meteor.Router.add({
	'/': 'welcome',
	'/admin': 'admin',
	'/merchants/:_id': {
		to: 'merchantPage',
		and: function(id) {
			Session.set('currentMerchant', id);
			console.log(Session.get('currentMerchant'))
		}
	},
	'/merchants/': 'merchantList',
	'/*': {
		to: '404'
	}
});

var status = [
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

//Global Helpers
// Handlebars.registerHelper('merchants', function() {
// 	return Merchant.find();
// });
Template.navbar.helpers({
	loggedIn: function() {
		return Meteor.user();
	},
	isAdmin: function() {
		return Session.get('isAdmin');
	}
});


Template.sidebar.helpers({
	merchantsWithOpenSpree: function() {
		return Spree.find({
			'status': 'open'
		}, {
			transform: function(data) {
				return data.merchant;
			}
		});
	}
})

Template.sidebar.events({
	'submit #contact-form': function(e) {
		e.preventDefault();

		var form = $(event.target).closest('form');

		var name = form.find('[name=name]').val();
		var email = form.find('[name=email]').val();
		var body = form.find('[name=body]').val();

		console.log('Sending Email..');

		var r = Meteor.call('sendMail', email, 'Dummy Subject', body);

		$('#contact').modal('hide');
		form[0].reset();

		Meteor.Messages.sendSuccess('Thank you for contacting us! We will respond shortly');

		setTimeout(function() {
			Meteor.Messages.clear();
		}, 5000);
	}
})

Meteor.startup(function() {
	Deps.autorun(function() {
		//Set Current Spree
		var spree = Spree.findOne({
			'merchant': Session.get('currentMerchant'),
			'status': 'open'
		}, {
			transform: function(data) {
				Session.set('currentSpree', data._id);
				console.log('set currentSpree: %s', data._id);
			}
		});
	});

	Deps.autorun(function() {
		//Set Current Order
		Order.findOne({
			spree: Session.get('currentSpree'),
			user: '122', //TODO
			status: 1 //TODO
		}, {
			transform: function(data) {
				Session.set('currentOrder', data._id);
				console.log('set currentOrder: %s', data._id);
			}
		})
	});


	// Deps.autorun(function() {
	// 	if (Meteor.userId() == "admin") {

	// 	} else {
	// 		Session.set('isAdmin', false);
	// 	}
	// });
});