/*
 The MIT License (MIT)

 Copyright (c) 2013-2016 Mariano Cuatrin
 Copyright (c) 2016      Rhody Lugo

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function Packer(params) {
	this.params = {
		mode: "auto",   // Specifies the packing heuristic. Allowed values are eiher its index or string value:
		                //  0 'auto' (default; tries all modes and selects the one)
		                //  1 'bottom-left'
		                //  2 'short-side'
		                //  3 'long-side'
		                //  4 'best-area'
		                //  5 'contact-point'
		pot: false,     // Keep atlas size a power of two (ignored if size is used).
		rotate: false,  // Allows sprites to be rotated for better packing.
		padding: 0,     // Padding between sprites.
		width: 0,       // Fixed width for the atlas image.
		height: 0,      // Fixed height for the atlas image.
		max_size: false // Treat size parameter as maximum size.
	};
	this.input_sprites = [];
	this.input_rects = [];

	this.init(params);
}
Packer.prototype = {
	constructor: Packer,
	init: function(params) {
		for (var p in params) {
			this.params[p] = params[p];
		}
		this.input_sprites.length = 0;
		this.input_rects.length = 0;
	},
	pack_mode: function(mode) {
		if (typeof mode === "string") {
			for (var i = 0; i < MaxRects.Modes.length; i++)
			{
				if (mode === MaxRects.Modes[i])
					return i;
			}
		}
		var i = parseInt(mode);
		if (i >= 0 && i < MaxRects.Modes.length) {
			return i;
		}
		return -1;
	},
	validate_params: function() {
		if (this.params.padding < 0)
		{
			throw "Invalid padding";
		}

		if ((this.params.width > 0 || this.params.height > 0 || this.params.max_size) &&
			(this.params.width <= 0 || this.params.height <= 0))
		{
			throw "Invalid size";
		}

		if (this.pack_mode(this.params.mode) == -1)
		{
			throw "Invalid packing mode";
		}

		if (this.params.max_size && this.params.pot)
		{
			var w = 1;
			while (w <= this.params.width) w <<= 1;

			var h = 1;
			while (h <= this.params.height) h <<= 1;

			this.params.width = w >> 1;
			this.params.height = h >> 1;
		}

		return true;
	},
	load_sprites_info: function(data) {
		for (var i = 0; i < data.length; i++) {
			var entry = data[i];
			this.input_sprites.push(new Sprite(entry.name, entry.width, entry.height));
		}

		this.input_rects.length = 0;

		for (var i = 0; i < this.input_sprites.length; i++)
		{
			var sprite = this.input_sprites[i];
			var rect = new RectSize();
			rect.width = sprite.width + this.params.padding;
			rect.height = sprite.height + this.params.padding;
			this.input_rects.push(rect);
		}

		if (this.params.width > 0 && this.params.height > 0)
		{
			for (var i = 0; i < this.input_sprites.length; i++)
			{
				var w = 2 * this.params.padding + this.input_sprites[i].width;
				var h = 2 * this.params.padding + this.input_sprites[i].height;

				if (w > this.params.width || h > this.params.height)
				{
					throw "Some of the sprites are larger than the allowed size";
				}
			}
		}

		return true;
	},
	has_fixed_size: function() {
		return this.params.width > 0 && this.params.height > 0 && !this.params.max_size;
	},
	can_enlarge: function(width, height) {
		return !this.has_fixed_size() && (!this.params.max_size ||
			width < this.params.width || height < this.params.height);
	},
	calculate_initial_size: function(rect_indices) {
		var rect =  new RectSize();

		if (this.has_fixed_size())
		{
			rect.width = this.params.width;
			rect.height = this.params.height;
			return rect;
		}

		var area = 0;

		for (var i = 0; i < rect_indices.length; i++)
		{
			var rc = this.input_rects[rect_indices[i]];
			area += rc.width * rc.height;
		}

		var n = 1;
		var size = Math.ceil(Math.sqrt(area));

		while (n < size)
			n <<= 1;

		rect.width = rect.height = n;

		if (this.params.max_size)
		{
			rect.width = Math.min(n, this.params.width);
			rect.height = Math.min(n, this.params.height);
		}

		return rect;
	},
	compute_results: function() {
		var result = [];

		var mode = this.pack_mode(this.params.mode);

		if (mode == 0)
		{
			var modes = [
				MaxRects.BottomLeft,
				MaxRects.ShortSide,
				MaxRects.LongSide,
				MaxRects.BestArea,
				MaxRects.ContactPoint
			];

			var best = [];
			var best_area = 0;

			for (var i = 0; i < modes.length; i++)
			{
				var res = this.compute_result(modes[i]);

				var area = 0;

				for (var j = 0; j < res.length; j++)
					area += res[j].width * res[j].height;

				if (best.length == 0 || res.length < best.length ||
					(res.length == best.length && area < best_area))
				{
					for (var j = 0; j < best.length; j++)
						delete best[j];

					var tmp = [];
					for (var j = 0; j < best.length; j++)
						tmp[j] = best[j];
					for (var j = 0; j < res.length; j++)
						best[j] = res[j];
					best.length = res.length;
					for (var j = 0; j < tmp.length; j++)
						res[j] = tmp[j];
					res.length = tmp.length;

					best_area = area;
				}
				else
				{
					for (var j = 0; j < res.length; j++)
						delete res[j];
				}
			}

			var tmp = [];
			for (var j = 0; j < best.length; j++)
				tmp[j] = best[j];
			for (var j = 0; j < result.length; j++)
				best[j] = result[j];
			best.length = result.length;
			for (var j = 0; j < tmp.length; j++)
				result[j] = tmp[j];
			result.length = tmp.length;
		}
		else
		{
			result = this.compute_result(mode);
		}

		return result;
	},
	compute_result: function(mode) {
		var results = [];

		var result_rects = [];
		var result_indices = [];
		var input_indices = [];
		var rects_indices = [];

		for (var i = 0; i < this.input_rects.length; i++)
			input_indices.push(i);

		var size = this.calculate_initial_size(input_indices);

		var w = size.width;
		var h = size.height;

		while (input_indices.length > 0)
		{
			rects_indices = input_indices.slice(0);

			var packer = new MaxRects(w - this.params.padding, h - this.params.padding, this.params.rotate);

			packer.insert(mode, this.input_rects, rects_indices, result_rects, result_indices);

			var add_result = false;

			if (rects_indices.length > 0)
			{
				if (this.can_enlarge(w, h))
				{
					if (this.params.max_size)
					{
						var x = 0;

						if (w > h)
							x = h < this.params.height ? h : w;
						else
							x = w < this.params.width ? w : h;

						var max = x == w ? this.params.width : this.params.height;

						x = Math.min(x * 2, max);
					}
					else
					{
						if (w > h)
							h *= 2;
						else
							w *= 2;
					}
				}
				else
				{
					add_result = true;

					var tmp = [];
					for (var j = 0; j < input_indices.length; j++)
						tmp[j] = input_indices[j];
					for (var j = 0; j < rects_indices.length; j++)
						input_indices[j] = rects_indices[j];
					input_indices.length = rects_indices.length;
					for (var j = 0; j < tmp.length; j++)
						rects_indices[j] = tmp[j];
					rects_indices.length = tmp.length;
				}
			}
			else
			{
				add_result = true;
				input_indices.length = 0;
			}

			if (add_result)
			{
				var result = new Result();

				result.width = w;
				result.height = h;

				var xmin = w;
				var xmax = 0;
				var ymin = h;
				var ymax = 0;

				for (var i = 0; i < result_rects.length; i++)
				{
					var index = result_indices[i];

					var base_rect = this.input_rects[index];
					var base_sprite = this.input_sprites[index];

					var sprite = base_sprite.clone();
					sprite.x = result_rects[i].x + this.params.padding;
					sprite.y = result_rects[i].y + this.params.padding;
					sprite.rotated = (result_rects[i].width != base_rect.width);

					result.sprites.push(sprite);

					xmin = Math.min(xmin, result_rects[i].x);
					xmax = Math.max(xmax, result_rects[i].x + result_rects[i].width);
					ymin = Math.min(ymin, result_rects[i].y);
					ymax = Math.max(ymax, result_rects[i].y + result_rects[i].height);
				}

				if (!this.has_fixed_size() && !this.params.pot)
				{
					result.width = (xmax - xmin) + this.params.padding;
					result.height = (ymax - ymin) + this.params.padding;

					if (xmin > 0 || ymin > 0)
					{
						for (var i = 0; i < result.sprites.length; i++)
						{
							result.sprites[i].x -= xmin;
							result.sprites[i].y -= ymin;
						}
					}
				}

				results.push(result);

				if (input_indices.length > 0) {
					var rect = this.calculate_initial_size(input_indices);
					w = rect.width;
					h = rect.height;
				}
			}
		}

		return results;
	}
};

function RectSize(width, height) {
	this.width = width||0;
	this.height = height||0;
}
RectSize.prototype.constructor = RectSize;

function Rect(x, y, width, height) {
	this.x = x||0;
	this.y = y||0;
	this.width = width||0;
	this.height = height||0;
}
Rect.prototype.constructor = Rect;
Rect.prototype.clone = function() {
	return new Rect(this.x, this.y, this.width, this.height);
}
Rect.is_contained_in = function(a, b) {
	return a.x >= b.x && a.y >= b.y
		&& a.x + a.width <= b.x + b.width
		&& a.y + a.height <= b.y + b.height;
}
Rect.common_interval_length = function(i1start, i1end, i2start, i2end) {
	if (i1end < i2start || i2end < i1start)
		return 0;

	return Math.min(i1end, i2end) - Math.max(i1start, i2start);
}

function Score(value) {
	this.value = value||0;
}
Score.prototype.constructor = Score;

function MaxRects(width, height, rotate) {
	this.width_ = 0;
	this.height_ = 0;
	this.rotate_ = false;

	this.used_ = [];
	this.free_ = [];

	this.init(width, height, rotate);
}

MaxRects.prototype = {
	constructor: MaxRects,
	init: function(width, height, rotate) {
		width = width||0;
		height = height||0;
		rotate = rotate||false;

		this.width_ = width;
		this.height_ = height;
		this.rotate_ = rotate;

		var rect = new Rect();

		rect.x = 0;
		rect.y = 0;
		rect.width = width;
		rect.height = height;

		this.used_.length = 0;
		this.free_.length = 0;

		this.free_.push(rect);
	},
	insert: function(mode, rects, rects_indices, result, result_indices) {
		result.length = 0;
		result_indices.length = 0;

		while (rects_indices.length > 0)
		{
			var bestNode = new Rect();

			var bestScore1 = Infinity;
			var bestScore2 = Infinity;
			var bestRectIndex = -1;

			for (var i = 0; i < rects_indices.length; ++i)
			{
				var score1 = new Score();
				var score2 = new Score();

				var rect = rects[rects_indices[i]];

				var newNode = this.score_rect(rect.width, rect.height, mode, score1, score2);

				if (score1.value < bestScore1 || (score1.value == bestScore1 && score2.value < bestScore2))
				{
					bestScore1 = score1.value;
					bestScore2 = score2.value;
					bestNode = newNode;
					bestRectIndex = i;
				}
			}

			if (bestNode.height == 0 || bestRectIndex == -1)
				break;

			this.place_rect(bestNode);

			result.push(bestNode);
			result_indices.push(rects_indices[bestRectIndex]);
			rects_indices.splice(bestRectIndex, 1);
		}

		return result.length;
	},
	score_rect: function(width, height, mode, score1, score2) {
		var newNode = new Rect();

		score1.value = Infinity;
		score2.value = Infinity;

		switch (mode)
		{
			case MaxRects.ShortSide:
				newNode = this.find_ss(width, height, score1, score2);
				break;

			case MaxRects.BottomLeft:
				newNode = this.find_bl(width, height, score1, score2);
				break;

			case MaxRects.ContactPoint:
				newNode = this.find_cp(width, height, score1);
				score1.value = -score1.value;
				break;

			case MaxRects.LongSide:
				newNode = this.find_ls(width, height, score2, score1);
				break;

			case MaxRects.BestArea:
				newNode = this.find_ba(width, height, score1, score2);
				break;
		}

		if (newNode.height == 0)
		{
			score1.value = Infinity;
			score2.value = Infinity;
		}

		return newNode;
	},
	place_rect: function(node) {
		var numRectanglesToProcess = this.free_.length;

		for (var i = 0; i < numRectanglesToProcess; ++i)
		{
			if (this.split_free_node(this.free_[i], node))
			{
				this.free_.splice(i, 1);
				--i;
				--numRectanglesToProcess;
			}
		}

		this.prune_free_list();
		this.used_.push(node);
	},
	score_node_cp: function(x, y, width, height) {
		var score = 0;

		if (x == 0 || x + width == this.width_)
			score += height;

		if (y == 0 || y + height == this.height_)
			score += width;

		for (var i = 0; i < this.used_.length; ++i)
		{
			if (this.used_[i].x == x + width || this.used_[i].x + this.used_[i].width == x)
				score += Rect.common_interval_length(this.used_[i].y, this.used_[i].y + this.used_[i].height, y, y + height);

			if (this.used_[i].y == y + height || this.used_[i].y + this.used_[i].height == y)
				score += Rect.common_interval_length(this.used_[i].x, this.used_[i].x + this.used_[i].width, x, x + width);
		}

		return score;
	},
	find_bl: function(width, height, bestY, bestX) {
		bestNode = new Rect();

		bestY.value = Infinity;

		for (var i = 0; i < this.free_.length; ++i)
		{
			if (this.free_[i].width >= width && this.free_[i].height >= height)
			{
				var topSideY = this.free_[i].y + height;

				if (topSideY < bestY.value || (topSideY == bestY.value && this.free_[i].x < bestX.value))
				{
					bestNode.x = this.free_[i].x;
					bestNode.y = this.free_[i].y;
					bestNode.width = width;
					bestNode.height = height;
					bestY.value = topSideY;
					bestX.value = this.free_[i].x;
				}
			}

			if (this.rotate_ && this.free_[i].width >= height && this.free_[i].height >= width)
			{
				var topSideY = this.free_[i].y + width;

				if (topSideY < bestY.value || (topSideY == bestY.value && this.free_[i].x < bestX.value))
				{
					bestNode.x = this.free_[i].x;
					bestNode.y = this.free_[i].y;
					bestNode.width = height;
					bestNode.height = width;
					bestY.value = topSideY;
					bestX.value = this.free_[i].x;
				}
			}
		}

		return bestNode;
	},
	find_ss: function(width, height, bestShortSideFit, bestLongSideFit) {
		var bestNode = new Rect();

		bestShortSideFit.value = Infinity;

		for (var i = 0; i < this.free_.length; ++i)
		{
			if (this.free_[i].width >= width && this.free_[i].height >= height)
			{
				var leftoverHoriz = Math.abs(this.free_[i].width - width);
				var leftoverVert = Math.abs(this.free_[i].height - height);
				var shortSideFit = Math.min(leftoverHoriz, leftoverVert);
				var longSideFit = Math.max(leftoverHoriz, leftoverVert);

				if (shortSideFit < bestShortSideFit.value ||
					(shortSideFit == bestShortSideFit.value && longSideFit < bestLongSideFit.value))
				{
					bestNode.x = this.free_[i].x;
					bestNode.y = this.free_[i].y;
					bestNode.width = width;
					bestNode.height = height;
					bestShortSideFit.value = shortSideFit;
					bestLongSideFit.value = longSideFit;
				}
			}

			if (this.rotate_ && this.free_[i].width >= height && this.free_[i].height >= width)
			{
				var flippedLeftoverHoriz = Math.abs(this.free_[i].width - height);
				var flippedLeftoverVert = Math.abs(this.free_[i].height - width);
				var flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
				var flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);

				if (flippedShortSideFit < bestShortSideFit.value ||
					(flippedShortSideFit == bestShortSideFit.value && flippedLongSideFit < bestLongSideFit.value))
				{
					bestNode.x = this.free_[i].x;
					bestNode.y = this.free_[i].y;
					bestNode.width = height;
					bestNode.height = width;
					bestShortSideFit.value = flippedShortSideFit;
					bestLongSideFit.value = flippedLongSideFit;
				}
			}
		}

		return bestNode;
	},
	find_ls: function(width, height, bestShortSideFit, bestLongSideFit) {
		var bestNode = new Rect();

		bestLongSideFit.value = Infinity;

		for (var i = 0; i < this.free_.length; ++i)
		{
			if (this.free_[i].width >= width && this.free_[i].height >= height)
			{
				var leftoverHoriz = Math.abs(this.free_[i].width - width);
				var leftoverVert = Math.abs(this.free_[i].height - height);
				var shortSideFit = Math.min(leftoverHoriz, leftoverVert);
				var longSideFit = Math.max(leftoverHoriz, leftoverVert);

				if (longSideFit < bestLongSideFit.value ||
					(longSideFit == bestLongSideFit.value && shortSideFit < bestShortSideFit.value))
				{
					bestNode.x = this.free_[i].x;
					bestNode.y = this.free_[i].y;
					bestNode.width = width;
					bestNode.height = height;
					bestShortSideFit.value = shortSideFit;
					bestLongSideFit.value = longSideFit;
				}
			}

			if (this.rotate_ && this.free_[i].width >= height && this.free_[i].height >= width)
			{
				var leftoverHoriz = Math.abs(this.free_[i].width - height);
				var leftoverVert = Math.abs(this.free_[i].height - width);
				var shortSideFit = Math.min(leftoverHoriz, leftoverVert);
				var longSideFit = Math.max(leftoverHoriz, leftoverVert);

				if (longSideFit < bestLongSideFit.value ||
					(longSideFit == bestLongSideFit.value && shortSideFit < bestShortSideFit.value))
				{
					bestNode.x = this.free_[i].x;
					bestNode.y = this.free_[i].y;
					bestNode.width = height;
					bestNode.height = width;
					bestShortSideFit.value = shortSideFit;
					bestLongSideFit.value = longSideFit;
				}
			}
		}

		return bestNode;
	},
	find_ba: function(width, height, bestAreaFit, bestShortSideFit) {
		var bestNode = new Rect();

		bestAreaFit.value = Infinity;

		for (var i = 0; i < this.free_.length; ++i)
		{
			var areaFit = this.free_[i].width * this.free_[i].height - width * height;

			if (this.free_[i].width >= width && this.free_[i].height >= height)
			{
				var leftoverHoriz = Math.abs(this.free_[i].width - width);
				var leftoverVert = Math.abs(this.free_[i].height - height);
				var shortSideFit = Math.min(leftoverHoriz, leftoverVert);

				if (areaFit < bestAreaFit.value || (areaFit == bestAreaFit.value && shortSideFit < bestShortSideFit.value))
				{
					bestNode.x = this.free_[i].x;
					bestNode.y = this.free_[i].y;
					bestNode.width = width;
					bestNode.height = height;
					bestShortSideFit.value = shortSideFit;
					bestAreaFit.value = areaFit;
				}
			}

			if (this.rotate_ && this.free_[i].width >= height && this.free_[i].height >= width)
			{
				var leftoverHoriz = Math.abs(this.free_[i].width - height);
				var leftoverVert = Math.abs(this.free_[i].height - width);
				var shortSideFit = Math.min(leftoverHoriz, leftoverVert);

				if (areaFit < bestAreaFit.value || (areaFit == bestAreaFit.value && shortSideFit < bestShortSideFit.value))
				{
					bestNode.x = this.free_[i].x;
					bestNode.y = this.free_[i].y;
					bestNode.width = height;
					bestNode.height = width;
					bestShortSideFit.value = shortSideFit;
					bestAreaFit.value = areaFit;
				}
			}
		}

		return bestNode;
	},
	find_cp: function(width, height, bestContactScore) {
		var bestNode = new Rect();

		bestContactScore.value = -1;

		for (var i = 0; i < this.free_.length; ++i)
		{
			if (this.free_[i].width >= width && this.free_[i].height >= height)
			{
				var score = this.score_node_cp(this.free_[i].x, this.free_[i].y, width, height);

				if (score > bestContactScore.value)
				{
					bestNode.x = this.free_[i].x;
					bestNode.y = this.free_[i].y;
					bestNode.width = width;
					bestNode.height = height;
					bestContactScore.value = score;
				}
			}

			if (this.rotate_ && this.free_[i].width >= height && this.free_[i].height >= width)
			{
				var score = this.score_node_cp(this.free_[i].x, this.free_[i].y, height, width);

				if (score > bestContactScore.value)
				{
					bestNode.x = this.free_[i].x;
					bestNode.y = this.free_[i].y;
					bestNode.width = height;
					bestNode.height = width;
					bestContactScore.value = score;
				}
			}
		}

		return bestNode;
	},
	split_free_node: function(freeNode, usedNode) {
		if (usedNode.x >= freeNode.x + freeNode.width || usedNode.x + usedNode.width <= freeNode.x ||
			usedNode.y >= freeNode.y + freeNode.height || usedNode.y + usedNode.height <= freeNode.y)
			return false;

		if (usedNode.x < freeNode.x + freeNode.width && usedNode.x + usedNode.width > freeNode.x)
		{
			if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.height)
			{
				var newNode = freeNode.clone();
				newNode.height = usedNode.y - newNode.y;
				this.free_.push(newNode);
			}

			if (usedNode.y + usedNode.height < freeNode.y + freeNode.height)
			{
				var newNode = freeNode.clone();
				newNode.y = usedNode.y + usedNode.height;
				newNode.height = freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
				this.free_.push(newNode);
			}
		}

		if (usedNode.y < freeNode.y + freeNode.height && usedNode.y + usedNode.height > freeNode.y)
		{
			if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width)
			{
				var newNode = freeNode.clone();
				newNode.width = usedNode.x - newNode.x;
				this.free_.push(newNode);
			}

			if (usedNode.x + usedNode.width < freeNode.x + freeNode.width)
			{
				var newNode = freeNode.clone();
				newNode.x = usedNode.x + usedNode.width;
				newNode.width = freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
				this.free_.push(newNode);
			}
		}

		return true;
	},
	prune_free_list: function() {
		for (var i = 0; i < this.free_.length; ++i)
		{
			for (var j = i + 1; j < this.free_.length; ++j)
			{
				if (Rect.is_contained_in(this.free_[i], this.free_[j]))
				{
					this.free_.splice(i, 1);
					--i;
					break;
				}

				if (Rect.is_contained_in(this.free_[j], this.free_[i]))
				{
					this.free_.splice(j, 1);
					--j;
				}
			}
		}
	}
};
MaxRects.ShortSide = 1;
MaxRects.LongSide = 2;
MaxRects.BestArea = 3;
MaxRects.BottomLeft = 4;
MaxRects.ContactPoint = 5;
MaxRects.Modes = [
	"auto",
	"short-side",
	"long-side",
	"best-area",
	"bottom-left",
	"contact-point"
];

function Sprite(name, width, height) {
	this.name = name||"";
	this.x = 0;
	this.y = 0;
	this.width = width||0;
	this.height = height||0;
	this.rotated = false;
};
Sprite.prototype.constructor = Sprite;
Sprite.prototype.clone = function() {
	var copy = new Sprite(this.name, this.width, this.height);
	copy.x = this.x;
	copy.y = this.y;
	copy.rotated = this.rotated;
	return copy;
}

function Result() {
	this.width = 0;
	this.height = 0;
	this.sprites = [];
};
Result.prototype.constructor = Result;
