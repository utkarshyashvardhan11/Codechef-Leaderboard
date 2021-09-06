const puppeteer = require("puppeteer");

//initiating Puppeteer
puppeteer
  .launch()
  .then(async (browser) => {
    //opening a new page
    const page = await browser.newPage();

    //usernames of the users we want to find the details of
    const usernames = require("./input.json").usernames;
    // console.log(usernames);
    // var usernames = ["john_doe_002", "utkarsh_utk"];
    const allDetails = [];

    for (var i = 0; i < usernames.length; i++) {
      //navigating to Codechef page with given username
      var username = usernames[i];
      let link = "https://www.codechef.com/users/" + username;
      await page.goto(link);
      await page.waitForSelector("body");

      //manipulating the page's content
      let grabDetail = await page.evaluate(async () => {
        let numberRating =
          document.body.querySelector(".rating-number").innerText;

        let userDetails = document.body.querySelector(
          ".user-details-container"
        );

        let name = userDetails.querySelector("h1").innerText;
        let starRating = userDetails.querySelector(".rating").innerText;

        //storing the detail items then selecting for retrieving content
        let detail = {
          name: name,
          starRating: starRating,
          numberRating: numberRating,
        };
        return detail;
      });
      grabDetailWithUsername = Object.assign(
        { username: username },
        grabDetail
      );
      allDetails.push(grabDetailWithUsername);
    }

    //sorting allDetails based on numberRating
    allDetails.sort((a, b) => {
      if (a.numberRating < b.numberRating) {
        return 1;
      }
      if (a.numberRating > b.numberRating) {
        return -1;
      }
      return 0;
    });

    //outputting the scraped details of all usernames
    console.log(allDetails);

    //closing the browser
    await browser.close();
  })
  //handling any errors
  .catch(function (err) {
    console.error(err);
  });
