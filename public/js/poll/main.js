'use strict';

/* global Poll */

window.Poll = {};

(function () {
	window.Poll.alertError = function (message) {
		require(['alerts'], function (alerts) {
			alerts.error(message);
		});
	};

	// eslint-disable-next-line import/no-unresolved
	require('poll/serializer')(window.utils);

	$(window).on('action:topic.loading', function () {
		if (ajaxify.data.posts.length > 0 && ajaxify.data.posts[0].hasOwnProperty('pollId')) {
			getPoll(ajaxify.data.posts[0].pollId);
		}
	});

	$(window).on('action:posts.loaded', function (ev, data) {
		data.posts.forEach((post) => {
			if (post.hasOwnProperty('pollId')) {
				getPoll(post.pollId);
			}
		});
	});

	$(window).on('action:posts.edited', function (ev, data) {
		if (data.post.hasOwnProperty('pollId')) {
			getPoll(data.post.pollId);
		}
	});

	socket.on('event:poll.voteChange', function (data) {
		Poll.view.update(data);
	});

	function getPoll(pollId) {
		pollId = parseInt(pollId, 10);

		if (!isNaN(pollId)) {
			socket.emit('plugins.poll.get', { pollId }, function (err, pollData) {
				if (err) {
					return Poll.alertError(err.message);
				}
				Poll.view.load(pollData);
			});
		}
	}
}());
