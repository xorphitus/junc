describe("junc", function() {

    beforeEach(function(){
	// pass
    });

    afterEach(function(){
	// pass
    });

    it('test01', function() {
	var input = '';
	var expected = junc._uncomment(input);
	var actual = '';
	expect(actual).toEqual(expected);
    });

    it('test02', function() {
	var input = '/** @junc */';
	var expected = junc._uncomment(input);
	var actual = '';
	expect(actual).toEqual(expected);
    });
});