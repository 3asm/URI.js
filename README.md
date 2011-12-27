# URI.js #

[documentation](http://medialize.github.com/URI.js/docs.html)

---

I always want to shoot myself in the head when looking at code like the following:

```javascript
var url = "http://example.org/foo?bar=baz",
    separator = url.indexOf('?') > -1 ? '&' : '?';

url += separator + encodeURIComponent("foo") + "=" + encodeURIComponent("bar");
```

I still can't believe javascript - the f**ing backbone-language of the web - doesn't offer an API for mutating URLs. Browsers (Firefox) don't expose the `Location` object (the structure behind window.location).

How about a nice, clean and simple API for mutating URIs:

```javascript
var url = new URL("http://example.org/foo?bar=baz");
url.addQuery("foo", "bar");
```

URI.js is here to help with that.


## API Example ##

```javascript
// mutating URLs
URI("http://example.org/foo.html?hello=world")
    .username("rodneyrehm") 
        // -> http://rodneyrehm@example.org/foo.html?hello=world
    .username("") 
        // -> http://example.org/foo.html?hello=world
    .directory("bar")
        // -> http://example.org/bar/foo.html?hello=world
    .suffix("xml")    
        // -> http://example.org/bar/foo.xml?hello=world
    .query("")       
        // -> http://example.org/bar/foo.xml
    .tld("com")      
        // -> http://example.com/bar/foo.xml
    .query({ foo: "bar", hello: ["world", "mars"] });
        // -> http://example.com/bar/foo.xml?foo=bar&hello=world&hello=mars

// cleaning things up
URI("?&foo=bar&&foo=bar&foo=baz&")
    .normalizeQuery();
        // -> ?foo=bar&foo=baz

// working with relative paths
URI("/foo/bar/baz.html")
    .relativeTo("/foo/bar/world.html");
        // -> ./baz.html

URI("/foo/bar/baz.html")
    .relativeTo("/foo/bar/sub/world.html")
        // -> ../baz.html
    .absoluteTo("/foo/bar/sub/world.html");
        // -> /foo/bar/baz.html
```

See the [API Docs](http://medialize.github.com/URI.js/docs.html) for more stuff.


## Minify ##

use [Google Closure Compiler](http://closure-compiler.appspot.com/home):

```
// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name contextMenu.js
// @code_url http://medialize.github.com/URI.js/IPv6.js
// @code_url http://medialize.github.com/URI.js/punycode.js
// @code_url http://medialize.github.com/URI.js/URI.js
// ==/ClosureCompiler==    
```

## Resources ##

Docs where you get more info on parsing and working with URLs

* [Uniform Resource Identifiers (URI): Generic Syntax](http://www.ietf.org/rfc/rfc2396.txt) ([superseded by 3986](http://tools.ietf.org/html/rfc3986))
* [IPv6 Literal Addresses in URL's](http://www.ietf.org/rfc/rfc2732.txt) ([superseded by 3986](http://tools.ietf.org/html/rfc3986))
* [Punycode - Internationalized Domain Name (IDN)](http://www.ietf.org/rfc/rfc3492.txt) ([html version](http://tools.ietf.org/html/rfc3492))
* [URI - Reference Resolution](http://tools.ietf.org/html/rfc3986#section-5)
* [Parsing URLs for Fun and Profit](http://tools.ietf.org/html/draft-abarth-url-01)
* [Regular Expression URL Parser](http://blog.stevenlevithan.com/archives/parseuri)
* [Naming URL components](http://tantek.com/2011/238/b1/many-ways-slice-url-name-pieces)
* [Java URI Class](http://docs.oracle.com/javase/7/docs/api/java/net/URI.html)
* [Java Inet6Address Class](http://docs.oracle.com/javase/1.5.0/docs/api/java/net/Inet6Address.html)

### MozURLProperty ###

* https://www.w3.org/Bugs/Public/show_bug.cgi?id=14148
* http://www.whatwg.org/specs/web-apps/current-work/multipage/workers.html#workerlocation
* MozURLProperty (not documented yet?!) https://developer.mozilla.org/User:trevorh/Interface_documentation_status

### Alternatives ###

* [The simple <a> URL Mutation "Hack"](http://jsfiddle.net/rodneyrehm/KkGUJ/)
* [URI Parser](http://blog.stevenlevithan.com/archives/parseuri)
* [jQuery-URL-Parser](https://github.com/allmarkedup/jQuery-URL-Parser)
* [URL.js](https://github.com/ericf/urljs)

### URL Draft ###

* [W3C URL Draft](http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html)
* [Webkit #71968 - Implement URL API](https://bugs.webkit.org/show_bug.cgi?id=71968)


## TODO ##

if you want to get involved, these are things you could help out with…

* look into abusing HTMLAnchorElement: `var a = document.createElement("a"); a.href = uri; a.pathname`
* AMD stuff
* modifiers for domain, tld, directory, file, suffix are hardly the most performant solutions
* accept all [IPv6 notations](http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6)
* include a hint for [jQuery.fn.serialize()](http://api.jquery.com/serialize/)


## Authors ##

* [Rodney Rehm](https://github.com/rodneyrehm)


## Contains Code From ##

* [punycode.js](http://mths.be/punycode) - Mathias Bynens
* [IPv6.js](http://intermapper.com/support/tools/IPV6-Validator.aspx) - Rich Brown - (rewrite of the original)


## Useless Information ##

I built this sucker during Christmas 2011. It was a nice excuse to get away from the annual family terror. You should try it some time…

### Naming Libraries sucks ###

```
Quote from java doc:
A URI is a uniform resource identifier while a URL is a uniform resource locator. Hence every URL is a URI, abstractly speaking, but not every URI is a URL. This is because there is another subcategory of URIs, uniform resource names (URNs), which name resources but do not specify how to locate them. The mailto, news, and isbn URIs shown above are examples of URNs. 
```

URI.js only handles URLs - but since Firefox already used window.URL for some (yet undocumented) MozURLProperty, I named it URI anyways.


## License ##

URI.js is published under the [MIT license](http://www.opensource.org/licenses/mit-license) and [GPL v3](http://opensource.org/licenses/GPL-3.0).


## Changelog ##

### 1.0 ###

* Initial URI.js
