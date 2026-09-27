const nextConfig = {
    bundlePagesRouterDependencies: true,
    typescript: {
      ignoreBuildErrors: true,
    },
    // We use transpilePackages for the custom admin-ui pages in the ./admin folder
    // as they import ts files into nextjs
    transpilePackages: ['../../admin'],
    
  }

  module.exports = nextConfig