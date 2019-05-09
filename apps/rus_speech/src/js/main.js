var $window = $(window);
var $document = $(document);


$window.on('load hashchange', function(e) {
	var context = {
		skip: 0,
		limit: 10,
		category: window.location.hash.replace('#', '')
	};

	var scrollLoader = function(e, fire) {
		if (fire || $window.scrollTop() + $window.height() + 240 >= $document.height()) {
			context.limit = 5;

			$window.off('scroll');

			$.ajax({url: '', method: 'POST', data: { context: context }, async: false }).done(function(data) {
				if (data !== 'end') {

					$('.posts_block').append(data);

					context.skip += 5;
					$window.on('scroll', scrollLoader);
				} else {
					$('.posts_more').addClass('hide');
				}
			});
		}
	};

	$('.posts_more').removeClass('hide');
	$(context.category != '' ? '.' + context.category : '').addClass('current');

	$.ajax({url: '', method: 'POST', data: { context: context }, async: false }).done(function(data) {
		if (data !== 'end') {
			var $data = $(data);

			$('.posts_block').empty().append($data);

			context.skip = $data.length;
			$window.off('scroll').scrollTop(0).on('scroll', scrollLoader);
		} else {
			$('.posts_block').empty();
		}
	});
});


$(function() {
	$('.posts_more').children('span').on('click', function(e) {
		$window.trigger('scroll', true);
	});

	$document
		.on('click', '.category_item', function(e) {
			e.preventDefault();

			$('.category_item').removeClass('current').filter(this).addClass('current');

			window.location.href = '#' + $(this).attr('class').split(' ')[1];
		})
		.on('click', '.category_item.current', function(e) {
			e.preventDefault();

			$(this).removeClass('current');

			window.location.href = '#';
		});

});