var favicons = require('favicons'),
    source = 'src/logo.png',           // Source image(s). `string`, `buffer` or array of `string` 
    configuration = {
        appName: null,                  // Your application's name. `string` 
        appDescription: null,           // Your application's description. `string` 
        developerName: null,            // Your (or your developer's) name. `string` 
        developerURL: null,             // Your (or your developer's) URL. `string` 
        background: "#fff",             // Background colour for flattened icons. `string` 
        path: "/src/icons",                      // Path for overriding default icons path. `string` 
        display: "standalone",          // Android display: "browser" or "standalone". `string` 
        orientation: "portrait",        // Android orientation: "portrait" or "landscape". `string` 
        start_url: "/?homescreen=1",    // Android start application's URL. `string` 
        version: "1.0",                 // Your application's version number. `number` 
        logging: false,                 // Print logs to console? `boolean` 
        online: true,                  // Use RealFaviconGenerator to create favicons? `boolean` 
        preferOnline: true,            // Use offline generation, if online generation has failed. `boolean` 
    },
    callback = function (error, response) {
        if (error) {
            console.log(error.status);  // HTTP error code (e.g. `200`) or `null` 
            console.log(error.name);    // Error name e.g. "API Error" 
            console.log(error.message); // Error description e.g. "An unknown error has occurred" 
        }
        console.log(response.images);   // Array of { name: string, contents: <buffer> } 
        console.log(response.files);    // Array of { name: string, contents: <string> } 
        console.log(response.html);     // Array of strings (html elements) 
        for (var i = 0; i < response.images.length; i++) {
            var image = response.images[i];
            require("fs").writeFileSync("./src/icons/" + image.name, image.contents, 'binary', function(err){
                if (err) throw err
                console.log('File saved.');
            })
        }
    };
 
favicons(source, configuration, callback);
 