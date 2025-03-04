module.exports = function override(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "path": require.resolve("path-browserify"),
      "url": require.resolve("url/"),
      "http": require.resolve("stream-http"),
      "net": require.resolve("net-browserify"),
      "querystring": require.resolve("querystring-es3"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/")
    };
    return config;
  };