Proxino.key = "zLtTh21LnAkdc9JjxFX9DA";
Proxino.track_errors();

Meteor.subscribe('all');

Session.set('isAdmin', true);

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
		}
	},
	'/*': {
		to: '404'
	}
});

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

Meteor.startup(function() {
	Deps.autorun(function() {
		//Set Current Spree
		Spree.findOne({
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
			user: '122'
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