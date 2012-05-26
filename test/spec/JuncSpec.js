/**
 * Run this test on google-chrome
 * with '-allow-file-access-from-files' option
 * in local machine
 */
describe('junc', function() {

    describe('private function: __uncomment', function() {

        beforeEach(function(){
            // pass
        });

        afterEach(function(){
            // pass
        });

        it('should not modify an empty code.', function() {
            var input = '';
            var actual = junc.__uncomment(input);
            var expected = '';
            expect(actual).toEqual(expected);
        });

        it('should not modify lines without comment symbol.', function() {
            var input = 'foo \n bar';
            var actual = junc.__uncomment(input);
            var expected = input;
            expect(actual).toEqual(expected);
        });

        it('should not modify commentouted lines without junc annotation.', function() {
            var input = '/* foo \n bar */';
            var actual = junc.__uncomment(input);
            var expected = input;
            expect(actual).toEqual(expected);
        });

        it('should delete junc annotation with comment symbol.', function() {
            var input = '/** @junc */';
            var actual = junc.__uncomment(input);
            var expected = '';
            expect(actual).toEqual(expected);
        });

        it('should not modify a line in a junc annotation comment.', function() {
            var inputArray = [];
            inputArray.push('/*');
            inputArray.push('@junc');
            inputArray.push('var val = 0;');
            inputArray.push('*/');
            var actual = junc.__uncomment(inputArray.join('\n'));
            var expected  = new RegExp('\\s*' + 'var val = 0;' + '\\s*');
            expect(actual).toMatch(expected);
        });

        it('should delete only junc annotation with comment symbol and should not modfy the others.', function() {
            var inputArray = [];
            inputArray.push('var foo = 0;');
            inputArray.push('/*');
            inputArray.push('@junc');
            inputArray.push('var val = 0;');
            inputArray.push('*/');
            inputArray.push('var bar = 1;');
            var actual = junc.__uncomment(inputArray.join('\n'));
            var expectedArray = [];
            expectedArray.push('var foo = 0;');
            expectedArray.push('var val = 0;');
            expectedArray.push('var bar = 1;');
            var expected  = new RegExp(expectedArray.join('\\s*'));
            expect(actual).toMatch(expected);
        });
    });


    describe('modify external script by using function: "add" and "exec"', function() {

        beforeEach(function(){
            // pass
        });

        afterEach(function(){
            // pass
        });

        it('should execute without any exception.', function() {
            junc.add(location.href + '/../spec/test01.js?' + new Date());
            junc.exec();
            //var actual = sessionStorage.testval01;
            //expect(actual).toEqual('TESTVAL01');
        });
    });
});