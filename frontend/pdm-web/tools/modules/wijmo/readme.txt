Npm image for Wijmo System modules (sources)
============================================

This folder represents an npm image containing Wijmo core and Angular 2 interop 
modules in System module format (non-minified), and corresponding TypeScript source  
and mapping (.js.map) files.
The folder also includes metadata files for Angular 2 AoT compiler (.metadata.json).

If you are an owner of the Standard (not Enterprise) Wijmo version, the modules 
that are not included in the Standard version are represented by .d.ts files.

Because the folder content is formed as an npm image, you can easily install it in your 
application using "npm install <path_to_folder>" command in NodeJS command prompt, like this:
npm install ../wijmo_download/NpmImages/wijmo-system-src
This command will add the folder content to the node_modules/wijmo folder of your application.
Alternatively, you can add the following record to the package.json file of your application:
"dependencies": {
   "wijmo": "../wijmo_download/NpmImages/wijmo-system-src",
   … other libraries
}
After that, each time you execute "npm install" command in your application root folder, 
Wijmo modules will be installed under the "node_modules" folder along with other libraries 
enumerated in package.json.
