/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
 //
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', () => {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', () => {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


       /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        // this function is used both for url and name tests
        function testFeedKeys(key) {
            it(`'${key}' is defined and not empty`, () => {
                expect(key).toBeDefined();
                expect(key).not.toBeNull();
                expect(key).not.toBe('');
            });
        }
        // iterate over allFeeds and check each url
        for (let feed of allFeeds) {
            const url = feed.url;
            testFeedKeys(url);
        }


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        // iterate over allFeeds and check each name
        for (let feed of allFeeds) {
            const name = feed.name;
            testFeedKeys(name);
        }
    });


    /* TODO: Write a new test suite named "The menu" */
    describe('The menu', () => {

        const body = $('body')[0];

        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it('is hidden', () => {

            // NB: in the most recent version of Jasmine we would use 'toHaveClass' method
            expect(body).toHaveClass('menu-hidden');
        });

         /* TODO: Write a test that ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * should have two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */

        it('is showing when icon is clicked, is hidden when cliked again', () => {
            menuIcon = $('.menu-icon-link');
            menuIcon.click();
            expect(body).not.toHaveClass('menu-hidden');
            menuIcon.click();
            expect(body).toHaveClass('menu-hidden');
        });
    });
    
    describe('Initial Entries', () => {
    /* TODO: Write a new test suite named "Initial Entries" */

        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        beforeEach(done => {
            loadFeed(0, () => done());
        });

        it('There is at least one entry', done => {
            // entries is an HTML collection of found entries
            const entries = document.querySelector('.feed').querySelectorAll('.entry');
            // checking the entries.length against 0 we make sure, that there is at least one entry
            expect(entries.length).toBeGreaterThan(0);
            done();
        });
    });

    describe('New Feed Selection', () => {
    /* TODO: Write a new test suite named "New Feed Selection" */

        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        const feed = $('.feed')[0];
        // new and old content variables
       let currFeedContent, newFeedContent;

        beforeEach(done => {

            //default feed index;
            const i = 0;

            // to check different feed options j is a random feed index ranging from 1 to 3)
            const j = 1 + Math.floor(Math.random() * 3);

            loadFeed(i, () => {
                currFeedContent = feed.innerHTML;
                loadFeed(j, () => {
                    newFeedContent = feed.innerHTML;
                    done();
                });
            });
        });

        it('Feed content changes', done => {
            // as a set only stores unique values, we made sure that in case feed content did not change, it would be overwritten
            // if the size of the set equals allFeeds.length, it means that all feeds are different and the content does change:)
            expect(currFeedContent).not.toEqual(newFeedContent);
            done();
        });

    });

}());
