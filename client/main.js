// Proxino.key = "zLtTh21LnAkdc9JjxFX9DA";
// Proxino.track_errors();
Meteor.subscribe('all');

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Meteor.Router.add({
	'/': 'welcome',
	'/admin': 'admin',
	'/users/self': 'userProfile',
	'/users/cart': 'userCart',
	'/users/all': 'manageUsers',
	'/merchants/': 'merchantList',
	'/merchants/:_id': {
		to: 'merchantPage',
		and: function(id) {
			Session.set('currentMerchant', id);
			console.log(Session.get('currentMerchant'))
		}
	},
	'/*': {
		to: '404'
	}
});

Meteor.Router.filters({
	'checkLoggedIn': function(page) {
		if (Meteor.user()) {
			return page;
		} else {
			//Change URL TODO
			return 'welcome';
		}
	},
	'checkAdmin': function(page) {
		if (Roles.userIsInRole(Meteor.user(), ['admin'])) {
			return page;
		} else {
			//Change URL TODO
			return 'welcome'
		}
	}
});

Meteor.Router.filter('checkLoggedIn', {
	only: ['userProfile', 'userCart']
});

Meteor.Router.filter('checkAdmin', {
	only: ['admin', 'db_view', 'collection_view', 'document_view']
});

//Global Helpers
Template.sidebar.merchantsWithOpenSpree = function() {
	return Spree.find({
		'status': 'open'
	}, {
		transform: function(data) {
			return data.merchant;
		}
	});
};

Template.navbar.rendered = function() {
	$('#login-buttons').children().removeClass('nav-collapse collapse in');
};

Meteor.startup(function() {
	Hooks.init();

	Hooks.onLoggedIn = function() {
		var profile = Meteor.user().profile;
		if (!(profile && profile.email && profile.phone && profile.address)) {
			Meteor.Router.to('/users/self');
		}
	}

	Hooks.onLoggedOut = function() {
		Session.set('currentOrder', undefined);
		Meteor.Router.to('/');
	}

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
		var id = Order.findOne({
			spree: Session.get('currentSpree'),
			user: Meteor.userId(),
			status: 0
		}, {
			transform: function(data) {
				Session.set('currentOrder', data._id);
				console.log('set currentOrder: %s', data._id);
				return data;
			}
		});

		if (!id) {
			console.log('No currentOrder');
			Session.set('currentOrder', undefined);
		}
	});

});