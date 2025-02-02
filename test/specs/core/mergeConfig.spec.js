var defaults = require('../../../lib/defaults');
var mergeConfig = require('../../../lib/core/mergeConfig');

describe('core::mergeConfig', function() {
  it('should accept undefined for second argument', function() {
    expect(mergeConfig(defaults, undefined)).toEqual(defaults);
  });

  it('should accept an object for second argument', function() {
    expect(mergeConfig(defaults, {})).toEqual(defaults);
  });

  it('should not leave references', function() {
    var merged = mergeConfig(defaults, {});
    expect(merged).not.toBe(defaults);
    expect(merged.headers).not.toBe(defaults.headers);
  });

  it('should allow setting request options', function() {
    var config = {
      url: '__sample url__',
      method: '__sample method__',
      params: '__sample params__',
      data: { foo: true }
    };
    var merged = mergeConfig(defaults, config);
    expect(merged.url).toEqual(config.url);
    expect(merged.method).toEqual(config.method);
    expect(merged.params).toEqual(config.params);
    expect(merged.data).toEqual(config.data);
  });

  it('should not inherit request options', function() {
    var localDefaults = {
      method: '__sample method__',
      data: { foo: true }
    };
    var merged = mergeConfig(localDefaults, {});
    expect(merged.method).toEqual(undefined);
    expect(merged.data).toEqual(undefined);
  });

  it('should merge auth, headers, params, proxy with defaults', function() {
    expect(mergeConfig({ auth: undefined }, { auth: { user: 'foo', pass: 'test' } })).toEqual({
      auth: { user: 'foo', pass: 'test' }
    });
    expect(mergeConfig({ auth: { user: 'foo', pass: 'test' } }, { auth: { pass: 'foobar' } })).toEqual({
      auth: { user: 'foo', pass: 'foobar' }
    });
    expect(mergeConfig({ params: { token: 'foo' } }, { params: { name: 'bar' } })).toEqual({
      params: { token: 'foo', name: 'bar' }
    });
  });

  it('should overwrite auth, headers, params, proxy with a non-object value', function() {
    expect(mergeConfig({ auth: { user: 'foo', pass: 'test' } }, { auth: false })).toEqual({
      auth: false
    });
    expect(mergeConfig({ auth: { user: 'foo', pass: 'test' } }, { auth: null })).toEqual({
      auth: null
    });
  });

  it('should allow setting other options', function() {
    var merged = mergeConfig(defaults, { timeout: 123 });
    expect(merged.timeout).toEqual(123);
  });

  it('should allow setting custom options', function() {
    var merged = mergeConfig(defaults, { foo: 'bar' });
    expect(merged.foo).toEqual('bar');
  });
});
