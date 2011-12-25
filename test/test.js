test("loaded", function() {
    ok(window.hURL);
});


module("constructing");
test("new hURL(string)", function() {
    var u = new hURL("http://example.org/");
    ok(u instanceof hURL, "instanceof hURL");
    ok(u._parts.host !== undefined, "host undefined");
});
test("new hURL(object)", function() {
    var u = new hURL({protocol: "http", host: 'example.org'});
    ok(u instanceof hURL, "instanceof hURL");
    ok(u._parts.host !== undefined, "host undefined");
});
test("new hURL(hURL)", function() {
    var u = new hURL(new hURL({protocol: "http", host: 'example.org'}));
    ok(u instanceof hURL, "instanceof hURL");
    ok(u._parts.host !== undefined, "host undefined");
});
test("new hURL(new Date())", function() {
    raises(function() {
        new hURL(new Date());
    }, TypeError, "Failing unknown input");
});
test("new hURL()", function() {
    var u = new hURL();
    ok(u instanceof hURL, "instanceof hURL");
    ok(u._parts.host === location.hostname, "host == location.hostname");
});
test("function hURL(string)", function() {
    var u = new hURL("http://example.org/");
    ok(u instanceof hURL, "instanceof hURL");
    ok(u._parts.host !== undefined, "host undefined");
});


module("parsing");
urls.forEach(function(t) {
    test("parse " + t.name, function() {
        var u = new hURL(t.url),
            key;
        
        // test URL built from parts
        equal(u+"", t._url || t.url, "toString");
        
        // test parsed parts
        for (key in t.parts) {
            if (Object.hasOwnProperty.call(t, key)) {
                equal(u[key], t.parts[key], key);
            }
        }
        
        // test convinience
        for (key in t.convinience) {
            if (Object.hasOwnProperty.call(t.convinience, key)) {
                if (u[key]) {
                    equal(u[key].call(u), t.convinience[key], key);
                } else {
                    // TODO: remove this branch
                    var method = 'get' + key[0].toUpperCase() + key.substr(1);
                    equal(u[method].call(u), t.convinience[key], key);
                }
            }
        }
    });
});


module("normalizing");
test("normalize", function() {
   // TODO: test normalize()
});
test("normalizeHost", function() {
    if (window.punycode) {
        var u = new hURL("http://exämple.org/foobar.html");
        u.normalizeHost();
        equal(u+"", "http://xn--exmple-cua.org/foobar.html", "converting IDN to punycode");
    }

    if (window.IPv6) {
        u = new hURL("http://fe80:0000:0000:0000:0204:61ff:fe9d:f156/foobar.html");
        u.normalizeHost();
        equal(u+"", "http://fe80::204:61ff:fe9d:f156/foobar.html", "best IPv6 representation");
    }
});
test("normalizePort", function() {
    var u = new hURL("http://example.org:80/foobar.html");
    u.normalizePort();
    equal(u+"", "http://example.org/foobar.html", "dropping port 80 for http");

    u = new hURL("ftp://example.org:80/foobar.html");
    u.normalizePort();
    equal(u+"", "ftp://example.org:80/foobar.html", "keeping port 80 for ftp");

});
test("normalizePath", function() {
   // TODO: test normalizePath()
});
test("normalizeQuery", function() {
    var u = new hURL("http://example.org/foobar.html?");
    u.normalizeQuery();
    equal(u+"", "http://example.org/foobar.html", "dropping empty query sign");
    
    // TODO: test bad querystring
});
test("normalizeFragment", function() {
    var u = new hURL("http://example.org/foobar.html#");
    u.normalizeFragment();
    equal(u+"", "http://example.org/foobar.html", "dropping empty fragment sign");
});


module("mutating basics");
test("protocol", function() {
    var u = new hURL("http://example.org/foo.html");
    u.protocol('ftp');
    equal(u.protocol(), "ftp", "ftp protocol");
    equal(u+"", "ftp://example.org/foo.html", "ftp url");

    u.protocol('');
    equal(u.protocol(), "", "missing protocol");
    equal(u+"", "example.org/foo.html", "no-scheme url");
    
    u.protocol(null);
    equal(u.protocol(), "", "missing protocol");
    equal(u+"", "example.org/foo.html", "no-scheme url");
});
test("username", function() { 
    var u = new hURL("http://example.org/foo.html");
    u.username("hello");
    equal(u.username(), "hello", "changed username hello");
    equal(u.password(), "", "changed passowrd hello");
    equal(u+"", "http://hello@example.org/foo.html", "changed url hello");
    
    u.username("");
    equal(u.username(), "", "changed username ''");
    equal(u.password(), "", "changed passowrd ''");
    equal(u+"", "http://example.org/foo.html", "changed url ''");
});
test("password", function() { 
    var u = new hURL("http://hello@example.org/foo.html");
    u.password("world");
    equal(u.username(), "hello", "changed username world");
    equal(u.password(), "world", "changed passowrd world");
    equal(u+"", "http://hello:world@example.org/foo.html", "changed url world");
    
    u.password("");
    equal(u.username(), "hello", "changed username ''");
    equal(u.password(), "", "changed passowrd ''");
    equal(u+"", "http://hello@example.org/foo.html", "changed url ''");
    
    u.username("").password("hahaha");
    equal(u.username(), "", "changed username - password without username");
    equal(u.password(), "hahaha", "changed passowrd - password without username");
    equal(u+"", "http://example.org/foo.html", "changed url - password without username");
});
test("hostname", function() {
    var u = new hURL("http://example.org/foo.html");
    u.hostname('abc.foobar.lala');
    equal(u.hostname(), "abc.foobar.lala", "hostname changed");
    equal(u+"", "http://abc.foobar.lala/foo.html", "hostname changed url");

    u.hostname('');
    equal(u.hostname(), "", "hostname removed");
    equal(u+"", "http:///foo.html", "hostname removed url");
});
test("port", function() { 
    var u = new hURL("http://example.org/foo.html");
    u.port('80');
    equal(u.port(), "80", "changing port 80");
    equal(u+"", "http://example.org:80/foo.html", "changing url 80");

    u.port('');
    equal(u.port(), "", "changing port ''");
    equal(u+"", "http://example.org/foo.html", "changing url ''");
});
test("path", function() { 
    var u = new hURL("http://example.org/foobar.html?query=string");
    u.pathname('/some/path/file.suffix');
    equal(u.pathname(), '/some/path/file.suffix', "changing pathname '/some/path/file.suffix'");
    equal(u+"", "http://example.org/some/path/file.suffix?query=string", "changing url '/some/path/file.suffix'");
    
    u.pathname('');
    equal(u.pathname(), '/', "changing pathname ''");
    equal(u+"", "http://example.org/?query=string", "changing url ''");
});
test("query", function() { 
    var u = new hURL("http://example.org/foo.html");
    u.query('foo=bar=foo');
    equal(u.query(), "foo=bar=foo", "query: foo=bar=foo");
    equal(u.search(), "?foo=bar=foo", "query: foo=bar=foo - search");

    u.query('?bar=foo');
    equal(u.query(), "bar=foo", "query: ?bar=foo");
    equal(u.search(), "?bar=foo", "query: ?bar=foo - search");
    
    u.query('');
    equal(u.query(), "", "query: ''");
    equal(u.search(), "", "query: '' - search");
    
    u.search('foo=bar=foo');
    equal(u.query(), "foo=bar=foo", "search: foo=bar=foo");
    equal(u.search(), "?foo=bar=foo", "search: foo=bar=foo - query");

    u.search('?bar=foo');
    equal(u.query(), "bar=foo", "search: ?bar=foo");
    equal(u.search(), "?bar=foo", "search: ?bar=foo - query");
    
    u.search('');
    equal(u.query(), "", "search: ''");
    equal(u.search(), "", "search: '' - query");
});
test("fragment", function() { 
    var u = new hURL("http://example.org/foo.html");
    u.fragment('foo');
    equal(u.fragment(), "foo", "fragment: foo");
    equal(u.hash(), "#foo", "fragment: foo - hash");

    u.fragment('#bar');
    equal(u.fragment(), "bar", "fragment: #bar");
    equal(u.hash(), "#bar", "fragment: #bar - hash");
    
    u.fragment('');
    equal(u.fragment(), "", "fragment: ''");
    equal(u.hash(), "", "fragment: '' - hash");
    
    u.hash('foo');
    equal(u.fragment(), "foo", "hash: foo");
    equal(u.hash(), "#foo", "hash: foo - fragment");

    u.hash('#bar');
    equal(u.fragment(), "bar", "hash: #bar");
    equal(u.hash(), "#bar", "hash: #bar - fragment");
    
    u.hash('');
    equal(u.fragment(), "", "hash: ''");
    equal(u.hash(), "", "hash: '' - fragment");
});

module("mutating compounds");
test("host", function() {
    var u = new hURL("http://foo.bar/foo.html");
    
    u.host('example.org:80');
    equal(u.hostname(), "example.org", "host changed hostname");
    equal(u.port(), "80", "host changed port");
    equal(u+"", "http://example.org:80/foo.html", "host changed url");
    
    u.host('some-domain.com');
    equal(u.hostname(), "some-domain.com", "host modified hostname");
    equal(u.port(), "", "host removed port");
    equal(u+"", "http://some-domain.com/foo.html", "host modified url");
});
test("authority", function() {
    var u = new hURL("http://foo.bar/foo.html");
    
    u.authority('username:password@example.org:80');
    equal(u.username(), "username", "authority changed username");
    equal(u.password(), "password", "authority changed password");
    equal(u.hostname(), "example.org", "authority changed hostname");
    equal(u.port(), "80", "authority changed port");
    equal(u+"", "http://username:password@example.org:80/foo.html", "authority changed url");
    
    u.authority('some-domain.com');
    equal(u.username(), "", "authority removed username");
    equal(u.password(), "", "authority removed password");
    equal(u.hostname(), "some-domain.com", "authority modified hostname");
    equal(u.port(), "", "authority removed port");
    equal(u+"", "http://some-domain.com/foo.html", "authority modified url");
});
test("href", function() {
    var u = new hURL("http://foo.bar/foo.html");

    u.href('ftp://u:p@example.org:123/directory/file.suffix?query=string#fragment');
    equal(u.protocol(), "ftp", "href changed protocol");
    equal(u.username(), "u", "href changed username");
    equal(u.password(), "p", "href changed password");
    equal(u.hostname(), "example.org", "href changed hostname");
    equal(u.port(), "123", "href changed port");
    equal(u.pathname(), "/directory/file.suffix", "href changed pathname");
    equal(u.search(), "?query=string", "href changed search");
    equal(u.hash(), "#fragment", "href changed hash");
    equal(u.href(), 'ftp://u:p@example.org:123/directory/file.suffix?query=string#fragment', "href removed url");
    
    u.href('../path/index.html');
    equal(u.protocol(), "", "href removed protocol");
    equal(u.username(), "", "href removed username");
    equal(u.password(), "", "href removed password");
    equal(u.hostname(), "", "href removed hostname");
    equal(u.port(), "", "href removed port");
    equal(u.pathname(), "../path/index.html", "href removed pathname");
    equal(u.search(), "", "href removed search");
    equal(u.hash(), "", "href removed hash");
    equal(u.href(), '../path/index.html', "href removed url");
});

module("mutating fractions");
test("domain", function() {
    var u = new hURL("http://www.example.org/foo.html");
    u.domain("foo.bar");
    equal(u.hostname(), "www.foo.bar", "changed hostname foo.bar");
    equal(u+"", "http://www.foo.bar/foo.html", "changed url foo.bar");
    
    u.domain("");
    equal(u.hostname(), "www.foo.bar", "changed ''");
    equal(u+"", "http://www.foo.bar/foo.html", "changed url ''");
});
test("tld", function() {
    var u = new hURL("http://www.example.org/foo.html");
    u.tld("mine");
    equal(u.tld(), "mine", "tld changed");
    equal(u+"", "http://www.example.mine/foo.html", "changed url mine");
    
    u.tld("");
    equal(u.tld(), "mine", "tld changed");
    equal(u+"", "http://www.example.mine/foo.html", "changed url ''");
});
test("directory", function() {
    // TODO: mutating directory test
});
test("filename", function() {
    // TODO: mutating filename test
});
test("suffix", function() {
    // TODO: mutating suffix test
});

module("mutating query strings");

