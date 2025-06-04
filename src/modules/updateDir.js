(function() {
  // The current locale is stored in the <html> tag's lang attribute.
  const locale = document.documentElement.getAttribute('lang');
  // Define default directions. You can amend this if you have more locales.
  const dirMap = { 'fa': 'rtl', 'en': 'ltr' };
  const dir = dirMap[locale] || 'ltr';
  document.documentElement.setAttribute('dir', dir);
})();