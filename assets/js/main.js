/*
	Paradigm Shift by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Hack: Enable IE workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Mobile?
		if (browser.mobile)
			$body.addClass('is-mobile');

	// Scrolly.
		$('.scrolly')
			.scrolly({
				offset: 100
			});

	// Polyfill: Object fit.
		if (!browser.canUse('object-fit')) {

			$('.image[data-position]').each(function() {

				var $this = $(this),
					$img = $this.children('img');

				// Apply img as background.
					$this
						.css('background-image', 'url("' + $img.attr('src') + '")')
						.css('background-position', $this.data('position'))
						.css('background-size', 'cover')
						.css('background-repeat', 'no-repeat');

				// Hide img.
					$img
						.css('opacity', '0');

			});

			$('.gallery > a').each(function() {

				var $this = $(this),
					$img = $this.children('img');

				// Apply img as background.
					$this
						.css('background-image', 'url("' + $img.attr('src') + '")')
						.css('background-position', 'center')
						.css('background-size', 'cover')
						.css('background-repeat', 'no-repeat');

				// Hide img.
					$img
						.css('opacity', '0');

			});

		}

	// Gallery.
		$('.gallery')
			.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div><div class="modal-nav"><a href="#" class="modal-prev" aria-label="Previous image">&#10094;</a><a href="#" class="modal-next" aria-label="Next image">&#10095;</a></div></div>')
			.each(function() {

				var el = this,
					$gallery = $(this),
					$links = $gallery.children('a'),
					hrefs = [];

				// Build list of image hrefs.
					$links.each(function() {
						var href = $(this).attr('href');
						if (href && href.match(/\.(jpg|gif|png|mp4)$/))
							hrefs.push(href);
					});

				el._hrefs = hrefs;
				el._currentIndex = 0;

			})
			.on('click', 'a', function(event) {

				var $a = $(this),
					$gallery = $a.parents('.gallery'),
					galleryEl = $gallery[0],
					$modal = $gallery.children('.modal'),
					$modalImg = $modal.find('.inner img'),
					href = $a.attr('href');

				// Not an image? Bail.
					if (!href.match(/\.(jpg|gif|png|mp4)$/))
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Locked? Bail.
					if ($modal[0]._locked)
						return;

				// Lock.
					$modal[0]._locked = true;

				// Track current index.
					var index = galleryEl._hrefs.indexOf(href);
					if (index !== -1) galleryEl._currentIndex = index;

				// Update nav visibility.
					var $nav = $modal.find('.modal-nav');
					if (galleryEl._hrefs.length > 1) $nav.show();
					else $nav.hide();

				// Set src.
					$modalImg.attr('src', href);

				// Set visible.
					$modal.addClass('visible');

				// Focus.
					$modal.focus();

				// Delay.
					setTimeout(function() {

						// Unlock.
							$modal[0]._locked = false;

					}, 600);

			})
			.on('click', '.modal-nav', function(event) {

				// Stop click from closing modal.
					event.stopPropagation();

			})
			.on('click', '.modal-prev, .modal-next', function(event) {

				event.preventDefault();
				event.stopPropagation();

				var $btn = $(this),
					$modal = $btn.closest('.modal'),
					$gallery = $modal.parent('.gallery'),
					galleryEl = $gallery[0],
					$modalImg = $modal.find('.inner img'),
					dir = $btn.hasClass('modal-prev') ? -1 : 1,
					hrefs = galleryEl._hrefs,
					newIndex = (galleryEl._currentIndex + dir + hrefs.length) % hrefs.length;

				if ($modal[0]._locked) return;

				galleryEl._currentIndex = newIndex;
				$modal.removeClass('loaded');
				$modalImg.attr('src', hrefs[newIndex]);

			})
			.on('click', '.modal', function(event) {

				var $modal = $(this),
					$modalImg = $modal.find('.inner img');

				// Locked? Bail.
					if ($modal[0]._locked)
						return;

				// Already hidden? Bail.
					if (!$modal.hasClass('visible'))
						return;

				// Stop propagation.
					event.stopPropagation();

				// Lock.
					$modal[0]._locked = true;

				// Clear visible, loaded.
					$modal
						.removeClass('loaded')

				// Delay.
					setTimeout(function() {

						$modal
							.removeClass('visible')

						setTimeout(function() {

							// Clear src.
								$modalImg.attr('src', '');

							// Unlock.
								$modal[0]._locked = false;

							// Focus.
								$body.focus();

						}, 475);

					}, 125);

			})
			.on('keydown', '.modal', function(event) {

				var $modal = $(this),
					$gallery = $modal.parent('.gallery'),
					galleryEl = $gallery[0];

				// Escape? Hide modal.
					if (event.keyCode == 27)
						$modal.trigger('click');

				// Left arrow? Previous image.
					if (event.keyCode == 37 && galleryEl._hrefs.length > 1)
						$modal.find('.modal-prev').trigger('click');

				// Right arrow? Next image.
					if (event.keyCode == 39 && galleryEl._hrefs.length > 1)
						$modal.find('.modal-next').trigger('click');

			})
			.on('mouseup mousedown mousemove', '.modal', function(event) {

				// Stop propagation.
					event.stopPropagation();

			})
				.find('.inner img')
					.on('load', function(event) {

						var $modalImg = $(this),
							$modal = $modalImg.parents('.modal');

						setTimeout(function() {

							// No longer visible? Bail.
								if (!$modal.hasClass('visible'))
									return;

							// Set loaded.
								$modal.addClass('loaded');

						}, 275);

					});

})(jQuery);