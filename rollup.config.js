export default {
    input: 'nexs.js', // Your main JS file
    output: {
      file: 'bundle.js', // The output file
      format: 'iife', // Immediately Invoked Function Expression, suitable for browsers
      name: 'NEXSJS' // Global variable name if needed
    },
    plugins: [
      // Add any Rollup plugins here if needed
    ]
};  