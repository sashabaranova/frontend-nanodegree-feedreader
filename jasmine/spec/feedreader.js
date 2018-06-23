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

        // OPTION 1 - we define a function that gets all feeds content concurrently, using JS Promises
        function getFeedsConcurrently(cb) {
                
            // this array will contain promises
            let promises = [];

            // looping over the number of feeds, we create a promise
            // that calls loadFeed function for each feed
            for (let i = 0; i < allFeeds.length; i++) {
                let promise = new Promise((resolve, reject) => {
                    loadFeed(i, () => resolve(feed.innerHTML));
                    // we pass HTML content of the feed container in the resolve function
                });
                // all promises are added to the array
                promises.push(promise);
            }

            // we use Promise.all method to create a new promise that will wait until all the promises have resolved
            // contents is the array that stores all HTML contents from the previous promises; it is passed into a callback function
            // and used to create a new set stored in the contentSet variable
            Promise.all(promises).then(cb);
        }

        // OPTION 2 - we define a function that gets feeds content sequentially 

        function getFeedsSequentionally(cb) {
            // internal variable storing feed contents
            let contents = [];

            // function f is used for calling loadFeed recursively
            // internal state of recursion is controlled with 'i' that is passed to the function as a parameter
            function f(i) {
                contents.push(feed.innerHTML);

                // the recursion is stopped when we run out of feeds, and cb is called
                if (i >= allFeeds.length - 1) {
                    cb(contents);
                    return;
                }

                i++;

                loadFeed(i, () => f(i));
            }

            loadFeed(0, () => f(0)); 

        }

        // array that will store all feeds contents
        let contents = [];

        beforeEach(done => {

            const callback = cnts => {
                contents = cnts;
                // back to default feed
                loadFeed(0);
                //done is called when all the promises have resolved / recursion has finished
                done();
            }

            // OPTION 1

            getFeedsConcurrently(callback);

            /* OPTION 2
             * Both functions give the same result and return contents array, but the sequential function takes longer
             * to get all feeds, so we pass a timeout into beforeEach
             */


            // getFeedsSequentionally(callback);


        }, 60000);

        it('Feed content changes', done => {
            // OPTION 1

            const contentSet = new Set(contents);

            // as a set only stores unique values, we made sure that in case feed content did not change, it would be overwritten
            // if the size of the set equals allFeeds.length, it means that all feeds are different and the content does change:)
            expect(contentSet.size).toEqual(allFeeds.length);

            // OPTION 2
            done();
        });

    });

}());
