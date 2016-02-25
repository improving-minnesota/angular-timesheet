describe('Security', function () {

  describe("An unauthenticated user that opens the application", function () {
    beforeEach (function () {
      browser.get("/");
    });

    it('should be redirected to the login page', function () {
      var loginForm = by.name('loginForm');
      expect(browser.isElementPresent(loginForm)).toBe(true);
    });

    it('should be able to login', function () {
      element(by.model('loginCtrl.user.username')).sendKeys('admin');
      element(by.model('loginCtrl.user.password')).sendKeys('password');
      element(by.css('form button')).click();

      browser.sleep(1000);

      var logout = by.css('a.logout');
      expect(browser.isElementPresent(logout)).toBe(true);
    });
  });
});
